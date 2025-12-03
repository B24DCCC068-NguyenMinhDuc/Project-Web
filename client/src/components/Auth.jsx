import React, { useState } from "react";
import { registerAPI, googleLoginAPI } from "../api/api";
import { GoogleLogin } from '@react-oauth/google'; // Component nút Google
import { jwtDecode } from "jwt-decode"; // Hàm giải mã thông tin
import "./Auth.css";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

function Auth({ onLoginSubmit }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
      username: "", password: "", fullName: "", phone: "" 
  });

  // Xử lý đăng nhập thường
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
        onLoginSubmit({ username: formData.username, password: formData.password });
    } else {
        try {
            const res = await registerAPI(formData);
            if (res.data.success) {
                alert("Đăng ký thành công!");
                setIsLogin(true);
            } else {
                alert(res.data.message);
            }
        } catch (err) { alert("Lỗi kết nối"); }
    }
  };

  // Xử lý đăng nhập Google thành công
  const handleGoogleSuccess = async (credentialResponse) => {
      try {
          // 1. Giải mã token để lấy thông tin (email, tên, ảnh...)
          const decoded = jwtDecode(credentialResponse.credential);
          console.log("Google Info:", decoded);

          // 2. Gửi về Server để kiểm tra/tạo tài khoản
          const res = await googleLoginAPI({
              email: decoded.email,
              name: decoded.name,
              googleId: decoded.sub
          });

          // 3. Đăng nhập thành công như bình thường
          if (res.data.success) {
              // Gọi hàm onLoginSubmit nhưng truyền user object trực tiếp (cần sửa nhẹ logic ở App.jsx nếu chưa hỗ trợ)
              // Hoặc reload trang để App tự nhận localStorage
              localStorage.setItem("user", JSON.stringify(res.data.user));
              window.location.href = "/"; // Reload về trang chủ
          }
      } catch (error) {
          console.error("Lỗi Google Login", error);
          alert("Không thể đăng nhập bằng Google.");
      }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
            <h2>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
            <p>Chào mừng đến với Bệnh viện Đa khoa A</p>
        </div>

        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <>
                    <div className="input-group">
                        <input type="text" placeholder="Họ và tên" required 
                            value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Số điện thoại" required 
                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                </>
            )}
            <div className="input-group">
                <input type="text" placeholder="Tên đăng nhập" required 
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="input-group">
                <input type="password" placeholder="Mật khẩu" required 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            <button type="submit" className="auth-btn primary">
                {isLogin ? <><FaSignInAlt/> Đăng Nhập</> : <><FaUserPlus/> Đăng Ký</>}
            </button>
        </form>

        <div className="divider"><span>Hoặc</span></div>

        {/* Nút Google Chính Hãng */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
                width="320" // Độ rộng nút
            />
        </div>

        <p className="switch-mode">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? " Đăng ký ngay" : " Đăng nhập ngay"}
            </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;