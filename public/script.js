const fileCoverInput = document.getElementById('fileCover');
const fileBookInput = document.getElementById('fileBook');
const fileBookLink = document.getElementById('fileBookLink');
const imgPreview = document.getElementById('file-cover-preview');
const fileCoverPreview = document.getElementById('fileCoverPreview');

if (fileCoverInput) {
    fileCoverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.addEventListener('load', (e) => {
            const img = document.createElement('img');
            img.classList.add('image-preview');
            img.src = reader.result;

            imgPreview.replaceChildren(img);
        });
    });
}

if (fileBookInput) {
    fileBookInput.addEventListener('change', (e) => {
        const parent = fileBookLink.parentElement;
        parent.removeChild(fileBookLink);
    });
}
