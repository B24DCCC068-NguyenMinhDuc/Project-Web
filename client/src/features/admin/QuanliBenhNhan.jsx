import React, { useState } from 'react';

function QuanliBenhNhan({ patients, addPatient, updatePatient, deletePatient }) {
  const [formData, setFormData] = useState({ name: '', year: '', address: '', phone: '', gender: 'Nam' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ Xử lý nhập liệu form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Thêm hoặc cập nhật bệnh nhân
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.year) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (editMode) {
      // Cập nhật bệnh nhân
      const updatedData = {
        name: formData.name,
        year: parseInt(formData.year),
        address: formData.address,
        phone: formData.phone,
        gender: formData.gender
      };
      updatePatient(editId, updatedData);
      setEditMode(false);
      setFormData({ name: '', year: '', address: '', phone: '', gender: 'Nam' });
      setEditId(null);
    } else {
      // Thêm mới bệnh nhân (mã tự động tăng)
      const newPatient = { 
        id: patients.length > 0 ? Math.max(...patients.map(p => parseInt(p.id) || 0)) + 1 : 1,
        name: formData.name,
        year: parseInt(formData.year),
        address: formData.address,
        phone: formData.phone,
        gender: formData.gender
      };
      addPatient(newPatient);
      setFormData({ name: '', year: '', address: '', phone: '', gender: 'Nam' });
    }
  };

  // ✅ Xử lý sửa
  const handleEdit = (patient) => {
    setEditMode(true);
    setEditId(patient.id);
    setFormData({
      name: patient.name,
      year: patient.year_birth || patient.year || '',
      address: patient.address || '',
      phone: patient.phone || '',
      gender: patient.gender || 'Nam'
    });
  };

  // ✅ Xử lý xóa
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này không? Hành động này không thể hoàn tác.')) {
      deletePatient(id);
    }
  };

  const  thStyle = {color: '#000', fontWeight: 700};
  return (
    <div className="component-container">
      <h2>Quản lý Bệnh nhân</h2>

      {/* Form thêm/sửa bệnh nhân */}
      <form onSubmit={handleSubmit} className="form-section">
        <h3>{editMode ? 'Cập nhật thông tin bệnh nhân' : 'Thêm Bệnh nhân mới'}</h3>
        <div>
          <label>Tên Bệnh nhân:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Năm sinh:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Giới tính:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div>
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editMode ? 'Cập nhật' : 'Thêm mới'}</button>

        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setFormData({ name: '', year: '', address: '', phone: '', gender: 'Nam' });
            }}
            style={{ marginLeft: '10px', backgroundColor: '#aaa' }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Bảng danh sách bệnh nhân */}
      <h3>Danh sách Bệnh nhân</h3>
      <table>
        <thead>
          <tr>
            <th style={thStyle}>Mã</th>
            <th style={thStyle}>Tên</th>
            <th style={thStyle}>Năm sinh</th>
            <th style={thStyle}>Giới tính</th>
            <th style={thStyle}>Số ĐT</th>
            <th style={thStyle}>Địa chỉ</th>
            <th style={thStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.year_birth || patient.year || '-'}</td>
              <td>{patient.gender || '-'}</td>
              <td>{patient.phone || '-'}</td>
              <td>{patient.address || '-'}</td>
              <td>
                <button className="Edit" onClick={() => handleEdit(patient)}>
                  Sửa
                </button>
                <button
                  className="Delete"
                  onClick={() => handleDelete(patient.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', color: '#777' }}>
                Chưa có bệnh nhân nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuanliBenhNhan;
