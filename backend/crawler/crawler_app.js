// database-server.js
const express = require('express');
const mongoose = require('mongoose');
// const { exec } = require('child_process');
const cron = require('node-cron');
const PythonShell = require('python-shell');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

const pythonScriptPath = 'crawler.py';

// Define a cron job to run every day at a specific time (in this case, at midnight)
cron.schedule('00 20 * * *', async () => {
    console.log("Start crawling...")

    // Basic execution:
    PythonShell.run(pythonScriptPath, (err, results) => {
        if (err) throw err;
        console.log('Complete running file');
    });

    console.log("End crawling...")

}, { scheduled: true, timezone: 'Asia/Ho_Chi_Minh' });

app.listen(PORT, () => {
    console.log(`Database server is running on http://localhost:${PORT}`);
});
