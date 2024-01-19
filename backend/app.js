const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conferenceRoutes = require('./routes/conferenceRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Sử dụng router
app.use(conferenceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên port ${PORT}`));

