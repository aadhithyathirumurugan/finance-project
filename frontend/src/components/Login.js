import React, { useState } from "react";
import { login } from "../services/api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const res = await login({ email });
    setToken(res.data);
  };

  return (
    <div className="login">
      <h2>Finance System Login</h2>
      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;