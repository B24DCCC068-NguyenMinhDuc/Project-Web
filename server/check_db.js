const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Minhduc16',      
    database: 'hospital_db'
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        process.exit(1);
    }
    console.log('✅ Đã kết nối MySQL thành công!\n');

    // Kiểm tra schema bảng appointments
    console.log('--- SCHEMA BẢNG APPOINTMENTS ---');
    db.query('DESCRIBE appointments', (err, results) => {
        if (err) {
            console.error('Lỗi:', err);
        } else {
            console.table(results);
        }

        // Kiểm tra schema bảng patients
        console.log('\n--- SCHEMA BẢNG PATIENTS ---');
        db.query('DESCRIBE patients', (err, results) => {
            if (err) {
                console.error('Lỗi:', err);
            } else {
                console.table(results);
            }

            // Kiểm tra dữ liệu appointments
            console.log('\n--- DỮ LIỆU APPOINTMENTS (5 DÒNG ĐẦU) ---');
            db.query('SELECT * FROM appointments LIMIT 5', (err, results) => {
                if (err) {
                    console.error('Lỗi:', err);
                } else {
                    console.table(results);
                }

                // Kiểm tra dữ liệu patients
                console.log('\n--- DỮ LIỆU PATIENTS (5 DÒNG ĐẦU) ---');
                db.query('SELECT * FROM patients LIMIT 5', (err, results) => {
                    if (err) {
                        console.error('Lỗi:', err);
                    } else {
                        console.table(results);
                    }

                    db.end();
                    process.exit(0);
                });
            });
        });
    });
});
