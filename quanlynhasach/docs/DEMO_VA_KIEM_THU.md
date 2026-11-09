# Kịch bản demo và checklist kiểm thử thủ công

## Cách chuẩn bị demo

1. `npm install && npm run dev`; mở localhost theo cổng Vite thông báo.
2. Vào `/quan-tri/cai-dat`, nhấn **Khôi phục dữ liệu mẫu** nếu cần trạng thái ban đầu; chỉ reset khi dữ liệu cũ không quan trọng.
3. Mở **2 tab** cho trải nghiệm: trang bán `/sach` và quản trị `/quan-tri` (lưu ý localStorage không đảm bảo nhất quán cập nhật cạnh tranh đa tab, F5 để cập nhật khi cần).
4. Dùng dữ liệu khách hàng giả, ví dụ Nguyễn Văn An / 0901234567 / 123 Nguyễn Trãi, Quận 1, TP.HCM.

## Quy trình 7 phút (minh họa)

| Bước | Thao tác | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Trang chủ → **Tủ sách** | Hiện sách và bộ lọc thể loại |
| 2 | Tìm `dac nhan tam`, mở chi tiết | Tìm được `Đắc Nhân Tâm`, hiển thị 2 phiên bản |
| 3 | Hover bìa cứng, click chọn | Màu preview/giá/tồn kho thay đổi theo phiên bản |
| 4 | Thêm 2 cuốn vào giỏ | Badge đếm 2, tạm tính và ship cập nhật |
| 5 | Đặt hàng bằng thông tin demo hợp lệ | Có mã `DH-...`, giỏ rỗng, kho giảm 2 |
| 6 | Vào Quản trị → Đơn hàng → chi tiết → Hủy | Đơn thành Đã hủy, kho phục hồi 2 |
| 7 | Thêm sách, chỉnh tồn, tải JSON, F5 | Dữ liệu vẫn tồn tại trong trình duyệt |

## Kiểm thử theo trường hợp (TC)

| TC | Tiền điều kiện / thao tác | Kết quả cần quan sát |
| --- | --- | --- |
| TC01 | Tìm `dac nhan tam` | Hiển thị sách có dấu tương ứng |
| TC02 | Chọn Bìa mềm/cứng ở `/sach/B001` | Giá và kho thay đổi tương ứng |
| TC03 | Thêm nhiều hơn stock | Thông báo lỗi, giỏ không tăng quá stock |
| TC04 | Đặt giỏ 2 cuốn, form hợp lệ | Tạo order status Mới, trừ 2, giỏ rỗng |
| TC05 | F5 sau tạo order | Đơn và stock vẫn có (cùng origin) |
| TC06 | Hủy đơn Mới | Tồn được cộng lại đúng 2 |
| TC07 | Đơn đã hủy | Không có nút hủy lần nữa |
| TC08 | Tạo sách mới trùng ISBN | Lỗi và không thêm bản trùng |
| TC09 | Nhập JSON không có `schemaVersion: 1` | Báo lỗi, không thay thế dữ liệu đang dùng |
| TC10 | Tải trực tiếp `/quan-tri/sach` sau GitHub Pages deploy | App SPA được hiển thị (nhờ fallback 404) |
| TC11 | Chat `sách lập trình` | Gợi ý sách công nghệ còn hàng, có nhãn mock |
| TC12 | Đặt đơn thiếu tên, SĐT sai, địa chỉ ngắn | Không cho checkout |
| TC13 | Tồn kho 0 → mở sản phẩm | Không thể thêm phiên bản hết hàng |
| TC14 | Nhập kho 5 cuốn trong quản trị | Stock tăng 5; làm mới vẫn giữ |

## Screenshot cần chụp để nộp báo cáo (chụp từ app chạy thật)

1. Hình 1 — Trang chủ và phân loại sách.
2. Hình 2 — Tìm kiếm không dấu / filter.
3. Hình 3 — Chi tiết và hai phiên bản, trạng thái kho.
4. Hình 4 — Giỏ và tính toán tổng tiền.
5. Hình 5 — Đơn hàng tạo thành công.
6. Hình 6 — Dashboard.
7. Hình 7 — Thêm/chỉnh sửa đầu sách.
8. Hình 8 — Điều chỉnh kho và cảnh báo.
9. Hình 9 — Trạng thái đơn/hủy hoàn kho.
10. Hình 10 — Chatbot mô phỏng.
11. Hình 11 — GitHub Actions lint/test/build/deploy **trạng thái pass thực tế**.
12. Hình 12 — Website được mở từ URL deploy thực tế.

**Không tuyên bố đã thực hiện các TC hoặc đã có ảnh trên nếu chưa trực tiếp chạy.** Các unit tests trong thư mục `tests/` chỉ kiểm tra phần logic, không thay thế kiểm thử giao diện bằng trình duyệt.
