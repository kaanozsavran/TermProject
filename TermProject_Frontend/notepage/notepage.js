// API endpoint'leri swagger'dan çekilen
const apiUrlUniversity = 'https://localhost:7149/api/University';
const apiUrlFaculty = 'https://localhost:7149/api/Faculty';
const apiUrlDepartment = facultyId => `https://localhost:7149/api/Department/faculty/${facultyId}`;
const apiUrlCourse = departmentId => `https://localhost:7149/api/Course/department/${departmentId}`;
const apiUrlNotes = courseId => `https://localhost:7149/api/Note/course-notes/${courseId}`;

let facultyMap = {}; // Fakülte ID -> Fakülte İsmi eşleştirmesi için
let departmentMap = {}; // Departman ID -> Departman İsmi eşleştirmesi için

// Üniversiteleri Fetch Et
function fetchUniversities() {
    fetch(apiUrlUniversity)
        .then(response => {
            if (!response.ok) {
                throw new Error('Üniversite verileri alınamadı.');
            }
            return response.json();
        })
        .then(universities => {
            const universitySelect = document.getElementById('university');
            universities.forEach(university => {
                const option = document.createElement('option');
                option.value = university.universityId; // Üniversite ID'sini kullan
                option.textContent = university.universityName; // Üniversite adını göster
                universitySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Üniversiteler alınırken hata oluştu:', error);
        });
}

// Fakülteleri Fetch Et
function fetchFaculties() {
    fetch(apiUrlFaculty)
        .then(response => {
            if (!response.ok) {
                throw new Error('Fakülte verileri alınamadı.');
            }
            return response.json();
        })
        .then(faculties => {
            const facultySelect = document.getElementById('faculty');
            faculties.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.facultyID; // Fakülte ID'sini kullan
                option.textContent = faculty.facultyName; // Fakülte adını göster
                facultySelect.appendChild(option);
                facultyMap[faculty.facultyID] = faculty.facultyName; // Fakülte adını haritaya ekle
            });
        })
        .catch(error => {
            console.error('Fakülteler alınırken hata oluştu:', error);
        });
}

// Seçilen Fakülteye Göre Departmanları Fetch Et
function fetchDepartments(facultyId) {
    if (!facultyId) return; // Eğer fakülte seçilmediyse işlem yapma

    fetch(apiUrlDepartment(facultyId))
        .then(response => {
            if (!response.ok) {
                throw new Error('Departman verileri alınamadı.');
            }
            return response.json();
        })
        .then(departments => {
            const departmentSelect = document.getElementById('department');
            departmentSelect.innerHTML = '<option value="">Departman Seçiniz...</option>'; // Varsayılan seçenek
            departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department.departmentId; // Departman ID'sini kullan
                option.textContent = department.departmentName; // Departman adını göster
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Departmanlar alınırken hata oluştu:', error);
        });
}

// Seçilen Departmana Göre Kursları Fetch Et
function fetchCourses(departmentId) {
    if (!departmentId) return; // Eğer departman seçilmediyse işlem yapma

    fetch(apiUrlCourse(departmentId))
        .then(response => {
            if (!response.ok) {
                throw new Error('Kurs verileri alınamadı.');
            }
            return response.json();
        })
        .then(courses => {
            const courseSelect = document.getElementById('course');
            courseSelect.innerHTML = '<option value="">Ders Seçiniz...</option>'; // Varsayılan seçenek
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course.courseID; // Course ID'sini kullan
                option.textContent = course.courseName; // Course adını göster
                courseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Kurslar alınırken hata oluştu:', error);
        });
}

