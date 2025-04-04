from flask import Flask, render_template, request, send_from_directory
import os
import librosa
import noisereduce as nr
import soundfile as sf
from pydub import AudioSegment

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

# Ensure folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file uploaded", 400
    file = request.files['file']
    if file.filename == '':
        return "No file selected", 400

    filename = file.filename
    upload_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(upload_path)

    try:
        y, sr = librosa.load(upload_path, sr=None)
        reduced_noise = nr.reduce_noise(y=y, sr=sr)
        temp_wav = os.path.join(PROCESSED_FOLDER, "temp_cleaned.wav")
        sf.write(temp_wav, reduced_noise, sr)

        cleaned_mp3 = os.path.join(PROCESSED_FOLDER, "cleaned_" + os.path.splitext(filename)[0] + ".mp3")
        AudioSegment.from_wav(temp_wav).export(cleaned_mp3, format="mp3")
        os.remove(temp_wav)

        return f"/processed/{os.path.basename(cleaned_mp3)}"
    except Exception as e:
        return f"Error processing file: {str(e)}", 500

@app.route('/processed/<filename>')
def processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename, as_attachment=False)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000)

