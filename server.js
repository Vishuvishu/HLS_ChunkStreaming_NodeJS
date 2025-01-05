const express = require('express');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const app = express();
const PORT = 3000;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//frontend call : 'http://localhost:3000/bad'
app.get('/bad-stream', (req, res) => {
    const filePath = path.join(__dirname, '/songs/songs.mp3');
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="songs.mp3"');
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).send('MP3 file not found');
    }
});

//sending file in chunks and combine while use
//frontend call : 'http://localhost:3000/good-stream/hls/playlist.m3u8'
app.get('/good-stream/hls/:file', (req, res) => {
    const filePath = path.join(__dirname, 'hls', req.params.file);
    if (fs.existsSync(filePath)) {
        const ext = path.extname(req.params.file);
        if (ext === '.m3u8') {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        } else if (ext === '.ts') {
            res.setHeader('Content-Type', 'video/mp2t');
        }
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Generate HLS files for audio (Bad Stream - Good Practice)
const generateHLS = (inputFile, outputFolder) => {
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    const command = `ffmpeg -i ${inputFile} -vn -acodec copy -hls_time 9 -hls_list_size 0 -f hls ${outputFolder}/playlist.m3u8`;

    child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error generating HLS: ${error.message}`);
            return;
        }
        console.log('HLS files generated successfully');
    });
};

//calling generateHLS if HLS don't exist
const inputFile = path.join(__dirname, '/songs/songs.mp3');
const outputFolder = path.join(__dirname, 'hls');
if (!fs.existsSync(path.join(outputFolder, 'playlist.m3u8'))) {
    console.log('Generating HLS files...');
    generateHLS(inputFile, outputFolder);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
