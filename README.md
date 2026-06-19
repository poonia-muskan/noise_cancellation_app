# ClariFi - Background Noise Cancellation 

A Flask-based web application that removes unwanted background noise from audio and video files. Upload a file, process it using advanced audio denoising techniques, and download a cleaner version in seconds.

---

## Features

- Noise reduction for audio files
- Video support with audio cleanup
- Drag-and-drop uploads
- Fast processing
- Automatic file cleanup
- Responsive user interface
- Audio preview support
- Supports 13+ audio and video formats
- No installation required for end users

---

## Supported Formats

### Audio
- MP3
- WAV
- OGG
- FLAC
- AAC
- M4A
- WMA

### Video
- MP4
- AVI
- MOV
- MKV
- WEBM
- FLV

---

## Tech Stack

### Backend
- Python
- Flask
- SoundFile
- NoiseReduce
- Pydub
- FFmpeg

### Frontend
- HTML5
- CSS3
- JavaScript

### Libraries
- NumPy
- SciPy
- Werkzeug

---

## How It Works

### Audio Processing Flow

Audio File
↓
Read Audio
↓
Noise Reduction
↓
Generate Clean MP3
↓
Download

### Video Processing Flow

Video File
↓
Extract Audio
↓
Noise Reduction
↓
Merge Clean Audio With Original Video
↓
Download Cleaned Video

---

## Real-World Use Cases

### Podcast Editing
Remove fan noise, room hum, keyboard sounds, and background distractions from podcast recordings.

### Content Creation
Improve audio quality in YouTube videos, reels, vlogs, and social media content recorded in noisy environments.

### Meetings, Interviews & Lectures
Clean recorded interviews, online meetings, and educational lectures to improve clarity and listening experience.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/poonia-muskan/ClariFi.git
cd ClariFi
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open your browser and visit:

```text
http://127.0.0.1:5000
```

---

## Project Structure

```text
ClariFi/
│
├── app.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── main.js
│   │
│   └── images/
│
├── uploads/
├── processed/
│
└── README.md
```

---

## Privacy & Security

- Uploaded files are processed temporarily.
- Files are automatically deleted after processing.
- Unique filenames prevent collisions.
- File size limits help protect server resources.

---

## Screenshots

<img width="1904" height="910" alt="image" src="https://github.com/user-attachments/assets/90ae4e5a-b2fd-4e92-bdf9-d0e4f67be27a" />
<img width="1900" height="909" alt="image" src="https://github.com/user-attachments/assets/2164bea1-180f-46b8-9e19-daacbd9c102d" />
<img width="1896" height="905" alt="image" src="https://github.com/user-attachments/assets/e0b9bdd2-7998-425f-a717-2f78a02291e4" />
<img width="1898" height="912" alt="image" src="https://github.com/user-attachments/assets/b4ca073c-e7fd-4ee2-8467-312d67491bca" />

---

## Key Highlights

- Supports both audio and video inputs.
- Automatically extracts audio from videos.
- Reduces background noise while preserving speech and important audio.
- Merges cleaned audio back into video files.
- Clean and responsive user experience.
- Built using Python, Flask, FFmpeg, and NoiseReduce.
