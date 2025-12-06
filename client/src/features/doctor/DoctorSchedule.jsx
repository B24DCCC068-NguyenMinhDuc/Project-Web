import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const DoctorSchedule = ({ user }) => {
  // --- PHẦN 1: LOGIC LOGIC XỬ LÝ (Giữ nguyên) ---
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayString());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [fullSchedule, setFullSchedule] = useState([]);
  const [message, setMessage] = useState('');

  const timeSlots = [];
  for (let i = 7; i < 17; i++) {
    const start = i < 10 ? `0${i}` : i;
    const end = i + 1 < 10 ? `0${i + 1}` : i + 1;
    timeSlots.push(`${start}:00-${end}:00`);
  }

  // Helper chuyển đổi ngày từ UTC sang Local YYYY-MM-DD
  // Hàm này dùng để so sánh chính xác ngày user đang chọn với ngày trong DB trả về
  const formatLocalDate = (isoString) => {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const updateSelectedTimesFromDB = useCallback((scheduleList, dateString) => {
    // SỬA: So sánh ngày đã convert sang Local Time thay vì string thô
    const scheduleForDay = scheduleList.filter(s => formatLocalDate(s.date) === dateString);
    setSelectedTimes(scheduleForDay.map(s => s.time));
  }, []);

  const fetchSchedule = useCallback(async () => {
    if (!user?.doctorId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/${user.doctorId}/schedule`);
      if (res.data.success) {
        setFullSchedule(res.data.schedule);
        updateSelectedTimesFromDB(res.data.schedule, date);
      }
    } catch (err) { console.error(err); }
  }, [user?.doctorId, date, updateSelectedTimesFromDB]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleDateChange = (e) => {
    const newDateStr = e.target.value;
    setDate(newDateStr);
    setMessage('');
    updateSelectedTimesFromDB(fullSchedule, newDateStr);
  };

  const toggleTime = (time) => {
    setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTimes.length === 0) {
      if (!window.confirm(`Bạn muốn XÓA toàn bộ lịch ngày ${date}?`)) return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/doctors/${user.doctorId}/schedule`, {
        date: date, times: selectedTimes
      });
      if (res.data.success) {
        alert("✅ Cập nhật thành công!");
        setFullSchedule(res.data.schedule);
      } else { alert("Lỗi: " + res.data.message); }
    } catch (err) { alert("Lỗi kết nối server!"); }
  };

  // --- PHẦN 2: LOGIC NHÓM LỊCH HIỂN THỊ (SỬA LỖI LÙI NGÀY Ở ĐÂY) ---
  const groupedSchedule = fullSchedule.reduce((acc, item) => {
    // SỬA: Thay vì split('T')[0], ta dùng hàm formatLocalDate để lấy ngày theo múi giờ máy tính
    const d = formatLocalDate(item.date); 
    
    if (!acc[d]) acc[d] = [];
    acc[d].push(item.time);
    return acc;
  }, {});

  // --- PHẦN 3: GIAO DIỆN (Giữ nguyên style cũ) ---
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>📅 Đăng ký Khung giờ làm việc</h2>
      <p>Bác sĩ: <strong>{user.full_name || "Chưa cập nhật tên"}</strong></p>

      <div className="form-box" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#f9f9f9' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>1. Chọn Ngày:</label>
        <input 
          type="date" 
          required 
          value={date} 
          onChange={handleDateChange} 
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} 
        />

        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>2. Chọn các khung giờ rảnh:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {timeSlots.map(t => (
            <button 
              key={t} 
              type="button" 
              onClick={() => toggleTime(t)}
              style={{
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #3498db', 
                cursor: 'pointer',
                background: selectedTimes.includes(t) ? '#3498db' : 'white',
                color: selectedTimes.includes(t) ? 'white' : '#3498db',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <button 
          onClick={handleSubmit} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#2ecc71', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          💾 Lưu Lịch
        </button>
      </div>

      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }}/>

      <h3>📋 Lịch làm việc hiện tại của bạn</h3>
      {Object.keys(groupedSchedule).length > 0 ? (
        <div style={{ display: 'grid', gap: '15px' }}>
          {Object.entries(groupedSchedule).sort().map(([scheduleDate, times]) => (
            <div key={scheduleDate} style={{ background: 'white', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#e67e22', fontWeight: 'bold', borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '5px' }}>
                {/* Hiển thị ngày tháng năm theo chuẩn Việt Nam */}
                Ngày {scheduleDate.split('-').reverse().join('/')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {times.sort().map((t, idx) => (
                  <span key={idx} style={{ background: '#eaf2f8', color: '#2980b9', padding: '4px 10px', borderRadius: '4px', fontSize: '13px', border: '1px solid #bdc3c7' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#777', fontStyle: 'italic' }}>Chưa có lịch đăng ký nào.</p>
      )}
    </div>
  );
};

export default DoctorSchedule;