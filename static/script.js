document.getElementById("uploadBtn").addEventListener("click", () => {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];

    if (!file) {
        alert("💖 Please select a file 💖");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    let loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    fetch("/upload", {
        method: "POST",
        body: formData,
    })
        .then(response => response.text())
        .then(cleanedPath => {
            loader.classList.add("hidden");

            const audioPlayer = document.getElementById("audioPlayer");
            const downloadBtn = document.getElementById("downloadBtn");

            audioPlayer.src = cleanedPath;
            audioPlayer.classList.remove("hidden");

            downloadBtn.href = cleanedPath;
            downloadBtn.classList.remove("hidden");
        })
        .catch(error => {
            loader.classList.add("hidden");
            alert("Error uploading file.");
        });
});
