import os
os.environ["NUMBA_DISABLE_JIT"] = "1"   

from flask import Flask, render_template, request, send_from_directory
import soundfile as sf
import noisereduce as nr
from pydub import AudioSegment
from pydub.utils import which

AudioSegment.converter = which("ffmpeg")  

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if not file or file.filename == "":
        return "No file selected", 400

    filename = file.filename
    upload_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(upload_path)

    try:
        y, sr = sf.read(upload_path)

        reduced_noise = nr.reduce_noise(y=y, sr=sr)

        temp_wav = os.path.join(PROCESSED_FOLDER, "temp_cleaned.wav")
        sf.write(temp_wav, reduced_noise, sr)

        cleaned_mp3 = os.path.join(
            PROCESSED_FOLDER,
            f"cleaned_{os.path.splitext(filename)[0]}.mp3"
        )

        AudioSegment.from_wav(temp_wav).export(cleaned_mp3, format="mp3")
        os.remove(temp_wav)

        return f"/processed/{os.path.basename(cleaned_mp3)}"

    except Exception as e:
        return f"Error: {str(e)}", 500

@app.route('/processed/<filename>')
def processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

