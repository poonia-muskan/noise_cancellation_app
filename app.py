import os
import uuid
import logging
import threading
import subprocess

os.environ["NUMBA_DISABLE_JIT"] = "1"

from flask import Flask, render_template, request, send_from_directory, flash, redirect, url_for
import soundfile as sf
import noisereduce as nr
from pydub import AudioSegment
from pydub.utils import which
from werkzeug.utils import secure_filename

AudioSegment.converter = which("ffmpeg")

UPLOAD_FOLDER    = "uploads"
PROCESSED_FOLDER = "processed"
MAX_FILE_MB      = 100          
MAX_CONTENT_MB   = MAX_FILE_MB + 1

ALLOWED_AUDIO = {"mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"}
ALLOWED_VIDEO = {"mp4", "avi", "mov", "mkv", "webm", "flv"}
ALLOWED_EXTENSIONS = ALLOWED_AUDIO | ALLOWED_VIDEO

os.makedirs(UPLOAD_FOLDER,    exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "clarifi-dev-secret-change-in-prod")
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_MB * 1024 * 1024


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def is_video(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_VIDEO


def safe_remove(*paths):
    """Delete files without raising if they don't exist."""
    for p in paths:
        try:
            if p and os.path.exists(p):
                os.remove(p)
        except OSError as e:
            logger.warning("Could not remove %s: %s", p, e)


def schedule_cleanup(delay_seconds: int, *paths):
    """Delete files after a delay so the download link still works briefly."""
    def _delete():
        safe_remove(*paths)
        logger.info("Cleaned up: %s", paths)

    t = threading.Timer(delay_seconds, _delete)
    t.daemon = True
    t.start()

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload_file():
    upload_path  = None
    temp_wav     = None
    output_path  = None

    file = request.files.get("file")
    if not file or file.filename == "":
        flash("No file selected. Please choose a file before uploading.", "error")
        return redirect(url_for("index"))

    if not allowed_file(file.filename):
        flash(
            f"Unsupported format. Accepted types: {', '.join(sorted(ALLOWED_EXTENSIONS)).upper()}",
            "error",
        )
        return redirect(url_for("index"))

    safe_original_name = secure_filename(file.filename)
    original_ext = safe_original_name.rsplit(".", 1)[1].lower()
    unique_id    = uuid.uuid4().hex[:10]
    safe_name    = f"upload_{unique_id}.{original_ext}"
    upload_path  = os.path.join(UPLOAD_FOLDER, safe_name)
    file.save(upload_path)

    file_mb = os.path.getsize(upload_path) / (1024 * 1024)
    if file_mb > MAX_FILE_MB:
        safe_remove(upload_path)
        flash(f"File too large ({file_mb:.1f} MB). Maximum size is {MAX_FILE_MB} MB.", "error")
        return redirect(url_for("index"))

    logger.info("Uploaded: %s (%.2f MB)", safe_name, file_mb)

    try:
        if is_video(safe_name):
            temp_wav = os.path.join(PROCESSED_FOLDER, f"extracted_{unique_id}.wav")
            video    = AudioSegment.from_file(upload_path)
            video.export(temp_wav, format="wav")
            source_wav = temp_wav
        else:
            source_wav = upload_path

        audio_data, sample_rate = sf.read(source_wav)
        print("Shape:", audio_data.shape)
        print("Dtype:", audio_data.dtype)
        print("Sample Rate:", sample_rate)

        if len(audio_data.shape) > 1:
            audio_data = audio_data.mean(axis=1)

        reduced = nr.reduce_noise(y=audio_data, sr=sample_rate, stationary=True)

        cleaned_wav = os.path.join(
            PROCESSED_FOLDER,
            f"cleaned_{unique_id}.wav"
        )

        sf.write(cleaned_wav, reduced, sample_rate)

        if is_video(safe_name):

            cleaned_mp3 = os.path.join(
                PROCESSED_FOLDER,
                f"cleaned_audio_{unique_id}.mp3"
            )

            AudioSegment.from_wav(cleaned_wav).export(
                cleaned_mp3,
                format="mp3"
            )

            output_filename = f"clarifi_cleaned_{unique_id}.mp4"

            output_path = os.path.join(
                PROCESSED_FOLDER,
                output_filename
            )

            ffmpeg_path = AudioSegment.converter

            subprocess.run(
                [
                    ffmpeg_path,
                    "-i", upload_path,
                    "-i", cleaned_mp3,
                    "-c:v", "copy",
                    "-map", "0:v:0",
                    "-map", "1:a:0",
                    "-shortest",
                    "-y",
                    output_path,
                ],
                check=True,
            )

            safe_remove(cleaned_mp3)

        else:

            output_filename = f"clarifi_cleaned_{unique_id}.mp3"

            output_path = os.path.join(
                PROCESSED_FOLDER,
                output_filename
            )

            AudioSegment.from_wav(cleaned_wav).export(
                output_path,
                format="mp3"
            )

        safe_remove(cleaned_wav)

        schedule_cleanup(600, output_path)
        if temp_wav:
            schedule_cleanup(600, temp_wav)

        return render_template("index.html", download_filename=output_filename, scroll_to_result=True)

    except sf.LibsndfileError as e:
        logger.error("soundfile error: %s", e)
        flash("Could not read the audio. The file may be corrupted or use an unsupported codec.", "error")
    except Exception as e:
        logger.exception("Unexpected error during processing: %s", e)
        flash(f"Something went wrong during processing: {e}", "error")
    finally:
        safe_remove(upload_path)
        if temp_wav:
            safe_remove(temp_wav)

    return redirect(url_for("index"))


@app.route("/processed/<filename>")
def processed_file(filename):
    """Serve a processed file for download."""
    if ".." in filename or "/" in filename:
        return "Invalid filename", 400

    file_path = os.path.join(PROCESSED_FOLDER, filename)
    if not os.path.exists(file_path):
        flash("Download link has expired. Please process your file again.", "error")
        return redirect(url_for("index"))

    return send_from_directory(
        PROCESSED_FOLDER,
        filename,
        as_attachment=True,
        download_name=filename,
    )
@app.route("/preview/<filename>")
def preview_file(filename):

    if ".." in filename or "/" in filename:
        return "Invalid filename", 400

    return send_from_directory(
        PROCESSED_FOLDER,
        filename,
        as_attachment=False
    )

@app.errorhandler(413)
def file_too_large(_):
    flash(f"File exceeds the {MAX_FILE_MB} MB limit. Please upload a smaller file.", "error")
    return redirect(url_for("index"))

@app.errorhandler(404)
def not_found(_):
    return render_template("index.html"), 404

if __name__ == "__main__":
    port  = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
