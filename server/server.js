// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- GIẢ LẬP DỮ LIỆU (Sau này bạn thay bằng Database MySQL/MongoDB) ---
const USERS = [
    { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Quản trị viên' },
    { id: 2, username: 'bs_hung', password: '123', role: 'doctor', name: 'Bác sĩ Hùng' },
    { id: 3, username: 'bs_lan', password: '123', role: 'doctor', name: 'Bác sĩ Lan' },
    { id: 4, username: 'benhnhan1', password: '123', role: 'patient', name: 'Nguyễn Văn A' }
];

// --- API ĐĂNG NHẬP ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        // Trả về thông tin user kèm role (vai trò)
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
});

// --- API KHÁC (Ví dụ lấy danh sách bác sĩ) ---
app.get('/api/doctors', (req, res) => {
    const doctors = USERS.filter(u => u.role === 'doctor');
    res.json(doctors);
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});