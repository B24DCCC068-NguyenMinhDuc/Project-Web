// App.jsx (router version)
import { useState } from "react";
import QuanliBenhNhan from "./QuanliBenhNhan";
import QuanliBacSi from "./QuanliBacSi";
import DangkiLichKham from "./DangkiLichKham";
import PhanCongBacSi from "./PhanCongBacSi";
import CapNhatKetQua from "./CapNhatKetQua";
import "./api";
import Auth from "./Auth";


function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!loggedIn) return <Auth onLogin={() => setLoggedIn(true)} />;

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="sidebar">
          <h2>🏥 Bệnh viện A</h2>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/benhnhan">Quản lý Bệnh nhân</NavLink>
          <NavLink to="/bacsi">Quản lý Bác sĩ</NavLink>
          <NavLink to="/dangki">Đăng ký Lịch khám</NavLink>
          <NavLink to="/phancong">Phân công Khám</NavLink>
          <NavLink to="/capnhat">Cập nhật Kết quả</NavLink>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/benhnhan" element={<QuanliBenhNhan />} />
            <Route path="/bacsi" element={<QuanliBacSi />} />
            <Route path="/dangki" element={<DangkiLichKham />} />
            <Route path="/phancong" element={<PhanCongBacSi />} />
            <Route path="/capnhat" element={<CapNhatKetQua />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;