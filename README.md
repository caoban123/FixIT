# FixIT Student — Dịch Vụ Công Nghệ Sinh Viên

> **Đồ án 1 (CSC00006) — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM**  
> Dự án mô phỏng website dịch vụ CNTT hỗ trợ sinh viên: chẩn đoán lỗi, cài đặt môi trường lập trình, cấp cứu Windows và kiểm tra laptop tận nơi tại sảnh trường.

---

## 📌 1. Giới thiệu Dự án

Khi bước vào giảng đường đại học hoặc bắt đầu các học phần lập trình/đồ án, sinh viên thường xuyên gặp phải những rào cản kỹ thuật:
- **Kẹt môi trường lập trình:** Cài đặt C/C++, Python, Git, VS Code... lỗi PATH hoặc xung đột compiler mất hàng giờ giải quyết.
- **Bế tắc tra cứu:** Không biết lỗi tên gì để tìm kiếm (màn hình xanh, traceback dài, tràn bộ nhớ...).
- **Chi phí đắt đỏ:** Các cửa hàng sửa chữa bên ngoài tính phí từ 150.000đ – 300.000đ, phải để máy qua đêm và lo ngại bảo mật dữ liệu.

**FixIT Student** ra đời như một mô hình dịch vụ công nghệ tinh gọn do chính sinh viên IT vận hành: **Chẩn đoán trước — Hẹn gặp giải quyết tại sảnh trường — Giá chuẩn sinh viên (từ 9.000đ – 79.000đ) — Bảo hành 7 ngày**.

---

## 🚀 2. Tính năng Nổi bật

### 2.1. Danh mục 8 Dịch vụ Cố định & Gói Student Pack
- **8 Dịch vụ chuyên biệt:**
  1. *Cứu hộ laptop Windows (Windows Rescue)* — 79.000đ
  2. *Thiết lập môi trường Python (Python Setup)* — 29.000đ
  3. *Cấu hình biên dịch C/C++ (C/C++ Setup)* — 39.000đ
  4. *Cấu hình Git & GitHub (Git Setup)* — 19.000đ
  5. *Cài đặt & tối ưu VS Code (VS Code Setup)* — 9.000đ
  6. *Khám sức khoẻ tổng quát Laptop (Health Check)* — 49.000đ
  7. *Sao lưu & sắp xếp dữ liệu (Data Backup)* — 59.000đ
  8. *Tư vấn công nghệ & thiết bị (Tech Consultation)* — 99.000đ
- **Student Pack All-in-One:** Combo 6 giải pháp thiết yếu nhất cho sinh viên năm nhất và kỳ đồ án với giá ưu đãi **149.000đ** (tiết kiệm 27%).

### 2.2. Find Your Fix (Cây chẩn đoán tương tác)
- Công cụ tương tác 3 bước ánh xạ triệu chứng lỗi thực tế thành dịch vụ chính xác, kèm thời gian xử lý và báo giá cố định.
- Tích hợp bài trắc nghiệm kiểm tra sức khỏe máy tính trong 30 giây.

### 2.3. Giỏ hàng & Đặt lịch hẹn Demo (Client-side)
- Giỏ hàng động lưu trữ qua `localStorage`.
- Hỗ trợ mã giảm giá sinh viên: `FIXIT10` (giảm 10%), `SINHVIEN` (giảm 15%).
- Chọn cơ sở hẹn gặp trực tiếp:
  - **CS1:** Sảnh Tòa Nhà A / Căn tin trường (227 Nguyễn Văn Cừ, Quận 5).
  - **CS2:** Sảnh Giảng đường A / B (Khu đô thị ĐHQG-HCM, Thủ Đức).
- Mô phỏng thanh toán chuyển khoản VietQR và ví MoMo.

### 2.4. Hệ thống Tra cứu Tiến độ (Order Tracker)
- Tra cứu trạng thái xử lý đơn hàng theo mã ticket.
- Mã demo kiểm tra nhanh: `FIX-DEMO`, `FIX-REQ89`.

### 2.5. Giao diện Hiện đại & Trải nghiệm Người dùng
- **Thẩm mỹ Cyberpunk / Clean Glassmorphism:** Hiệu ứng kính mờ, viền neon emerald, hạt chuyển động canvas (`particles.js`), mô phỏng terminal trực tiếp.
- **Dark Mode & Light Mode:** Chuyển đổi giao diện mượt mà, lưu trạng thái người dùng.
- **Tiêu đề mục đồng bộ & căn giữa:** Toàn bộ tiêu đề các phần được chuẩn hóa căn giữa với badge pill phát sáng và gradient typography.
- **Responsive & Truy cập qua Mobile:** Hỗ trợ quét mã QR để mở website mượt mà trên điện thoại.

