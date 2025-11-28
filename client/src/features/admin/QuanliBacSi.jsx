import React, { useState } from 'react';

function QuanliBacSi({ doctors, addDoctor }) {
  // Form thêm bác sĩ bao gồm cả thông tin đăng nhập
  const [newDoc, setNewDoc] = useState({ 
      name: '', 
      username: '', 
      password: '', 
      specialty: 'Tim mạch' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!newDoc.name || !newDoc.username || !newDoc.password) {
        return alert("Vui lòng điền đầy đủ thông tin!");
    }
    
    // Gọi hàm thêm bác sĩ (Hàm này sẽ gọi API POST xuống server)
    addDoctor(newDoc);
    
    // Reset form
    setNewDoc({ name: '', username: '', password: '', specialty: 'Tim mạch' });
  };

  return (
    <div className="component-container">
      <h2>👨‍⚕️ Quản lý Bác sĩ & Lịch làm việc</h2>
      
      {/* --- FORM THÊM BÁC SĨ --- */}
      <div className="form-box" style={{marginBottom: 30, background: '#f9f9f9', padding: 20, borderRadius: 8}}>
          <h3 style={{marginTop: 0, color: '#2c3e50'}}>Thêm Bác sĩ Mới</h3>
          <form onSubmit={handleSubmit} style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
              <input 
                placeholder="Họ và tên Bác sĩ" 
                value={newDoc.name} 
                onChange={e => setNewDoc({...newDoc, name: e.target.value})} 
                style={{padding: 10, flex: 1, minWidth: 200}} 
                required
              />
              <input 
                placeholder="Tên đăng nhập (Username)" 
                value={newDoc.username} 
                onChange={e => setNewDoc({...newDoc, username: e.target.value})} 
                style={{padding: 10, flex: 1, minWidth: 150}} 
                required
              />
              <input 
                type="password"
                placeholder="Mật khẩu" 
                value={newDoc.password} 
                onChange={e => setNewDoc({...newDoc, password: e.target.value})} 
                style={{padding: 10, flex: 1, minWidth: 150}} 
                required
              />
              <select 
                value={newDoc.specialty} 
                onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} 
                style={{padding: 10, flex: 1, minWidth: 150}}
              >
                  <option value="Tim mạch">Tim mạch</option>
                  <option value="Nhi khoa">Nhi khoa</option>
                  <option value="Thần kinh">Thần kinh</option>
                  <option value="Da liễu">Da liễu</option>
                  <option value="Chấn thương chỉnh hình">Chấn thương chỉnh hình</option>
                  <option value="Mắt">Mắt</option>
                  <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                  <option value="Sản phụ khoa">Sản phụ khoa</option>
              </select>
              <button type="submit" className="btn" style={{background: '#27ae60', padding: '10px 20px'}}>
                  + Thêm mới
              </button>
          </form>
      </div>

      {/* --- DANH SÁCH BÁC SĨ & LỊCH --- */}
      <h3>Danh sách Bác sĩ hiện có</h3>
      <table>
        <thead>
          <tr>
            <th style={{width: '5%'}}>ID</th>
            <th style={{width: '20%'}}>Tên Bác sĩ</th>
            <th style={{width: '15%'}}>Chuyên khoa</th>
            <th style={{width: '60%'}}>Lịch đã đăng ký (Ngày rảnh)</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td style={{textAlign: 'center'}}>{doc.id}</td>
              <td style={{fontWeight: 'bold', color: '#2c3e50'}}>{doc.name}</td>
              <td>
                  <span style={{background: '#eaf2f8', color: '#3498db', padding: '4px 8px', borderRadius: 4, fontSize: 12}}>
                      {doc.specialty}
                  </span>
              </td>
              <td>
                {/* Hiển thị lịch làm việc lấy từ Database */}
                {doc.schedule && doc.schedule.length > 0 ? (
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 5}}>
                        {doc.schedule.map((s, idx) => (
                            <div key={idx} style={{
                                border: '1px solid #ddd', 
                                padding: '5px 10px', 
                                borderRadius: 20, 
                                fontSize: 13, 
                                background: '#fff'
                            }}>
                                📅 <strong>{new Date(s.date).toLocaleDateString('vi-VN')}</strong>: 
                                <span style={{color: '#e67e22', fontWeight: 'bold'}}> {s.shift}</span>
                                {s.time && <span style={{color: '#3498db', marginLeft: 5}}>({s.time})</span>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span style={{color: '#999', fontStyle: 'italic', fontSize: 13}}>Chưa đăng ký lịch</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuanliBacSi;