# 🎄 NOËL & CO. - Luxury Christmas Holiday E-Commerce Store (Shopify Standard)

Một giải pháp cửa hàng thương mại điện tử Giáng Sinh cao cấp, được thiết kế chuyên biệt để bùng nổ doanh số tại thị trường **Mỹ (USA)** và **Châu Âu (EU)**. Tương thích chuẩn 100% với kiến trúc **Shopify Online Store 2.0 (Theme Prestige & Dawn Style)**.

---

## 🌟 Điểm Nổi Bật Dành Cho Thị Trường US & EU Mùa Giáng Sinh

1. **Holiday Shipping Cutoff Countdown**: Đồng hồ đếm ngược hạn chót giao hàng (Dec 18 Guarantee) nhằm kích thích tâm lý mua sắm gấp gáp (*FOMO*) của khách hàng phương Tây trước đêm Noel.
2. **Multi-Currency (USD & EUR)**: Chuyển đổi linh hoạt giữa thị trường Mỹ ($) và Châu Âu (€) tức thì trên toàn bộ sản phẩm và giỏ hàng.
3. **Shopify-Style Slide-Out Cart Drawer**:
   - **Thanh tiến trình Free Shipping**: Tự động tính toán số tiền còn thiếu để đạt mức Free Shipping ($75 / €70).
   - **Tùy chọn gói quà (Holiday Gift Wrapping & Note)**: Tăng giá trị trung bình đơn hàng (AOV) bằng tùy chọn gói quà nhung cao cấp + thiệp viết tay (+$4.99 / €4.50).
   - **Huy hiệu bảo chứng tin cậy**: Shop Pay, Apple Pay, PayPal, Klarna, bảo hành đổi trả kéo dài tới 31/01.
4. **Curated Gift Guide**: Bộ lọc thông minh theo đối tượng nhận quà (*For Her, For Him, For the Home, Kids*) và theo tầm giá (*Under $25, Under $50*).
5. **Hiệu ứng Tuyết rơi Tinh Tế (Subtle Snowfall)**: Canvas tuyết rơi mùa đông với nút bật/tắt tiện lợi ngay trên thanh thông báo.
6. **Không dùng placeholder**: Sử dụng hình ảnh chất lượng cao chuẩn studio thương mại điện tử cao cấp.

---

## 🚀 Cách Xem Trực Tiếp Trên Máy Tính (Interactive Preview)

Cửa hàng đang chạy local server tại địa chỉ:
👉 **[http://localhost:3000](http://localhost:3000)**

Hoặc bạn có thể mở trực tiếp file [`index.html`](file:///Users/steveanh/Desktop/Quản%20lý%20project/Vibe%20Coding/Chợ%20Giáng%20Sinh/index.html) bằng bất kỳ trình duyệt nào (Chrome, Safari, Edge, Firefox).

---

## 📦 Cách Tải Lên Trực Tiếp Cửa Hàng Shopify (Shopify Upload)

File theme nén chuẩn Shopify đã được tạo sẵn tại:
📁 **[`noel-christmas-shopify-theme.zip`](file:///Users/steveanh/Desktop/Quản%20lý%20project/Vibe%20Coding/Chợ%20Giáng%20Sinh/noel-christmas-shopify-theme.zip)**

### Các bước upload lên Shopify:
1. Đăng nhập vào trang quản trị **Shopify Admin** (`https://admin.shopify.com/store/YOUR-STORE`).
2. Vào mục **Online Store** -> **Themes**.
3. Trong phần **Theme library**, bấm nút **Add theme** -> **Upload zip file**.
4. Chọn file [`noel-christmas-shopify-theme.zip`](file:///Users/steveanh/Desktop/Quản%20lý%20project/Vibe%20Coding/Chợ%20Giáng%20Sinh/noel-christmas-shopify-theme.zip).
5. Bấm **Upload file**. Shopify sẽ tự động giải nén và cấu hình toàn bộ Section, Snippet, Banner, CSS và JS!
6. Bấm **Customize** để chỉnh sửa hình ảnh, text banner, sản phẩm theo ý bạn hoặc bấm **Publish** để công khai cửa hàng.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
Chợ Giáng Sinh/
├── index.html                      # Giao diện Storefront hoàn chỉnh chuẩn Shopify
├── assets/
│   ├── css/theme.css               # Hệ thống CSS Design System chuẩn Prestige & Dawn
│   ├── js/theme.js                 # Engine xử lý Cart Drawer, FX, Countdown, Currency
│   ├── js/products-data.js         # Dữ liệu sản phẩm Giáng Sinh chuẩn US/EU
│   └── images/                     # Ảnh sản phẩm & Hero Banner chất lượng cao
├── shopify-theme/                  # Mã nguồn Shopify Theme OS 2.0 (Liquid)
│   ├── layout/theme.liquid
│   ├── sections/
│   │   ├── announcement-bar.liquid
│   │   ├── header.liquid
│   │   ├── hero-banner.liquid
│   │   ├── featured-collection.liquid
│   │   └── cart-drawer.liquid
│   ├── snippets/product-card.liquid
│   ├── config/settings_schema.json
│   ├── locales/en.default.json
│   └── assets/
└── noel-christmas-shopify-theme.zip # Gói ZIP sẵn sàng tải thẳng lên Shopify
```
