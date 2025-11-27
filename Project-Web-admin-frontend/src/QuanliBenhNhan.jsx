// QuanliBenhNhan.jsx (using backend)
import { useEffect, useState } from "react";
import api from "./api";

function QuanliBenhNhan() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ patient_code: "", name: "", age: "", gender: "Nam", email: "", contact_number: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/patients").then(res => setPatients(res.data)).catch(() => setError("Không tải được danh sách bệnh nhân"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await api.put(`/patients/${editId}`, formData);
        setPatients(patients.map(p => (p.id === editId ? res.data : p)));
        setEditId(null);
      } else {
        const res = await api.post("/patients", formData);
        setPatients([...patients, res.data]);
      }
      setFormData({ patient_code: "", name: "", age: "", gender: "Nam", email: "", contact_number: "" });
      setError("");
    } catch {
      setError("Lỗi khi lưu bệnh nhân");
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setFormData({
      patient_code: p.patient_code,
      name: p.name,
      age: p.age,
      gender: p.gender,
      email: p.email,
      contact_number: p.contact_number,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    await api.delete(`/patients/${id}`);
    setPatients(patients.filter(p => p.id !== id));
  };

  return (
    <div className="component-container">
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Mã BN"
          value={formData.patient_code}
          onChange={e => setFormData({ ...formData, patient_code: e.target.value })}
        />
        <input
          placeholder="Tên"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="Tuổi"
          value={formData.age}
          onChange={e => setFormData({ ...formData, age: e.target.value })}
        />
        <select
          value={formData.gender}
          onChange={e => setFormData({ ...formData, gender: e.target.value })}
        >
          <option>Nam</option>
          <option>Nữ</option>
        </select>
        <input
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          placeholder="SĐT"
          value={formData.contact_number}
          onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
        />
        <button type="submit">{editId ? "Cập nhật" : "Thêm"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ patient_code: "", name: "", age: "", gender: "Nam", email: "", contact_number: "" });
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên</th>
            <th>Tuổi</th>
            <th>Giới</th>
            <th>Email</th>
            <th>SĐT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.patient_code}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.email}</td>
              <td>{p.contact_number}</td>
              <td>
                <button type="button" onClick={() => handleEdit(p)}>Sửa</button>
                <button type="button" onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default QuanliBenhNhan;