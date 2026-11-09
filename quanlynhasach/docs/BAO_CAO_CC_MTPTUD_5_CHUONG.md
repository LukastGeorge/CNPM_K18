# Nội dung tham khảo báo cáo 5 chương — môn Công cụ và môi trường phát triển ứng dụng

> Đề tài: **Xây dựng ứng dụng SPA quản lý và bán sách BookFlow sử dụng Vue 3, Pinia, Vue Router, gợi ý sách mô phỏng và CI/CD với GitHub Actions.** Đây là nội dung thuyết minh cho code hiện có, không phải bài Word hoàn chỉnh. Hình ảnh màn hình, URL GitHub và URL demo chỉ bổ sung **sau khi chạy/triển khai thật**.

## Lời mở đầu

Việc quản lý tồn kho, cập nhật giá bán và theo dõi đơn hàng thủ công dễ phát sinh sai sót, đặc biệt khi cùng một đầu sách có nhiều hình thức đóng bìa hoặc giá khuyến mãi. BookFlow được xây dựng như một mô hình thực hành hiện đại hóa quy trình bán sách nhỏ, ưu tiên tương tác nhanh và cấu trúc frontend dễ mở rộng. Ứng dụng minh họa cách xây dựng Single Page Application với Vue 3 và quản lý trạng thái tập trung bằng Pinia. Hệ thống hoàn toàn là **demo frontend**; dữ liệu được lưu vào trình duyệt nên không thay thế phần mềm kinh doanh thực tế.

## Chương 1. Tổng quan đề tài và phân tích yêu cầu (1,0 điểm)

### 1.1. Bài toán

Một nhà sách cần theo dõi đầu sách, tác giả, thể loại, ISBN, giá, chương trình giảm giá, tồn kho theo phiên bản, giỏ hàng và vòng đời đơn hàng. Ngoài trải nghiệm mua sách, nhà quản lý cần có trang dashboard, sửa danh mục, bổ sung hàng và phục hồi dữ liệu sau khi làm mới trang.

### 1.2. Đối tượng sử dụng và phạm vi

- **Khách hàng mô phỏng:** tìm kiếm, xem danh mục, xem chi tiết phiên bản, thêm giỏ, đặt hàng.
- **Quản trị mô phỏng:** CRUD sách, điều chỉnh kho, xem thống kê, xử lý đơn, xuất CSV, backup/restore JSON.
- Không phát triển backend, DBMS, tài khoản, thanh toán trực tuyến, tích hợp AI có mạng hay đồng bộ đa thiết bị.

### 1.3. Yêu cầu chức năng

| Mã | Tính năng | Điều kiện chấp nhận |
| --- | --- | --- |
| FR01 | Duyệt, tìm, lọc sách | Truy vấn không phân biệt dấu và lọc theo thể loại/tồn kho |
| FR02 | Chi tiết và phiên bản | Bìa mềm/cứng có giá/discount/tồn kho riêng; hiển thị preview khi trỏ chuột |
| FR03 | Giỏ hàng | Thêm, sửa lượng, xóa, tính tiền; không cho vượt kho |
| FR04 | Đặt hàng | Kiểm tra khách hàng, chốt giá snapshot, trừ kho, tạo mã đơn |
| FR05 | Quản lý trạng thái đơn | new → processing → completed; cancel → hoàn kho một lần |
| FR06 | CRUD sách | Tên/tác giả/ISBN bắt buộc, ISBN không trùng, giá >0, kho nguyên không âm |
| FR07 | Báo cáo | Số sách, tồn kho, số đơn, doanh thu các đơn hoàn thành |
| FR08 | AI suggestion mock | Gợi ý sách theo thể loại và ngân sách từ dữ liệu có sẵn |
| FR09 | Sao lưu | Xuất và nhập JSON, kiểm tra schema, reset dữ liệu mẫu |

### 1.4. Yêu cầu phi chức năng

NFR01 giao diện responsive; NFR02 nhập liệu kiểm tra cả UI lẫn domain; NFR03 code tách domain/adapter/UI; NFR04 có unit tests; NFR05 có pipeline lint/test/build/deploy; NFR06 không lưu khóa bí mật; NFR07 cảnh báo giới hạn localStorage, chỉ dùng dữ liệu mô phỏng.

