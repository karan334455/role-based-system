require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db');
const path = require("path");

const mainRoutes = require('./routes/index')
// Connect to database
connectDB();

const PORT = process.env.PORT || 6001;

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());


app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use('/api', mainRoutes);




app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
