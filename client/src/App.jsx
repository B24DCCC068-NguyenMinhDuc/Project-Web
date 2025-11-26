import React, { useState, useEffect } from "react";
import Auth from "./Auth";
import Home from "./Home"; // Admin Dashboard
import QuanliBenhNhan from "./QuanliBenhNhan";
import QuanliBacSi from "./QuanliBacSi";
import DangkiLichKham from "./DangkiLichKham";
import PhanCongBacSi from "./PhanCongBacSi";
import CapNhatKetQua from "./CapNhatKetQua";
import DoctorSchedule from "./DoctorSchedule"; // Import component mới
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Lưu thông tin người đang đăng nhập
  const [currentView, setCurrentView] = useState("home"); // Mặc định

  // --- STATES DỮ LIỆU ---
  const [patients, setPatients] = useState(() => JSON.parse(localStorage.getItem("patients")) || []);
  const [doctors, setDoctors] = useState(() => JSON.parse(localStorage.getItem("doctors")) || []);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem("appointments")) || []);

  // --- EFFECT LƯU LOCALSTORAGE ---
  useEffect(() => localStorage.setItem("patients", JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem("doctors", JSON.stringify(doctors)), [doctors]);
  useEffect(() => localStorage.setItem("appointments", JSON.stringify(appointments)), [appointments]);

  // --- CÁC HÀM XỬ LÝ ---
  const addPatient = (p) => setPatients([...patients, p]);
  const addDoctor = (d) => setDoctors([...doctors, d]);
  const addAppointment = (a) => setAppointments([...appointments, a]);
  const updateAppointment = (updated) => setAppointments(prev => prev.map(x => x.id === updated.id ? updated : x));
  const deleteAppointment = (id) => setAppointments(prev => prev.filter(x => x.id !== id));
  
  // Hàm giả lập update lịch bác sĩ (bạn có thể phát triển thêm logic lưu vào bác sĩ tương ứng)
  const updateDoctorSchedule = (username, schedule) => {
    console.log("Cập nhật lịch cho bác sĩ", username, schedule);
    // Logic thực tế: Tìm bác sĩ trong list doctors và push schedule vào
  };

  // --- XỬ LÝ ĐĂNG NHẬP ---
  // Nếu chưa đăng nhập -> Hiện Form Auth
  if (!user) {
    return <Auth onLogin={(userData) => {
      setUser(userData);
      // Nếu là bác sĩ, mặc định vào trang lịch làm việc
      if(userData.role === 'doctor') setCurrentView("doctor-schedule");
      else setCurrentView("home");
    }} />;
  }

  // --- RENDER GIAO DIỆN THEO ROLE ---
  const renderContent = () => {
    // 1. Nếu là Admin
    if (user.role === 'admin') {
      switch (currentView) {
        case "home": return <Home patients={patients} doctors={doctors} appointments={appointments} />;
        case "benhnhan": return <QuanliBenhNhan patients={patients} addPatient={addPatient} />;
        case "bacsi": return <QuanliBacSi doctors={doctors} addDoctor={addDoctor} />;
        case "dangki": return <DangkiLichKham patients={patients} appointments={appointments} addAppointment={addAppointment} />;
        case "phancong": return <PhanCongBacSi appointments={appointments} doctors={doctors} updateAppointment={updateAppointment} deleteAppointment={deleteAppointment} />;
        case "capnhat": return <CapNhatKetQua appointments={appointments} doctors={doctors} updateAppointment={updateAppointment} />;
        default: return <Home patients={patients} doctors={doctors} appointments={appointments} />;
      }
    } 
    
    // 2. Nếu là Bác sĩ (Giống video: chỉ chọn ca làm việc)
    else if (user.role === 'doctor') {
       return <DoctorSchedule user={user} doctors={doctors} updateDoctorSchedule={updateDoctorSchedule} />;
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <nav className="sidebar">
        <h2>🏥 Bệnh viện A</h2>
        <div className="user-info" style={{padding: '0 15px 15px', borderBottom: '1px solid #ffffff30', marginBottom:'10px', fontSize:'14px'}}>
            Xin chào: <strong>{user.username}</strong> <br/>
            Role: <span style={{color: '#f1c40f'}}>{user.role === 'admin' ? 'Quản trị' : 'Bác sĩ'}</span>
        </div>

        {/* Menu cho ADMIN */}
        {user.role === 'admin' && (
          <>
            <button onClick={() => setCurrentView("home")}>📊 Thống kê (Dashboard)</button>
            <button onClick={() => setCurrentView("benhnhan")}>👥 Quản lý Bệnh nhân</button>
            <button onClick={() => setCurrentView("bacsi")}>👨‍⚕️ Quản lý Bác sĩ</button>
            <button onClick={() => setCurrentView("dangki")}>📝 Đăng ký Khám</button>
            <button onClick={() => setCurrentView("phancong")}>📅 Phân công</button>
            <button onClick={() => setCurrentView("capnhat")}>✅ Cập nhật Kết quả</button>
          </>
        )}

        {/* Menu cho BÁC SĨ */}
        {user.role === 'doctor' && (
           <button className="active">📅 Đăng ký ca làm việc</button>
        )}

        <button onClick={() => setUser(null)} style={{ marginTop: "auto", background: "#c0392b" }}>
           Đăng xuất
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;