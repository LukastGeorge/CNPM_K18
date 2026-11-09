# BookFlow — Phần mềm quản lý nhà sách (Frontend-only)

**Đồ án 2 học phần:**

1. **Công nghệ phần mềm (CNPM):** *Đề tài số 4 — Phần mềm quản lý nhà sách* (theo `DE THI CNPM(2).docx`).
2. **Công cụ và môi trường phát triển ứng dụng (CC&MTPTUD):** đáp ứng những yêu cầu công nghệ frontend của mẫu đánh giá Vue 3 / SPA / Pinia / Vue Router / chatbot / CI/CD.

BookFlow gồm **giao diện khách hàng bán sách** và **quản lý nhà sách**, chạy 100% trên trình duyệt. Không cần Node server riêng, database server, API key, đăng nhập hoặc backend để sử dụng tính năng demo. Node chỉ cần lúc xây dựng / chạy dev server Vite.

## 1. Khởi động

Cần **Node.js 20+** (khuyến nghị 22) và npm.

```bash
npm install
npm run dev
```

Mở URL mà Vite in ra (thường `http://localhost:5173`).

**Các trang cần demo:**

| URL | Chức năng |
| --- | --- |
| `/` | Trang chủ, nhóm thể loại, sách nổi bật, chatbot mô phỏng |
| `/sach` | Danh mục, tìm kiếm không dấu, lọc, sắp xếp |
| `/sach/B001` | Chi tiết, bìa mềm/cứng, giá và số lượng theo phiên bản |
| `/gio-hang` | Giỏ hàng và form tạo đơn |
| `/quan-tri` | Dashboard, thống kê, cảnh báo kho |
| `/quan-tri/sach` | CRUD sách, xuất CSV, kiểm tra ISBN |
| `/quan-tri/kho` | Nhập/xuất kho theo phiên bản |
| `/quan-tri/don-hang` | Đơn hàng, trạng thái, hủy hoàn kho |
| `/quan-tri/cai-dat` | Cài đặt, backup/import JSON, reset demo |

## 2. Những chức năng đã triển khai

**Bán hàng:** duyệt danh sách; tìm bằng tên, tác giả, ISBN (không dấu); lọc thể loại, còn hàng; sắp xếp giá; trang chi tiết dynamic route; phiên bản *bìa mềm / bìa cứng* với **giá / giảm giá / kho riêng**; giỏ hàng Pinia với computed số lượng, giá tạm tính, vận chuyển, tổng tiền; form đặt hàng (kiểm tra họ tên, SĐT VN, địa chỉ); tạo snapshot đơn và trừ kho.

**Quản trị:** bảng điều khiển tổng sách/tồn/đơn/doanh thu hoàn thành; biểu đồ phân bổ danh mục CSS; CRUD sách; ngăn ISBN trùng; điều chỉnh kho; phân loại hết hàng; quản lý trạng thái `new → processing → completed` hoặc hủy (hoàn kho **một lần**); xuất danh mục CSV; sao lưu và phục hồi JSON; reset demo.

**Chatbot:** biểu tượng góc màn hình, trả lời và gợi ý sách theo từ khóa/thể loại/ngân sách. **Đây là giải pháp mock AI chạy offline (rule-based), không kết nối OpenAI/Gemini thật** vì không có backend bảo vệ API key. Đáp ứng nhánh *mock AI* cho mục demo.

## 3. Các lệnh kiểm thử và build

```bash
npm run test:smoke  # Chạy được ngay cả khi chưa cài npm dependencies
npm run lint
npm run test
npm run build
npm run preview
```

Các bài unit test dùng Vitest tại `tests/`, tập trung nghiệp vụ kho, tính giá, vận chuyển, dữ liệu, tư vấn mô phỏng, vòng đời giỏ–đặt–hủy đơn. `features/quan_ly_nha_sach.feature` là đặc tả chấp nhận Given/When/Then, **chưa có step definitions để tự chạy Cucumber**.

> Ghi chú về bản ZIP: môi trường đóng gói không truy cập được npm registry nên **không thể tải dependencies hoặc xác minh thực tế `npm run build` / Vitest** tại đây. Đã có thể chạy `npm run test:smoke` để kiểm tra nghiệp vụ JS thuần không cần npm install. Mã nguồn, scripts, CI và Vitest tests đã được cung cấp để chạy đầy đủ trên máy có Internet. Không kèm `node_modules` hoặc `dist`.

## 4. CI/CD GitHub Actions — GitHub Pages

`.github/workflows/ci-cd.yml` chạy lint → unit tests → build mỗi khi push / PR vào `main`. Khi push vào `main`, workflow deploy website tĩnh lên GitHub Pages.

