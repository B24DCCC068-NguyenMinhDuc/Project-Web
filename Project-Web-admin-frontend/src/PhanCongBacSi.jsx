import React from 'react';

function PhanCongBacSi({ appointments, doctors, updateAppointment, deleteAppointment }) {
  const getDoctorsBySpecialty = (specialty) => {
    return doctors.filter(doc => doc.specialty === specialty);
  };

  const handleAssignDoctor = (appointment, doctorId) => {
    const updated = { ...appointment, assignedDoctor: doctorId };
    updateAppointment(updated);
  };

  const unassigned = appointments.filter(a => !a.assignedDoctor);
  const assigned = appointments.filter(a => a.assignedDoctor);

  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || 'Không rõ';

  return (
    <div className="component-container">
      <h2>Phân công Bác sĩ</h2>

      {/* --- CHƯA PHÂN CÔNG --- */}
      <h3>Chưa phân công</h3>
      <table>
        <thead>
          <tr>
            <th>Bệnh nhân</th>
            <th>Triệu chứng</th>
            <th>Chuyên khoa</th>
            <th>Thời gian</th>
            <th>Bác sĩ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {unassigned.map(app => (
            <tr key={app.id}>
              <td>{app.patientId}</td>
              <td>{app.symptoms}</td>
              <td>{app.specialty}</td>
              <td>{new Date(app.time).toLocaleString('vi-VN')}</td>
              <td>
                <select onChange={(e) => handleAssignDoctor(app, e.target.value)}>
                  <option value="">-- Chọn bác sĩ --</option>
                  {getDoctorsBySpecialty(app.specialty).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc muốn xóa lịch khám này không?")) {
                      deleteAppointment(app.id);
                    }
                  }}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- ĐÃ PHÂN CÔNG --- */}
      <h3>Đã phân công</h3>
      <table>
        <thead>
          <tr>
            <th>Bệnh nhân</th>
            <th>Chuyên khoa</th>
            <th>Thời gian</th>
            <th>Bác sĩ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {assigned.map(app => (
            <tr key={app.id}>
              <td>{app.patientId}</td>
              <td>{app.specialty}</td>
              <td>{new Date(app.time).toLocaleString('vi-VN')}</td>
              <td>{getDoctorName(app.assignedDoctor)}</td>
              <td>
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc muốn xóa lịch khám này không?")) {
                      deleteAppointment(app.id);
                    }
                  }}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PhanCongBacSi;
