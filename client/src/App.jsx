import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";

// --- 1. IMPORT API ---
import { 
    loginAPI, 
    getDataAPI, 
    updateAppointmentAPI, 
    addAppointmentAPI, 
    addDoctorAPI, 
    addPatientAPI,
    updatePatientAPI,
    deletePatientAPI,
} from "./api/api"; 

// --- 2. IMPORT COMPONENTS ---
import Auth from "./components/Auth";

// Admin Features
import Home from "./features/admin/Home"; 
import QuanliBenhNhan from "./features/admin/QuanliBenhNhan";
import QuanliBacSi from "./features/admin/QuanliBacSi";
import QuanLyLichKham from "./features/admin/QuanLyLichKham"; 
import CapNhatKetQua from "./features/admin/CapNhatKetQua";
// Admin có thể dùng ké form đăng ký của patient nếu cần, hoặc bỏ qua nếu không dùng
import DangkiLichKham from "./features/patient/DangkiLichKham"; 

// Doctor Features
import DoctorSchedule from "./features/doctor/DoctorSchedule";
import DoctorAppointments from "./features/doctor/DoctorAppointments";

// Patient Features
import LandingPage from "./features/patient/LandingPage"; 

import "./App.css"; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE USER & DATA ---
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const [data, setData] = useState({ 
      patients: [], 
      doctors: [], 
      appointments: [] 
  }); 

  // --- HÀM TẢI DỮ LIỆU ---
  
  // 1. Tải toàn bộ (Dành cho Admin / Khách)
  const fetchData = async () => {
    try {
        const res = await getDataAPI();
        setData({
            doctors: res.data.doctors || [],
            appointments: res.data.appointments || [],
            patients: res.data.patients || [] 
        });
    } catch (error) {
        console.error("Lỗi kết nối Server:", error);
    }
  };

  // 2. Tải dữ liệu riêng cho Bác sĩ (Để tối ưu và bảo mật hơn)
  const fetchDoctorData = async (doctorId) => {
    try {
        // Nếu api.js chưa có getDoctorAppointmentsAPI, ta dùng tạm fetchData()
        // Nhưng tốt nhất nên có API riêng. Ở đây ta dùng fetchData() rồi lọc lại ở Frontend để tránh lỗi crash nếu thiếu API
        const res = await getDataAPI();
        setData({
            doctors: res.data.doctors || [],
            patients: [], // Bác sĩ không cần xem danh sách tất cả bệnh nhân
            appointments: res.data.appointments || [] // Lọc sau ở component con
        });
    } catch (error) {
        console.error("Lỗi tải dữ liệu bác sĩ:", error);
    }
  };

  // Effect: Tải dữ liệu khi app chạy hoặc user thay đổi
  useEffect(() => { 
    if (user?.role === 'doctor') {
      fetchDoctorData(user.doctorId || user.id);
    } else {
      fetchData(); 
    }
  }, [user]);

  // --- HÀM AUTH ---
  const handleLogin = async (loginData) => {
      try {
          const res = await loginAPI(loginData);
          if (res.data.success) {
              const loggedUser = res.data.user;
              setUser(loggedUser);
              localStorage.setItem("user", JSON.stringify(loggedUser));
              
              // Điều hướng sau khi login
              if (loggedUser.role === 'admin') navigate('/admin/dashboard');
              else if (loggedUser.role === 'doctor') navigate('/doctor/appointments');
              else navigate('/'); // Bệnh nhân về trang chủ
          } else {
              alert(res.data.message || "Đăng nhập thất bại");
          }
      } catch (err) { alert("Lỗi kết nối server"); }
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem("user");
      navigate('/');
  };

  // --- HÀM XỬ LÝ DỮ LIỆU (CRUD) ---

  // Bác sĩ
  const handleAddDoctor = async (d) => { await addDoctorAPI(d); fetchData(); alert("Thêm bác sĩ thành công!"); };
  
  // Bệnh nhân
  const handleAddPatient = async (p) => { await addPatientAPI(p); fetchData(); alert("Thêm bệnh nhân thành công!"); };
  const handleUpdatePatient = async (id, d) => { 
      if(updatePatientAPI) await updatePatientAPI(id, d); // Kiểm tra nếu hàm tồn tại
      fetchData(); alert("Cập nhật thành công!"); 
  };
  const handleDeletePatient = async (id) => { 
      if(deletePatientAPI) await deletePatientAPI(id); 
      fetchData(); alert("Xóa thành công!"); 
  };

  // Lịch hẹn
  const handleAddAppointment = async (newApp) => { 
      try {
          const res = await addAppointmentAPI(newApp); 
          if (res.data.success) {
              alert(res.data.message || "Đặt lịch thành công!");
              // Refresh dữ liệu
              if (user?.role === 'doctor') fetchDoctorData(user.id);
              else fetchData();
          } else {
              alert(res.data.message); // Hiển thị lỗi trùng lịch từ server
          }
      } catch (err) { alert("Lỗi kết nối server!"); }
  };
  
  const handleUpdateAppointment = async (updated) => {
      // Optimistic update (Cập nhật giao diện trước)
      const newApps = data.appointments.map(a => a.id === updated.id ? updated : a);
      setData({ ...data, appointments: newApps }); 
      try {
         await updateAppointmentAPI(updated.id, updated); 
         if (user?.role === 'doctor') fetchDoctorData(user.id); // Refresh lại để chắc chắn
      } catch(err) { console.error(err); fetchData(); }
  };

  // --- LAYOUT: ADMIN ---
  const AdminLayout = () => {
      const isActive = (path) => location.pathname.includes(path) ? "active" : "";
      return (
        <div className="app-container">
            <nav className="sidebar">
                <h2>🏥 Admin Panel</h2>
                <div className="user-info-box">Xin chào: {user?.full_name || user?.username}</div>

                <Link to="/admin/dashboard"><button className={isActive('dashboard')}>📊 Thống kê</button></Link>
                <Link to="/admin/benh-nhan"><button className={isActive('benh-nhan')}>👥 QL Bệnh nhân</button></Link>
                <Link to="/admin/bac-si"><button className={isActive('bac-si')}>👨‍⚕️ QL Bác sĩ</button></Link>
                {/* Admin xem tất cả lịch hẹn */}
                <Link to="/admin/lich-hen"><button className={isActive('lich-hen')}>📅 QL Lịch Hẹn</button></Link>
                {/* Admin có thể đăng ký hộ nếu cần */}
                <Link to="/admin/dang-ky"><button className={isActive('dang-ky')}>📝 Đăng ký hộ</button></Link>
                <Link to="/admin/cap-nhat"><button className={isActive('cap-nhat')}>✅ Cập nhật KQ</button></Link>
                
                <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="dashboard" element={<Home appointments={data.appointments} doctors={data.doctors} patients={data.patients} />} />
                    <Route path="benh-nhan" element={<QuanliBenhNhan patients={data.patients} addPatient={handleAddPatient} updatePatient={handleUpdatePatient} deletePatient={handleDeletePatient} />} />
                    <Route path="bac-si" element={<QuanliBacSi doctors={data.doctors} addDoctor={handleAddDoctor} />} />
                    <Route path="lich-hen" element={<QuanLyLichKham appointments={data.appointments} />} />
                    <Route path="dang-ky" element={<DangkiLichKham patients={data.patients} appointments={data.appointments} addAppointment={handleAddAppointment} />} />
                    <Route path="cap-nhat" element={<CapNhatKetQua appointments={data.appointments} doctors={data.doctors} updateAppointment={handleUpdateAppointment} />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </main>
        </div>
      );
  };

  // --- RENDER CHÍNH ---
  return (
    <Routes>
        {/* 1. TRANG CHỦ & BỆNH NHÂN (Dùng chung LandingPage) */}
        <Route path="/" element={
            <LandingPage 
                user={user} 
                onLogout={handleLogout} 
                onLoginClick={() => navigate('/login')}
                appointments={data.appointments}
                addAppointment={handleAddAppointment}
                doctors={data.doctors}
            />
        } />
        
        {/* 2. TRANG ĐĂNG NHẬP */}
        <Route path="/login" element={<Auth onLoginSubmit={handleLogin} />} />

        {/* 3. KHU VỰC ADMIN */}
        <Route path="/admin/*" element={
            (user && user.role === 'admin') ? <AdminLayout /> : <Navigate to="/login" />
        } />

        {/* 4. KHU VỰC BÁC SĨ */}
        <Route path="/doctor/*" element={
            (user && user.role === 'doctor') ? (
                <div className="app-container">
                    <nav className="sidebar">
                        <h2>👨‍⚕️ Bác sĩ</h2>
                        <div className="user-info-box">BS: {user.full_name || user.username}</div>
                        
                        <Link to="/doctor/schedule">
                            <button className={location.pathname.includes('schedule') ? 'active' : ''}>
                                📅 Đăng ký lịch
                            </button>
                        </Link>
                        
                        <Link to="/doctor/appointments">
                            <button className={location.pathname.includes('appointments') ? 'active' : ''}>
                                📋 Danh sách khám
                            </button>
                        </Link>

                        <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
                    </nav>

                    <main className="main-content">
                        <Routes>
                            <Route path="schedule" element={<DoctorSchedule user={user} doctors={data.doctors} onRefresh={() => fetchDoctorData(user.doctorId || user.id)}/>} />
                            <Route path="appointments" element={
                                <DoctorAppointments 
                                    user={user} 
                                    appointments={data.appointments} 
                                    updateAppointment={handleUpdateAppointment} 
                                />
                            } />
                            <Route path="*" element={<Navigate to="appointments" />} />
                        </Routes>
                    </main>
                </div>
            ) : <Navigate to="/login" />
        } />
    </Routes>
  );
}

export default App;