# Hướng dẫn sửa EmailJS Contact Form

## Tình trạng hiện tại

✅ **Code đã được sửa đúng** - Gửi các biến:
- `email: "thiephuc.ba@gmail.com"` (cho {{email}} trong template)
- `to_email: "thiephuc.ba@gmail.com"` (dự phòng)
- `from_name: formData.name`
- `from_email: formData.email`
- `message: formData.message`
- `reply_to: formData.email`

## Bạn cần làm gì?

### ✅ CÁCH 1: Sửa Template trong EmailJS (KHUYẾN NGHỊ)

**Bước 1:** Vào https://da shboard.emailjs.com/admin

**Bước 2:** Vào **Email Templates** → Chọn template `template_w61yj9e`

**Bước 3:** Kiểm tra và sửa các phần sau:

#### 3.1. Phần "To Email" (QUAN TRỌNG NHẤT)
- Phải có: `{{email}}` hoặc `thiephuc.ba@gmail.com`
- ❌ KHÔNG để trống
- ❌ KHÔNG dùng `{{to_email}}` (trừ khi bạn muốn sửa code)

#### 3.2. Phần "Subject"
Ví dụ:
```
New Contact Form Message from {{from_name}}
```
hoặc
```
Portfolio Inquiry from {{from_name}}
```

#### 3.3. Phần "Content" (Email Body)
Đảm bảo có các biến sau:
```
From: {{from_name}} ({{from_email}})
Reply-To: {{reply_to}}

Message:
{{message}}

---
This email was sent via contact form.
```

**Bước 4:** Click **Save**

---

### ✅ CÁCH 2: Sửa Code để khớp với Template hiện tại

Nếu template của bạn đang dùng tên biến khác, sửa code trong `components/Contact.tsx`:

**Ví dụ:** Nếu template dùng `{{to_email}}` thay vì `{{email}}`:

```javascript
const templateParams = {
  from_name: formData.name,
  from_email: formData.email,
  message: formData.message,
  to_email: targetEmail,  // ← Template dùng {{to_email}}
  reply_to: formData.email,
};
```

**Ví dụ:** Nếu template dùng `{{name}}` thay vì `{{from_name}}`:

```javascript
const templateParams = {
  name: formData.name,  // ← Template dùng {{name}}
  from_name: formData.name,  // Giữ để tương thích
  from_email: formData.email,
  message: formData.message,
  email: targetEmail,
  to_email: targetEmail,
  reply_to: formData.email,
};
```

---

## Kiểm tra sau khi sửa

1. **Mở Console** (F12) trong browser
2. **Submit form** và xem logs:
   ```
   Sending email with params: {
    email: "thiephuc.ba@gmail.com",
     from_name: "...",
     ...
   }
   ```
3. **Kiểm tra response:**
   - ✅ Thành công: `✅ EmailJS Success Response: {status: 200}`
   - ❌ Lỗi: Xem error message cụ thể

4. **Kiểm tra EmailJS Dashboard:**
   - Vào **Email History** hoặc **Logs**
   - Xem email đã được gửi chưa
   - Kiểm tra status: Success hay Failed

---

## Mapping giữa Code và Template

| Code gửi | Template nhận | Mục đích |
|----------|---------------|----------|
| `email: targetEmail` | `{{email}}` | Địa chỉ người nhận (To Email) |
| `from_name: formData.name` | `{{from_name}}` | Tên người gửi |
| `from_email: formData.email` | `{{from_email}}` | Email người gửi |
| `message: formData.message` | `{{message}}` | Nội dung tin nhắn |
| `reply_to: formData.email` | `{{reply_to}}` | Email để reply |

---

## Lưu ý quan trọng

1. **Template "To Email" phải có giá trị:**
   - ✅ `{{email}}` (dynamic - dùng biến từ code)
- ✅ `thiephuc.ba@gmail.com` (static - email cố định)
   - ❌ Để trống → Lỗi "recipients address is empty"

2. **Sau khi sửa template, không cần restart server**

