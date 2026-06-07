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

<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/6ae45132-eb8c-48cd-b2f1-6f148e86371b" />
<img width="1891" height="904" alt="image" src="https://github.com/user-attachments/assets/332f409e-8237-42f2-8163-3381d9c66554" />
<img width="1896" height="910" alt="image" src="https://github.com/user-attachments/assets/fe2c6fdc-df38-489a-9817-f1aeb0b8cbec" />
<img width="1894" height="907" alt="image" src="https://github.com/user-attachments/assets/3462ab34-e52f-4b02-bcb0-637481be3fd4" />

---

## Key Highlights

- Supports both audio and video inputs.
- Automatically extracts audio from videos.
- Reduces background noise while preserving speech and important audio.
- Merges cleaned audio back into video files.
- Clean and responsive user experience.
- Built using Python, Flask, FFmpeg, and NoiseReduce.
