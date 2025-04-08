// Sayfa Yüklendiğinde Üniversite ve Fakülte Bilgilerini Getir
document.addEventListener("DOMContentLoaded", function () {
    setupAuthDropdown(); // Kullanıcı durumu kontrolü ve dropdown ayarlama
    fetchUserDetails(); // Kullanıcının üniversite/fakülte/departman bilgilerini çek
});



// Kullanıcı Durumunu Kontrol Et ve Dropdown'u Oluştur
function setupAuthDropdown() {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName'); // Full Name'i al
    const authContainer = document.getElementById("authContainer");

    if (token && fullName) {
        // Kullanıcı giriş yapmışsa dropdown menüsünü göster
        authContainer.innerHTML = `
            <div class="dropdown">
                <button class="dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="../img/pp-blue.png" class="profile-pic" alt="Profil">
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown" style="min-width: 200px;">
                    <li><span class="dropdown-item-text">Merhaba ${fullName}!</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="../profilepage/profile.html">Profilim</a></li>
                    <li><a class="dropdown-item" href="#" id="logout">
                        <i class="bi bi-box-arrow-right logout-icon" style="font-weight:bold"></i> &nbsp;Çıkış Yap</a>
                    </li>
                </ul>
            </div>
        `;

        // Çıkış yapma fonksiyonu
        document.getElementById("logout").addEventListener("click", function () {
            localStorage.removeItem('token');
            localStorage.removeItem('fullName');
            window.location.href = "../login/login.html"; // Giriş sayfasına yönlendir
        });
    } else {
        // Kullanıcı giriş yapmamışsa varsayılan giriş butonunu göster
        authContainer.innerHTML = `<a href="../login/login.html" class="btn btn-outline-custom">Giriş / Üye Ol</a>`;
    }
}


function fetchUserDetails() {
    const userID = localStorage.getItem('userID');

    if (!userID) return;

    fetch(`https://localhost:7149/api/User/userinfo/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Kullanıcı bilgileri getirilemedi.");
            }
            return response.json();
        })
        .then(user => {
            fillUserFields(user);
            getCoursesByDepartment(user.departmentID); // ID’yi alıyoruz artık
        })
        .catch(error => {
            console.error("Hata:", error);
        });
}

function fillUserFields(user) {
    // Backend'den gelen yapıya göre doldur
    const universitySelect = document.getElementById("university");
    const facultySelect = document.getElementById("faculty");
    const departmentSelect = document.getElementById("department");

    if (user.universityName) {
        universitySelect.innerHTML = `<option selected>${user.universityName}</option>`;
    }

    if (user.facultyName) {
        facultySelect.innerHTML = `<option selected>${user.facultyName}</option>`;
    }

    if (user.departmentName) {
        departmentSelect.innerHTML = `<option selected>${user.departmentName}</option>`;
    }

    // Dersleri yükle (eğer backend'den kullanıcıya ait course bilgisi geliyorsa)
}


function getCoursesByDepartment(departmantId) {
    fetch(`https://localhost:7149/api/Course/department/${departmantId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Dersler getirilemedi.");
            }
            return response.json();
        })
        .then(courses => {
            const courseSelect = document.getElementById("course");
            courseSelect.innerHTML = `<option value="">Seçiniz...</option>`; // Temizle
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.courseID;
                option.textContent = course.courseName;
                courseSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Hata:", error);
        });
}

// Not Ekleme Formu Submit Olayı
document.getElementById("noteForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Sayfa yenilenmesin

    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    const title = document.getElementById("noteTitle").value.trim();
    const description = document.getElementById("noteDescription").value.trim();
    const courseID = document.getElementById("course").value;
    const fileInput = document.getElementById("noteFile");
    const file = fileInput.files[0];

    // Basit kontroller
    if (!title || !description || !courseID || !file) {
        alertify.error("Lütfen tüm alanları doldurun ve dosya seçin.");
        return;
    }

    // FormData ile dosya ve verileri gönder
    const formData = new FormData();
    formData.append("UserID", userID);
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("CourseID", courseID);
    formData.append("File", file);

    try {
        const response = await fetch("https://localhost:7149/api/Note/add-note", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // Content-Type yok! fetch bunu FormData ile otomatik ayarlıyor
            },
            body: formData
        });
        console.log("Response status:", response.status);
        console.log("Response ok?:", response.ok);


        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Not eklenemedi.");
        }

        alertify.success("Not başarıyla eklendi!");
        document.getElementById("noteForm").reset();

    } catch (error) {
        console.error("Not ekleme hatası:", error);
        alertify.error(`Hata: ${error.message}`);
    }
});
