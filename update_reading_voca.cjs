const fs = require('fs');
let content = fs.readFileSync('services/vocabulary/readingVoca.ts', 'utf8');

const t2 = `const test2_words: VocabItem[] = [
    { word: "Presentation", definition: "Bài thuyết trình", example: "" },
    { word: "Schedule", definition: "Lên lịch / Sắp xếp", example: "" },
    { word: "Report", definition: "Bản báo cáo", example: "" },
    { word: "Free", definition: "Rảnh / Có mặt", example: "" },
    { word: "Necessary", definition: "Cần thiết", example: "" },
    { word: "Summary", definition: "Bản tóm tắt", example: "" },
    { word: "Trial run", definition: "Buổi chạy thử / Thử nghiệm", example: "" },
    { word: "Expedite", definition: "Xúc tiến / Làm nhanh", example: "" },
    { word: "Incorporate", definition: "Kết hợp / Đưa vào", example: "" },
    { word: "On track", definition: "Đúng tiến độ", example: "" },
    { word: "Distribution", definition: "Sự phân phối", example: "" },
    { word: "Findings", definition: "Kết quả tìm thấy", example: "" },
    { word: "Missing elements", definition: "Các phần còn thiếu", example: "" }
];`;

const t3 = `const test3_words: VocabItem[] = [
    { word: "Deliver", definition: "Giao hàng", example: "" },
    { word: "Transport", definition: "Vận chuyển", example: "" },
    { word: "Order", definition: "Đơn hàng", example: "" },
    { word: "Item", definition: "Món đồ / Mặt hàng", example: "" },
    { word: "Arrive", definition: "Đến nơi", example: "" },
    { word: "Departure", definition: "Sự khởi hành", example: "" },
    { word: "Baggage", definition: "Hành lý", example: "" },
    { word: "Policy", definition: "Chính sách", example: "" },
    { word: "Personal", definition: "Đích thân / Cá nhân", example: "" },
    { word: "In transit", definition: "Đang vận chuyển", example: "" },
    { word: "Courier service", definition: "Dịch vụ chuyển phát", example: "" },
    { word: "Merchandise", definition: "Hàng hóa", example: "" },
    { word: "Rental car", definition: "Xe thuê", example: "" },
    { word: "Hand deliver", definition: "Giao tận tay", example: "" },
    { word: "Baggage handlers", definition: "Nhân viên bốc xếp", example: "" },
    { word: "Docking", definition: "Cập bến (phà/tàu)", example: "" },
    { word: "Vehicle", definition: "Phương tiện", example: "" },
    { word: "Prior to", definition: "Trước khi", example: "" }
];`;

const t6 = `const test6_words: VocabItem[] = [
    { word: "Discuss", definition: "Thảo luận", example: "" },
    { word: "Meet", definition: "Gặp mặt / Họp", example: "" },
    { word: "Available", definition: "Rảnh / Có mặt", example: "" },
    { word: "Office", definition: "Văn phòng", example: "" },
    { word: "Convenient", definition: "Thuận tiện / Phù hợp", example: "" },
    { word: "Next week", definition: "Tuần tới", example: "" },
    { word: "Extension", definition: "Sự gia hạn / Kéo dài", example: "" },
    { word: "Term", definition: "Thời hạn (hợp đồng)", example: "" },
    { word: "Out of the office", definition: "Vắng mặt / Đi công tác", example: "" },
    { word: "Date and time", definition: "Ngày và giờ", example: "" },
    { word: "Propose", definition: "Đề xuất", example: "" },
    { word: "Revision", definition: "Sự sửa đổi / Xem xét lại", example: "" }
];`;

content = content.replace('const test2_words: VocabItem[] = [];', t2);
content = content.replace('const test3_words: VocabItem[] = [];', t3);
content = content.replace('const test6_words: VocabItem[] = [];', t6);

fs.writeFileSync('services/vocabulary/readingVoca.ts', content);
