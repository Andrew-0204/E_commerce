# E_commerce

# version 1: sign up code 

# version 2: Custom Dynamic Middleware for ApiKey and Permissions

# version 3: Xử lý ErrorHandler trong API

# version 4: Make Your API Response use class

# version 5: Login Shop API

# version 6: Logout + Authentication

# version 7: Auto-Detect token

# version 8: Schema Product Ecommerce
Polymorphic pattern - Giải pháp thiết kế Product 
1 collection - 32 TB
1 document - 16 MB (tối đa) 
100 nested object 
MGDB có thể mở rộng theo chiều ngang hay chiều dọc để xử lý dl nhiều hơn
1 collection có thể chứa hàng trăm triệu sản phẩm 
thực tế, 1 collection được giới hạn bởi phần cứng có sẵn và yêu cầu hiệu suất của ứng dụng 
VD: 1 document - 1 KB => 50 GB. Nhưng đề xuất phải dùng 64 GB RAM