## Chương 2. Cơ sở lý thuyết và công nghệ áp dụng (1,5 điểm)

### 2.1. SPA (Single Page Application)

SPA tải shell HTML ban đầu; khi chuyển trang, Vue Router cập nhật component tương ứng mà không tái tải toàn bộ document. Cách này giảm tải lại giao diện nhưng cần cấu hình fallback 404 với host tĩnh cho dynamic route.

### 2.2. Vue 3 và Reactive

Vue 3 sử dụng hệ thống reactivity dựa trên JavaScript Proxy để theo dõi thay đổi trạng thái ở các object reactive. `ref()` tạo tham chiếu phản ứng; `reactive()` bao đối tượng; `computed()` trả về giá trị dẫn xuất có caching; `watch()` theo dõi thay đổi có side effect. BookFlow dùng những primitive này trong các trang và store Pinia.

### 2.3. Composition API và `<script setup>`

`<script setup>` viết logic component ngắn, dùng composable và giúp đặt biến/hàm trực tiếp trong template. Các trang `ShopCatalog.vue`, `CartPage.vue`, `AdminOrders.vue` dùng `ref` và `computed`; `BookEditor.vue` dùng `reactive`, `watch`.

### 2.4. Vue Router

`src/router.js` sử dụng `createWebHistory`, nested route theo layout cửa hàng/quản trị, dynamic `:id` cho `/sach/:id`, meta title và fallback 404. Đây là ví dụ route cha–con phục vụ SPA.

### 2.5. Pinia

`useBookstore` trong `src/stores/bookstore.js` lưu state `db` và `toast`, tạo getter qua computed và action (thêm giỏ, checkout, CRUD sách, status đơn). `watch(..., { deep:true })` đồng bộ vào localStorage sau khi state thay đổi.

### 2.6. Unit tests, CI/CD

Vitest kiểm thử hàm domain và luồng Pinia. GitHub Actions cấu hình workflow chạy `npm run lint`, `npm run test`, `npm run build`; nếu push lên nhánh main và đã bật Pages, pipeline sử dụng `deploy-pages` để phát hành thư mục tĩnh `dist`. Đây là **cấu hình triển khai**, chưa phải bằng chứng đã pass hoặc có website live.

## Chương 3. Thiết kế và cài đặt hệ thống (2,5 điểm)

### 3.1. Kiến trúc

Hệ thống phân tầng nhẹ theo `pages/components` (hiển thị), `stores` (use case/state), `domain` (nghiệp vụ thuần), `services` (storage adapter / AI mock), `data` (seed). Xem `KIEN_TRUC_UML.md` cho sơ đồ component, ERD và sequence.

### 3.2. Cây component

```text
App
├── ShopLayout
│   ├── Header / Navbar / Footer
│   ├── ShopHome ── BookCard ── BookCover
│   ├── ShopCatalog ── BookCard ── BookCover
│   ├── BookDetail ── BookCover
│   ├── CartPage ── BookCover
│   └── ChatAssistant
└── AdminLayout
    ├── AdminDashboard
    ├── AdminBooks ── BookEditor ── BookCover
    ├── AdminInventory ── BookCover
    ├── AdminOrders
    └── AdminSettings
```

### 3.3. Logic giao diện và số liệu

- `v-for` render danh sách sách, thể loại, phiên bản, giỏ, đơn, bảng.
- `v-if/v-else` phân nhánh rỗng, hết kho, thành công/thất bại.
- `@click` thêm giỏ, đổi phiên bản, điều chỉnh số lượng, chuyển trạng thái đơn.
- `@mouseover` tạm preview phối màu bìa theo phiên bản ở `BookDetail.vue`; `@mouseleave` trả preview về phiên bản đã chọn.
- Giá cuối: `price × (1 − discount/100)` làm tròn về đồng; tồn kho = tổng stock các phiên bản.
- Tạm tính = tổng (giá cuối × số lượng); phí ship 25.000đ nếu tổng tạm tính dưới 350.000đ (không kể giỏ rỗng); tổng = tạm tính + ship.

