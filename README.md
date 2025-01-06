# **HLS_ChunkStreaming_NodeJS**

## **HLS Chunk Streaming Example**

This repository shows the difference between two streaming approaches: sending an entire file in response vs. streaming content in chunks using HLS (good practice).
Ofcourse based on your use case good and bad approch is different but when it comes to streaming good aproch would be streaming chunks.
It is Node.js backend and a sample HTML frontend just to show both approaches.

---

## **Features**
1. **Bad Streaming (Entire File)**:  
   Sends MP3 file as a single file.
   - Uses more bandwidth.
   - Allows easy downloading of the entire file, leading to reduced security and potential revenue loss.
   
2. **Good Streaming (HLS)**:  
   Streams audio in smaller chunks using the HLS (HTTP Live Streaming) protocol
   - Optimizes bandwidth usage.
   - Provides better security by splitting content into encrypted chunks.
   - Prevents users from easily downloading the entire file.

3. **Dynamic HLS File Generation:**
   Converts MP3 files into HLS format using FFmpeg.
---

## **Technologies and libraries Used**
- **Node.js**: Backend server.
- **FFmpeg**: Used to convert an MP3 file into HLS chunks.
- **HTML & JavaScript**: Simple frontend for interacting with the backend.
- **HLS.js**: JavaScript library for playing HLS content in browsers if not native HLS support.

---

## **Installation and Setup**

### **Prerequisites**
- Node.js installed on your machine.
- FFmpeg installed and added to your system path.

### **Steps**
1. Clone this repository:
   ```bash
   git clone https://github.com/VishuVishu/HLS_ChunkStreaming_NodeJS.git
   cd HLS_ChunkStreaming_NodeJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your sample MP3 file to songs folder `songs.mp3`.

4. Start server:
   ```bash
   node app.js
   ```

5. Access webapp onL
   ```
   http://localhost:3000
   ```

---

## **Usage**

### **Good Stream**
   - Open Network tab in inspect mode.
   - Call good stream - you can see .m3u8 files and multiple .ts files.
   - This files are combined and will be played as one file.

2. **Bad Stream (Single File)**:
   - Open Network tab in inspect mode.
   - You can see .mp3 file.
   - This file can be downloaded by anyone if wanted

### **Endpoints**
- `/`: Serves the HTML frontend.
- `/bad-stream`: Streams the entire MP3 file as a single download.
- `/good-stream/hls/:file`: Streams HLS chunks or the master playlist.


## **References**

- Related Blog:
   - [Don't Make This Common Streaming App Mistake](https://medium.com/@FingerPrintBlogs/dont-make-mistake-like-this-streaming-app-d14b246c79b2)
