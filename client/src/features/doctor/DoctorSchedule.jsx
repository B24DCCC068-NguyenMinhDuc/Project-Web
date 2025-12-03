import React, { useState } from 'react';
import { registerScheduleAPI } from '../../api/api'; 

function DoctorSchedule({ user, doctors, onRefresh }) { 
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  const TIME_SLOTS = [
      "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
      "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // Logic an toàn: Ưu tiên dùng doctorId, nếu không có thì lấy user.id
  // Nhưng để chính xác nhất, bạn PHẢI ĐĂNG XUẤT ĐĂNG NHẬP LẠI để có doctorId
  const currentDoctorId = user.doctorId || user.id;

  // Tìm lịch hiện tại để hiển thị
  const myInfo = doctors.find(d => d.id === currentDoctorId);
  const mySchedule = myInfo ? myInfo.schedule : [];

  const toggleTime = (time) => {
      if (selectedTimes.includes(time)) setSelectedTimes(selectedTimes.filter(t => t !== time));
      else setSelectedTimes([...selectedTimes, time]);
  };

  const handleSave = async (e) => {
      e.preventDefault();
      
      // KIỂM TRA QUAN TRỌNG
      if (!user.doctorId) {
          alert("⚠️ Lỗi dữ liệu tài khoản! Vui lòng ĐĂNG XUẤT và ĐĂNG NHẬP LẠI để hệ thống cập nhật ID mới.");
          return;
      }

      if (!selectedDate) return alert("Vui lòng chọn Ngày!");
      if (selectedTimes.length === 0) {
          if (!window.confirm("Bạn không chọn giờ nào. Hành động này sẽ XÓA lịch làm việc của ngày đã chọn. Tiếp tục?")) return;
      }

      try {
          const res = await registerScheduleAPI(currentDoctorId, { 
              date: selectedDate, 
              times: selectedTimes.sort() 
          });
          
          if (res.data.success) {
              alert("✅ Đăng ký lịch thành công!");
              // Gọi hàm làm mới dữ liệu từ App.jsx truyền xuống
              if (onRefresh) onRefresh(); 
          } else {
              alert("Lỗi: " + res.data.message);
          }
      } catch (err) { 
          console.error(err);
          alert("Lỗi kết nối server!"); 
      }
  };

  return (
    <div className="component-container">
      <h2>📅 Đăng ký Khung giờ làm việc</h2>
      <p>Bác sĩ: <strong>{user.full_name}</strong></p>

      {/* Warning nếu tài khoản bị lỗi ID cũ */}
      {!user.doctorId && (
          <div style={{padding:10, background:'#ffe6e6', color:'red', marginBottom:15, border:'1px solid red'}}>
              ⚠️ Cảnh báo: Tài khoản của bạn là phiên bản cũ. Vui lòng <strong>Đăng xuất</strong> ra vào lại để đăng ký lịch.
          </div>
      )}

      <form onSubmit={handleSave} className="form-box">
          <label style={{fontWeight:'bold'}}>1. Chọn Ngày:</label>
          <input 
            type="date" required 
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate} onChange={e => setSelectedDate(e.target.value)} 
            style={{width:'100%', padding:10, marginBottom:15}} 
          />

          <label style={{fontWeight:'bold'}}>2. Chọn các khung giờ rảnh:</label>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(80px, 1fr))', gap:10, marginBottom:20}}>
              {TIME_SLOTS.map(t => (
                  <button key={t} type="button" 
                      onClick={() => toggleTime(t)}
                      style={{
                          padding: '10px', borderRadius: 5, border: '1px solid #3498db', cursor: 'pointer',
                          background: selectedTimes.includes(t) ? '#3498db' : 'white',
                          color: selectedTimes.includes(t) ? 'white' : '#3498db',
                          fontWeight: 'bold'
                      }}
                  >
                      {t}
                  </button>
              ))}
          </div>
          <button className="btn" style={{width:'100%', padding:12}}>💾 Lưu Lịch</button>
      </form>

      <hr style={{margin:'30px 0'}}/>

      <h3>📋 Lịch làm việc hiện tại của bạn</h3>
      {mySchedule && mySchedule.length > 0 ? (
          <div style={{display:'grid', gap:15}}>
              {Object.entries(mySchedule.reduce((acc, item) => {
                  const d = item.date.split('T')[0];
                  if (!acc[d]) acc[d] = [];
                  acc[d].push(item.time);
                  return acc;
              }, {})).sort().map(([date, times]) => (
                  <div key={date} style={{background:'white', padding:15, border:'1px solid #ddd', borderRadius:8}}>
                      <div style={{color:'#e67e22', fontWeight:'bold', borderBottom:'1px solid #eee', marginBottom:5}}>
                          Ngày {new Date(date).toLocaleDateString('vi-VN')}
                      </div>
                      <div style={{display:'flex', flexWrap:'wrap', gap:5}}>
                          {times.sort().map(t => (
                              <span key={t} style={{background:'#eaf2f8', color:'#2980b9', padding:'2px 8px', borderRadius:4, fontSize:13}}>
                                  {t}
                              </span>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <p style={{color:'#777'}}>Chưa có lịch đăng ký.</p>
      )}
    </div>
  );
}

export default DoctorSchedule;