import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";

// 1. IMPORT API
// client/src/App.jsx

// Thêm addPatientAPI vào danh sách import
import { 
    loginAPI, 
    getDataAPI, 
    updateAppointmentAPI, 
    addAppointmentAPI, 
    addDoctorAPI, 
    addPatientAPI,
    getDoctorAppointmentsAPI
} from "./api/api"; 

// ... các dòng code khác giữ nguyên
// 2. IMPORT COMPONENTS
import Auth from "./components/Auth";

// 3. ADMIN FEATURES
import Home from "./features/admin/Home"; 
import QuanliBenhNhan from "./features/admin/QuanliBenhNhan";
import QuanliBacSi from "./features/admin/QuanliBacSi";
import QuanLyLichKham from "./features/admin/QuanLyLichKham"; // Quản lý danh sách hẹn
import CapNhatKetQua from "./features/admin/CapNhatKetQua";

// 4. DOCTOR FEATURES
import DoctorSchedule from "./features/doctor/DoctorSchedule";
import DoctorAppointments from "./features/doctor/DoctorAppointments";

// 5. PATIENT FEATURES (Landing Page kiêm Trang chủ Bệnh nhân)
import LandingPage from "./features/patient/LandingPage"; 

import "./App.css"; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const [data, setData] = useState({ 
      patients: [], 
      doctors: [], 
      appointments: [] 
  }); 

  // --- FETCH DATA TỪ MYSQL ---
  const fetchData = async () => {
    try {
        const res = await getDataAPI();
        // Server trả về: { doctors: [], patients: [], appointments: [] }
        setData({
            doctors: res.data.doctors || [],
            appointments: res.data.appointments || [],
            patients: res.data.patients || [] 
        });
    } catch (error) {
        console.error("Lỗi kết nối Server:", error);
    }
  };

  // --- FETCH DATA RIÊNG CHO BÁC SĨ ---
  const fetchDoctorData = async (doctorId) => {
    try {
        const resAppts = await getDoctorAppointmentsAPI(doctorId);
        setData(prev => ({
            ...prev,
            appointments: resAppts.data.appointments || []
        }));
    } catch (error) {
        console.error("Lỗi lấy danh sách bệnh nhân:", error);
    }
  };

  useEffect(() => { 
    if (user?.role === 'doctor' && user?.doctorId) {
      fetchDoctorData(user.doctorId);
    } else {
      fetchData(); 
    }
  }, [user]);

  // --- LOGIC AUTH ---
  const handleLogin = async (loginData) => {
      try {
          const res = await loginAPI(loginData);
          if (res.data.success) {
              const loggedUser = res.data.user;
              setUser(loggedUser);
              localStorage.setItem("user", JSON.stringify(loggedUser));
              
              if (loggedUser.role === 'admin') navigate('/admin/dashboard');
              else if (loggedUser.role === 'doctor') navigate('/doctor/appointments');
              else navigate('/'); // Bệnh nhân về Landing Page
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

  // --- CÁC HÀM XỬ LÝ DỮ LIỆU ---
  const handleAddDoctor = async (d) => { 
    await addDoctorAPI(d); 
    fetchData(); 
    alert("Thêm bác sĩ thành công!"); 
  };
  
  const handleAddPatient = async (p) => { 
    await addPatientAPI(p); 
    fetchData(); 
    alert("Thêm bệnh nhân thành công!"); 
  };
  
  const handleAddAppointment = async (a) => { 
      await addAppointmentAPI(a); 
      // Nếu là bác sĩ, refresh danh sách bệnh nhân của bác sĩ
      if (user?.role === 'doctor' && user?.doctorId) {
        fetchDoctorData(user.doctorId);
      } else {
        fetchData();
      }
  };
  
  const handleUpdateAppointment = async (updated) => {
      const newApps = data.appointments.map(a => a.id === updated.id ? updated : a);
      setData({ ...data, appointments: newApps }); 
      try {
         await updateAppointmentAPI(updated.id, updated); 
         // Nếu là bác sĩ, refresh danh sách bệnh nhân của bác sĩ đó
         if (user?.role === 'doctor' && user?.doctorId) {
           fetchDoctorData(user.doctorId);
         }
      } catch(err) { 
         console.error(err); 
         if (user?.role === 'doctor' && user?.doctorId) {
           fetchDoctorData(user.doctorId);
         } else {
           fetchData();
         }
      }
  };

  // --- ADMIN LAYOUT ---
  const AdminLayout = () => {
      const isActive = (path) => location.pathname.includes(path) ? "active" : "";

      return (
        <div className="app-container">
            <nav className="sidebar">
                <h2>🏥 Admin Panel</h2>
                <div className="user-info-box">Xin chào: {user?.full_name}</div>

                <Link to="/admin/dashboard"><button className={isActive('dashboard')}>📊 Thống kê</button></Link>
                <Link to="/admin/benh-nhan"><button className={isActive('benh-nhan')}>👥 Quản lý Bệnh nhân</button></Link>
                
                {/* Admin quản lý bác sĩ & xem lịch làm việc */}
                <Link to="/admin/bac-si"><button className={isActive('bac-si')}>👨‍⚕️ Quản lý Bác sĩ</button></Link>
                
                {/* Admin quản lý các cuộc hẹn đã đặt */}
                <Link to="/admin/lich-hen"><button className={isActive('lich-hen')}>📅 QL Lịch Hẹn</button></Link>
                
                <Link to="/admin/cap-nhat"><button className={isActive('cap-nhat')}>✅ Cập nhật Kết quả</button></Link>
                
                <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="dashboard" element={<Home appointments={data.appointments} doctors={data.doctors} patients={data.patients} />} />
                    <Route path="benh-nhan" element={<QuanliBenhNhan patients={data.patients} addPatient={handleAddPatient} />} />
                    <Route path="bac-si" element={<QuanliBacSi doctors={data.doctors} addDoctor={handleAddDoctor} />} />
                    <Route path="lich-hen" element={<QuanLyLichKham appointments={data.appointments} />} />
                    <Route path="cap-nhat" element={<CapNhatKetQua appointments={data.appointments} doctors={data.doctors} updateAppointment={handleUpdateAppointment} />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </main>
        </div>
      );
  };

  return (
    <Routes>
        {/* PUBLIC + PATIENT ROUTE */}
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
        
        <Route path="/login" element={<Auth onLoginSubmit={handleLogin} />} />

        {/* ADMIN ROUTE */}
        <Route path="/admin/*" element={
            (user && user.role === 'admin') ? <AdminLayout /> : <Navigate to="/login" />
        } />

        {/* DOCTOR ROUTE */}
        <Route path="/doctor/*" element={
            (user && user.role === 'doctor') ? (
                <div className="app-container">
                    <nav className="sidebar">
                        <h2>👨‍⚕️ Bác sĩ</h2>
                        <div className="user-info-box">BS: {user.full_name}</div>
                        <Link to="/doctor/schedule"><button className={location.pathname.includes('schedule') ? 'active' : ''}>📅 Đăng ký lịch</button></Link>
                        <Link to="/doctor/appointments"><button className={location.pathname.includes('appointments') ? 'active' : ''}>📋 Danh sách khám</button></Link>
                        <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
                    </nav>

                    <main className="main-content">
                        <Routes>
                            <Route path="schedule" element={<DoctorSchedule user={user} />} />
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