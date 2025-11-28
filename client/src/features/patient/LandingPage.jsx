import React, { useState } from 'react';
import './LandingPage.css'; 
import { FaHospitalSymbol, FaHistory, FaCalendarPlus, FaUserMd, FaNotesMedical, FaCheckCircle, FaStar, FaStethoscope } from 'react-icons/fa';

function LandingPage({ onLoginClick, user, onLogout, appointments, addAppointment, doctors }) {
    const [view, setView] = useState('home'); // home | doctors | booking | history
    
    // --- STATE CHO BOOKING WIZARD ---
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingData, setBookingData] = useState({ date: '', shift: '', symptoms: '' });

    // Lấy danh sách chuyên khoa unique
    const specialties = [...new Set(doctors.map(d => d.specialty))].filter(Boolean);
    // Lọc bác sĩ theo khoa đã chọn
    const filteredDoctors = doctors.filter(d => d.specialty === selectedSpecialty);

    const handleBook = (e) => {
        e.preventDefault();
        const newApp = {
            patientId: user.patientId || user.id,
            patientName: user.full_name,
            doctor_id: selectedDoctor.id,
            time_booked: `${new Date(bookingData.date).toLocaleDateString('vi-VN')} (${bookingData.shift})`,
            symptoms: bookingData.symptoms,
            doctorName: selectedDoctor.name,
            specialty: selectedSpecialty,
            status: 'Chờ khám'
        };
        addAppointment(newApp);
        
        alert(`Đặt lịch thành công!\nBác sĩ: ${selectedDoctor.name}\nThời gian: ${bookingData.shift} ngày ${bookingData.date}`);
        setBookingStep(1);
        setBookingData({ date: '', shift: '', symptoms: '' });
        setView('history');
    };

    return (
        <div className="landing-container">
            {/* --- HEADER --- */}
            <header className="landing-header">
                <div className="logo-section" onClick={() => setView('home')} style={{cursor:'pointer'}}>
                    <FaHospitalSymbol className="logo-icon" />
                    <div>
                        <h1 className="logo-text">Bệnh Viện Nhóm 7</h1>
                        <p className="logo-subtitle">Chuyên tâm chăm sóc sức khỏe bạn</p>
                    </div>
                </div>
                <nav className="nav-menu">
                    <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Trang chủ</button>
                    <button className={`nav-link ${view === 'doctors' ? 'active' : ''}`} onClick={() => setView('doctors')}>Đội Ngũ</button>
                    {user ? (
                        <>
                            <button className={`nav-link ${view === 'booking' ? 'active' : ''}`} onClick={() => setView('booking')}>Đặt lịch khám</button>
                            <button className={`nav-link ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>Lịch sử</button>
                            <div className="user-menu">
                                <span>Xin chào, <strong>{user.full_name}</strong></span>
                                <button className="btn-logout-nav" onClick={onLogout}>Đăng xuất</button>
                            </div>
                        </>
                    ) : (
                        <button className="btn-login-nav" onClick={onLoginClick}>Đăng nhập / Đăng ký</button>
                    )}
                </nav>
            </header>

            <div className="main-content-landing">
                {/* --- VIEW: TRANG CHỦ --- */}
                {view === 'home' && (
                    <>
                        <section className="hero-section">
                            <div className="hero-content">
                                <h2 className="hero-title">Chăm Sóc Sức Khỏe <br/> Toàn Diện & Tận Tâm</h2>
                                <p className="hero-subtitle">Đặt lịch khám trực tuyến nhanh chóng với đội ngũ chuyên gia hàng đầu.</p>
                                <button className="cta-button" onClick={() => user ? setView('booking') : onLoginClick()}>
                                    Đặt Lịch Ngay
                                </button>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section className="features-section">
                            <h2 className="section-heading">Tại Sao Chọn Chúng Tôi?</h2>
                            <div className="features-grid">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <FaUserMd/>
                                    </div>
                                    <h3>Đội ngũ chuyên gia</h3>
                                    <p>Các bác sĩ đầu ngành với nhiều năm kinh nghiệm chuyên môn cao.</p>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <FaCalendarPlus/>
                                    </div>
                                    <h3>Đặt lịch dễ dàng</h3>
                                    <p>Thao tác đơn giản, chọn bác sĩ và thời gian linh hoạt theo ý muốn.</p>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <FaNotesMedical/>
                                    </div>
                                    <h3>Hồ sơ điện tử</h3>
                                    <p>Theo dõi lịch sử khám bệnh và kết quả mọi lúc mọi nơi.</p>
                                </div>
                            </div>
                        </section>

                        {/* Hospital Images Section */}
                        <section className="hospital-images-section">
                            <h2 className="section-heading">Cơ Sở Vật Chất</h2>
                            <div className="images-gallery">
                                <div className="gallery-item">
                                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Bệnh viện"/>
                                    <p>Tòa nhà chính</p>
                                </div>
                                <div className="gallery-item">
                                    <img src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Phòng khám"/>
                                    <p>Phòng khám hiện đại</p>
                                </div>
                                <div className="gallery-item">
                                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Phòng ICU"/>
                                    <p>Phòng ICU trang bị tối tân</p>
                                </div>
                                <div className="gallery-item">
                                    <img src="https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Phòng chờ"/>
                                    <p>Phòng chờ thoải mái</p>
                                </div>
                            </div>
                        </section>

                        {/* Quick Stats */}
                        <section className="stats-section">
                            <div className="stat-card">
                                <h3>100+</h3>
                                <p>Bác sĩ chuyên gia</p>
                            </div>
                            <div className="stat-card">
                                <h3>50,000+</h3>
                                <p>Bệnh nhân đã khám</p>
                            </div>
                            <div className="stat-card">
                                <h3>24/7</h3>
                                <p>Hỗ trợ liên tục</p>
                            </div>
                            <div className="stat-card">
                                <h3>99%</h3>
                                <p>Hài lòng khách hàng</p>
                            </div>
                        </section>
                    </>
                )}

                {/* --- VIEW: ĐỘI NGŨ BÁC SĨ --- */}
                {view === 'doctors' && (
                    <div className="doctors-container">
                        <h2 className="section-title">Đội Ngũ Bác Sĩ Chuyên Gia</h2>
                        <div className="doctors-grid">
                            {doctors.length === 0 ? (
                                <p style={{textAlign:'center', gridColumn:'1/-1'}}>Chưa có bác sĩ nào.</p>
                            ) : (
                                doctors.map(doc => (
                                    <div key={doc.id} className="doctor-card">
                                        <div className="doctor-avatar">
                                            <FaUserMd size={60}/>
                                        </div>
                                        <h3>{doc.name}</h3>
                                        <p className="doctor-specialty">
                                            <FaStethoscope/> {doc.specialty || 'Chuyên gia'}
                                        </p>
                                        <div className="doctor-rating">
                                            <FaStar size={14} color="#f39c12"/>
                                            <FaStar size={14} color="#f39c12"/>
                                            <FaStar size={14} color="#f39c12"/>
                                            <FaStar size={14} color="#f39c12"/>
                                            <FaStar size={14} color="#f39c12"/>
                                        </div>
                                        <div className="doctor-schedule">
                                            <p><strong>Lịch làm việc:</strong></p>
                                            {doc.schedule && doc.schedule.length > 0 ? (
                                                <ul>
                                                    {doc.schedule.slice(0, 3).map((s, idx) => (
                                                        <li key={idx}>
                                                            {new Date(s.date).toLocaleDateString('vi-VN')} - {s.shift}
                                                        </li>
                                                    ))}
                                                    {doc.schedule.length > 3 && <li>...</li>}
                                                </ul>
                                            ) : (
                                                <p style={{color:'#888', fontSize:'12px'}}>Hiện chưa có lịch</p>
                                            )}
                                        </div>
                                        <button className="doctor-book-btn" onClick={() => user ? setView('booking') : onLoginClick()}>
                                            Đặt Lịch
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* --- VIEW: ĐẶT LỊCH (WIZARD) --- */}
                {view === 'booking' && (
                    <div className="booking-container">
                        <h2 className="section-title">Đăng Ký Khám Bệnh</h2>
                        
                        {/* STEP 1: CHỌN KHOA */}
                        {bookingStep === 1 && (
                            <div className="step-box">
                                <h3>Bước 1: Bạn muốn khám chuyên khoa nào?</h3>
                                <div className="grid-options">
                                    {specialties.length === 0 ? (
                                        <p style={{gridColumn:'1/-1'}}>Chưa có chuyên khoa nào.</p>
                                    ) : (
                                        specialties.map((spec, idx) => (
                                            <button key={idx} className="option-btn" onClick={() => { setSelectedSpecialty(spec); setBookingStep(2); }}>
                                                {spec}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: CHỌN BÁC SĨ */}
                        {bookingStep === 2 && (
                            <div className="step-box">
                                <button className="back-btn" onClick={() => setBookingStep(1)}>← Quay lại</button>
                                <h3>Bước 2: Chọn Bác sĩ khoa {selectedSpecialty}</h3>
                                {filteredDoctors.length === 0 ? (
                                    <p style={{textAlign:'center', padding:'40px'}}>Chưa có bác sĩ nào ở khoa này.</p>
                                ) : (
                                    <div className="grid-cards">
                                        {filteredDoctors.map(doc => (
                                            <div key={doc.id} className="card-item" onClick={() => { setSelectedDoctor(doc); setBookingStep(3); }}>
                                                <div className="card-avatar"><FaUserMd/></div>
                                                <h4>{doc.name}</h4>
                                                <p className="card-specialty">{doc.specialty}</p>
                                                <p className="card-schedule">Lịch trống: <strong>{doc.schedule?.length || 0}</strong> ngày</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: CHỌN NGÀY & CA */}
                        {bookingStep === 3 && selectedDoctor && (
                            <div className="step-box">
                                <button className="back-btn" onClick={() => setBookingStep(2)}>← Chọn lại Bác sĩ</button>
                                <h3>Bước 3: Chọn Thời Gian Khám</h3>
                                <div className="info-summary">
                                    <p><strong>Bác sĩ:</strong> {selectedDoctor.name}</p>
                                    <p><strong>Chuyên khoa:</strong> {selectedSpecialty}</p>
                                </div>

                                <form onSubmit={handleBook} className="booking-form">
                                    <div className="form-group">
                                        <label>Chọn Ngày:</label>
                                        <select required className="form-input" 
                                            value={bookingData.date}
                                            onChange={e => setBookingData({...bookingData, date: e.target.value, shift: ''})}>
                                            <option value="">-- Chọn ngày --</option>
                                            {selectedDoctor.schedule?.map((s, idx) => (
                                                <option key={idx} value={s.date}>
                                                    {new Date(s.date).toLocaleDateString('vi-VN')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {bookingData.date && (
                                        <>
                                            <div className="form-group">
                                                <label>Chọn Khung Giờ:</label>
                                                <div className="shift-options">
                                                    {selectedDoctor.schedule
                                                        .filter(s => s.date === bookingData.date)
                                                        .map((s, idx) => {
                                                            // Kiểm tra có bệnh nhân nào đã đặt khung giờ này chưa
                                                            const isBooked = appointments?.some(app => 
                                                                app.doctor_id === selectedDoctor.id &&
                                                                app.time_booked?.includes(s.date) &&
                                                                app.time_booked?.includes(s.time || s.shift)
                                                            );
                                                            
                                                            return (
                                                                <button key={idx} type="button" 
                                                                    className={`shift-btn ${bookingData.shift === s.time ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                                                                    onClick={() => !isBooked && setBookingData({...bookingData, shift: s.time || s.shift})}
                                                                    disabled={isBooked}
                                                                    title={isBooked ? 'Khung giờ này đã có người đặt' : ''}
                                                                >
                                                                    {s.time || s.shift}
                                                                    {isBooked && ' ❌'}
                                                                </button>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="form-group">
                                        <label>Triệu chứng / Lý do khám:</label>
                                        <textarea required rows={3} className="form-input"
                                            value={bookingData.symptoms} 
                                            onChange={e => setBookingData({...bookingData, symptoms: e.target.value})}
                                            placeholder="Vui lòng mô tả triệu chứng của bạn..."
                                        />
                                    </div>

                                    <button type="submit" className="submit-btn" disabled={!bookingData.shift}>
                                        XÁC NHẬN ĐẶT LỊCH
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* --- VIEW: LỊCH SỬ --- */}
                {view === 'history' && (
                    <div className="history-container">
                        <h2 className="section-title">Lịch Sử Khám Bệnh</h2>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Chuyên khoa</th>
                                    <th>Bác sĩ</th>
                                    <th>Triệu chứng</th>
                                    <th>Kết quả</th>
                                    <th>Trạng thái</th>
                                    <th>Viện phí</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.filter(a => a.patientName === user.full_name).map(app => (
                                    <tr key={app.id}>
                                        <td>{app.time_booked || app.time}</td>
                                        <td>{app.specialty}</td>
                                        <td style={{fontWeight:'bold'}}>{app.doctorName}</td>
                                        <td>{app.symptoms}</td>
                                        <td>{app.result || '-'}</td>
                                        <td>
                                            <span className={`status-tag ${app.status === 'Hoàn thành' ? 'success' : 'pending'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td style={{fontWeight:'bold', color:'#27ae60'}}>
                                            {app.fee ? `${parseInt(app.fee).toLocaleString()} đ` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LandingPage;