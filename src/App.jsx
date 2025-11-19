import React, { useState, useEffect } from "react";
import Auth from "./Auth";

import QuanliBenhNhan from "./QuanliBenhNhan";
import QuanliBacSi from "./QuanliBacSi";
import DangkiLichKham from "./DangkiLichKham";
import PhanCongBacSi from "./PhanCongBacSi";
import CapNhatKetQua from "./CapNhatKetQua";
import Home from "./Home";
import "./App.css";

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  

  const [currentView, setCurrentView] = useState("home");

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("patients");
    return saved ? JSON.parse(saved) : [];
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem("doctors");
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : [];
  });

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  
  const addPatient = (p) => setPatients((prev) => [...prev, p]);
  const addDoctor = (d) => setDoctors((prev) => [...prev, d]);
  const addAppointment = (a) => setAppointments((prev) => [...prev, a]);
  const updateAppointment = (updated) =>
    setAppointments((prev) =>
      prev.map((x) => (x.id === updated.id ? updated : x))
    );
  const deleteAppointment = (id) =>
    setAppointments((prev) => prev.filter((x) => x.id !== id));

  
  if (!loggedIn) {
    return <Auth onLogin={() => setLoggedIn(true)} />;
  }

  
  const renderView = () => {
    switch (currentView) {
      case "benhnhan":
        return <QuanliBenhNhan patients={patients} addPatient={addPatient} />;
      case "bacsi":
        return <QuanliBacSi doctors={doctors} addDoctor={addDoctor} />;
      case "dangki":
        return (
          <DangkiLichKham
            patients={patients}
            appointments={appointments}
            addAppointment={addAppointment}
          />
        );
      case "phancong":
        return (
          <PhanCongBacSi
            appointments={appointments}
            doctors={doctors}
            updateAppointment={updateAppointment}
            deleteAppointment={deleteAppointment}
          />
        );
      case "capnhat":
        return (
          <CapNhatKetQua
            appointments={appointments}
            doctors={doctors}
            updateAppointment={updateAppointment}
          />
        );
      default:
        return (
          <Home
            patients={patients}
            doctors={doctors}
            appointments={appointments}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2>🏥 Bệnh viện A</h2>
        <button onClick={() => setCurrentView("home")}>Trang chủ</button>
        <button onClick={() => setCurrentView("benhnhan")}>
          Quản lý Bệnh nhân
        </button>
        <button onClick={() => setCurrentView("bacsi")}>Quản lý Bác sĩ</button>
        <button onClick={() => setCurrentView("dangki")}>
          Đăng ký Lịch khám
        </button>
        <button onClick={() => setCurrentView("phancong")}>
          Phân công Khám
        </button>
        <button onClick={() => setCurrentView("capnhat")}>
          Cập nhật Kết quả
        </button>
      </nav>

      <main className="main-content">{renderView()}</main>
    </div>
  );
}

export default App;
