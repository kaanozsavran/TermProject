// API endpoint'leri
const apiUrlUniversity = 'https://localhost:7149/api/University';
const apiUrlFaculty = 'https://localhost:7149/api/Faculty';
const apiUrlFacultyName = id => `https://localhost:7149/api/Faculty/getFacultyName/${id}`;
const apiUrlDepartment = facultyId => `https://localhost:7149/api/Department/faculty/${facultyId}`;
const apiUrlRegister = 'https://localhost:7149/api/User';

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
            console.log("Üniversiteler:", universities);
            const universitySelect = document.getElementById('university');

            universities.forEach(university => {
                const option = document.createElement('option');
                option.value = university.universityId;
                option.textContent = university.universityName;
                universitySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Üniversiteler alınırken hata oluştu:', error);
        });
}
let facultyMap = {}; // Fakülte ID -> Fakülte İsmi eşleştirmesi için

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
            console.log("Fakülteler:", faculties);
            const facultySelect = document.getElementById('faculty');

            faculties.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.facultyID;
                option.textContent = faculty.facultyName;
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
            console.log("Departmanlar:", departments);
            const departmentSelect = document.getElementById('department');
            departmentSelect.innerHTML = '<option value="">Departman Seçin</option>'; // Varsayılan seçenek

            departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department.departmentId;
                option.textContent = department.departmentName;
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Departmanlar alınırken hata oluştu:', error);
        });
}

// Sayfa Yüklendiğinde Üniversite ve Fakülte Bilgilerini Getir
document.addEventListener("DOMContentLoaded", function () {
    fetchUniversities();
    fetchFaculties();
});

// Fakülte seçildiğinde departmanları getir
document.getElementById('faculty').addEventListener('change', function () {
    const facultyId = this.value;
    fetchDepartments(facultyId);
});

// Şifre Göster/Gizle Fonksiyonları
function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("bi-eye-slash");
        toggleIcon.classList.add("bi-eye");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("bi-eye");
        toggleIcon.classList.add("bi-eye-slash");
    }
}

// Şifreleri Doğrulama Fonksiyonu
function validatePasswords() {
    const password = document.getElementById("password").value;
    const passwordAgain = document.getElementById("passwordAgain").value;
    const passwordError = document.getElementById("passwordError");

    if (passwordAgain && password !== passwordAgain) {
        passwordError.style.display = "block"; // Hata mesajını göster
    } else {
        passwordError.style.display = "none"; // Hata mesajını gizle
    }
}

// Şifre alanlarında her değişiklikte doğrulamayı tetikle
document.getElementById("password").addEventListener("input", validatePasswords);
document.getElementById("passwordAgain").addEventListener("input", validatePasswords);


// Kullanıcı Kayıt Fonksiyonu
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    registerUser();
});

function registerUser() {
    const fullName = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordAgain = document.getElementById("passwordAgain").value;
    const university = document.getElementById("university").value;
    const facultyID = document.getElementById("faculty").value;
    const department = document.getElementById("department").value;

    if (password !== passwordAgain) {
        alert("Şifreler eşleşmiyor!");
        return;
    }
    const facultyName = facultyMap[facultyID] || ""; // Fakülte ismini haritadan al



    var e1 = document.getElementById("university");
    var e2 = document.getElementById("faculty");   //added var getbyid
    var e3 = document.getElementById("department");




    const requestData = {
        fullName,
        email,
        password,
        universityId: parseInt(e1.value), //dto isimlerine dikkat et çekerken
        facultyId: parseInt(e2.value),
        departmentId: parseInt(e3.value)
    };
    console.log(faculty);

    console.log("Gönderilen veri:", requestData);
    console.log(JSON.stringify(requestData));
    debugger;
    fetch(apiUrlRegister, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) throw new Error("Kayıt işlemi başarısız!");
            return response.json();
        })
        .then(data => {
            console.log("Kayıt Başarılı:", data);
            alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            window.location.href = "../login/login.html";
        })
        .catch(error => {
            console.error("Kayıt hatası:", error);
            alert("Kayıt sırasında hata oluştu. Lütfen tekrar deneyin.");
        });
}
