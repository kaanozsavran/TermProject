function fetchNotes() {
    const university = document.getElementById('university').value;
    const faculty = document.getElementById('faculty').value;
    const department = document.getElementById('department').value;
    const course = document.getElementById('course').value;

    if (!university || !faculty || !department || !course) {
        alert("Lütfen tüm alanları seçin!");
        return;
    }

    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = `<div class='col'><div class='card p-3'>${course} dersi için notlar yükleniyor...</div></div>`;

    // Burada gerçek verileri API'den çekip listelemek için fetch() kullanılabilir
}
