# Project 2: ClariFi – Background Noise Cancellation Web App

## Overview
**ClariFi** is a Flask-based web application that removes background noise from audio and video files. It uses Python’s `noisereduce` library to enhance sound quality and offers users a simple, clean interface for uploading and downloading processed files.

## Features
- Upload audio or video files
- Removes background noise automatically
- Download cleaned version
- Deployed on [Railway](https://web-production-6aaa7.up.railway.app)

## Tech Stack
- **Backend**: Python, Flask
- **Noise Reduction**: `noisereduce` library
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Railway

## Screenshots
![image](https://github.com/user-attachments/assets/855cb795-6ccc-4cb1-b4de-80d0f98938c5)


## Live Demo
[ClariFi on Railway](https://web-production-6aaa7.up.railway.app)

## How to Run Locally
```bash
git clone https://github.com/poonia-muskan/clarifi.git
cd clarifi
pip install -r requirements.txt
python app.py
