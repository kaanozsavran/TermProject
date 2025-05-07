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
            const token = data.token;
            const fullName = apiUser.fullName;
            const userID = apiUser.userID;

            //  Eski kullanıcı bilgilerini temizle
            localStorage.removeItem('token');
            localStorage.removeItem('fullName');
            localStorage.removeItem('userID');
            localStorage.removeItem('profileImage');

            //  Yeni kullanıcı bilgilerini sakla
            localStorage.setItem('token', token);
            localStorage.setItem('fullName', fullName);
            localStorage.setItem('userID', userID);

            //  Profil fotoğrafını backend'den çek ve localStorage'a kaydet
            fetchProfilePicture(userID).then(() => {
                // Tüm işlemler tamamlandıktan sonra yönlendir
                window.location.href = "../homepages/home.html";
            });
        })
        .catch(error => {
            console.error("Giriş hatası:", error);
            alert(error.message);
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

// Profil fotoğrafını backend'den çekme fonksiyonu
async function fetchProfilePicture(userId) {
    try {
        const response = await fetch(`https://localhost:7149/api/User/${userId}/profile-picture`);
        if (!response.ok) {
            throw new Error("Profil fotoğrafı yüklenemedi");
        }

        const data = await response.json();
        const profilePictureUrl = data.profilePictureUrl;
        const fullUrl = profilePictureUrl ? `https://localhost:7149${profilePictureUrl}` : '../img/pp-white.png';

        localStorage.setItem('profileImage', fullUrl);
    } catch (error) {
        console.error("Profil fotoğrafı yüklenirken hata oluştu:", error);
        localStorage.setItem('profileImage', '../img/pp-white.png'); // varsayılan fotoğraf
    }
}
