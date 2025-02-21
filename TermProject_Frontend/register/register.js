// API endpoint'leri
const apiUrlUniversity = 'https://localhost:44310/api/University';
const apiUrlFaculty = 'https://localhost:44310/api/Faculty';
const apiUrlDepartment = facultyId => `https://localhost:44310/api/Department/faculty/${facultyId}`;


// Fetch ile veri al
Promise.all([
    fetch(apiUrlUniversity),
    fetch(apiUrlFaculty)
])
    .then(responses => {
        // Her iki isteğin sonuçlarını kontrol et
        responses.forEach(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        });
        // İsteklerden gelen verileri JSON formatında al
        return Promise.all(responses.map(response => response.json()));
    })
    .then(data => {
        const [universities, faculties] = data; // İki API'den gelen verileri ayır

        console.log("Üniversiteler:", universities);
        console.log("Fakülteler:", faculties);

        // Üniversiteleri <select> elementine ekle
        const universitySelect = document.getElementById('university');
        if (universitySelect) {
            universities.forEach(university => {
                const option = document.createElement('option');
                option.value = university;  // Option'un value değeri
                option.textContent = university; // Görünen metin
                universitySelect.appendChild(option);
            });
        } else {
            console.error("university-select elementi bulunamadı! ID'yi kontrol et.");
        }

        // Fakülteleri <select> elementine ekle (benzer şekilde yapabilirsin)
        const facultySelect = document.getElementById('faculty');
        if (facultySelect) {
            faculties.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty;  // Option'un value değeri
                option.textContent = faculty; // Görünen metin
                facultySelect.appendChild(option);
            });
        } else {
            console.error("faculty-select elementi bulunamadı! ID'yi kontrol et.");
        }
    })
    .catch(error => {
        console.error('Bir hata oluştu:', error);
    });

// Fetch ile department verilerini al
function fetchDepartments(facultyId) {
    fetch(apiUrlDepartment(facultyId))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const departmentSelect = document.getElementById('department');


            if (data) {
                data.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.id;  // Departmanın ID'si
                    option.textContent = department.name; // Görünen metin
                    departmentSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Departmanları alırken hata oluştu:', error);
        });
}




function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

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
// Şifreleri doğrulama fonksiyonu
function validatePasswords() {
    const password = document.getElementById("password").value;
    const passwordAgain = document.getElementById("passwordAgain").value;
    const passwordError = document.getElementById("passwordError");

    // İkinci şifre alanı boş değilse kontrol et
    if (passwordAgain) {
        if (password !== passwordAgain) {
            passwordError.style.display = "block"; // Hata mesajını göster
        } else {
            passwordError.style.display = "none"; // Hata mesajını gizle
        }
    } else {
        passwordError.style.display = "none"; // İkinci şifre alanı boşsa hata mesajını gizle
    }

}

// İlk şifre alanında her değişiklikte doğrulamayı yap
document.getElementById("password").addEventListener("input", validatePasswords);
document.getElementById("passwordAgain").addEventListener("input", validatePasswords);


function togglePasswordAgain() {
    const passwordAgainInput = document.getElementById("passwordAgain");
    const toggleIconAgain = document.getElementById("toggleIconAgain");

    if (passwordAgainInput.type === "password") {
        passwordAgainInput.type = "text";
        toggleIconAgain.classList.remove("bi-eye-slash");
        toggleIconAgain.classList.add("bi-eye");
    } else {
        passwordAgainInput.type = "password";
        toggleIconAgain.classList.remove("bi-eye");
        toggleIconAgain.classList.add("bi-eye-slash");
    }
}
