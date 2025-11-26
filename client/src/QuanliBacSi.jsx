import React, { useState, useEffect } from 'react';

function QuanliBacSi({ doctors, addDoctor }) {
  const [localDoctors, setLocalDoctors] = useState(doctors);
  const [formData, setFormData] = useState({ id: '', name: '', specialty: '', schedule: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ Khi props doctors từ App thay đổi thì cập nhật lại local state
  useEffect(() => {
    setLocalDoctors(doctors);
  }, [doctors]);

  // ✅ Xử lý nhập liệu form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Thêm hoặc cập nhật bác sĩ
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.id || !formData.name || !formData.specialty) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (editMode) {
      // Cập nhật bác sĩ
      const updated = localDoctors.map((d) =>
        d.id === editId ? { ...formData } : d
      );
      setLocalDoctors(updated);
      localStorage.setItem('doctors', JSON.stringify(updated));
      alert('Cập nhật thông tin bác sĩ thành công!');
      setEditMode(false);
      setEditId(null);
    } else {
      // Thêm mới bác sĩ
      if (localDoctors.some((d) => d.id === formData.id)) {
        alert('Mã bác sĩ đã tồn tại!');
        return;
      }
      const newDoctor = { ...formData };
      const updated = [...localDoctors, newDoctor];
      setLocalDoctors(updated);
      localStorage.setItem('doctors', JSON.stringify(updated));
      addDoctor(newDoctor);
      alert('Thêm bác sĩ thành công!');
    }

    setFormData({ id: '', name: '', specialty: '', schedule: '' });
  };

  // ✅ Chọn bác sĩ để sửa
  const handleEdit = (doctor) => {
    setEditMode(true);
    setEditId(doctor.id);
    setFormData(doctor);
  };

  // ✅ Xóa bác sĩ
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này không?')) {
      const updated = localDoctors.filter((d) => d.id !== id);
      setLocalDoctors(updated);
      localStorage.setItem('doctors', JSON.stringify(updated));
      alert('Đã xóa bác sĩ!');
    }
  };

  return (
    <div className="component-container">
      <h2>Quản lý Bác sĩ</h2>

      {/* Form thêm/sửa bác sĩ */}
      <form onSubmit={handleSubmit} className="form-section">
        <h3>{editMode ? 'Cập nhật Bác sĩ' : 'Thêm Bác sĩ mới'}</h3>
        <div>
          <label>Mã Bác sĩ:</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={editMode}
          />
        </div>
        <div>
          <label>Tên Bác sĩ:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Chuyên khoa:</label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn chuyên khoa --</option>
            <option value="Tim mạch">Tim mạch</option>
            <option value="Nhi">Nhi</option>
            <option value="Nội tổng quát">Nội tổng quát</option>
            <option value="Da liễu">Da liễu</option>
          </select>
        </div>
        <div>
          <label>Lịch làm việc:</label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            placeholder="VD: T2, T4, T6"
          />
        </div>
        <button type="submit">{editMode ? 'Cập nhật' : 'Thêm mới'}</button>

        {editMode && (
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setFormData({ id: '', name: '', specialty: '', schedule: '' });
            }}
            style={{ marginLeft: '10px', backgroundColor: '#aaa' }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Bảng danh sách bác sĩ */}
      <h3>Danh sách Bác sĩ</h3>
      <table>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Chuyên khoa</th>
            <th>Lịch làm việc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {localDoctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>{doctor.schedule}</td>
              <td>
                <button className="Edit" onClick={() => handleEdit(doctor)}>
                  Sửa
                </button>
                <button
                  className="Delete"
                  onClick={() => handleDelete(doctor.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {localDoctors.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: '#777' }}>
                Chưa có bác sĩ nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuanliBacSi;
