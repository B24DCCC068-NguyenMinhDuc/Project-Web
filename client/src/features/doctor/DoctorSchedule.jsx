import React, { useState } from 'react';
// [SỬA LẠI ĐƯỜNG DẪN API]
import { registerScheduleAPI } from '../../api/api';

function DoctorSchedule({ user }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);

  // user.doctorId là ID liên kết với bảng doctors
  const doctorId = user.doctorId;

  // Khung giờ theo ca
  const shiftTimes = {
    'Sáng': ['7h-9h', '9h-11h'],
    'Chiều': ['13h-15h', '15h-17h', '18h-20h']
  };

  const handleTimeToggle = (time) => {
    setSelectedTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!doctorId) return alert("Lỗi tài khoản: Không tìm thấy ID bác sĩ.");
    if (!selectedDate) return alert("Chọn ngày!");
    if (!selectedShift) return alert("Chọn ca!");
    if (selectedTimes.length === 0) return alert("Chọn ít nhất 1 khung giờ!");

    try {
        // Gửi từng khung giờ như một schedule
        for (let time of selectedTimes) {
            await registerScheduleAPI(doctorId, { 
                date: selectedDate, 
                shift: selectedShift,
                time: time 
            });
        }
        alert("Đã gửi lịch cho Admin!");
        setSelectedDate('');
        setSelectedShift('');
        setSelectedTimes([]);
    } catch (err) { 
        alert("Lỗi lưu lịch: " + err.message); 
    }
  };

  return (
    <div className="component-container">
      <h2>📅 Đăng ký Lịch làm việc</h2>
      <p>Xin chào: <strong>{user.name}</strong></p>
      <form onSubmit={handleRegister} className="form-box">
          <label>Ngày:</label>
          <input 
            type="date" 
            required 
            value={selectedDate} 
            onChange={e => {
              setSelectedDate(e.target.value);
              setSelectedShift('');
              setSelectedTimes([]);
            }} 
            style={{width:'100%', padding:10, marginBottom:20}} 
          />

          <label style={{fontWeight: 'bold', marginTop: 10, display: 'block'}}>Chọn Ca:</label>
          <div style={{marginBottom: 20, display: 'flex', gap: 20}}>
             <label style={{cursor: 'pointer'}}>
               <input 
                 type="radio" 
                 name="shift" 
                 value="Sáng"
                 checked={selectedShift === 'Sáng'} 
                 onChange={() => {
                   setSelectedShift('Sáng');
                   setSelectedTimes([]);
                 }} 
               /> Ca Sáng
             </label>
             <label style={{cursor: 'pointer'}}>
               <input 
                 type="radio" 
                 name="shift" 
                 value="Chiều"
                 checked={selectedShift === 'Chiều'} 
                 onChange={() => {
                   setSelectedShift('Chiều');
                   setSelectedTimes([]);
                 }} 
               /> Ca Chiều
             </label>
          </div>

          {selectedShift && (
            <>
              <label style={{fontWeight: 'bold', marginTop: 10, display: 'block'}}>Chọn Khung Giờ:</label>
              <div style={{marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10}}>
                {shiftTimes[selectedShift].map(time => (
                  <label key={time} style={{
                    padding: 10,
                    border: selectedTimes.includes(time) ? '2px solid #667eea' : '1px solid #ddd',
                    borderRadius: 5,
                    cursor: 'pointer',
                    backgroundColor: selectedTimes.includes(time) ? '#f0f4ff' : '#fff',
                    textAlign: 'center',
                    fontWeight: selectedTimes.includes(time) ? 'bold' : 'normal'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTimes.includes(time)} 
                      onChange={() => handleTimeToggle(time)}
                      style={{marginRight: 5}}
                    /> {time}
                  </label>
                ))}
              </div>
            </>
          )}

          <button className="btn" style={{width: '100%', padding: 12, fontSize: 16}}>Xác nhận</button>
      </form>
    </div>
  );
}

export default DoctorSchedule;