import { VocabItem, VocabularyPart } from '../../types';

const test1_words: VocabItem[] = [
    { word: "Schedule", definition: "Lịch trình / Sắp xếp", example: "" },
    { word: "Meeting", definition: "Cuộc họp", example: "" },
    { word: "Staff", definition: "Nhân viên", example: "" },
    { word: "Conference", definition: "Hội nghị", example: "" },
    { word: "Firm", definition: "Công ty", example: "" },
    { word: "Preferred", definition: "Được ưu tiên / Ưa thích", example: "" },
    { word: "Workday", definition: "Ngày làm việc", example: "" },
    { word: "Time zones", definition: "Múi giờ", example: "" },
    { word: "Interoffice", definition: "Giữa các văn phòng", example: "" },
    { word: "Reference", definition: "Tham khảo", example: "" },
    { word: "Underlined", definition: "Được gạch chân (nhấn mạnh)", example: "" },
    { word: "Administrative", definition: "Thuộc về hành chính", example: "" },
    { word: "Assistant", definition: "Trợ lý", example: "" },
    { word: "Tool", definition: "Công cụ (hỗ trợ lịch)", example: "" },
    { word: "Noon", definition: "Buổi trưa (12:00)", example: "" }
];

const test2_words: VocabItem[] = [
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
];

const test3_words: VocabItem[] = [
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
];

const test4_words: VocabItem[] = [];

const test5_words: VocabItem[] = [];

const test6_words: VocabItem[] = [
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
];

const test7_words: VocabItem[] = [
    { word: "Survey", definition: "Cuộc khảo sát", example: "" },
    { word: "Results", definition: "Kết quả", example: "" },
    { word: "Attached", definition: "Được đính kèm", example: "" },
    { word: "Disappointing", definition: "Đáng thất vọng", example: "" },
    { word: "Flavour", definition: "Hương vị", example: "" },
    { word: "Taste", definition: "Vị / Nếm", example: "" },
    { word: "Rating", definition: "Sự đánh giá / Điểm số", example: "" },
    { word: "Advance", definition: "Tiến tới / Tiến bộ", example: "" },
    { word: "Consistent", definition: "Nhất quán / Đồng nhất", example: "" },
    { word: "Consumer", definition: "Người tiêu dùng", example: "" },
    { word: "Adjust", definition: "Điều chỉnh", example: "" },
    { word: "Potential", definition: "Tiềm năng", example: "" },
    { word: "Proceed", definition: "Tiến hành / Tiếp tục", example: "" },
    { word: "Stage", definition: "Giai đoạn", example: "" },
    { word: "Phase", definition: "Giai đoạn", example: "" },
    { word: "Development", definition: "Sự phát triển", example: "" },
    { word: "Participant", definition: "Người tham gia", example: "" },
    { word: "Rate", definition: "Đánh giá", example: "" },
    { word: "Pleasant", definition: "Dễ chịu, hài lòng", example: "" },
    { word: "Sample", definition: "Mẫu", example: "" }
];

const test8_words: VocabItem[] = [
    { word: "Mission", definition: "Sứ mệnh / Nhiệm vụ", example: "" },
    { word: "Provide", definition: "Cung cấp", example: "" },
    { word: "Founded", definition: "Được thành lập", example: "" },
    { word: "Request", definition: "Yêu cầu", example: "" },
    { word: "Options", definition: "Lựa chọn", example: "" },
    { word: "Minimum", definition: "Tối thiểu", example: "" },
    { word: "Quality", definition: "Chất lượng", example: "" },
    { word: "Experience", definition: "Kinh nghiệm / Trải nghiệm", example: "" },
    { word: "Satisfying", definition: "Đem lại sự thỏa mãn / Hài lòng", example: "" },
    { word: "Fresh", definition: "Tươi / Mới", example: "" },
    { word: "Delicious", definition: "Ngon miệng", example: "" },
    { word: "Serve", definition: "Phục vụ", example: "" },
    { word: "Meal", definition: "Bữa ăn", example: "" },
    { word: "Cost", definition: "Chi phí", example: "" },
    { word: "Catering", definition: "Dịch vụ ăn uống / Cung cấp tiệc", example: "" },
    { word: "Ingredients", definition: "Thành phần / Nguyên liệu", example: "" },
    { word: "Vegetarian", definition: "Người ăn chay / Chay", example: "" },
    { word: "Growers", definition: "Người trồng trọt", example: "" },
    { word: "Adapted", definition: "Được điều chỉnh / Thích nghi", example: "" },
    { word: "Operated", definition: "Được vận hành / Hoạt động", example: "" },
    { word: "Estimate", definition: "Ước tính / Báo giá", example: "" }
];

const test9_words: VocabItem[] = [];

const test10_words: VocabItem[] = [];

export const readingComprehensiveVocabulary: VocabularyPart = {
    id: 200,
    title: "Reading theo Khóa học",
    description: "Từ vựng Reading phổ biến, có tỉ lệ xuất hiện cao",
    tests: [
        { id: 2001, title: "T1 - P7(149-150)", words: test1_words },
        { id: 2002, title: "T1 - P7(172-175)", words: test2_words },
        { id: 2003, title: "T1 - P7(181-185)", words: test3_words },
        { id: 2004, title: "Test 4", words: test4_words },
        { id: 2005, title: "Test 5", words: test5_words },
        { id: 2006, title: "T2 - P7(164-167)", words: test6_words },
        { id: 2007, title: "T2 - P7(176-180)", words: test7_words },
        { id: 2008, title: "T3 - P7(168-171)", words: test8_words },
        { id: 2009, title: "Test 9", words: test9_words },
        { id: 2010, title: "Test 10", words: test10_words },
    ]
};
