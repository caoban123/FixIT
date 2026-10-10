# FixIT Student (Đồ án 1 – CSC00006)

Website Hugo cho startup dịch vụ công nghệ sinh viên. Giỏ hàng/thanh toán chỉ là DEMO (localStorage, không backend).

## Chạy thử
```
hugo server      # http://localhost:1313
hugo --minify    # build ra public/
```
Hugo bản thường là đủ (không dùng SCSS).

## Deploy (Cloudflare Pages hoặc Netlify)
- Build command: `hugo --minify`
- Output directory: `public`
- Sau khi có link thật, sửa `baseURL` trong `hugo.toml` và tạo lại QR cho poster.

## Cấu trúc
- `content/services/*.md`: 8 dịch vụ (giá, mô tả, đánh giá mẫu ở front matter)
- `static/data/fix-tree.json`: cây câu hỏi của Find your fix (rule-based)
- `static/js/`: `cart.js` (giỏ hàng, mã giảm giá, đặt hàng demo, theo dõi đơn), `fix.js`, `search.js`, `theme.js`, `terminal.js`
- `layouts/`: giao diện Hugo (`services.json` được sinh từ `layouts/index.servicesjson.json`)

Mã giảm giá demo: `FIXIT10` (10%), `SINHVIEN` (15%). Mã đơn thử ở trang Theo dõi: `FIX-DEMO`.

