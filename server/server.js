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
    password: 'Jeff1911!',      
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

// 5. API ĐẶT LỊCH (Bệnh nhân) - CÓ KIỂM TRA TRÙNG LỊCH
app.post('/api/appointments', (req, res) => {
    const { patientId, doctor_id, time_booked, symptoms, specialty, status, gender, year, address, phone, patientName } = req.body;
    
    console.log('=== ĐẶT LỊCH ===');
    console.log('time_booked:', time_booked);
    console.log('doctor_id:', doctor_id);
    console.log('patientId:', patientId);
    
    // Nếu doctor_id null, tức là bệnh nhân chưa chọn bác sĩ cụ thể
    // Lúc này chúng ta phải tìm bác sĩ nào có lịch trống vào thời gian đó
    
    if (!doctor_id) {
        // Chỉ cho phép nếu có time_booked (tức là bệnh nhân đặt lịch từ LandingPage)
        let appointmentDate, timeSlot;
        
        if (time_booked.includes('(')) {
            // Format: yyyy-MM-dd (7h-8h)
            appointmentDate = time_booked.split(' ')[0];
            timeSlot = time_booked.match(/\((.*?)\)/)?.[1];
            
            if (!timeSlot) {
                return res.json({ success: false, message: "Format thời gian không hợp lệ" });
            }
        } else {
            // Lỗi: không có doctor_id và không phải format LandingPage
            return res.json({ success: false, message: "Vui lòng chọn bác sĩ hoặc dùng form đặt lịch khác" });
        }
        
        // Lưu lịch khám mà không cần kiểm tra schedule (chỉ kiểm tra trùng appointment)
        // Bác sĩ sẽ được gán sau bởi admin hoặc hệ thống
        const sql = "INSERT INTO appointments (patient_id, doctor_id, time_booked, symptoms, specialty, status) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [patientId || Date.now(), null, time_booked, symptoms, specialty, status || 'Chờ khám'], (err, result) => {
            if (err) {
                console.error('Lỗi lưu appointment:', err);
                return res.json({ success: false, message: "Lỗi lưu lịch khám: " + err.message });
            }
            console.log('✓ Đặt lịch thành công!');
            res.json({ success: true, message: "Đặt lịch thành công! Admin sẽ gán bác sĩ cho bạn." });
        });
        return;
    }
    
    // Nếu có doctor_id thì kiểm tra xem bác sĩ này có lịch vào thời gian đó không
    let appointmentDate, appointmentTime;
    
    if (time_booked.includes('(')) {
        // Format: yyyy-MM-dd (7h-8h)
        appointmentDate = time_booked.split(' ')[0];
        const timeSlot = time_booked.match(/\((.*?)\)/)?.[1];
        
        if (!timeSlot) {
            return res.json({ success: false, message: "Format thời gian không hợp lệ" });
        }
        
        // Kiểm tra xem có lịch khám nào của bác sĩ này vào ngày/khung giờ đó chưa
        const sqlCheckAppointment = `
            SELECT a.* FROM appointments a 
            WHERE a.doctor_id = ? 
            AND a.time_booked LIKE ?
        `;
        
        db.query(sqlCheckAppointment, [doctor_id, appointmentDate + '%' + timeSlot + '%'], (err, appointmentResults) => {
            if (err) {
                console.error('Lỗi kiểm tra:', err);
                return res.json({ success: false, message: "Lỗi kiểm tra lịch khám" });
            }
            
            console.log('Appointments found:', appointmentResults.length);
            
            // Nếu đã có bệnh nhân khác đăng ký, không cho đặt
            if (appointmentResults.length > 0) {
                return res.json({ success: false, message: "Thời gian này đã được bệnh nhân khác đặt. Vui lòng chọn thời gian khác." });
            }
            
            // OK, có thể lưu lịch khám
            const sql = "INSERT INTO appointments (patient_id, doctor_id, time_booked, symptoms, specialty, status) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(sql, [patientId, doctor_id, time_booked, symptoms, specialty, status || 'Chờ khám'], (err, result) => {
                if (err) {
                    console.error('Lỗi lưu appointment:', err);
                    return res.json({ success: false, message: "Lỗi lưu lịch khám" });
                }
                console.log('✓ Đặt lịch thành công!');
                res.json({ success: true, message: "Đặt lịch thành công!" });
            });
        });
    } else {
        // Format: yyyy-MM-dd HH:mm (từ DangkiLichKham)
        appointmentDate = time_booked.split(' ')[0];
        appointmentTime = time_booked.split(' ')[1];
        
        // Kiểm tra xem có lịch khám nào của bác sĩ này vào thời gian đó chưa (cùng 1 tiếng)
        const sqlCheckAppointment = `
            SELECT a.* FROM appointments a 
            WHERE a.doctor_id = ? 
            AND DATE(a.time_booked) = ? 
            AND TIME(a.time_booked) >= ? 
            AND TIME(a.time_booked) < ?
        `;
        
        const startHour = appointmentTime.split(':')[0];
        const endHour = String(parseInt(startHour) + 1).padStart(2, '0');
        
        db.query(sqlCheckAppointment, [doctor_id, appointmentDate, appointmentTime, endHour + ':00'], (err, appointmentResults) => {
            if (err) {
                console.error('Lỗi kiểm tra:', err);
                return res.json({ success: false, message: "Lỗi kiểm tra lịch khám" });
            }
            
            console.log('Appointments found (format 2):', appointmentResults.length);
            
            // Nếu đã có bệnh nhân khác đăng ký, không cho đặt
            if (appointmentResults.length > 0) {
                return res.json({ success: false, message: "Thời gian này đã được bệnh nhân khác đặt. Vui lòng chọn thời gian khác." });
            }
            
            // OK, có thể lưu lịch khám
            const sql = "INSERT INTO appointments (patient_id, doctor_id, time_booked, symptoms, specialty, status) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(sql, [patientId, doctor_id, time_booked, symptoms, specialty, status || 'Chờ khám'], (err, result) => {
                if (err) {
                    console.error('Lỗi lưu appointment:', err);
                    return res.json({ success: false, message: "Lỗi lưu lịch khám" });
                }
                console.log('✓ Đặt lịch thành công!');
                res.json({ success: true, message: "Đặt lịch thành công!" });
            });
        });
    }
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

