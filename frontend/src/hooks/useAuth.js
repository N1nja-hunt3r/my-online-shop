import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const register = (name, email, phone, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) return false;
    users.push({ name, email, phone, password });
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return { user, register, login, logout };
};

export default useAuth;
