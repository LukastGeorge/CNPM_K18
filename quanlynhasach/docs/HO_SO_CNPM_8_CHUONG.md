# Hồ sơ tham khảo 8 chương — đề tài số 4: Phần mềm quản lý nhà sách

> Theo `DE THI CNPM(2).docx` môn **Công nghệ phần mềm**. Cấu trúc sau đi theo đúng 8 chương được nêu trong đề. Những số liệu về công sức, thời gian, chi phí và mục tiêu chất lượng là **kế hoạch giả định minh họa**, không phải kết quả khảo sát/đo lường đã thực hiện.

## Chương 1 — Tổng quan đề tài

### 1.1. Đặt vấn đề

Trong nhà sách quy mô nhỏ, thông tin sách có thể được ghi rời rạc; tình trạng tồn kho không nhất quán dẫn đến hết hàng khi bán, còn quá trình theo dõi đơn và báo cáo doanh thu mất thời gian. Dự án BookFlow đưa các thao tác demo vào một SPA, tách cổng khách hàng và khu vực quản lý.

### 1.2. Mục tiêu

M01: quản lý đầu sách/tác giả/ISBN/giá; M02: quản lý tồn từng phiên bản; M03: giỏ và đơn hàng có validation; M04: quản lý trạng thái và hoàn kho; M05: thống kê; M06: giao diện thân thiện; M07: có tài liệu, test, CI/CD.

### 1.3. Phạm vi và giả định

Hệ thống chỉ phục vụ **một người dùng tại một trình duyệt**, giả lập cả vai trò người mua và quản trị. Dữ liệu sinh sẵn 18 đầu sách, không phản ánh giá thị trường hoặc đơn hàng thật. Không có phân quyền, server, DB quan hệ, thanh toán hay giao vận thật.

## Chương 2 — Xác định và mô hình hóa yêu cầu phần mềm

### 2.1. Khảo sát hiện trạng (mô phỏng tình huống)

| Quy trình thủ công mô phỏng | Hạn chế | Yêu cầu hệ thống |
| --- | --- | --- |
| Ghi danh mục trong sổ/Excel | Trùng ISBN, cập nhật chậm | CRUD + ISBN unique |
| Bán các loại bìa với số lượng chung | Dễ nhầm stock | Theo dõi tồn từng phiên bản |
| Tính tổng và phí ship bằng tay | Sai lệch tổng tiền | Computed tổng tạm tính, phí ship |
| Hủy đơn bằng ghi chú | Không hoàn lại kho | State machine + restock |
| Thống kê bán hàng thủ công | Khó theo dõi | Dashboard và lọc đơn |
| Dữ liệu chỉ nằm ở phiên làm việc | Mất sau tải trang | localStorage, backup JSON |

Đây là **mô hình khảo sát giả định**, không được trình bày như đã phỏng vấn chủ nhà sách thực tế.

### 2.2. Phân loại yêu cầu

- **Chức năng**: FR01–FR09, xem bảng trong tài liệu 5 chương.
- **Phi chức năng**: giao diện responsive, nhập dữ liệu hợp lệ, phản hồi tức thời, code dễ mở rộng, test và backup.
- **Ràng buộc**: frontend-only; localStorage; không có đồng bộ cạnh tranh.

### 2.3. Bảng trách nhiệm

| Vai trò | Tác vụ chính | Module hiện thực |
| --- | --- | --- |
| Khách hàng mô phỏng | Tìm sách, chọn phiên bản, đặt hàng | ShopCatalog / BookDetail / CartPage |
| Quản trị mô phỏng | CRUD, nhập/xuất kho, xử lý đơn | AdminBooks / Inventory / Orders |
| Hệ thống | Kiểm tra dữ liệu, tính tiền, snapshot, hoàn kho | domain/book, domain/order, Pinia |
| Hệ thống | Lưu/đọc dữ liệu, backup/restore | services/storage, AdminSettings |

### 2.4. Use cases (rút gọn)

UC01 quản lý sách (actor Quản trị); UC02 duyệt tìm sách (actor Khách hàng); UC03 quản lý giỏ (actor Khách hàng); UC04 đặt hàng (actor Khách hàng); UC05 tiếp nhận/hoàn thành/hủy đơn (actor Quản trị); UC06 chỉnh tồn kho (actor Quản trị); UC07 sao lưu/khôi phục (actor Quản trị); UC08 gợi ý sách mô phỏng (actor Khách hàng).

### 2.5. Đặc tả tình huống

`features/quan_ly_nha_sach.feature` mô tả Given/When/Then cho tìm kiếm, giỏ, đặt hàng, kho, đơn, backup và trợ lý. Các scenario đóng vai trò acceptance criteria, không phải hệ thống tự động Cucumber hoàn thiện.

## Chương 3 — Thiết kế dữ liệu

### 3.1. Mô hình logic

