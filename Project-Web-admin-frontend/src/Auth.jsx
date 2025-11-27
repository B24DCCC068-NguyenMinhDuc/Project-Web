// src/Auth.jsx
import { useState } from "react";
import api from "./api";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [error, setError] = useState("");

  const handleChange = (e, target = "login") => {
    const { name, value } = e.target;
    setError("");
    if (target === "login") {
      setLoginData((s) => ({ ...s, [name]: value }));
    } else {
      setSignupData((s) => ({ ...s, [name]: value }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", loginData);
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        if (onLogin) onLogin(res.data);
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/signup", signupData);
      setIsLogin(true);
    } catch (err) {
      setError("Không thể tạo tài khoản");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, border: "1px solid #ddd", borderRadius: 6 }}>
      <div style={{ display: "flex", marginBottom: 12 }}>
        <button
          onClick={() => { setIsLogin(true); setError(""); }}
          style={{ flex: 1, padding: 8, background: isLogin ? "#1976d2" : "#eee", color: isLogin ? "#fff" : "#000", border: "none" }}
        >
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(""); }}
          style={{ flex: 1, padding: 8, background: !isLogin ? "#1976d2" : "#eee", color: !isLogin ? "#fff" : "#000", border: "none" }}
        >
          Sign up
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Email</label>
            <input name="email" value={loginData.email} onChange={(e) => handleChange(e, "login")} required style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Password</label>
            <input type="password" name="password" value={loginData.password} onChange={(e) => handleChange(e, "login")} required style={{ width: "100%", padding: 8 }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none" }}>Login</button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Name</label>
            <input name="name" value={signupData.name} onChange={(e) => handleChange(e, "signup")} required style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Email</label>
            <input name="email" value={signupData.email} onChange={(e) => handleChange(e, "signup")} required style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Password</label>
            <input type="password" name="password" value={signupData.password} onChange={(e) => handleChange(e, "signup")} required style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Role</label>
            <select name="role" value={signupData.role} onChange={(e) => handleChange(e, "signup")} style={{ width: "100%", padding: 8 }}>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <button type="submit" style={{ width: "100%", padding: 10, background: "#1976d2", color: "#fff", border: "none" }}>Create account</button>
        </form>
      )}
    </div>
  );
}

export default Auth;