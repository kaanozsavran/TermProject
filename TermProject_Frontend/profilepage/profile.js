// Sayfa Yüklendiğinde Üniversite ve Fakülte Bilgilerini Getir
document.addEventListener("DOMContentLoaded", function () {
    setupAuthDropdown(); // Kullanıcı durumu kontrolü ve dropdown ayarlama

    const fullName = localStorage.getItem('fullName');
    const greetingText = document.getElementById("greetingText");
    const savedImage = localStorage.getItem('profileImage');
    const imgElement = document.getElementById('profileImage');

    if (fullName && greetingText) {
        greetingText.textContent = `Merhaba ${fullName}!`;
    }

    if (savedImage && imgElement) {
        imgElement.src = savedImage;
    }

    // ===>> SAYFA AÇILINCA "Profilim" SEÇENEĞİNİ YÜKLE <<
    loadSection('profilim');
});

// Kullanıcı Durumunu Kontrol Et ve Dropdown'u Oluştur
function setupAuthDropdown() {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');
    const authContainer = document.getElementById("authContainer");

    if (token && fullName) {
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

        document.getElementById("logout").addEventListener("click", function () {
            localStorage.removeItem('token');
            localStorage.removeItem('fullName');
            window.location.href = "../login/login.html";
        });
    } else {
        authContainer.innerHTML = `<a href="../login/login.html" class="btn btn-outline-custom">Giriş / Üye Ol</a>`;
    }
}

// Güvenlik alt menüsünü aç/kapat ve ikon değişimi
function toggleSecurity() {
    const submenu = document.getElementById("securitySubmenu");
    const icon = document.getElementById("securityIcon");

    submenu.classList.toggle("d-none");
    if (submenu.classList.contains("d-none")) {
        icon.classList.remove("bi-chevron-up");
        icon.classList.add("bi-chevron-down");
    } else {
        icon.classList.remove("bi-chevron-down");
        icon.classList.add("bi-chevron-up");
    }
}

// Şifre değiştirme içeriğini yüklemek için
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
            // Şifre değiştir formunu JS ile oluşturma
            contentArea.innerHTML = `
                <div class="card p-3 shadow-sm">
                    <h4>Şifre Değiştir</h4>
                    <form id="changePasswordForm">
                        <div class="mb-3">
                            <label for="oldPassword" class="form-label">Eski Şifre:</label>
                            <input type="password" class="form-control" id="oldPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="newPassword" class="form-label">Yeni Şifre:</label>
                            <input type="password" class="form-control" id="newPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Yeni Şifre (Tekrar):</label>
                            <input type="password" class="form-control" id="confirmPassword" required>
                        </div>
                        <button type="submit" class="btn btn-outline-custom updateButton">Şifreyi Güncelle</button>
                    </form>
                </div>`;
            break;
        default:
            contentArea.innerHTML = `<div class="card p-3 shadow-sm"><h4>İçerik buraya yüklenecek</h4></div>`;
    }

    // Form yüklendikten sonra event listener eklemek
    const changePasswordForm = document.getElementById("changePasswordForm");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // Sayfa yenilenmesin

            const token = localStorage.getItem('token');
            const userID = localStorage.getItem('userID'); // Kullanıcı ID'sini alıyoruz

            const oldPassword = document.getElementById("oldPassword").value.trim();
            const newPassword = document.getElementById("newPassword").value.trim();
            const confirmNewPassword = document.getElementById("confirmPassword").value.trim();

            // Basit kontroller
            if (!oldPassword || !newPassword || !confirmNewPassword) {
                alertify.error("Lütfen tüm alanları doldurun.");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alertify.error("Yeni şifreler eşleşmiyor!");
                return;
            }

            const requestBody = {
                oldPassword: oldPassword,
                newPassword: newPassword,
                newPasswordAgain: confirmNewPassword
            };

            try {
                const response = await fetch(`https://localhost:7149/api/User/password-change${userID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`  // API Key veya token burada kullanılıyor
                    },
                    body: JSON.stringify(requestBody)  // JSON formatında veri gönderiyoruz
                });

                console.log("Response status:", response.status);
                console.log("Response ok?:", response.ok);

                if (!response.ok) {
                    const errText = await response.text();  // Yanıt metnini al
                    throw new Error(errText || "Şifre değiştirilemedi.");
                }

                const responseData = await response.json();  // Yanıtı JSON olarak çözümle
                alertify.success(responseData.message || "Şifre başarıyla değiştirildi!");

                // Formu sıfırlıyoruz (formun gerçekten yüklendiğinden emin olarak)
                changePasswordForm.reset();

            } catch (error) {
                console.error("Şifre değiştirme hatası:", error);
                alertify.error(`${error.message}`);
            }
        });
    }
}



































// Profil resmi değiştirme
document.getElementById('profilePicInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const imgElement = document.getElementById('profileImage');

    if (file && imgElement) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgElement.src = e.target.result;
            localStorage.setItem('profileImage', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});
