import React, { useState } from "react";
// Nếu bạn muốn dùng style chung của App, hãy import lùi ra 2 cấp
// import '../../App.css'; 

function DangkiLichKham({ patients, appointments, addAppointment, preFilledPatientId }) {
  const [phoneSearch, setPhoneSearch] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  
  // Form đăng ký
  const [formData, setFormData] = useState({
    patientName: "",
    year: "",
    gender: "Nam",
    phone: "",
    address: "",
    time: "",
    symptoms: "",
    specialty: "Tim mạch"
  });

  // Tự động điền nếu có preFilledPatientId (dùng cho bệnh nhân tự đặt)
  React.useEffect(() => {
    if (preFilledPatientId && patients) {
        const p = patients.find(pat => pat.id === preFilledPatientId || pat.patientId === preFilledPatientId);
        if (p) {
            setFoundPatient(p);
            setFormData(prev => ({
                ...prev,
                patientName: p.name,
                year: p.year,
                address: p.address,
                phone: p.phone || "" // Nếu có
            }));
        }
    }
  }, [preFilledPatientId, patients]);

  const handleSearch = () => {
    if (!patients) return;
    const p = patients.find((p) => p.phone === phoneSearch || p.name.toLowerCase().includes(phoneSearch.toLowerCase()));
    if (p) {
      setFoundPatient(p);
      setFormData({ ...formData, patientName: p.name, year: p.year, address: p.address, phone: p.phone || phoneSearch });
      alert(`Đã tìm thấy bệnh nhân: ${p.name}`);
    } else {
      alert("Không tìm thấy! Vui lòng nhập thông tin mới.");
      setFoundPatient(null);
      setFormData({ ...formData, patientName: "", year: "", address: "", phone: phoneSearch });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate cơ bản
    if (!formData.patientName || !formData.time) {
        return alert("Vui lòng điền tên và thời gian khám!");
    }

    // Chuyển định dạng datetime-local sang yyyy-MM-dd HH:mm
    const timeBooked = formData.time ? new Date(formData.time).toLocaleString('sv-SE').slice(0, 16) : '';

    const newAppointment = {
      patientId: foundPatient ? foundPatient.id : Date.now(), // ID giả nếu khách mới
      patientName: formData.patientName,
      doctor_id: null, // Không chọn bác sĩ từ DangkiLichKham
      time_booked: timeBooked, // Sử dụng time_booked thay vì time
      symptoms: formData.symptoms,
      specialty: formData.specialty,
      status: 'Chờ khám',
      gender: formData.gender,
      year: formData.year,
      address: formData.address,
      phone: formData.phone
    };

    addAppointment(newAppointment);
    
    // Reset form
    setFormData({
        patientName: "", year: "", gender: "Nam", phone: "", address: "",
        time: "", symptoms: "", specialty: "Tim mạch"
    });
    setPhoneSearch("");
    setFoundPatient(null);
  };

  return (
    <div className="component-container">
      <h2 style={{ textAlign: "center", color: "#2c3e50" }}>📝 Đăng Ký Khám Bệnh</h2>

      {/* Chỉ hiện ô tìm kiếm nếu KHÔNG phải là bệnh nhân đang tự đặt (preFilledPatientId) */}
      {!preFilledPatientId && (
          <div className="search-box" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Nhập SĐT hoặc Tên để tìm hồ sơ cũ..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              style={{ flex: 1, padding: "10px" }}
            />
            <button onClick={handleSearch} className="btn" style={{ background: "#3498db" }}>
              Tìm hồ sơ
            </button>
          </div>
      )}

      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label>Họ và Tên:</label>
            <input
              type="text"
              required
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              disabled={!!foundPatient} // Khóa nếu tìm thấy
            />
          </div>
          <div>
            <label>Năm sinh:</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              disabled={!!foundPatient}
            />
          </div>
          <div>
            <label>Giới tính:</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div>
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Địa chỉ:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            disabled={!!foundPatient}
          />
        </div>

        <hr style={{ margin: "20px 0", border: "0", borderTop: "1px solid #eee" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label style={{ fontWeight: "bold", color: "#e74c3c" }}>Chuyên khoa khám:</label>
            <select
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #e74c3c" }}
            >
              <option value="Tim mạch">Tim mạch</option>
              <option value="Nhi">Nhi</option>
              <option value="Da liễu">Da liễu</option>
              <option value="Mắt">Mắt</option>
              <option value="Tai Mũi Họng">Tai Mũi Họng</option>
              <option value="Răng Hàm Mặt">Răng Hàm Mặt</option>
              <option value="Nội tổng quát">Nội tổng quát</option>
              <option value="Ngoại khoa">Ngoại khoa</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: "bold", color: "#e74c3c" }}>Thời gian hẹn:</label>
            <input
              type="datetime-local"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #e74c3c" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Triệu chứng / Ghi chú:</label>
          <textarea
            rows="3"
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          ></textarea>
        </div>

        <button type="submit" className="btn" style={{ width: "100%", marginTop: "20px", fontSize: "16px", padding: "12px" }}>
          ✅ Xác Nhận Đăng Ký
        </button>
      </form>
    </div>
  );
}

export default DangkiLichKham;