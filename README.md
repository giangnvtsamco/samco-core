# samco-core · VinFast SAMCO Bình Tân

Bộ dùng chung (màu, nút, gọi API) cho App Sale và Xe Demo.

## Cách dùng
Nạp theo **phiên bản**, không nạp file ở thư mục gốc:
```html
<link rel="stylesheet" href="https://giangnvtsamco.github.io/samco-core/v1/style.css">
<script src="https://giangnvtsamco.github.io/samco-core/v1/api.js"></script>
<script src="https://giangnvtsamco.github.io/samco-core/v1/ui.js"></script>
```

| File | Nội dung |
|---|---|
| `v1/style.css` | Màu, chữ, nút, thẻ, bảng, tab, chế độ tối |
| `v1/api.js` | `call(fn, ...args)` gọi Apps Script (link lấy từ `config.js` của từng app) |
| `v1/ui.js` | Thông báo, định dạng tiền/ngày, `esc`, bỏ dấu, thu nhỏ ảnh |

## Quy tắc
- Sửa nhỏ, không đổi cách dùng → sửa trong `v1/`.
- Đổi cách dùng (đổi tên hàm, đổi giao diện lớn) → tạo `v2/`, chuyển từng app sang khi đã thử xong. App cũ vẫn chạy trên `v1/`.
- File ở thư mục gốc giữ lại để app cũ (nếu còn) không bị lỗi; không sửa nữa.

## Phiên bản
- v1 (11/2026): bản đầu, App Sale và Xe Demo dùng.
