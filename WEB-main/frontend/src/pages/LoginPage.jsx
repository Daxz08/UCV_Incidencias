import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>UCV Backend - Auth Frontend</h1>
      <LoginForm />
      <p style={{ marginTop: 10 }}>
        ¿No tienes cuenta? <a href="/register">Registrarse</a>
      </p>
    </div>
  );
};

export default LoginPage;