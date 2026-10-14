# FixIT Student (Hugo)

Website dịch vụ công nghệ cho sinh viên, viết bằng Hugo, toàn bộ nội dung tiếng Việt.
Sản phẩm học tập (Đồ án 1 – CSC00006): giỏ hàng và thanh toán QR chỉ là mô phỏng.

## Chạy thử

```bash
hugo server        # http://localhost:1313
hugo --minify      # build ra thư mục public/
```

Cần Hugo extended 0.147 trở lên. Không cần theme ngoài, toàn bộ layout nằm trong `layouts/`.

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `hugo.toml` | Cấu hình site, menu, link video nền, thông tin liên hệ |
| `content/services/*.md` | 8 dịch vụ (giá, thời gian, mô tả, danh sách bao gồm, `triggers` cho chatbot) |
| `content/*/_index.md` | Find your fix, Student Pack, About, Contact, Cart, FAQ, Track |
| `data/fix.yaml` | Cây câu hỏi của Find your fix |
| `data/faq.yaml` | Câu hỏi thường gặp (dùng cho trang FAQ và chatbot) |
| `layouts/index.chatindex.json` | Sinh `chatbot-index.json` từ nội dung site cho chatbot |
| `static/css/main.css` | Toàn bộ giao diện theo DESIGN.md (token màu, chữ, khoảng cách) |
| `static/js/` | `main.js`, `chatbot.js`, `fix.js`, `cart.js`, `track.js`, `qrcode.js` |

## Ảnh dịch vụ

Mỗi dịch vụ có một khung ảnh (trên card ở trang chủ, trang Dịch vụ và đầu trang chi tiết).
Chỉ cần chép ảnh vào `static/images/services/` đặt tên theo tên file dịch vụ:

`cai-windows`, `ve-sinh-laptop`, `diet-virus`, `cai-phan-mem`, `cuu-du-lieu`, `nang-cap`, `wifi-mang`, `tu-van-mua-may`
(đuôi `.jpg`, `.jpeg`, `.png` hoặc `.webp`).

Ví dụ: `static/images/services/cai-windows.jpg`. Chưa có ảnh thì khung hiện nền xám nhạt. Khi chạy
`hugo server`, khung trống sẽ ghi sẵn đường dẫn cần đặt ảnh. Nên dùng ảnh ngang tỉ lệ khoảng 16:10,
rộng từ 1200px, dưới 300KB. Muốn mô tả ảnh cho người dùng đọc màn hình, thêm `imageAlt: "..."` vào front matter.

## Font chữ

Be Vietnam Pro (giấy phép SIL OFL), lưu trong `static/fonts/`. Font nằm ngay trong site nên
không có yêu cầu nào tới Google khi người xem mở trang.

## Video trong trang chi tiết dịch vụ

Ngoài danh sách, card hiện **ảnh**. Khi bấm vào xem chi tiết, trang hiện **video** (nếu có), không có thì hiện lại ảnh.
Chép video vào `static/video/services/` đặt tên theo dịch vụ, ví dụ `static/video/services/cai-windows.mp4`
(đuôi `.mp4` hoặc `.webm`). Ảnh cùng dịch vụ sẽ làm ảnh bìa trước khi bấm phát.

Nên nén video trước khi đưa vào (mục tiêu dưới 15MB mỗi video, Cloudflare Pages giới hạn 25MB mỗi file):

```bash
ffmpeg -i video-goc.mp4 -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart cai-windows.mp4
```

## Giới thiệu nhóm

Sửa nội dung trong `data/team.yaml` (chỗ nào có dấu `[ ]` là chỗ mẫu cần thay). Ảnh đặt trong `static/images/team/`:
`nhom.jpg` là ảnh cả nhóm, `thanh-vien-1.jpg`... là ảnh từng người (tên file trùng với `id` trong `team.yaml`).
Ảnh chụp bằng điện thoại thường chứa vị trí GPS trong metadata, nên xóa metadata trước khi đưa lên web.

## Màu và nền động

Mỗi trang có một tông màu, đặt bằng `tone:` trong front matter của `content/<trang>/_index.md`
(`purple`, `blue`, `mix`, `dark`). Màu lấy từ bảng màu của DESIGN.md. Header các trang con có video nền mờ,
muốn tắt thì đặt `pageHeroVideo = false` trong `hugo.toml` (khi đó chỉ còn nền gradient động).

## Đưa website lên mạng để người khác truy cập

Website là file tĩnh (HTML, CSS, JS), nên đưa lên các dịch vụ hosting tĩnh miễn phí là được.

1. Build: chạy `hugo --minify`, kết quả nằm trong thư mục `public/`.
2. **Cách nhanh, không cần Git:** Cloudflare Pages có mục "Direct Upload", kéo thả thư mục `public/` lên là có link
   dạng `https://<tên-dự-án>.pages.dev`. Netlify Drop (app.netlify.com/drop) cũng kéo thả được.
3. **Cách tự cập nhật:** đưa cả project lên GitHub, rồi nối với Cloudflare Pages (Connect to Git) với
   Build command `hugo --minify`, Build output directory `public`, biến môi trường `HUGO_VERSION` = `0.147.0`.
   Mỗi lần đẩy code mới, website tự build lại.
4. Mở `hugo.toml`, sửa `baseURL` cho đúng địa chỉ thật (ví dụ `https://ten-du-an.pages.dev/`).
5. Muốn tên miền riêng (ví dụ `fixit.vn`) thì mua tên miền rồi gắn vào mục Custom domains của dịch vụ hosting.

Lưu ý: repo GitHub để công khai thì mã nguồn ai cũng xem được; hãy thay email mẫu và kiểm tra không có thông tin riêng tư trước khi đưa lên.

## Chatbot

Chatbot chạy hoàn toàn trên trình duyệt, không gọi API ngoài. Nó đọc `chatbot-index.json`
(tự sinh khi build) nên **sửa giá, dịch vụ hoặc FAQ rồi build lại là chatbot tự cập nhật**.

- Thêm từ khóa nhận diện dịch vụ: sửa `triggers` (không dấu, chữ thường) trong `content/services/<tên>.md`.
- Thêm câu hỏi thường gặp: sửa `data/faq.yaml` (`keywords` không dấu, chữ thường).
