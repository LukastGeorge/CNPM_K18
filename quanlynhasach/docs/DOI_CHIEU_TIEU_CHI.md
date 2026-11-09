# Đối chiếu tiêu chí từ hai đề thi được cung cấp

**Phạm vi:** Đây là ZIP mã nguồn frontend. File tiêu chí có các mục **bài báo cáo, định dạng Word, ảnh chụp, link deploy** không thể tự động hoàn thành chỉ bằng việc cung cấp mã nguồn. Trạng thái dưới đây phân biệt *đã viết code* với *phải bổ sung minh chứng*. Không khẳng định đã được chấm điểm.

## A. Môn Công cụ và môi trường phát triển ứng dụng (CC&MTPTUD)

Theo file `Mẫu đề thi_tiêu chí đánh giá tiểu luận_CC_PT_UD - sv(4).docx`, tiêu chí tổng **10 điểm**: bố cục 1.5, hình thức 1.5, 5 chương nội dung 7.

| Tiêu chí | Bằng chứng trong dự án | Trạng thái |
| --- | --- | --- |
| SPA, Vue 3, Composition API `<script setup>` | `src/main.js`, `src/App.vue`, toàn bộ `src/pages` | Đã viết code |
| Reactive / Proxy / `ref` / `reactive` / `computed` / `watch` | `src/stores/bookstore.js`, `src/pages/CartPage.vue`, `BookDetail.vue` | Đã viết code |
| Vue Router cha/con, dynamic routing | `src/router.js`, `/sach/:id`, `/quan-tri/*` | Đã viết code |
| Pinia global store State/Getters/Actions | `src/stores/bookstore.js` | Đã viết code |
| Component Header/ProductList/ProductCard/CartModal/AIChatbot | `layouts/ShopLayout.vue`, `pages/ShopCatalog.vue`, `components/BookCard.vue`, `pages/CartPage.vue`, `components/ChatAssistant.vue` | Đã viết các thành phần tương đương; giỏ là trang thay vì modal |
| `v-for`, `v-if/v-else`, `@click`, `@mouseover` | `BookDetail.vue` và các trang | Đã viết code |
| Biến thể màu, tồn kho, giá | Bản sách sử dụng phiên bản **bìa mềm/cứng**, màu hiển thị preview khi hover, giá/kho riêng | Điều chỉnh phù hợp đề tài nhà sách thay vì màu sắc áo/quần |
| computed tổng tiền, đếm giỏ, sale, inStock | `domain/book.js`, `domain/order.js`, `src/stores/bookstore.js`, `BookCard.vue` | Đã viết code |
| Chatbot gợi ý sản phẩm | `ChatAssistant.vue` + `services/assistant.js` | Mock offline có ghi nhãn, **không phải AI thật** |
| CRUD giỏ / kiểm soát tồn kho | `stores/bookstore.js` | Đã viết code |
| CI: lint/test/build | `.github/workflows/ci-cd.yml`, `tests/` | Đã cấu hình, **cần chạy thật trên GitHub** |
| CD: deploy host miễn phí | GitHub Pages deployment job + redirect | Đã cấu hình, **chưa có link website thật** |
| Chương 1–5 bài tiểu luận | `BAO_CAO_CC_MTPTUD_5_CHUONG.md` | Có đề cương thuyết minh; cần soạn Word theo mẫu |
| Bố cục: bìa, mục lục, hình/bảng, kết luận, tham khảo | Không nằm trong ZIP code | **Chưa có báo cáo Word cuối cùng** |
| Hình thức: Times New Roman 13, giãn 1.5, lề trái 3; phải 2; trên/dưới 2 cm | Không thuộc phạm vi source ZIP | **Chưa áp dụng** |
| Chương 5: ảnh chụp, link live và GitHub | Cần chạy, chụp và đẩy GitHub thật | **Chưa có minh chứng thực nghiệm** |

## B. Môn Công nghệ phần mềm (CNPM)

Theo file `DE THI CNPM(2).docx`, **đề tài số 4 — Phần mềm quản lý nhà sách**. Rubric: bố cục 1 điểm, hình thức 1 điểm, nội dung 8 điểm với **8 chương và kết luận**.

| Tiêu chí / chương | Bằng chứng trong ZIP | Còn cần bổ sung |
| --- | --- | --- |
| Chương 1: Tổng quan | `HO_SO_CNPM_8_CHUONG.md` | Minh chứng khảo sát tình huống thực tế nếu có |
| Chương 2: Yêu cầu, khảo sát, bảng trách nhiệm | `HO_SO_CNPM_8_CHUONG.md`, `features/*.feature` | Xác nhận với giảng viên / người dùng |
| Chương 3: Thiết kế dữ liệu | `KIEN_TRUC_UML.md`, `seed.js`, `storage.js` | Vẽ ERD vào Word kèm giải thích đúng phạm vi frontend |
| Chương 4: Thiết kế giao diện | Vue pages, component, CSS | Ảnh chụp giao diện thực tế |
| Chương 5: Kế hoạch dự án | `HO_SO_CNPM_8_CHUONG.md` | Điều chỉnh số ngày và người thực hiện theo dự án thật |
| Chương 6: Quản lý rủi ro/kỹ thuật kiểm soát | `HO_SO_CNPM_8_CHUONG.md` | Đưa log kiểm soát dự án thật vào báo cáo |
| Chương 7: Chi phí/cấu hình/xây dựng | README, package, CI, hồ sơ CNPM | Chi phí thực tế, Git history và log cấu hình |
| Chương 8: Chất lượng/độ đo | `tests/`, `docs/DEMO_VA_KIEM_THU.md`, hồ sơ | Kết quả test/build đo được sau chạy thật |
| Kết luận | Hồ sơ CNPM có nội dung tham khảo | Điều chỉnh theo kết quả thực tế |
| Bố cục/hình thức Word | Không thuộc yêu cầu ZIP source code | **Tự hoàn thiện báo cáo Word theo mẫu** |

## C. Giới hạn tuyên bố khi bảo vệ

Không được nói hệ thống có backend, đăng nhập bảo mật, API AI trực tiếp, thanh toán thật, đồng bộ đa máy hoặc deploy thành công khi chưa thực tế xác minh. CI/CD là **cấu hình sẵn**, việc pass build/test/deploy phải lấy từ GitHub Actions.
