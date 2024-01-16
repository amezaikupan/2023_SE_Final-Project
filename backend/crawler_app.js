// database-server.js
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;
const { exec } = require('child_process');

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a cron job to run every day at a specific time (in this case, at midnight)
cron.schedule('5 19 * * *', async () => {
    const python_file = 'crawler.py';
    const childProcess = exec(`python ${python_file}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
    });

    childProcess.on('exit', (code) => {
        console.log(`Python script exited with code ${code}`);
    });

}, { scheduled: true, timezone: 'Asia/Ho_Chi_Minh' });

app.listen(PORT, () => {
  console.log(`Database server is running on http://localhost:${PORT}`);
});
