import React, { useState } from "react";
import "./Auth.css";

// 1. Phải nhận prop { onLogin } ở đây để sửa lỗi 'onLogin is not defined'
function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  // 2. Phải giữ lại state này để sửa lỗi 'loginData is not defined'
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  // --- HÀM XỬ LÝ ĐĂNG NHẬP (GỌI API) ---
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Gọi xuống Backend chạy ở cổng 5000
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        // Đăng nhập thành công -> gọi hàm onLogin cha truyền xuống
        onLogin(data.user);
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối tới Server (Backend). Bạn đã chạy 'node server.js' chưa?");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirm) {
      alert("Mật khẩu không khớp!");
      return;
    }
    alert("Chức năng đăng ký tạm thời chưa mở (Demo)!");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Đăng Nhập
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Đăng Ký
          </button>
        </div>

        {isLogin && (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Đăng nhập</h2>

            <input
              type="text"
              placeholder="Tài khoản (vd: admin, bs_hung)"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <button type="submit" className="auth-btn">
              Đăng nhập
            </button>
          </form>
        )}

        {!isLogin && (
          <form className="auth-form" onSubmit={handleSignup}>
            <h2>Tạo tài khoản</h2>

            <input
              type="text"
              placeholder="Tên tài khoản"
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={signupData.confirm}
              onChange={(e) =>
                setSignupData({ ...signupData, confirm: e.target.value })
              }
              required
            />

            <button type="submit" className="auth-btn">
              Đăng ký
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;