const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { join } = require("path");
const { Low, JSONFile } = require("lowdb");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(join(__dirname, "uploads")));

// LowDB setup (single JSON file)
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data ||= {
    admins: [
      // default admin (password: password123) — change after first login
      { id: "admin-1", username: "admin", passwordHash: await bcrypt.hash("password123", 10) }
    ],
    products: [],
    orders: [],
    settings: {
      payment: {
        type: "manual", // manual | qr | link
        danaNumber: "",
        ovoNumber: "",
        qrImageUrl: "" // uploaded payment QR image url (relative /uploads/...)
      }
    }
  };
  await db.write();
}
initDb();

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  }
});
const upload = multer({ storage });

// Middleware: auth
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* --- AUTH --- */
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const admin = db.data.admins.find(a => a.username === username);
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, admin: { id: admin.id, username: admin.username } });
});

/* --- Admin profile / change password --- */
app.post("/api/admin/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await db.read();
  const admin = db.data.admins.find(a => a.id === req.admin.id);
  if (!admin) return res.status(404).json({ error: "Not found" });
  const ok = await bcrypt.compare(oldPassword, admin.passwordHash);
  if (!ok) return res.status(400).json({ error: "Old password is wrong" });
  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await db.write();
  res.json({ ok: true });
});

/* --- PRODUCTS CRUD --- */
app.get("/api/products", async (req, res) => {
  await db.read();
  res.json(db.data.products || []);
});

app.get("/api/products/:id", async (req, res) => {
  await db.read();
  const p = db.data.products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

app.post("/api/products", authMiddleware, upload.single("image"), async (req, res) => {
  await db.read();
  const { name, price, originalPrice, category, seller, location, description, isNew } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || "";
  const product = {
    id: uuidv4(),
    name,
    price: Number(price) || 0,
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category: category || "Umum",
    seller: seller || "Penjual",
    location: location || "",
    description: description || "",
    isNew: isNew === "true" || isNew === true,
    image: imageUrl,
    rating: 0,
    reviewCount: 0,
    createdAt: Date.now()
  };
  db.data.products.push(product);
  await db.write();
  res.json(product);
});

app.put("/api/products/:id", authMiddleware, upload.single("image"), async (req, res) => {
  await db.read();
  const p = db.data.products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  const { name, price, originalPrice, category, seller, location, description, isNew } = req.body;
  p.name = name ?? p.name;
  p.price = price !== undefined ? Number(price) : p.price;
  p.originalPrice = originalPrice !== undefined ? Number(originalPrice) : p.originalPrice;
  p.category = category ?? p.category;
  p.seller = seller ?? p.seller;
  p.location = location ?? p.location;
  p.description = description ?? p.description;
  p.isNew = isNew === "true" || isNew === true ? true : false;
  if (req.file) p.image = `/uploads/${req.file.filename}`;
  await db.write();
  res.json(p);
});

app.delete("/api/products/:id", authMiddleware, async (req, res) => {
  await db.read();
  db.data.products = db.data.products.filter(x => x.id !== req.params.id);
  await db.write();
  res.json({ ok: true });
});

/* --- ORDERS --- */
app.get("/api/orders", authMiddleware, async (req, res) => {
  await db.read();
  res.json(db.data.orders || []);
});

app.get("/api/orders/:id", authMiddleware, async (req, res) => {
  await db.read();
  const order = db.data.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

app.post("/api/orders", async (req, res) => {
  // Endpoint used by frontend checkout to create order
  await db.read();
  const { cart, customerName, phone, address, paymentMethod } = req.body;
  const total = (cart || []).reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const order = {
    id: uuidv4(),
    cart,
    customerName,
    phone,
    address,
    paymentMethod,
    total,
    status: "pending",
    createdAt: Date.now()
  };
  db.data.orders.push(order);
  await db.write();
  res.json(order);
});

app.put("/api/orders/:id/status", authMiddleware, async (req, res) => {
  await db.read();
  const order = db.data.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  order.status = req.body.status || order.status;
  await db.write();
  res.json(order);
});

/* --- SETTINGS: Payment config --- */
app.get("/api/settings", authMiddleware, async (req, res) => {
  await db.read();
  res.json(db.data.settings);
});

app.put("/api/settings/payment", authMiddleware, upload.single("qrImage"), async (req, res) => {
  await db.read();
  const { danaNumber, ovoNumber, type } = req.body;
  if (!db.data.settings) db.data.settings = {};
  db.data.settings.payment ||= {};
  db.data.settings.payment.danaNumber = danaNumber ?? db.data.settings.payment.danaNumber;
  db.data.settings.payment.ovoNumber = ovoNumber ?? db.data.settings.payment.ovoNumber;
  db.data.settings.payment.type = type ?? db.data.settings.payment.type;
  if (req.file) db.data.settings.payment.qrImageUrl = `/uploads/${req.file.filename}`;
  await db.write();
  res.json(db.data.settings.payment);
});

/* --- Admin create (for dev) --- */
app.post("/api/admin/create", authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  if (db.data.admins.find(a => a.username === username)) return res.status(400).json({ error: "exists" });
  const hash = await bcrypt.hash(password, 10);
  const admin = { id: uuidv4(), username, passwordHash: hash };
  db.data.admins.push(admin);
  await db.write();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
