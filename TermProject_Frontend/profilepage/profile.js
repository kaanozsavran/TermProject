// Sayfa Yüklendiğinde Üniversite ve Fakülte Bilgilerini Getir
document.addEventListener("DOMContentLoaded", function () {
    setupAuthDropdown(); // Kullanıcı durumu kontrolü ve dropdown ayarlama

    const fullName = localStorage.getItem('fullName');
    const greetingText = document.getElementById("greetingText");

    if (fullName && greetingText) {
        greetingText.textContent = `Merhaba ${fullName}!`;
    }
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

// Güvenlik alt menüsünü aç/kapat ve ikon değişimi
function toggleSecurity() {
    const submenu = document.getElementById("securitySubmenu");
    const icon = document.getElementById("securityIcon");

    submenu.classList.toggle("d-none");
    // İkonu değiştir
    if (submenu.classList.contains("d-none")) {
        icon.classList.remove("bi-chevron-up");
        icon.classList.add("bi-chevron-down");
    } else {
        icon.classList.remove("bi-chevron-down");
        icon.classList.add("bi-chevron-up");
    }
}


// Menü tıklandığında sağ içeriği değiştirme (örnek)
function loadSection(section) {
    const contentArea = document.getElementById("contentArea");

    switch (section) {
        case 'profilim':
            contentArea.innerHTML = `<div class="card p-3 shadow-sm"><h4>Profilim</h4><p>Profil bilgileri burada gösterilecek.</p></div>`;
            break;
        case 'notlarim':
            contentArea.innerHTML = `<div class="card p-3 shadow-sm"><h4>Notlarım</h4><p>Notlar burada listelenecek.</p></div>`;
            break;
        case 'sifreDegistir':
            contentArea.innerHTML = `
                <div class="card p-3 shadow-sm">
                    <h4>Şifre Değiştir</h4>
                    <form>
                        <div class="mb-3">
                            <label for="oldPassword" class="form-label">Eski Şifre</label>
                            <input type="password" class="form-control" id="oldPassword">
                        </div>
                        <div class="mb-3">
                            <label for="newPassword" class="form-label">Yeni Şifre</label>
                            <input type="password" class="form-control" id="newPassword">
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Yeni Şifre (Tekrar)</label>
                            <input type="password" class="form-control" id="confirmPassword">
                        </div>
                        <button type="submit" class="btn btn-outline-custom updateButton">Şifreyi Güncelle</button>
                    </form>
                </div>`;
            break;
        default:
            contentArea.innerHTML = `<div class="card p-3 shadow-sm"><h4>İçerik buraya yüklenecek</h4></div>`;
    }
}