---

## 🛠️ 3. Công nghệ Sử dụng

- **Static Site Generator (SSG):** Hugo v0.120+ (Extended / Standard)
- **Frontend Core:** HTML5 ngữ nghĩa, Vanilla CSS3 (Custom Design Tokens, không phụ thuộc Tailwind hay Bootstrap cồng kềnh)
- **Client Logic:** Vanilla JavaScript ES6+ (`cart.js`, `fix.js`, `theme.js`, `terminal.js`, `scroll-reveal.js`, `particles.js`)
- **Typography:** `Be Vietnam Pro` (tiêu đề, hỗ trợ đầy đủ tiếng Việt) & `Plus Jakarta Sans` (nội dung)

---

## 📂 4. Cấu trúc Thư mục

```text
fixit_student/
├── content/                    # Nội dung Markdown của Hugo
│   └── services/               # 8 bài viết chi tiết từng dịch vụ
├── layouts/                    # Bộ khung giao diện HTML
│   ├── _default/               # Các trang: about, cart, contact, faq, fix, pack, track...
│   ├── partials/               # Thành phần tái sử dụng: header, footer, service-card...
│   ├── services/               # Layout danh sách và chi tiết dịch vụ
│   ├── index.html              # Trang chủ FixIT Student
│   └── index.servicesjson.json # Template sinh file services.json cho search/cart
├── static/                     # Tài nguyên tĩnh
│   ├── css/
│   │   └── main.css            # Toàn bộ CSS hệ thống thiết kế
│   ├── data/
│   │   └── fix-tree.json       # Dữ liệu cây quyết định chẩn đoán Find Your Fix
│   ├── img/                    # Vector SVG minh họa, logo, QR code
│   └── js/                     # Các file script xử lý logic
├── hugo.toml                   # File cấu hình chính của Hugo
└── README.md                   # Tài liệu hướng dẫn đồ án
```

---

## 💻 5. Hướng dẫn Cài đặt & Chạy Thử

### Yêu cầu môi trường
- Đã cài đặt [Hugo](https://gohugo.io/) (hoặc môi trường Python có gói `hugo-python-distributions`).

### 5.1. Khởi chạy trên máy tính (Localhost)
```bash
# Chạy máy chủ dev
hugo server

# Truy cập trình duyệt tại
http://localhost:1313/
```

### 5.2. Mở cho Điện thoại quét mã QR cùng mạng Wi-Fi
Để điện thoại có thể quét mã QR truy cập trang web chạy từ máy tính:
```bash
# Thay <IP_CUA_MAY> bằng IP Wi-Fi máy bạn (ví dụ: 192.168.1.9)
hugo server -p 1313 --bind 0.0.0.0 --baseURL http://<IP_CUA_MAY>:1313
```
*File mã QR mẫu có sẵn tại: `static/img/qr-site.png`.*

### 5.3. Build sản phẩm tĩnh (Production Build)
```bash
hugo --minify
```
Mã nguồn tĩnh sẽ được xuất ra thư mục `public/`.

---

## ☁️ 6. Hướng dẫn Triển khai (Deploy)

### 6.1. Cloudflare Pages / Vercel / Netlify
1. Kết nối kho lưu trữ GitHub chứa dự án.
2. Thiết lập cấu hình build:
   - **Framework preset:** `Hugo`
   - **Build command:** `hugo --minify`
   - **Output directory:** `public`
3. Cập nhật thuộc tính `baseURL` trong `hugo.toml` thành URL chính thức của bạn.

---

## 👥 7. Thông tin Đồ án & Tác giả

- **Học phần:** Đồ án 1 (CSC00006)
- **Đơn vị:** Khoa Công nghệ Thông tin — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM
- **Mã sinh viên / Tài khoản GitHub:** `tlmduc7796`
- **Cam kết liêm chính:** Dự án là sản phẩm học tập mô phỏng, toàn bộ giao dịch thanh toán và đặt lịch là demo giáo dục. Toàn bộ mã nguồn và nội dung ứng dụng AI đều được nhóm sinh viên trực tiếp đọc hiểu, kiểm thử và làm chủ kỹ thuật.
