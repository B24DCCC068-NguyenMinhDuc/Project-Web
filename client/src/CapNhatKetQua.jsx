import React, { useState, useEffect } from "react";
import './CapNhatKetQua.css';

// Nhận thêm props doctors
function CapNhatKetQua({ appointments, updateAppointment, doctors }) {
    const [selectedId, setSelectedId] = useState("");
    const [ketQua, setKetQua] = useState("");
    const [trangThai, setTrangThai] = useState("Đang điều trị");

    // Lọc: Chỉ lấy những ca đã phân công bác sĩ
    const daPhanCong = appointments.filter(a => a.assignedDoctor);
    
    // Lọc: Danh sách ca khám đã có kết quả để hiển thị ở bảng dưới
    const completedAppointments = appointments.filter(a => a.result && a.status);

    // ✅ Hàm tra cứu tên Bác sĩ
    const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || 'Không rõ';

    // Đồng bộ form khi chọn ca khám
    useEffect(() => {
        const selectedApp = appointments.find(a => a.id === selectedId);
        if (selectedApp) {
            setKetQua(selectedApp.result || "");
            setTrangThai(selectedApp.status || "Đang điều trị");
        } else {
            setKetQua("");
            setTrangThai("Đang điều trị");
        }
    }, [selectedId, appointments]);

    const handleUpdate = (e) => {
        e.preventDefault(); // Ngăn chặn form submit mặc định
        
        if (!selectedId) {
            alert("Vui lòng chọn lịch khám!");
            return;
        }

        const app = appointments.find(a => a.id === selectedId);

        const updated = {
            ...app,
            result: ketQua,
            status: trangThai,
        };

        updateAppointment(updated);

        alert("Cập nhật kết quả khám thành công!");

        // Reset form sau khi cập nhật thành công
        setSelectedId("");
        setKetQua("");
        setTrangThai("Đang điều trị");
        // Lưu ý: React sẽ tự động re-render và hiển thị ca khám mới trong bảng
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Cập nhật Kết quả Khám</h2>

            {/* --- PHẦN FORM CẬP NHẬT --- */}
            <form onSubmit={handleUpdate} className="form-section">
                <label>Chọn ca bệnh đã phân công bác sĩ:</label>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    style={{ display: "block", marginBottom: 15 }}
                    required
                >
                    <option value="">-- Chọn ca khám --</option>
                    {daPhanCong.map(app => (
                        <option key={app.id} value={app.id}>
                            {app.patientId} — {new Date(app.time).toLocaleString("vi-VN")}
                        </option>
                    ))}
                </select>

                <label>Kết quả khám:</label>
                <textarea
                    value={ketQua}
                    onChange={(e) => setKetQua(e.target.value)}
                    rows={4}
                    style={{ width: "100%", marginBottom: 15 }}
                    placeholder="Nhập kết quả chẩn đoán và điều trị..."
                    required
                />

                <label>Trạng thái:</label>
                <select
                    value={trangThai}
                    onChange={(e) => setTrangThai(e.target.value)}
                    style={{ display: "block", marginBottom: 15 }}
                >
                    <option value="Đang điều trị">Đang điều trị</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>

                <button type="submit">Cập nhật</button>
            </form>
            
            <hr style={{ margin: '30px 0' }} /> 

            {/* --- PHẦN BẢNG DANH SÁCH CA KHÁM ĐÃ CÓ KẾT QUẢ --- */}
            <h3>Danh sách ca khám đã cập nhật kết quả</h3>
            <table>
                <thead>
                    <tr>
                        <th>Mã BN</th>
                        <th>Thời gian</th>
                        <th>Bác sĩ</th>
                        <th>Kết quả</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {completedAppointments.length > 0 ? (
                        completedAppointments.map(app => (
                            <tr key={app.id}>
                                <td>{app.patientId}</td>
                                <td>{new Date(app.time).toLocaleString('vi-VN')}</td>
                                {/* HIỂN THỊ TÊN BÁC SĨ */}
                                <td>{getDoctorName(app.assignedDoctor)}</td> 
                                <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                                    {app.result || 'Chưa có kết quả'}
                                </td>
                                <td>
                                    <span 
                                        style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            color: 'white',
                                            backgroundColor: app.status === 'Hoàn thành' ? '#2ecc71' : 
                                                            app.status === 'Đang điều trị' ? '#3498db' : '#e74c3c'
                                        }}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: '#777' }}>
                                Chưa có ca khám nào được cập nhật kết quả
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CapNhatKetQua;