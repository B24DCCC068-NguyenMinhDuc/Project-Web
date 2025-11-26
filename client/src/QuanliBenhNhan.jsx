import React, { useState, useEffect } from 'react';

function QuanliBenhNhan({ patients, addPatient }) {
  const [localPatients, setLocalPatients] = useState(patients);
  const [formData, setFormData] = useState({ id: '', name: '', age: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ Đồng bộ khi danh sách từ App thay đổi
  useEffect(() => {
    setLocalPatients(patients);
  }, [patients]);

  // ✅ Xử lý nhập liệu form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Thêm hoặc cập nhật bệnh nhân
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.age) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (editMode) {
      // Cập nhật bệnh nhân
      const updated = localPatients.map((p) =>
        p.id === editId ? { ...formData, age: Number(formData.age) } : p
      );
      setLocalPatients(updated);
      localStorage.setItem('patients', JSON.stringify(updated));
      alert('Cập nhật thông tin thành công!');
      setEditMode(false);
      setEditId(null);
    } else {
      // Thêm mới bệnh nhân
      if (localPatients.some((p) => p.id === formData.id)) {
        alert('Mã bệnh nhân đã tồn tại!');
        return;
      }
      const newPatient = { ...formData, age: Number(formData.age) };
      const updated = [...localPatients, newPatient];
      setLocalPatients(updated);
      localStorage.setItem('patients', JSON.stringify(updated));
      addPatient(newPatient);
      alert('Thêm bệnh nhân thành công!');
    }

    // Reset form
    setFormData({ id: '', name: '', age: '' });
  };

  // ✅ Xử lý sửa
  const handleEdit = (patient) => {
    setEditMode(true);
    setEditId(patient.id);
    setFormData(patient);
  };

  // ✅ Xử lý xóa
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này không?')) {
      const updated = localPatients.filter((p) => p.id !== id);
      setLocalPatients(updated);
      localStorage.setItem('patients', JSON.stringify(updated));
      alert('Đã xóa bệnh nhân!');
    }
  };

  return (
    <div className="component-container">
      <h2>Quản lý Bệnh nhân</h2>

      {/* Form thêm/sửa bệnh nhân */}
      <form onSubmit={handleSubmit} className="form-section">
        <h3>{editMode ? 'Cập nhật thông tin bệnh nhân' : 'Thêm Bệnh nhân mới'}</h3>
        <div>
          <label>Mã Bệnh nhân:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={editMode} // Không cho sửa mã khi đang edit
          />
        </div>
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
          <label>Tuổi:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editMode ? 'Cập nhật' : 'Thêm mới'}</button>

        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setFormData({ id: '', name: '', age: '' });
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
            <th>Mã</th>
            <th>Tên</th>
            <th>Tuổi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {localPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
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
          {localPatients.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>
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
