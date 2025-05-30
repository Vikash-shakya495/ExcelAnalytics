const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // only allow this frontend origin
  credentials: true               // allow cookies and credentials
}));
connectDB();

app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", adminRoutes);
app.use("/api", aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
