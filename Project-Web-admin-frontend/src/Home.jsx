import React from 'react';
import { FaMoneyBillWave, FaUserPlus, FaCalendarCheck, FaUserMd } from 'react-icons/fa'; 
// Giả định bạn đã cài đặt react-icons (npm install react-icons)

// Nhận dữ liệu thống kê qua props
function Home({ patients, doctors, appointments }) {
    
    // 1. Tính toán các chỉ số
    const totalRevenue = 0; // Giả định doanh thu là 0 theo hình ảnh
    const totalPatients = patients ? patients.length : 0;
    const totalAppointments = appointments ? appointments.length : 0;
    const totalDoctors = doctors ? doctors.length : 0;

    // --- Cấu trúc dữ liệu cho các thẻ ---
    const stats = [
        {
            title: "Doanh thu hàng tuần",
            value: `$${totalRevenue}`,
            icon: FaMoneyBillWave,
            color: "var(--color-green)", // Sử dụng biến CSS để tạo màu nền
            backgroundColor: 'rgba(46, 204, 113, 0.1)', // Màu xanh lá nhạt
        },
        {
            title: "Tổng Bệnh nhân",
            value: totalPatients,
            icon: FaUserPlus,
            color: "var(--color-blue)",
            backgroundColor: 'rgba(52, 152, 219, 0.1)', // Màu xanh dương nhạt
        },
        {
            title: "Tổng Lịch khám",
            value: totalAppointments,
            icon: FaCalendarCheck,
            color: "var(--color-yellow)",
            backgroundColor: 'rgba(241, 196, 15, 0.1)', // Màu vàng nhạt
        },
        {
            title: "Tổng Bác sĩ",
            value: totalDoctors,
            icon: FaUserMd,
            color: "var(--color-red)",
            backgroundColor: 'rgba(231, 76, 60, 0.1)', // Màu đỏ nhạt
        },
    ];

    return (
        <div className="component-container">
            <h1>Hi, Welcome back</h1>
            
            {/* Vùng chứa các thẻ thống kê */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="info-card" 
                        style={{ backgroundColor: stat.backgroundColor, border: `1px solid ${stat.color}30` }}
                    >
                        <div className="card-icon" style={{ color: stat.color }}>
                            <stat.icon size={30} />
                        </div>
                        <div className="card-content">
                            <p className="card-value" style={{ color: stat.color }}>
                                {stat.value}
                            </p>
                            <p className="card-title">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Có thể thêm các biểu đồ hoặc thông tin khác tại đây */}
        </div>
    );
}

export default Home;