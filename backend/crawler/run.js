const { exec } = require('child_process');

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