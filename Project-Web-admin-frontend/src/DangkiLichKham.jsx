import React, { useState } from 'react';
function DangkiLichKham({ patients, appointments, addAppointment }) {
  const [formData, setFormData] = useState({ patientId: '', symptoms: '', specialty: 'Tim mạch', time: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: appointments.length + 1,
      ...formData,
      assignedDoctor: null
    };
    addAppointment(newAppointment);
    setFormData({ patientId: '', symptoms: '', specialty: 'Tim mạch', time: '' });
    alert('Đăng ký lịch khám thành công!');
  };

  return (
    <div className="component-container">
      <h2>Đăng ký Lịch khám</h2>
      <form onSubmit={handleSubmit} className="form-section">
        <label>Bệnh nhân:</label>
        <select name="patientId" value={formData.patientId} onChange={handleChange} required>
          <option value="">-- Chọn --</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
          ))}
        </select>

        <label>Chuyên khoa:</label>
        <select name="specialty" value={formData.specialty} onChange={handleChange}>
          <option value="Tim mạch">Tim mạch</option>
          <option value="Nhi">Nhi</option>
          <option value="Da liễu">Da liễu</option>
        </select>

        <label>Thời gian:</label>
        <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />

        <label>Triệu chứng:</label>
        <textarea name="symptoms" value={formData.symptoms} onChange={handleChange}></textarea>

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}
export default DangkiLichKham;