3. **Nếu vẫn lỗi:**
   - Kiểm tra Console logs
   - Kiểm tra EmailJS Dashboard → Logs
   - Đảm bảo Service đã được kết nối với email provider

---

## Tóm tắt nhanh

**Bạn chỉ cần:**
1. ✅ Code đã đúng rồi (không cần sửa)
2. ⚠️ Kiểm tra template trong EmailJS Dashboard:
   - "To Email" phải có `{{email}}` hoặc email cụ thể
   - Các biến khác phải khớp với code

**Nếu template đúng → Form sẽ hoạt động ngay!**

---

## 📧 Hướng dẫn tạo Template cho Owner Notification

**Vấn đề:** Người điền form nhận được email auto-reply, nhưng bạn (owner) không nhận được email thông báo về form submission.

**Giải pháp:** Tạo một template riêng để gửi email thông báo về email của bạn.

### Bước 1: Tạo Template mới trong EmailJS

1. Vào https://dashboard.emailjs.com/admin
2. Click **Email Templates** → **Create New Template**
3. Đặt tên: `Owner Notification` hoặc `Form Submission Alert`

### Bước 2: Cấu hình Template

#### 2.1. Phần "To Email" (QUAN TRỌNG)
- Nhập một trong các giá trị sau:
  - `{{email}}` (khuyến nghị)
  - `{{to_email}}`
  - `{{owner_email}}`
  - Hoặc email cố định: `thiephuc.ba@gmail.com`

#### 2.2. Phần "Subject"
Ví dụ:
```
New Contact Form Message from {{from_name}}
```
hoặc
```
[PORTFOLIO] New message from {{from_name}}
```

#### 2.3. Phần "Content" (Email Body)
Ví dụ:
```
Bạn có một tin nhắn mới từ contact form:

Tên: {{from_name}}
Email: {{from_email}}

Nội dung:
{{message}}

---
Reply to: {{reply_to}}
```

### Bước 3: Lấy Template ID

1. Sau khi tạo template, copy **Template ID** (ví dụ: `template_xxxxx`)
2. Thêm vào file `.env` hoặc `.env.local`:
   ```
   VITE_EMAILJS_OWNER_TEMPLATE_ID=template_xxxxx
   ```
3. Restart server (nếu đang chạy)

### Bước 4: Kiểm tra

1. Mở Console (F12) trong browser
2. Submit form
3. Xem logs:
   - ✅ Nếu thấy: `📧 Sending owner notification with params:` → Code đang cố gửi
   - ✅ Nếu thấy: `✅ EmailJS owner notification success:` → Thành công!
   - ❌ Nếu thấy: `❌ Owner notification email failed:` → Kiểm tra template "To Email"

### Lưu ý quan trọng

1. **Template Owner phải có "To Email" đúng:**
   - ✅ `{{email}}`, `{{to_email}}`, hoặc `{{owner_email}}` (code đã gửi cả 3)
   - ✅ Hoặc email cố định: `thiephuc.ba@gmail.com`
   - ❌ Để trống → Email không được gửi

2. **Code đã được cập nhật:**
   - Gửi cả `email`, `to_email`, và `owner_email` để hỗ trợ mọi template
   - Có logging chi tiết để debug

3. **Nếu vẫn không nhận được email:**
   - Kiểm tra Console logs để xem lỗi cụ thể
   - Kiểm tra EmailJS Dashboard → Email History
   - Đảm bảo Service đã được kết nối với email provider
   - Kiểm tra spam folder

---

## Tóm tắt: 2 Templates cần có

| Template | Mục đích | To Email | Template ID |
|----------|----------|----------|-------------|
| **Auto-Reply** | Gửi cho người điền form | `{{email}}` (email của user) | `VITE_EMAILJS_TEMPLATE_ID` |
| **Owner Notification** | Gửi cho bạn (owner) | `{{email}}` hoặc `thiephuc.ba@gmail.com` | `VITE_EMAILJS_OWNER_TEMPLATE_ID` |

**Hiện tại:**
- ✅ Auto-Reply template đã hoạt động
- ⚠️ Owner Notification template cần được tạo và cấu hình