// 8. API ĐĂNG KÝ LỊCH (Bác sĩ) - BỎ SHIFT, KỂM TRA TRÙNG LỊCH
// server/server.js

// --- API BÁC SĨ ĐĂNG KÝ LỊCH (Có trả về lịch mới nhất) ---
app.post('/api/doctors/:id/schedule', (req, res) => {
    const { id } = req.params;
    const { date, times } = req.body; // times = ["07:00", "07:30", ...]

    // Bước 1: Xóa lịch cũ của ngày đó
    db.query("DELETE FROM schedules WHERE doctor_id = ? AND date = ?", [id, date], (err) => {
        if (err) return res.json({ success: false, message: "Lỗi xóa lịch cũ" });

        // Bước 2: Hàm helper để lấy lại toàn bộ lịch và trả về client
        const returnUpdatedSchedule = () => {
            db.query("SELECT * FROM schedules WHERE doctor_id = ? ORDER BY date, time", [id], (err, results) => {
                if (err) return res.json({ success: false, message: "Lỗi lấy lịch mới" });
                res.json({ success: true, schedule: results }); // Trả về danh sách lịch mới
            });
        };

        // Bước 3: Thêm các khung giờ mới (nếu có)
        if (times && times.length > 0) {
            const values = times.map(t => [id, date, t]);
            db.query("INSERT INTO schedules (doctor_id, date, time) VALUES ?", [values], (err) => {
                if (err) return res.json({ success: false, message: "Lỗi lưu lịch mới" });
                returnUpdatedSchedule(); // Lưu xong -> Trả về lịch mới ngay
            });
        } else {
            returnUpdatedSchedule(); // Trường hợp xóa hết lịch ngày đó
        }
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