- `Book`: id, ISBN, title, author, category, description, cover color, featured, variants[];
- `Variant`: id (khóa cục bộ theo book), name, price, discount, stock;
- `CartItem`: bookId, variantId, quantity;
- `Order`: id, customer, items[], status, subtotal, shipping, total, createdAt, updatedAt;
- `OrderItem`: snapshot bookId, variantId, title, format, unitPrice, quantity;
- `Settings`: shopName, lowStockThreshold.

### 3.2. Lưu trữ

Đối tượng database được JSON serialize vào khóa `bookflow.db.v1`. `schemaVersion: 1` giúp kiểm tra tương thích khi import. Thao tác tạo đơn lưu snapshot để việc sửa giá sau này **không làm sai đơn cũ**. Trong dữ liệu hiện tại, book và variant nhúng trong JSON; ERD ở `KIEN_TRUC_UML.md` là **mô hình logic**, không phải schema SQL PostgreSQL.

### 3.3. Quy tắc toàn vẹn

ISBN không trùng, tên sách/tác giả bắt buộc, giá bán >0, tồn kho integer ≥0, giảm giá 0–100%; giỏ không được vượt stock; đơn được snapshot trước khi trừ kho; hủy hoàn kho đúng một lần. Không xóa sách liên quan đến đơn không bị hủy. Giới hạn: không có khóa giao dịch nhiều tab.

## Chương 4 — Thiết kế giao diện

### 4.1. Giao diện người mua

Homepage: banner giới thiệu, thể loại, card nổi bật. Catalog: filter keyword/type/stock/sort. Detail: SKU bìa mềm/cứng, giá và kho từng phiên bản. Cart: chỉnh số lượng, thông tin người nhận, xác nhận đơn. ChatAssistant: gợi ý offline minh bạch.

### 4.2. Giao diện quản trị

Dashboard: KPI, phân bổ thể loại, kho thấp, đơn gần đây. Books: bảng, tìm kiếm, modal CRUD, CSV. Warehouse: tổng tồn, điều chỉnh tồn, ngưỡng cảnh báo. Orders: tra cứu và workflow new/processing/completed/canceled. Settings: cấu hình, JSON export/import, reset.

### 4.3. Nguyên tắc thiết kế

Layout nhất quán, CTA rõ, các trạng thái empty/loading/error được tách; CSS responsive xuống điện thoại; dùng semantic `button`, `a`, `label`, `form`, thông báo `role=status` hoặc `role=alert`. Có thể kiểm chứng bằng ảnh trình duyệt sau khi chạy thật.

## Chương 5 — Lập kế hoạch dự án

### 5.1. Kế hoạch gợi ý (mô phỏng nhóm 1 sinh viên, 4 tuần)

| Tuần | Công việc | Sản phẩm bàn giao | Ước tính công |
| --- | --- | --- | --- |
| 1 | Phân tích yêu cầu, mô hình dữ liệu, BDD | FR/NFR, UML, feature | 18 giờ |
| 2 | Tạo SPA, store, danh mục, giỏ và checkout | Vertical slice end-to-end | 25 giờ |
| 3 | CRUD, tồn kho, đơn, dashboard, chatbot mock | Quản trị & báo cáo | 24 giờ |
| 4 | Test, review, CI/CD, tài liệu, demo | ZIP nguồn + bằng chứng | 20 giờ |
| **Tổng kế hoạch** | | | **87 giờ** |

Mốc M1: đặc tả đóng băng; M2: order vertical slice chạy; M3: quản trị đầy đủ; M4: test/build/deploy pass. Đây là **kế hoạch giả định**, cần thay bằng lịch làm thực tế khi nộp.

### 5.2. Phân rã công việc (WBS)

1. Requirement/spec; 2. frontend architecture; 3. catalog & variants; 4. cart/checkout; 5. admin workflows; 6. AI mock; 7. verification; 8. deployment/documentation.

## Chương 6 — Quản lý dự án phần mềm

### 6.1. Rủi ro

| ID | Rủi ro | Khả năng × tác động | Ứng phó |
| --- | --- | --- | --- |
| R1 | Dữ liệu localStorage bị xóa | Trung bình × Cao | Export JSON định kỳ; thông báo demo |
| R2 | Sai stock khi hai tab đặt cùng lúc | Trung bình × Cao | Giới hạn single-tab; nâng cấp server transactions về sau |
| R3 | Người dùng nhập dữ liệu sai | Cao × Trung bình | validate form và hàm domain |
| R4 | GitHub Actions/CD thất bại | Trung bình × Trung bình | pipeline lint/test/build, đọc workflow logs |
| R5 | Yêu cầu mở rộng AI vượt thời gian | Trung bình × Trung bình | mock rule-based, ghi giới hạn |
| R6 | Mất khả năng truy cập npm registry | Trung bình × Cao | lock dependencies sau lần cài thành công, chủ động test CI |

### 6.2. Kỹ thuật kiểm soát

Kanban TODO/In Progress/Done; review theo mốc; xác nhận mỗi user story bằng Given/When/Then; Git branch/PR; kiểm soát thay đổi bằng changelog/commit; CI gate trước deploy; bảng traceability yêu cầu–code–test trong `DOI_CHIEU_TIEU_CHI.md`.

