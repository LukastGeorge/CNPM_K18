# Đặc tả BDD cho BookFlow. Các Scenario là tiêu chí chấp nhận,
# không tự động chạy cho đến khi có bộ step definitions tương ứng.
Feature: Quản lý danh mục sách và bán sách nội bộ trên trình duyệt
  Là người quản lý nhà sách
  Tôi muốn xem, bán và quản lý tồn kho từng phiên bản sách
  Để kiểm soát quá trình bán hàng mà không cần backend

  Background:
    Given ứng dụng đã nạp dữ liệu sách mẫu vào localStorage

  Scenario: Tìm sách không phân biệt dấu tiếng Việt
    When người dùng tìm kiếm "dac nhan tam"
    Then danh sách hiển thị sách "Đắc Nhân Tâm"

  Scenario: Thêm vào giỏ sách còn hàng
    Given sách "Đắc Nhân Tâm" phiên bản "Bìa mềm" còn 28 cuốn
    When người dùng thêm 2 cuốn vào giỏ
    Then giỏ có 2 cuốn sách
    And tồn kho vẫn là 28 cho đến khi đặt hàng

  Scenario: Không thể đặt vượt số lượng tồn kho
    Given phiên bản bìa mềm chỉ còn 1 cuốn
    When người dùng yêu cầu đặt 2 cuốn
    Then hệ thống từ chối với thông báo vượt tồn kho
    And tồn kho không đổi

  Scenario: Tạo đơn thành công
    Given giỏ có 2 cuốn "Đắc Nhân Tâm" bìa mềm
    And người dùng nhập đúng họ tên, số điện thoại và địa chỉ
    When người dùng xác nhận đặt hàng
    Then đơn hàng có trạng thái "Mới tạo"
    And tồn kho bìa mềm giảm đi 2
    And giỏ hàng được làm trống

  Scenario: Hủy đơn và hoàn kho
    Given một đơn "Mới tạo" đã trừ tồn kho 2 cuốn
    When người quản lý hủy đơn
    Then trạng thái đơn thành "Đã hủy"
    And tồn kho được hoàn thêm 2 cuốn
    And không thể hủy lại để hoàn kho lần hai

  Scenario: Quản lý sách có ISBN duy nhất
    Given một ISBN đã được sử dụng trong danh mục
    When quản trị viên tạo sách mới trùng ISBN
    Then hệ thống từ chối lưu sách

  Scenario: Xuất và nhập dữ liệu
    When quản trị viên xuất bản sao lưu JSON
    And chọn lại bản sao lưu có schema hợp lệ
    Then danh mục và đơn hàng được khôi phục

  Scenario: Chatbot offline tư vấn sách
    When khách hàng hỏi "sách lập trình"
    Then chatbot gợi ý sách thuộc thể loại "Công nghệ" còn hàng
    And không gửi nội dung tới dịch vụ AI bên ngoài
