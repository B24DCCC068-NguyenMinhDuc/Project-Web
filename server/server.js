const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// 1. KẾT NỐI DATABASE
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Minhduc16',      
    database: 'hospital_db'
});

db.connect(err => {
    if (err) console.error('Lỗi kết nối MySQL:', err);
    else console.log('Đã kết nối MySQL thành công!');
});

// 2. API ĐĂNG NHẬP
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `
        SELECT u.*, d.id as doctorId, p.id as patientId 
        FROM users u 
        LEFT JOIN doctors d ON u.id = d.user_id 
        LEFT JOIN patients p ON u.id = p.user_id 
        WHERE u.username = ? AND u.password = ?`;

    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
    });
});

// 3. API ĐĂNG KÝ (Sign Up)
app.post('/api/register', (req, res) => {
    const { fullName, username, password, phone } = req.body;
    // Mặc định đăng ký là Bệnh nhân
    const sqlUser = "INSERT INTO users (username, password, role, full_name) VALUES (?, ?, 'patient', ?)";
    
    db.query(sqlUser, [username, password, fullName], (err, result) => {
        if (err) return res.json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
        
        const userId = result.insertId;
        const sqlPatient = "INSERT INTO patients (user_id, phone) VALUES (?, ?)";
        db.query(sqlPatient, [userId, phone], (err) => {
            if (err) return res.json({ success: false });
            res.json({ success: true, message: "Đăng ký thành công!" });
        });
    });
});

// 4. API LẤY DỮ LIỆU TỔNG HỢP (Cho Admin & Home)
app.get('/api/data', (req, res) => {
    const sqlDoctors = `
        SELECT d.id, u.full_name as name, d.specialty 
        FROM doctors d JOIN users u ON d.user_id = u.id`;
        
    const sqlPatients = `
        SELECT p.id, u.full_name as name, p.year_birth, p.address, p.phone 
        FROM patients p JOIN users u ON p.user_id = u.id`;

    const sqlAppointments = `
        SELECT a.*, u_pat.full_name as patientName, u_doc.full_name as doctorName, d.specialty, a.doctor_id
        FROM appointments a
        LEFT JOIN patients p ON a.patient_id = p.id
        LEFT JOIN users u_pat ON p.user_id = u_pat.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN users u_doc ON d.user_id = u_doc.id
        ORDER BY a.created_at DESC`;

    const sqlSchedules = `SELECT * FROM schedules`;

    db.query(sqlDoctors, (err, doctors) => {
        db.query(sqlPatients, (err, patients) => {
            db.query(sqlAppointments, (err, appointments) => {
                db.query(sqlSchedules, (err, schedules) => {
                    // Map lịch vào bác sĩ
                    const doctorsWithSchedule = doctors.map(doc => ({
                        ...doc,
                        schedule: schedules.filter(s => s.doctor_id === doc.id)
                    }));
                    res.json({ doctors: doctorsWithSchedule, patients, appointments });
                });
            });
        });
    });
});

// 5. API ĐẶT LỊCH (Bệnh nhân)
app.post('/api/appointments', (req, res) => {
    const { patientId, doctor_id, time_booked, symptoms, specialty, status, gender, year, address, phone, patientName } = req.body;
    const sql = "INSERT INTO appointments (patient_id, doctor_id, time_booked, symptoms, specialty, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [patientId, doctor_id || null, time_booked, symptoms, specialty, status || 'Chờ khám'], (err, result) => {
        if (err) {
            console.error('Lỗi lưu appointment:', err);
            return res.json({ success: false, message: "Lỗi lưu lịch khám" });
        }
        res.json({ success: true, message: "Đặt lịch thành công!" });
    });
});

// 6. API CẬP NHẬT TRẠNG THÁI/KẾT QUẢ (Bác sĩ/Admin)
app.put('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { status, result, fee } = req.body;
    const sql = "UPDATE appointments SET status = ?, result = ?, fee = ? WHERE id = ?";
    db.query(sql, [status, result, fee, id], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

// 7. API THÊM BÁC SĨ (Admin)
app.post('/api/doctors', (req, res) => {
    const { name, username, password, specialty } = req.body;
    const sqlUser = "INSERT INTO users (username, password, role, full_name) VALUES (?, ?, 'doctor', ?)";
    
    db.query(sqlUser, [username, password, name], (err, result) => {
        if (err) return res.json({ success: false, message: "Lỗi tạo user" });
        const userId = result.insertId;
        const sqlDoc = "INSERT INTO doctors (user_id, specialty) VALUES (?, ?)";
        db.query(sqlDoc, [userId, specialty], () => {
            res.json({ success: true });
        });
    });
});

// API THÊM BỆNH NHÂN MỚI (Dành cho Admin)
app.post('/api/patients', (req, res) => {
    // Lấy dữ liệu từ Admin gửi lên
    const { name, year, address, phone, gender } = req.body;

    // 1. Tạo User trước (để có thể đăng nhập)
    // Tự sinh username/password ngẫu nhiên cho bệnh nhân
    const username = "bn_" + phone; 
    const password = "123"; 

    const sqlUser = "INSERT INTO users (username, password, role, full_name) VALUES (?, ?, 'patient', ?)";
    
    db.query(sqlUser, [username, password, name], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Lỗi tạo User (SĐT có thể đã tồn tại)" });
        }
        
        const userId = result.insertId;

        // 2. Tạo thông tin Bệnh nhân liên kết với User vừa tạo
        const sqlPatient = "INSERT INTO patients (user_id, year_birth, address, phone, gender) VALUES (?, ?, ?, ?, ?)";
        
        db.query(sqlPatient, [userId, year, address, phone, gender], (err) => {
            if (err) return res.json({ success: false, message: "Lỗi thêm Patient" });
            res.json({ success: true, message: "Thêm thành công!" });
        });
    });
});