### 6.3. Điểm kiểm soát chất lượng

CP1 review UML trước code; CP2 hoàn thành tracer bullet đặt hàng; CP3 review kho và hoàn kho; CP4 chạy test và lint; CP5 deploy demo xác nhận route sâu và backup. Những cột kết quả thực tế cần điền sau khi thực hiện.

## Chương 7 — Chi phí, cấu hình phần mềm

### 7.1. Chi phí dự kiến (định giá giả định, không phải hóa đơn)

| Khoản | Cơ sở tính | Giá trị dự kiến |
| --- | --- | ---: |
| Công phát triển | 87 giờ × 50.000đ/giờ (giá trị quy đổi giả định) | 4.350.000đ |
| Công cụ mã nguồn | Vue, Vite, Router, Pinia, Vitest, ESLint | 0đ |
| GitHub repo/actions & Pages | Tùy hạn mức miễn phí/tính đủ điều kiện | Có thể 0đ ở quy mô đồ án |
| Domain riêng / backend | Không mua và không sử dụng | 0đ |
| **Tổng minh họa** | Chưa gồm máy tính/điện/internet | **4.350.000đ** |

### 7.2. Quản lý cấu hình

- Tên sản phẩm: BookFlow; version: 1.0.0; Node ≥20; Vue 3, Pinia, Vue Router, Vite, Vitest, ESLint.
- Các baseline: đặc tả BDD + UML; source; tests; workflow; documentation.
- Quy ước nhánh gợi ý `main`, `feature/*`, `fix/*` và commit `feat:`, `fix:`, `test:`, `docs:`.
- `.gitignore` loại trừ `node_modules/`, `dist/`, secrets. Không lưu token/API key vào repo.
- Dự án chạy `npm install && npm run dev`, kiểm tra `npm run lint && npm run test && npm run build`.

### 7.3. Xây dựng hệ thống

Frontend SPA có public và admin; domain validation tách khỏi UI; adapter localStorage lưu trên trình duyệt; CI/CD GitHub Pages. Chi tiết thành phần ở `README.md`, `KIEN_TRUC_UML.md`.

## Chương 8 — Chất lượng, các độ đo phần mềm

### 8.1. Hoạt động đảm bảo chất lượng

Phân tích rủi ro; review yêu cầu; domain unit tests; integration-level Pinia tests; ESLint; production build Vite; thử nghiệm thao tác trình duyệt; đo độ phủ test (nếu cấu hình thêm); đối chiếu tiêu chí và minh chứng.

### 8.2. Các độ đo và cách thu thập

| Metric | Cách đo | Mục tiêu tham khảo | Kết quả thực tế |
| --- | --- | --- | --- |
| Unit test pass rate | Vitest summary | 100% | **Chưa đo trong môi trường đóng gói** |
| Build pass | `npm run build` / Actions | 100% | **Chưa xác minh** |
| Lint violations | ESLint report | 0 lỗi | **Chưa xác minh** |
| Thời gian load | Chrome DevTools/Lighthouse | Tùy thiết bị | **Chưa đo** |
| Tính đầy đủ yêu cầu | Bảng FR với trạng thái test | FR01–FR09 có minh chứng | **Cần nghiệm thu UI** |
| Quy mô mã nguồn | Đếm `.vue`, `.js`, LOC excluding node_modules | Ghi giá trị kiểm chứng từ repo | **Chưa chốt số liệu** |
| Rủi ro còn lại | Số rủi ro chưa xử lý | R1,R2 cần giới hạn demo | **Đã nhận diện** |

### 8.3. Test cases bắt buộc trước nộp

TC01 tìm không dấu; TC02 giá/số lượng bìa khác nhau; TC03 không thêm quá kho; TC04 đặt hàng và trừ kho; TC05 reload giữ dữ liệu; TC06 hủy hoàn kho lần đầu; TC07 không hoàn kho lần hai; TC08 sách trùng ISBN; TC09 import JSON sai schema; TC10 route sâu sau deploy. Hướng dẫn thao tác chi tiết tại `DEMO_VA_KIEM_THU.md`.

## Kết luận và hướng phát triển

Dự án cung cấp baseline frontend cho nhà sách với luồng nghiệp vụ catalog–cart–order–inventory, thiết kế dữ liệu rõ, UML và kế hoạch kiểm soát chất lượng. Đây là đồ án mẫu minh họa, **không phải phần mềm đã sẵn sàng vận hành kinh doanh**. Cần tiếp tục xác minh build/test/triển khai, thu thập ảnh và số liệu, rồi đưa vào báo cáo Word theo mẫu trường. Hướng nâng cấp gồm database server, thanh toán, kiểm soát concurrency, phân quyền, log, quản lý nhiều kho, analytics và AI thực qua backend bảo mật.

## Tài liệu tham khảo

Vue.js Guide; Vue Router Documentation; Pinia Documentation; Vite Guide; Vitest Documentation; GitHub Actions Documentation (URL đầy đủ tại `README.md`).
