// Sayfa Yüklendiğinde Üniversite ve Fakülte Bilgilerini Getir
document.addEventListener("DOMContentLoaded", function () {
    setupAuthDropdown(); // Kullanıcı durumu kontrolü ve dropdown ayarlama
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
                    <img src="../img/pp.png" class="profile-pic" alt="Profil">
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
