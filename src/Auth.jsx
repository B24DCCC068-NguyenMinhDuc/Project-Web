import React, { useState } from "react";
import "./Auth.css";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginData.username === "admin" && loginData.password === "123") {
      onLogin();
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirm) {
      alert("Mật khẩu không khớp!");
      return;
    }

    alert("Tạo tài khoản thành công!");
    setIsLogin(true);
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
              placeholder="Tài khoản"
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
