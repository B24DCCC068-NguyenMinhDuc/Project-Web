import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import mới
import './index.css';
import App from './App';

// Thay CLIENT_ID bằng mã bạn vừa copy từ Google
const CLIENT_ID = "688729727288-jdi3fk944a0e84v9rr1ko2r8ahjapisb.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);