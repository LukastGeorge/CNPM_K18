# Kiến trúc hệ thống — BookFlow

## 1. Sơ đồ thành phần (Clean-style frontend / phân tách trách nhiệm)

```mermaid
flowchart LR
    UI["Vue Views / Components"] --> Store["Pinia Store"]
    UI --> Pure["Domain: book, order"]
    Store --> Pure
    Store --> Storage["Storage Adapter"]
    Storage --> LS["localStorage (browser)"]
    UI --> AI["Mock Recommendation Service"]
    AI --> Pure
```

**Hướng phụ thuộc:** UI phụ thuộc domain; store điều phối use case; domain là các hàm JavaScript thuần không biết về Vue, localStorage hay UI. `storage.js` là adapter lưu trữ thay thế được. Không có network API. Không có backend.

## 2. Mô hình dữ liệu logic

```mermaid
erDiagram
 BOOK ||--|{ VARIANT : has
 BOOK ||--o{ CART_ITEM : selected
 VARIANT ||--o{ CART_ITEM : selected
 ORDER ||--|{ ORDER_ITEM : contains
 BOOK ||--o{ ORDER_ITEM : referenced
 VARIANT ||--o{ ORDER_ITEM : referenced
 BOOK { string id PK string isbn string title string author string category string description string color string ink boolean featured }
 VARIANT { string id PK string name number price number discount integer stock }
 CART_ITEM { string bookId string variantId integer quantity }
 ORDER { string id PK string status datetime createdAt number subtotal number shipping number total }
 ORDER_ITEM { string bookId string variantId string title integer quantity number unitPrice }
```

Mã `variantId` chỉ duy nhất *trong phạm vi sách*, khóa ghép nghiệp vụ là `(bookId, variantId)`.

## 3. Luồng đặt hàng — tracer bullet (vertical slice)

```mermaid
sequenceDiagram
    actor User as Khách hàng
    participant View as CartPage
    participant State as Pinia Store
    participant Domain as order.js
    participant DB as Browser localStorage
    User->>View: Nhập thông tin & xác nhận
    View->>State: checkout(customer)
    State->>Domain: createOrderSnapshot(cart, customer, books)
    Domain-->>State: snapshot hợp lệ (hoặc lỗi)
    State->>State: Trừ tồn kho theo phiên bản
    State->>State: Lưu đơn và xóa giỏ
    State-->>DB: Watcher đồng bộ thay đổi
    State-->>View: Đơn thành công
    View-->>User: Hiển thị mã đơn
```

**Quy tắc:** không trừ kho khi thêm vào giỏ; kiểm tra lại trước khi tạo đơn; hủy chỉ từ `new` / `processing` và hoàn kho đúng một lần. Việc cập nhật là nhất quán trong *một tab trình duyệt* nhưng không có transaction đa thiết bị.

## 4. Quy trình / trạng thái đơn

```mermaid
stateDiagram-v2
    [*] --> new
    new --> processing
    new --> canceled
    processing --> completed
    processing --> canceled
    completed --> [*]
    canceled --> [*]
```

## 5. DDD mức frontend (lightweight)

- **Bounded context Catalog:** `Book`, `Variant`, ISBN, giá, giảm giá, phân loại.
- **Bounded context Inventory:** tồn kho và thao tác điều chỉnh kho.
- **Bounded context Sales:** `CartItem`, `Order`, `OrderItem` snapshot, state machine, khách hàng.
- **Infrastructure:** adapter lưu trữ và chatbot mô phỏng; không gắn vào domain.

## 6. SOLID và thiết kế để thay đổi

- **SRP:** các hàm tính giá/tồn kho ở `domain/book.js`; đặt hàng và trạng thái ở `domain/order.js`; giao diện chia thành views/components.
- **OCP / DIP phù hợp phạm vi frontend:** dữ liệu có thể chuyển từ storage adapter sang IndexedDB hoặc HTTP API mà không viết lại các công thức domain. Store hiện import adapter trực tiếp, do đó DIP mới được áp dụng một phần chứ chưa là inversion hoàn chỉnh.
- **ISP:** mỗi component chỉ nhận props / emits cần dùng.
- **Composition:** tách `BookCover`, `BookCard`, `BookEditor`, `ChatAssistant` thay vì component khổng lồ.
- **Patterns sử dụng:** Repository-like Storage Adapter, reactive Store (Observer), Factory (`freshBooks`, `initialDatabase`), Strategy-like pure selection (`searchBooks`, `mockBookAdvice`). Không nhận là Design Pattern chính thức nếu chưa có abstraction tương ứng.

## 7. Nâng cấp được trong tương lai

Có thể bổ sung role-based auth, PostgreSQL/backend, thanh toán, kho đa chi nhánh, barcode, gửi email, API AI thật **sau khi** thiết kế bảo mật phía server. Không chèn API key thật vào `VITE_*`/client.
