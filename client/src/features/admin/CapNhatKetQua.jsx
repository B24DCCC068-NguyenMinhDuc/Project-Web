import React, { useState, useEffect } from "react";

// [QUAN TRỌNG] Dấu ./ nghĩa là tìm file ở cùng thư mục hiện tại
import './CapNhatKetQua.css'; 

// Import API (Lùi ra 2 cấp thư mục)

function CapNhatKetQua({ appointments, doctors, updateAppointment }) {
    const [selectedId, setSelectedId] = useState("");
    
    // State cho form (Khởi tạo rỗng, sẽ được điền khi chọn ca khám)
    const [formData, setFormData] = useState({
        result: "",
        status: "Đang điều trị",
        fee: 0
    });

    // 1. Lọc danh sách: Chỉ hiển thị những ca ĐÃ CÓ BÁC SĨ để chọn cập nhật
    // Sắp xếp: Ca mới nhất lên đầu
    const assignedAppointments = appointments
        .filter(a => a.assignedDoctor || a.doctor_id) 
        .sort((a, b) => {
            const dateA = new Date(a.time || a.time_booked);
            const dateB = new Date(b.time || b.time_booked);
            return dateB - dateA;
        });

    // 2. Lọc danh sách: Để hiển thị bảng lịch sử bên dưới (Chỉ hiện ca đã xong)
    const completedAppointments = appointments.filter(a => a.status === 'Hoàn thành');

    // Hàm lấy tên bác sĩ từ ID
    const getDoctorName = (id) => {
        const doc = doctors.find(d => d.id === parseInt(id));
        return doc ? doc.name : "Chưa rõ";
    };

    // --- HIỆU ỨNG TỰ ĐỘNG ĐIỀN DỮ LIỆU CŨ (QUAN TRỌNG) ---
    // Khi người dùng chọn ID từ dropdown, code này sẽ tìm dữ liệu cũ và điền vào form
    useEffect(() => {
        if (!selectedId) {
            // Nếu chưa chọn gì -> Reset form về mặc định
            setFormData({ result: "", status: "Đang điều trị", fee: 0 });
            return;
        }

        const app = appointments.find(a => a.id === parseInt(selectedId));
        if (app) {
            setFormData({
                result: app.result || "",          // Lấy kết quả cũ (nếu có)
                status: app.status || "Đang điều trị", 
                fee: app.fee || 0                  // Lấy tiền cũ (nếu có)
            });
        }
    }, [selectedId, appointments]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedId) return alert("Vui lòng chọn ca khám!");

        const originalApp = appointments.find(a => a.id === parseInt(selectedId));
        
        // Tạo object mới với dữ liệu người dùng nhập
        const updatedApp = {
            ...originalApp,
            result: formData.result,
            status: formData.status,
            fee: parseInt(formData.fee) || 0 // Đảm bảo lưu số nguyên
        };

        // Gửi lên App.jsx để lưu xuống Server/State
        updateAppointment(updatedApp);
        
        alert("Cập nhật thành công!");
        // Không reset selectedId để người dùng thấy kết quả vừa lưu
    };

    const  thStyle = {color: '#000', fontWeight: 700};
    return (
        <div className="component-container">
            <h2>✅ Cập nhật Kết quả & Doanh thu</h2>
            
            <form onSubmit={handleSubmit} className="form-section">
                {/* 1. CHỌN CA KHÁM */}
                <label>Chọn ca bệnh đã phân công:</label>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    required
                    style={{width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc'}}
                >
                    <option value="">-- Vui lòng chọn --</option>
                    {assignedAppointments.map(app => (
                        <option key={app.id} value={app.id}>
                            {(app.time_booked || new Date(app.time).toLocaleString('vi-VN'))} — {app.patientName || `BN#${app.patientId}`} (BS. {app.doctorName || getDoctorName(app.assignedDoctor)})
                        </option>
                    ))}
                </select>

                {/* Chỉ hiện các ô nhập liệu khi đã chọn ca khám */}
                {selectedId && (
                    <div style={{animation: 'fadeIn 0.5s'}}>
                        <div style={{display: 'flex', gap: '20px', marginBottom: '15px'}}>
                            
                            {/* 2. CHỌN TRẠNG THÁI */}
                            <div style={{flex: 1}}>
                                <label>Trạng thái điều trị:</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    style={{width: '100%', padding: '10px'}}
                                >
                                    <option value="Đang điều trị">Đang điều trị</option>
                                    <option value="Hoàn thành">Hoàn thành (Đã khám xong)</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                </select>
                            </div>

                            {/* 3. NHẬP DOANH THU (Chỉ hiện khi Hoàn thành) */}
                            {formData.status === 'Hoàn thành' && (
                                <div style={{flex: 1}}>
                                    <label style={{color: '#e74c3c', fontWeight: 'bold'}}>Viện phí thực thu (VNĐ):</label>
                                    <input
                                        type="number"
                                        name="fee"
                                        value={formData.fee}
                                        onChange={handleChange}
                                        placeholder="Nhập số tiền..."
                                        style={{width: '100%', padding: '10px', border: '1px solid #e74c3c', fontWeight: 'bold', color: '#e74c3c'}}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 4. NHẬP KẾT QUẢ KHÁM */}
                        <label>Kết quả chẩn đoán / Ghi chú của Bác sĩ:</label>
                        <textarea
                            name="result"
                            value={formData.result}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Nhập chi tiết bệnh án, thuốc kê đơn..."
                            style={{width: '100%', padding: '10px', marginBottom: '20px'}}
                        />

                        <button type="submit" className="btn" style={{width: '100%', padding: '12px', fontSize: '16px'}}>
                            Lưu Cập Nhật
                        </button>
                    </div>
                )}
            </form>

            <hr style={{margin: '40px 0'}}/>

            {/* BẢNG LỊCH SỬ - Lấy từ dữ liệu thật completedAppointments */}
            <h3>Danh sách Ca đã hoàn thành & Doanh thu</h3>
            {completedAppointments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th style={thStyle}>Ngày khám</th>
                            <th style={thStyle}>Bệnh nhân</th>
                            <th style={thStyle}>Bác sĩ</th>
                            <th style={thStyle}>Kết quả</th>
                            <th style={thStyle}>Doanh thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedAppointments.map(app => (
                            <tr key={app.id}>
                                <td>{app.time_booked || (app.time ? new Date(app.time).toLocaleString('vi-VN') : 'Invalid Date')}</td>
                                <td>{app.patientName}</td>
                                <td>{app.doctorName || getDoctorName(app.assignedDoctor)}</td>
                                <td style={{maxWidth: '300px'}}>{app.result}</td>
                                <td style={{fontWeight: 'bold', color: '#27ae60'}}>
                                    {(app.fee || 0).toLocaleString('vi-VN')} đ
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>Chưa có ca khám nào hoàn thành.</p>
            )}
        </div>
    );
}

export default CapNhatKetQua;