1. Tạo GitHub repository, đẩy toàn bộ mã nguồn lên `main`.
2. Vào repository **Settings → Pages → Build and deployment → GitHub Actions**.
3. Vào **Actions**, kiểm tra workflow `BookFlow - CI and GitHub Pages CD`.
4. Link thường có dạng `https://TEN_USER.github.io/TEN_REPOSITORY/` (tùy tên repo). Pipeline thiết lập `VITE_BASE_PATH` cho đường dẫn con.

Vì SPA dùng history router, workflow copy `dist/index.html` thành `dist/404.html` để điều hướng khi tải trực tiếp đường dẫn con trên GitHub Pages. Cần bật Pages và quyền Actions phù hợp. Không thể tuyên bố đã deploy khi chưa có GitHub repo của người dùng.

**Thay thế:** build và kéo thư mục `dist/` lên Netlify; với host hỗ trợ redirect SPA, dùng `public/_redirects` nếu triển khai Netlify (xem bên dưới).

## 5. Dữ liệu và hạn chế cần nói rõ khi bảo vệ

- Dữ liệu mẫu: **18 đầu sách**, hai phiên bản mỗi sách, ISBN/giá/tồn kho mô phỏng; không phải dữ liệu nhà sách thực tế.
- Lưu tất cả trong `localStorage` với khóa `bookflow.db.v1`. Reload giữ dữ liệu trên **cùng trình duyệt / cùng origin**; trình duyệt khác không đồng bộ.
- `localStorage` **không có transaction đa tab hay đa người dùng**; không đảm bảo xử lý tồn kho cạnh tranh, không có authentication/authorization thật, không bảo vệ dữ liệu khách hàng trên server. Chỉ dùng để demo / bài tập học thuật.
- Đặt hàng là **mô phỏng**, không liên kết vận chuyển, xác nhận qua SMS/email hay cổng thanh toán.
- Nên tránh nhập dữ liệu khách hàng thật và không triển khai như hệ thống thương mại hoàn chỉnh.
- Font Google Fonts được ưu tiên khi có Internet, nếu offline sẽ dùng font hệ thống; không ảnh hưởng chức năng.
- Không đưa API key thật vào `.env` với prefix `VITE_`, vì Vite sẽ public biến đó ở frontend.

## 6. Kiến trúc thư mục

```text
bookflow-quan-ly-nha-sach/
├── .github/workflows/ci-cd.yml  # GitHub Actions lint/test/build/deploy
├── docs/                       # rubric mapping, kiến trúc/UML, hồ sơ tiểu luận
├── features/                   # BDD chấp nhận Given/When/Then
├── public/                     # favicon, Netlify SPA redirects
├── src/
│   ├── assets/style.css        # UI responsive
│   ├── components/             # BookCover/Card/Editor/ChatAssistant
│   ├── data/seed.js            # demo 18 đầu sách
│   ├── domain/book.js          # giá, tìm kiếm, kho, kiểm tra sách
│   ├── domain/order.js         # giỏ, phí ship, đơn, state machine
│   ├── layouts/                # quản trị vs cửa hàng
│   ├── pages/                  # trang Vue Router
│   ├── services/storage.js     # adapter localStorage
│   ├── services/assistant.js   # trợ lý rule-based offline
│   ├── stores/bookstore.js     # Pinia Store (state/getters/actions)
│   ├── utils/format.js        # tiền tệ, ngày, slug
│   ├── router.js
│   ├── App.vue
│   └── main.js
├── tests/                      # Vitest
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## 7. Dùng để viết tiểu luận

- [Đối chiếu yêu cầu trong hai đề](docs/DOI_CHIEU_TIEU_CHI.md)
- [Báo cáo đề cương 5 chương CC&MTPTUD](docs/BAO_CAO_CC_MTPTUD_5_CHUONG.md)
- [Hồ sơ CNPM 8 chương](docs/HO_SO_CNPM_8_CHUONG.md)
- [Kiến trúc, UML, dependency](docs/KIEN_TRUC_UML.md)
- [Các tình huống trình diễn và test cases](docs/DEMO_VA_KIEM_THU.md)

**Lưu ý:** Các file Markdown là nội dung/thuyết minh tham khảo và đề cương, **không thay thế** file Word trình bày đúng mẫu bìa, mục lục, font, giãn dòng và ảnh chụp thực tế của trường.

## 8. Nguồn tham khảo công nghệ

- Vue: https://vuejs.org/guide/introduction.html
- Vue Router: https://router.vuejs.org/
- Pinia: https://pinia.vuejs.org/
- Vite: https://vite.dev/guide/
- Vitest: https://vitest.dev/
- GitHub Actions: https://docs.github.com/en/actions
- GitHub Pages: https://docs.github.com/en/pages