### 3.4. Chatbot tư vấn

Chatbot gọi `mockBookAdvice(prompt, books)`, chuẩn hóa văn bản và nhận diện từ khóa thể loại (`Công nghệ`, `Văn học`, `Kỹ năng`...) hoặc ngân sách (`dưới 150k`). Kết quả là đầu sách còn hàng và có giá trong ngân sách; không dùng mô hình AI học máy. Việc đặt tên 'AI suggestion mock' phải được giải thích rõ trong báo cáo.

### 3.5. Quản lý kho và đơn

Giỏ hàng không giữ/chặn kho; khi tạo đơn, `createOrderSnapshot` kiểm tra tính hợp lệ đồng loạt, sau đó store trừ kho. Đơn có snapshot tên sách/giá lúc bán. Khi hủy đơn từ trạng thái có thể hủy, store cộng lại lượng từng item vào kho. Đơn đã hoàn thành/hủy không chuyển lại trạng thái cũ.

### 3.6. Giao diện và minh chứng

Tối thiểu tự chụp 8 ảnh từ website chạy thật: trang chủ, danh mục/tìm kiếm, chi tiết 2 phiên bản, giỏ, đặt hàng thành công, dashboard, CRUD sách, quản lý đơn, backup. Chú thích rõ số hình và màn hình thực tế. Không dùng hình giả làm ảnh thực nghiệm.

## Chương 4. Thiết lập CI/CD và triển khai (1,0 điểm)

1. Push mã nguồn lên GitHub. Bật **Settings → Pages → GitHub Actions**.
2. Workflow `ci-cd.yml`: checkout → setup Node 22 → npm install → ESLint → Vitest → Vite production build.
3. Khi push main thành công, upload Pages artifact và deploy; fallback `dist/404.html` hỗ trợ SPA deep links.
4. Thu thập ảnh workflow **thực tế** và URL deployment, kiểm tra trang chủ, `/sach/B001`, `/quan-tri`.
5. Nếu lỗi: `npm run lint`/`npm run test`/`npm run build` cục bộ, sửa rồi push mới.

## Chương 5. Đánh giá kết quả và hướng phát triển (1,0 điểm)

### 5.1. Mức đáp ứng

Các trang bán sách/quản trị, Pinia, router, localStorage, chatbot mock, CI/CD **đã được cài đặt trong mã nguồn**. Kết quả build/test/deploy và phản hồi người dùng **chưa đo được ở bước đóng gói**; phải bổ sung log, link và ảnh sau khi chạy thật.

### 5.2. Hạn chế

Không đồng bộ đa người dùng; localStorage có thể bị xóa và thiếu phân quyền; không có transaction DB hay API bí mật; gợi ý dựa trên từ khóa không mang tính ngữ nghĩa sâu.

### 5.3. Định hướng

Backend API + RDBMS, quản lý tài khoản/phân quyền, thanh toán giả lập→thật, audit log, tách inventory service, nâng cấp assistant bằng server-side AI gateway, đánh giá accessibility và E2E browser testing.

## Kết luận

BookFlow minh họa được vòng đời bán sách frontend và thực hành Composition API, Pinia, Router, unit test, CI/CD. Phần có thể trình bày là kiến trúc và chức năng đã được viết; phần chưa có xác minh phải nêu rõ khi bảo vệ để tránh nhầm lẫn giữa code dự kiến và kết quả đã chạy.

## Nguồn tham khảo

[1] Vue Team, *Vue.js Guide*, https://vuejs.org/guide/introduction.html.
[2] Vue Router Team, *Vue Router Documentation*, https://router.vuejs.org/.
[3] Pinia Team, *Pinia Documentation*, https://pinia.vuejs.org/.
[4] Vite Team, *Vite Guide*, https://vite.dev/guide/.
[5] Vitest Team, *Vitest Guide*, https://vitest.dev/.
[6] GitHub, *GitHub Actions Documentation*, https://docs.github.com/en/actions.
