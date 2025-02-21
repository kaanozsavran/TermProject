document.addEventListener("DOMContentLoaded", function () {
    const universitySelect = document.getElementById("university");
    const facultySelect = document.getElementById("faculty");
    const departmentSelect = document.getElementById("department");

    // Üniversiteleri getir
    fetch("/api/University")
        .then(response => response.json())
        .then(data => {
            universitySelect.innerHTML = '<option value="">Üniversitenizi seçin</option>';
            data.forEach(university => {
                let option = new Option(university.name, university.id);
                universitySelect.add(option);
            });
        })
        .catch(error => console.error("Üniversiteler yüklenirken hata oluştu:", error));

    // Fakülteleri getir
    universitySelect.addEventListener("change", function () {
        let universityId = this.value;
        facultySelect.innerHTML = '<option value="">Fakültenizi seçin</option>';
        departmentSelect.innerHTML = '<option value="">Önce fakülte seçin</option>'; // Bölüm temizlenmeli

        if (!universityId) return;

        fetch(`/api/Faculty?universityId=${universityId}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(faculty => {
                    let option = new Option(faculty.name, faculty.id);
                    facultySelect.add(option);
                });
            })
            .catch(error => console.error("Fakülteler yüklenirken hata oluştu:", error));
    });

    // Bölümleri getir
    facultySelect.addEventListener("change", function () {
        let facultyId = this.value;
        departmentSelect.innerHTML = '<option value="">Bölümünüzü seçin</option>';

        if (!facultyId) return;

        fetch(`/api/Department/faculty/${facultyId}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(department => {
                    let option = new Option(department.name, department.id);
                    departmentSelect.add(option);
                });
            })
            .catch(error => console.error("Bölümler yüklenirken hata oluştu:", error));
    });

    // Formu gönder
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let fullName = document.getElementById("fullname").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("passwordAgain").value;
        let passwordError = document.getElementById("passwordError");

        if (password !== confirmPassword) {
            passwordError.textContent = "Şifreler eşleşmiyor!";
            return;
        } else {
            passwordError.textContent = "";
        }

        let formData = {
            fullName: fullName,
            email: email,
            password: password,
            universityId: universitySelect.value,
            facultyId: facultySelect.value,
            departmentId: departmentSelect.value
        };

        fetch("/api/User", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error("Kayıt başarısız oldu");
                return response.json();
            })
            .then(data => {
                alert("Kayıt başarılı! Lütfen giriş yapınız.");
                window.location.href = "login.html"; // Kullanıcıyı giriş sayfasına yönlendir
            })
            .catch(error => {
                console.error("Kayıt sırasında hata oluştu:", error);
                alert("Kayıt başarısız oldu, lütfen tekrar deneyin.");
            });
    });
});
