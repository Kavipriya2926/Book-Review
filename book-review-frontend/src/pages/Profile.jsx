import { useEffect, useState } from "react";
import api from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me").then(res => setUser(res.data));
  }, []);

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
