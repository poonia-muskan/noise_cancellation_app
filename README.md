# ClariFi – Background Noise Cancellation Web App

### Overview
**ClariFi** is a Flask-based web application that removes background noise from audio and video files. It uses Python’s `noisereduce` library to enhance sound quality and offers users a simple, clean interface for uploading and downloading processed files.

### Features
- Upload audio or video files
- Removes background noise automatically
- Download cleaned version
- Deployed on Render

### Tech Stack
- **Backend**: Python, Flask
- **Noise Reduction**: `noisereduce` library
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Render

### Screenshots
![image](https://github.com/user-attachments/assets/855cb795-6ccc-4cb1-b4de-80d0f98938c5)


### Live Demo
[ClariFi on Render](https://noise-cancellation-app.onrender.com)

### Run Locally
```bash
git clone https://github.com/poonia-muskan/noise_cancellation_app.git
cd noise_cancellation_app
pip install -r requirements.txt
python app.py
