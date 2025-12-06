import React, { useState } from 'react';
import './LandingPage.css'; // File CSS nằm cùng thư mục này
import { FaHospitalSymbol } from 'react-icons/fa'; 
import DangkiLichKham from './DangkiLichKham'; // Import file cùng thư mục

function LandingPage({ onLoginClick, user, onLogout, patients, appointments, addAppointment }) {
    
    const [showBooking, setShowBooking] = useState(false);

    const handleBookingClick = () => {
        if (user) {
            setShowBooking(true);
            setTimeout(() => {
                document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            onLoginClick(); 
        }
    };

    return (
        <div className="landing-container">
            <header className="landing-header">
                <div className="logo-section">
                    <FaHospitalSymbol className="logo-icon" />
                    <h1 className="logo-text">Bệnh Viện A</h1>
                </div>
                
                <nav className="nav-menu">
                    <button className="nav-link" onClick={() => setShowBooking(false)}>Trang chủ</button>
                    <button className="nav-link">Dịch vụ</button>
                    
                    {user ? (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#0077b6' }}>Xin chào, {user.name || user.username}</span>
                            <button 
                                onClick={onLogout} 
                                style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <button className="btn-login-nav" onClick={onLoginClick}>
                            Đăng nhập / Đặt lịch
                        </button>
                    )}
                </nav>
            </header>
            
            {showBooking && user ? (
                <div id="booking-section" style={{ padding: '40px 20px', background: '#f4f7f6', minHeight: '80vh' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <button 
                            onClick={() => setShowBooking(false)}
                            style={{ marginBottom: '20px', cursor: 'pointer', background: 'transparent', border: '1px solid #333', padding: '5px 10px', borderRadius: '5px' }}
                        >
                            ← Quay lại trang chủ
                        </button>
                        
                        <DangkiLichKham 
                            patients={patients} 
                            appointments={appointments} 
                            addAppointment={(newApp) => {
                                addAppointment(newApp);
                                setShowBooking(false); 
                            }} 
                            preFilledPatientId={user.id} 
                        />
                    </div>
                </div>
            ) : (
                <section className="hero-section">
                    <div className="hero-content">
                        <h2 className="hero-title">Chăm Sóc Sức Khỏe <br/> Toàn Diện & Tận Tâm</h2>
                        <p className="hero-subtitle">
                            {user 
                                ? "Chào mừng bạn quay trở lại. Hãy đặt lịch khám ngay hôm nay." 
                                : "Trải nghiệm dịch vụ y tế chuẩn quốc tế. Đặt lịch khám trực tuyến nhanh chóng."}
                        </p>
                        <button className="cta-button" onClick={handleBookingClick}>
                            {user ? "Đặt Lịch Khám Ngay" : "Đăng Nhập Để Đặt Lịch"}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}

export default LandingPage;