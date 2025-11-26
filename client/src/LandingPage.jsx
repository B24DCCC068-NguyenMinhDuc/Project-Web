import React from 'react';
import './LandingPage.css'; // Nhớ import file CSS
import { FaHospitalSymbol } from 'react-icons/fa'; // Cần cài react-icons: npm install react-icons

function LandingPage({ onLoginClick }) {
    return (
        <div className="landing-container">
            {/* --- HEADER --- */}
            <header className="landing-header">
                <div className="logo-section">
                    <FaHospitalSymbol className="logo-icon" />
                    <h1 className="logo-text">Bệnh Viện A</h1>
                </div>
                
                <nav className="nav-menu">
                    <button className="nav-link">Trang chủ</button>
                    <button className="nav-link">Dịch vụ</button>
                    <button className="nav-link">Đội ngũ bác sĩ</button>
                    <button className="btn-login-nav" onClick={onLoginClick}>
                        Đăng nhập / Đặt lịch
                    </button>
                </nav>
            </header>
            
            {/* --- HERO SECTION --- */}
            <section className="hero-section">
                <div className="hero-content">
                    <h2 className="hero-title">Chăm Sóc Sức Khỏe <br/> Toàn Diện & Tận Tâm</h2>
                    <p className="hero-subtitle">
                        Trải nghiệm dịch vụ y tế chuẩn quốc tế với đội ngũ chuyên gia hàng đầu.
                        <br/> Đặt lịch khám trực tuyến nhanh chóng, không cần chờ đợi.
                    </p>
                    <button className="cta-button" onClick={onLoginClick}>
                        Đặt Lịch Ngay
                    </button>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;