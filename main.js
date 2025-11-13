// Chờ cho toàn bộ nội dung HTML được tải xong
document.addEventListener("DOMContentLoaded", function() {

    // Lấy các phần tử (elements)
    const modal = document.getElementById("booking-modal");
    const closeModalBtn = document.getElementById("close-booking-modal");
    
    // Lấy cả 2 nút "Đặt lịch hẹn"
    const openModalBtnNav = document.getElementById("open-booking-modal");
    const openModalBtnHero = document.getElementById("open-booking-modal-hero");

    // Hàm để mở modal
    function openModal() {
        modal.style.display = "block";
    }

    // Hàm để đóng modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Gán sự kiện click cho các nút
    openModalBtnNav.onclick = openModal;
    openModalBtnHero.onclick = openModal;
    closeModalBtn.onclick = closeModal;

    // Đóng modal khi nhấn ra ngoài khu vực form
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Xử lý khi form được gửi (submit)
    const bookingForm = document.getElementById("booking-form");
    bookingForm.onsubmit = function(event) {
        event.preventDefault(); // Ngăn trang tải lại

        // Lấy dữ liệu từ form
        const patientName = document.getElementById("patientName").value;
        const phone = document.getElementById("phone").value;
        const specialty = document.getElementById("specialty").value;
        const symptoms = document.getElementById("symptoms").value;
        const scheduledTime = document.getElementById("scheduledTime").value;

        // --- KẾT NỐI VỚI BACKEND ---
        // Đây là nơi bạn sẽ dùng 'fetch' để gửi dữ liệu này 
        // đến API backend (gọi hàm `registerAppointment`)
        
        console.log("Đang gửi dữ liệu đến backend:", {
            patientName,
            phone,
            specialty,
            symptoms,
            scheduledTime
        });

        alert("Đặt lịch thành công! Vui lòng kiểm tra email (demo).");
        closeModal();
    }
});