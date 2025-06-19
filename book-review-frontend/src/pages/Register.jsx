import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/users/register", form);
    login(res.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
