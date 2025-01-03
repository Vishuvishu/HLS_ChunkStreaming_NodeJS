const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const filePath = './songs/songs.mp3';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle HEAD requests for both streams
app.head(['/bad-stream', '/good-stream'], (req, res) => {
    const stat = fs.statSync(filePath);
    res.set({
        'Content-Length': stat.size,
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes'
    });
    res.end();
});

// Bad stream - sends entire file
app.get('/bad-stream', (req, res) => {
    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range) {
        // Even for bad stream, we'll honor range requests for the demo
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunkSize = (end - start) + 1;

        const head = {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        };

        res.writeHead(206, head);
        fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
        res.sendFile(filePath, { root: __dirname });
    }
});

// Good stream - enforces chunked delivery
app.get('/good-stream', (req, res) => {
    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 1024 * 1024 - 1, stat.size - 1);
        const chunkSize = (end - start) + 1;

        const head = {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        };

        res.writeHead(206, head);
        fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
        // For initial request, redirect to first chunk
        res.redirect(307, req.path);
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});