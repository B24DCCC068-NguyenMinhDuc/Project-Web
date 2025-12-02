import React, { useState } from 'react';

function DoctorAppointments({ user, appointments, updateAppointment }) {
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ result: '', status: 'Hoàn thành', fee: 0 });

    // Lọc lịch hẹn của CHÍNH BÁC SĨ NÀY (Dựa vào doctor_id hoặc doctorName)
    // Lưu ý: Kiểm tra cả doctor_id từ database và doctorName để chắc chắn
    const myAppointments = appointments.filter(app => 
        app.doctor_id === user.doctorId || 
        app.assignedDoctor === user.doctorId ||
        (app.doctorName && app.doctorName.toLowerCase() === (user.full_name || user.name || '').toLowerCase())
    );

    const startExam = (app) => {
        setEditingId(app.id);
        setFormData({
            result: app.result || '',
            status: app.status === 'Chờ khám' ? 'Hoàn thành' : app.status,
            fee: app.fee || 0
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const app = myAppointments.find(a => a.id === editingId);
        const updatedApp = {
            ...app,
            ...formData,
            fee: parseInt(formData.fee) || 0
        };
        updateAppointment(updatedApp); // Gọi hàm cập nhật từ App.jsx
        setEditingId(null);
        alert("Đã cập nhật hồ sơ bệnh án!");
    };

    return (
        <div className="component-container">
            <h2>👨‍⚕️ Danh sách Bệnh nhân cần khám</h2>
            <p>Bác sĩ: <strong>{user.name}</strong></p>

            {myAppointments.length === 0 ? (
                <p style={{fontStyle:'italic', color:'#777'}}>Chưa có bệnh nhân nào đặt lịch.</p>
            ) : (
                <div style={{display:'flex', flexDirection:'column', gap:20}}>
                    {myAppointments.map(app => (
                        <div key={app.id} style={{
                            border:'1px solid #ddd', borderRadius:8, padding:20,
                            background: app.status === 'Hoàn thành' ? '#f0fff4' : 'white',
                            borderLeft: app.status === 'Hoàn thành' ? '5px solid #27ae60' : '5px solid #f39c12'
                        }}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:15}}>
                                <div>
                                    <h3 style={{margin:0, color:'#2c3e50'}}>{app.patientName || 'N/A'}</h3>
                                    <p style={{margin:'5px 0'}}><strong>Thời gian:</strong> {app.time_booked || app.time || 'Chưa xác định'}</p>
                                    <p style={{margin:'5px 0'}}><strong>Triệu chứng:</strong> {app.symptoms || 'N/A'}</p>
                                </div>
                                <div>
                                    <span style={{
                                        padding:'5px 10px', borderRadius:15, fontSize:12, fontWeight:'bold', color:'white',
                                        background: app.status === 'Hoàn thành' ? '#27ae60' : '#f39c12'
                                    }}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>

                            {/* Form Khám Bệnh (Hiện khi bấm nút Khám) */}
                            {editingId === app.id ? (
                                <form onSubmit={handleSave} style={{marginTop:15, borderTop:'1px dashed #ccc', paddingTop:15}}>
                                    <h4>📝 Cập nhật Kết quả khám</h4>
                                    
                                    <label style={{display:'block', fontWeight:'bold', marginBottom:5}}>Kết quả chẩn đoán:</label>
                                    <textarea required rows={3} style={{width:'100%', padding:10, marginBottom:10}}
                                        value={formData.result} 
                                        onChange={e => setFormData({...formData, result: e.target.value})} 
                                        placeholder="Nhập bệnh án, đơn thuốc..."
                                    />

                                    <div style={{display:'flex', gap:20, marginBottom:15}}>
                                        <div style={{flex:1}}>
                                            <label style={{display:'block', fontWeight:'bold'}}>Trạng thái:</label>
                                            <select style={{width:'100%', padding:8}}
                                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                                <option value="Đang khám">Đang khám</option>
                                                <option value="Hoàn thành">Hoàn thành</option>
                                            </select>
                                        </div>
                                        <div style={{flex:1}}>
                                            <label style={{display:'block', fontWeight:'bold', color:'#c0392b'}}>Viện phí (VNĐ):</label>
                                            <input type="number" style={{width:'100%', padding:8, color:'#c0392b', fontWeight:'bold'}}
                                                value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} />
                                        </div>
                                    </div>

                                    <div style={{display:'flex', gap:10}}>
                                        <button type="submit" className="btn">Lưu Hồ Sơ</button>
                                        <button type="button" onClick={() => setEditingId(null)} 
                                            style={{padding:'10px 20px', border:'none', background:'#95a5a6', color:'white', borderRadius:5, cursor:'pointer'}}>
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Nút mở form
                                <button onClick={() => startExam(app)} 
                                    style={{padding:'8px 15px', background:'#3498db', color:'white', border:'none', borderRadius:5, cursor:'pointer'}}>
                                    {app.status === 'Hoàn thành' ? 'Xem/Sửa lại kết quả' : 'Bắt đầu Khám'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DoctorAppointments;