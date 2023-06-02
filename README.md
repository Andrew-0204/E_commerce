# E_commerce

# version 1: sign up code 

# version 2: Custom Dynamic Middleware for ApiKey and Permissions

# version 3: Xử lý ErrorHandler trong API

# version 4: Make Your API Response use class

# version 5: Login Shop API

# version 6: Logout + Authentication

# version 7: Auto-Detect token
Auto detect token (JWT) which is unauthorized and how to handle
Bước 1: Login 
user -> login vào hệ thống -> Auth0 cấp 1 cặp token (AT + RT) trả về cho user 
Bước 2: Transactions
user tiến hành transactions - > khi request luôn mang theo cặp token (AT + RT) 
Mục đích của việc request mang theo cặp token để khi RT hết hạn thì sẽ có thể làm mới luôn mà không cần phải thêm lần request nữa 
Bước 3: Giả sử hacker chiếm được 1 cặp token của user (để người dùng kick vào 1 link nào đó)
Bước 4: User token expried
Sau n lần request -> AT của user hết hạn
Bước 5: Hacker token expried
AT mà hacker lấy được -> hết hạn
Bước 6: Token reuse failed
Hệ thống ủy quyền sẽ sử dụng RT để cấp lại cho user 1 cặp token mới. Cặp token cũ -> đưa vào danh sách token hết hạn
Hacker không được phép nhận cặp token mới
Bước 7: destroy all token
server phát hiện có 2 token cùng request -> gửi response hủy hết các cặp token (cả cặp token hết hạn và cặp token mới cấp)
user + hacker -> không vào được server (server làm mất hiệu lực tất cả token đã ban hành)
Bước 8: relogin 
ai có user và password -> server sẽ response cho 1 cặp token mới