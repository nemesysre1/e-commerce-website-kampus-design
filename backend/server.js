const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const USERS_FILE = "./users.json";

// Helper: load users
function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Helper: save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// =========================
// REGISTER
// =========================
app.post("/api/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const users = loadUsers();

  // Cek email sudah terdaftar
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email sudah digunakan" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role, // buyer atau seller
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ message: "Registrasi berhasil", user: newUser });
});

// =========================
// LOGIN
// =========================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const users = loadUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  // Token dummy untuk frontend
  const token = "token-" + user.id;

  res.json({
    id: user.id,
    name: user.name,
    role: user.role,
    token,
  });
});

// =========================
// SERVER START
// =========================
app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