// API CẬP NHẬT BỆNH NHÂN (Sửa)
app.put('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const { name, year, address, phone, gender } = req.body;
    
    // Cập nhật bảng users
    const sqlUpdateUser = "UPDATE users SET full_name = ? WHERE id IN (SELECT user_id FROM patients WHERE id = ?)";
    
    db.query(sqlUpdateUser, [name, id], (err) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Lỗi cập nhật thông tin người dùng" });
        }
        
        // Cập nhật bảng patients
        const sqlUpdatePatient = "UPDATE patients SET year_birth = ?, address = ?, phone = ?, gender = ? WHERE id = ?";
        
        db.query(sqlUpdatePatient, [year, address, phone, gender, id], (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: "Lỗi cập nhật thông tin bệnh nhân" });
            }
            res.json({ success: true, message: "Cập nhật thành công!" });
        });
    });
});

// API XÓA BỆNH NHÂN
app.delete('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    
    // Lấy user_id của bệnh nhân
    const sqlGetUserId = "SELECT user_id FROM patients WHERE id = ?";
    
    db.query(sqlGetUserId, [id], (err, results) => {
        if (err || results.length === 0) {
            console.error(err);
            return res.json({ success: false, message: "Bệnh nhân không tồn tại" });
        }
        
        const userId = results[0].user_id;
        
        // Xóa từ bảng patients trước
        const sqlDeletePatient = "DELETE FROM patients WHERE id = ?";
        
        db.query(sqlDeletePatient, [id], (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: "Lỗi xóa bệnh nhân" });
            }
            
            // Sau đó xóa từ bảng users
            const sqlDeleteUser = "DELETE FROM users WHERE id = ?";
            
            db.query(sqlDeleteUser, [userId], (err) => {
                if (err) {
                    console.error(err);
                    return res.json({ success: false, message: "Lỗi xóa tài khoản người dùng" });
                }
                res.json({ success: true, message: "Xóa thành công!" });
            });
        });
    });
});

// 8. API ĐĂNG KÝ LỊCH (Bác sĩ)
app.post('/api/doctors/:id/schedule', (req, res) => {
    const { id } = req.params;
    const { date, shift, time } = req.body; // time là khung giờ như "7h-9h"
    
    // Xóa lịch cũ ngày và ca đó để lưu lại
    const sqlDelete = "DELETE FROM schedules WHERE doctor_id = ? AND date = ? AND shift = ?";
    db.query(sqlDelete, [id, date, shift], () => {
        const sqlInsert = "INSERT INTO schedules (doctor_id, date, shift, time) VALUES (?, ?, ?, ?)";
        db.query(sqlInsert, [id, date, shift, time], (err) => {
            if (err) {
                console.error('Lỗi lưu lịch:', err);
                res.json({ success: false, message: "Lỗi lưu lịch" });
            } else {
                res.json({ success: true, message: "Đã lưu lịch thành công!" });
            }
        });
    });
});

// 9. API LẤY DANH SÁCH BỆNH NHÂN CẦN KHÁM CỦA BÁC SĨ
app.get('/api/doctors/:id/appointments', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT a.*, u_pat.full_name as patientName, u_doc.full_name as doctorName, d.specialty, a.doctor_id as assignedDoctor
        FROM appointments a
        LEFT JOIN patients p ON a.patient_id = p.id
        LEFT JOIN users u_pat ON p.user_id = u_pat.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN users u_doc ON d.user_id = u_doc.id
        WHERE a.doctor_id = ?
        ORDER BY a.created_at DESC`;
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ appointments: results });
    });
});
// --- API ĐĂNG NHẬP BẰNG GOOGLE ---
app.post('/api/google-login', (req, res) => {
    const { email, name, googleId } = req.body;

    // 1. Kiểm tra xem email này đã có trong hệ thống chưa
    const sqlCheck = "SELECT * FROM users WHERE email = ?";
    db.query(sqlCheck, [email], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });

        if (results.length > 0) {
            // A. Đã có tài khoản -> Trả về thông tin user đó luôn
            const user = results[0];
            res.json({ success: true, user });
        } else {
            // B. Chưa có -> Tự động tạo tài khoản mới (Mặc định là Patient)
            // Mật khẩu để tạm là chuỗi ngẫu nhiên hoặc googleId
            const sqlInsert = "INSERT INTO users (username, password, role, full_name, email, google_id) VALUES (?, ?, 'patient', ?, ?, ?)";
            // Username lấy phần đầu email (vd: nam.nguyen@gmail -> nam.nguyen)
            const username = email.split('@')[0]; 
            
            db.query(sqlInsert, [username, googleId, name, email, googleId], (err, result) => {
                if (err) return res.status(500).json({ success: false, message: "Lỗi tạo user Google" });
                
                const newUserId = result.insertId;
                // Tạo thêm thông tin bảng patients
                const sqlPat = "INSERT INTO patients (user_id) VALUES (?)";
                db.query(sqlPat, [newUserId], () => {
                    // Trả về user mới tạo
                    res.json({ success: true, user: { id: newUserId, username, role: 'patient', full_name: name, email } });
                });
            });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});