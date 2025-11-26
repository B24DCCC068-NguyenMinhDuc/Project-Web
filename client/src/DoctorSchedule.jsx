import React, { useState } from 'react';

function DoctorSchedule({ user, doctors, updateDoctorSchedule }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [shifts, setShifts] = useState({ sang: false, chieu: false });

  const handleRegister = (e) => {
    e.preventDefault();
    if (!selectedDate) return alert("Vui lòng chọn ngày!");
    if (!shifts.sang && !shifts.chieu) return alert("Vui lòng chọn ít nhất 1 ca!");

    // Tạo object lịch mới
    const newSchedule = {
      date: selectedDate,
      shifts: []
    };
    if (shifts.sang) newSchedule.shifts.push("Sáng (7:00 - 11:30)");
    if (shifts.chieu) newSchedule.shifts.push("Chiều (13:30 - 17:00)");

    // Gọi hàm cập nhật (được truyền từ App.jsx)
    updateDoctorSchedule(user.username, newSchedule);
    
    alert(`Đã đăng ký lịch ngày ${selectedDate} thành công!`);
    // Reset
    setShifts({ sang: false, chieu: false });
    setSelectedDate('');
  };

  return (
    <div className="component-container">
      <h2>📅 Đăng ký Lịch làm việc</h2>
      <p>Xin chào, <strong>Bác sĩ {user.name || user.username}</strong></p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Form Đăng Ký */}
        <form onSubmit={handleRegister} className="form-box" style={{ flex: 1 }}>
          <label>Chọn ngày làm việc:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
          />

          <label>Chọn ca:</label>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: '20px', cursor:'pointer' }}>
              <input 
                type="checkbox" 
                checked={shifts.sang} 
                onChange={() => setShifts({...shifts, sang: !shifts.sang})}
                style={{ width: 'auto', marginRight: '8px' }}
              /> 
              Ca Sáng
            </label>

            <label style={{ display: 'inline-flex', alignItems: 'center', cursor:'pointer' }}>
              <input 
                type="checkbox" 
                checked={shifts.chieu} 
                onChange={() => setShifts({...shifts, chieu: !shifts.chieu})}
                style={{ width: 'auto', marginRight: '8px' }}
              /> 
              Ca Chiều
            </label>
          </div>

          <button type="submit" className="btn">Xác nhận Đăng ký</button>
        </form>

        {/* Danh sách đã đăng ký (Demo visual) */}
        <div className="list-box" style={{ flex: 1 }}>
          <h3>Lịch sử đăng ký</h3>
          <ul>
             <li>27/11/2025: Ca Sáng, Ca Chiều</li>
             <li>28/11/2025: Ca Sáng</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DoctorSchedule;