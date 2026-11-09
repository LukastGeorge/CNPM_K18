const raw = [
  ['Đắc Nhân Tâm','Dale Carnegie','Kỹ năng','9786043921380',129000,193000,28,'#e9e7dc','#253f45','Nghệ thuật ứng xử và xây dựng những mối quan hệ tích cực.',true],
  ['Nhà Giả Kim','Paulo Coelho','Văn học','9786043440287',79000,112000,35,'#f8db82','#604124','Hành trình theo đuổi vận mệnh và lắng nghe tiếng gọi của trái tim.',true],
  ['Tư Duy Nhanh Và Chậm','Daniel Kahneman','Kinh tế','9786041131569',199000,275000,12,'#f5ba7c','#743c39','Khám phá hai hệ thống tư duy chi phối quyết định thường ngày.',true],
  ['Dế Mèn Phiêu Lưu Ký','Tô Hoài','Thiếu nhi','9786043260793',65000,88000,26,'#afcfba','#234b3f','Chuyến phiêu lưu trưởng thành của chú Dế Mèn.',true],
  ['Atomic Habits','James Clear','Kỹ năng','9786043782622',189000,235000,18,'#f3e6cf','#394a67','Thay đổi thói quen nhỏ để tạo kết quả lớn trong cuộc sống.',true],
  ['Tuổi Trẻ Đáng Giá Bao Nhiêu','Rosie Nguyễn','Kỹ năng','9786042088152',85000,119000,32,'#ffcfbb','#a04538','Những bài học về học tập, trải nghiệm và hành trình tuổi trẻ.',false],
  ['Sapiens: Lược Sử Loài Người','Yuval Noah Harari','Lịch sử','9786047712588',228000,315000,9,'#dab9ad','#59352f','Câu chuyện về sự hình thành và tiến hóa của nhân loại.',true],
  ['Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya','Higashino Keigo','Văn học','9786046928942',120000,165000,25,'#c7d4de','#32445a','Những lá thư bí ẩn kết nối các số phận qua thời gian.',true],
  ['Cây Cam Ngọt Của Tôi','José Mauro de Vasconcelos','Văn học','9786043299885',95000,132000,21,'#efd3a9','#755135','Một tuổi thơ nhiều cảm xúc và bài học về yêu thương.',false],
  ['Clean Code','Robert C. Martin','Công nghệ','9780132350884',395000,480000,7,'#e7e9ef','#233555','Nguyên tắc viết mã nguồn sạch, dễ đọc và dễ bảo trì.',true],
  ['The Pragmatic Programmer','Andrew Hunt, David Thomas','Công nghệ','9780135957059',465000,550000,5,'#283a61','#eef1f5','Tư duy thực dụng trong nghề phát triển phần mềm.',false],
  ['Design Patterns','Erich Gamma và cộng sự','Công nghệ','9780201633610',525000,620000,4,'#c5ccd9','#24334a','Các mẫu thiết kế hướng đối tượng kinh điển.',false],
  ['Không Gia Đình','Hector Malot','Văn học','9786043971057',118000,155000,0,'#b9d6cf','#364c45','Cuộc phiêu lưu của cậu bé Rémi trên hành trình tìm mái ấm.',false],
  ['Lược Sử Thời Gian','Stephen Hawking','Khoa học','9786041091610',105000,149000,16,'#d6d2f2','#3e3967','Khám phá vũ trụ, thời gian và những bí ẩn của vật lý.',false],
  ['Bí Mật Tư Duy Triệu Phú','T. Harv Eker','Kinh tế','9786043088120',112000,148000,23,'#e7d8a4','#614c27','Khám phá quan niệm tài chính và thói quen giàu có.',false],
  ['Totto-chan Bên Cửa Sổ','Kuroyanagi Tetsuko','Thiếu nhi','9786042109062',97000,139000,31,'#d9e6bd','#4c6546','Câu chuyện ấm áp về một ngôi trường đặc biệt.',false],
  ['Lãnh Đạo Bằng Sự Tử Tế','William Baker','Kinh tế','9786043918720',159000,205000,14,'#cfdfec','#2d4660','Tạo giá trị bền vững qua sự thấu hiểu và lãnh đạo nhân văn.',false],
  ['Vũ Trụ Trong Vỏ Hạt Dẻ','Stephen Hawking','Khoa học','9786041179721',145000,185000,8,'#c8c5e1','#3f3965','Cái nhìn trực quan về những lý thuyết vật lý hiện đại.',false],
]

export const CATEGORIES = ['Văn học', 'Kỹ năng', 'Kinh tế', 'Công nghệ', 'Thiếu nhi', 'Khoa học', 'Lịch sử']
export function freshBooks() {
  return raw.map(([title, author, category, isbn, price, hardcover, stock, color, ink, description, featured], index) => ({
    id: `B${String(index + 1).padStart(3, '0')}`, title, author, category, isbn,
    description, color, ink, featured,
    variants: [
      { id: 'paperback', name: 'Bìa mềm', price, discount: index % 3 === 0 ? 12 : index % 4 === 0 ? 8 : 0, stock },
      { id: 'hardcover', name: 'Bìa cứng', price: hardcover, discount: index % 5 === 0 ? 7 : 0, stock: Math.floor(stock / 3) },
    ],
    createdAt: new Date(Date.UTC(2026, 7, 1 + index)).toISOString(),
  }))
}
export function freshOrders() { return [] }
