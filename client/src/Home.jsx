import React from 'react';
import { FaUserInjured, FaUserMd, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';
import './App.css'; 

function Home({ patients, doctors, appointments }) {
  // 1. Tính toán số liệu thực tế từ Props truyền vào
  const totalPatients = patients ? patients.length : 0;
  const totalDoctors = doctors ? doctors.length : 0;
  const totalAppointments = appointments ? appointments.length : 0;
  
  // Tính doanh thu (Ví dụ: chỉ tính các ca đã "Hoàn thành", mỗi ca 500k)
  const completedAppts = appointments ? appointments.filter(a => a.status === 'Hoàn thành') : [];
  const totalRevenue = completedAppts.length * 500000; 

  // Component con: Thẻ thống kê (Stat Card)
  const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div style={{
      background: 'white', 
      padding: '25px', 
      borderRadius: '12px',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
      borderLeft: `5px solid ${color}`,
      transition: 'transform 0.2s',
      marginBottom: '20px'
    }}>
      <div>
        <p style={{ color: '#7f8c8d', margin: '0 0 10px', fontSize: '15px', fontWeight: '500' }}>
            {title}
        </p>
        <h3 style={{ margin: 0, fontSize: '28px', color: '#2c3e50', fontWeight: 'bold' }}>
            {value}
        </h3>
      </div>
      <div style={{ 
        width: '60px', height: '60px', borderRadius: '50%', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontSize: '24px'
      }}>
        <Icon />
      </div>
    </div>
  );

  return (
    <div className="home-container" style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
        Tổng Quan Bệnh Viện
      </h2>

      {/* Grid 4 thẻ thống kê */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // Tự động co giãn responsive
          gap: '25px', 
          marginBottom: '30px' 
      }}>
        <StatCard 
            title="Doanh thu tuần" 
            value={`${(totalRevenue).toLocaleString('vi-VN')} đ`} 
            icon={FaMoneyBillWave} 
            color="#2ecc71" 
            bg="#e8f8f5" 
        />
        <StatCard 
            title="Tổng Bệnh nhân" 
            value={totalPatients} 
            icon={FaUserInjured} 
            color="#3498db" 
            bg="#eaf2f8" 
        />
        <StatCard 
            title="Tổng Lịch khám" 
            value={totalAppointments} 
            icon={FaCalendarCheck} 
            color="#f1c40f" 
            bg="#fef9e7" 
        />
        <StatCard 
            title="Tổng Bác sĩ" 
            value={totalDoctors} 
            icon={FaUserMd} 
            color="#e74c3c" 
            bg="#fdedec" 
        />
      </div>

      {/* Có thể thêm một dòng thông báo nhỏ hoặc để trống cho sạch */}
      <div style={{ 
          background: '#fff', 
          padding: '40px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          color: '#95a5a6',
          border: '1px dashed #bdc3c7'
      }}>
          <p>Hệ thống quản lý đang hoạt động ổn định.</p>
      </div>
    </div>
  );
}

export default Home;