function fetchNotes(courseId, courseName) {
    if (!courseId) return;

    const token = localStorage.getItem('token');
    const notesContainer = document.getElementById("notesContainer");
    const noteHeader = document.getElementById("noteHeader");

    noteHeader.textContent = `${courseName} Dersine Ait Notlar`;
    notesContainer.innerHTML = `<div class='col'><div class='card p-3'>${courseId} dersi için notlar yükleniyor...</div></div>`;

    fetch(apiUrlNotes(courseId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Notları çekerken bir hata oluştu.');
            }
            return response.json();
        })
        .then(data => {
            notesContainer.innerHTML = '';

            if (!data || data.length === 0) {
                notesContainer.innerHTML = `<div class='col'><div class='card p-3 text-center' style="background:white ;color:#42999b;"><strong>Bu derse ait not bulunamadı.</strong></div></div>`;
                return;
            }

            data.forEach(note => {
                const noteId = `pdf-canvas-${note.id}`; // PDF için benzersiz ID
                const noteCard = `
            <div class='col'>
                <div class='card p-3'>
                    <h5>${note.title}</h5>
                    <p>${note.description || 'Açıklama yok.'}</p>

            <canvas id="${noteId}" style=" width: 100%; max-height: 300px;"></canvas> <!-- PDF önizleme -->
            <!-- <iframe src="https://localhost:7149${note.filePath}" style="width: 100%; height: 300px;" frameborder="0"></iframe> 
            PDF önizlemesi iframe kullanarak, eğer pdf.js ile çözemezsen bu da bir seçenek.-->

                    <a href="${note.filePath}" class="btn btn-outline-custom w-25" download>İndir</a>
                    
                    <div class="note-footer d-flex justify-content-between align-items-center">
                        <p><strong>Yükleyen:</strong> ${note.userName}</p>
                        <p class="text-muted">${new Date(note.uploadDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>`;

                notesContainer.innerHTML += noteCard;
                // PDF'yi render et
                renderPDF(note.filePath, noteId);

            });

        })
        .catch(error => {
            notesContainer.innerHTML = `<div class='col'><div class='card p-3'>${error.message}</div></div>`;
            console.error('Hata:', error);
        });
}
// PDF.js kütüphanesinin gerekli özelliklerini ayarlayın
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

function renderPDF(pdfUrl, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        return pdf.getPage(1); // İlk sayfayı al
    }).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        return page.render(renderContext).promise;
    }).catch(error => {
        console.error("PDF yüklenirken hata oluştu:", error);
    });
}


// Sayfa Yüklendiğinde Üniversite ve Fakülte Bilgilerini Getir
document.addEventListener("DOMContentLoaded", function () {
    fetchUniversities();
    fetchFaculties(); // Fakülteleri de burada yükle
});

// Fakülte seçildiğinde departmanları getir
document.getElementById('faculty').addEventListener('change', function () {
    const facultyId = this.value;
    fetchDepartments(facultyId);
});

// Departman seçildiğinde kursları getir
document.getElementById('department').addEventListener('change', function () {
    const departmentId = this.value;
    fetchCourses(departmentId);
});

// Kurs seçildiğinde notları getir
// document.getElementById('course').addEventListener('change', function () {
//     const courseId = this.value;
//     fetchNotes(courseId);
// });

// Kurs seçildiğinde başlığı güncelle
// document.getElementById('course').addEventListener('change', function () {
//     const selectedCourseName = this.options[this.selectedIndex].text;
//     document.getElementById('noteHeader').textContent = `${selectedCourseName} Dersine Ait Notlar`;
// });
console.log(alertify);

// "Ara" butonuna tıklanınca notları getir ve başlığı güncelle
document.getElementById('searchButton').addEventListener('click', function () {
    const courseSelect = document.getElementById('course');
    const selectedCourseId = courseSelect.value;

    if (!selectedCourseId) {

        alertify.error('Lütfen Kurs Seçiniz!');

        return;
    }

    const selectedOption = courseSelect.options[courseSelect.selectedIndex];
    const selectedCourseName = selectedOption ? selectedOption.text : "Bilinmeyen Ders"; // Hata önleme

    fetchNotes(selectedCourseId, selectedCourseName);
});

