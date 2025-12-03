import React from "react";
// Admin chỉ xem danh sách và trạng thái, không cần chọn bác sĩ nữa
function QuanLyLichKham({ appointments }) {
  const  thStyle = {color: '#000', fontWeight: 700};
  return (
    <div className="component-container">
      <h2>📅 Quản Lý Lịch Hẹn</h2>
      <p>Danh sách bệnh nhân đã đặt lịch:</p>

      <table>
        <thead>
          <tr>
            <th style={thStyle}>Thời gian</th>
            <th style={thStyle}>Bệnh nhân</th>
            <th style={thStyle}>Triệu chứng</th>
            <th style={thStyle}>Bác sĩ phụ trách</th>
            <th style={thStyle}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id}>
              <td>{app.time_booked || (app.time ? new Date(app.time).toLocaleString('vi-VN') : 'Invalid Date')}</td>
              <td>{app.patientName}</td>
              <td>{app.symptoms}</td>
              <td style={{fontWeight:'bold', color:'#2980b9'}}>{app.doctorName || "Chưa chọn"}</td>
              <td>
                <span style={{
                    padding:'4px 8px', borderRadius:4, fontSize:12, color:'white',
                    background: app.status==='Hoàn thành'?'#27ae60': app.status==='Đã hủy'?'#c0392b':'#f39c12'
                }}>
                    {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLyLichKham; 