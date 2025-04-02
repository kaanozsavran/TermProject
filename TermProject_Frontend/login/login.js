// Giriş Yapma Fonksiyonu
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Formun varsayılan gönderimini engelle

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();



    const requestData = {
        email,
        password
    };

    fetch('https://localhost:7149/api/User/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Giriş başarısız! Lütfen e-posta ve şifrenizi kontrol edin.');
            }
            return response.json();
        })
        .then(data => {
            const apiUser = data.apiUser;
            const token = data.token; // Token'ı alıyoruz ama konsola yazdırmıyoruz
            localStorage.setItem('token', token); //Token'ı sakla


            // Giriş başarılı olduğunda yönlendirme yapabilirsiniz
            window.location.href = "../homepages/home.html"; // Dashboard sayfasına yönlendir
        })
        .catch(error => {
            console.error("Giriş hatası:", error);
            alert(error.message); // Hata mesajını kullanıcıya göster
        });
});

// Şifre göster/gizle fonksiyonunu çağır
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

