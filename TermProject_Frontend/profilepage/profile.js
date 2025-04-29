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
    // Fetch the user's profile picture from the backend
    const userId = localStorage.getItem('userID'); // Assuming the user ID is saved in localStorage
    if (userId) {
        fetchProfilePicture(userId);
    }
    // ===>> SAYFA AÇILINCA "Profilim" SEÇENEĞİNİ YÜKLE <<
    loadSection('profilim');
});








async function fetchProfilePicture(userId) {
    try {
        const response = await fetch(`https://localhost:7149/api/User/${userId}/profile-picture`);

        if (!response.ok) {
            throw new Error("Profil fotoğrafı yüklenemedi");
        }

        const data = await response.json();
        const profilePictureUrl = data.profilePictureUrl;


        // Tam URL'yi oluştur
        const fullUrl = profilePictureUrl ? `https://localhost:7149${profilePictureUrl}` : null;

        // Set the profile picture src to the fetched full URL
        const imgElement = document.getElementById('profileImage');
        imgElement.src = fullUrl || '../img/pp-blue.png';
    } catch (error) {
        console.error(error);
        const imgElement = document.getElementById('profileImage');
        imgElement.src = '../img/pp-blue.png';
    }
}





























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
            loadUserProfile();
            break;
        case 'notlarim':
            getUserNotes();
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


// Profil Bilgilerini Backend'den Al
async function loadUserProfile() {
    const token = localStorage.getItem('token');

    if (!token) {
        alertify.error("Kullanıcı girişi yapılmamış.");
        return;
    }

    try {
        const response = await fetch(`https://localhost:7149/api/User/getUserInformation`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Token gönderimi
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Kullanıcı bilgileri alınamadı.");
        }

        const userData = await response.json();  // Kullanıcı verisini JSON olarak al


        // Kullanıcı bilgilerini sayfada göster
        const contentArea = document.getElementById("contentArea");
        contentArea.innerHTML = `
                <div class="card p-3 shadow-sm">
                        <h4>Profilim</h4>
                        <p><strong>Ad Soyad:</strong>
                            <input type="text" id="fullName" value="${userData.fullName}" readonly class="form-control" onfocus="this.removeAttribute('readonly');">
                        </p>
                        <p><strong>Email:</strong> 
                            <input type="email" id="email" value="${userData.email}" readonly class="form-control" onfocus="this.removeAttribute('readonly');">
                        </p>
                        <p><strong>Üniversite:</strong> 
                            <input type="text" id="universityName" value="${userData.universityName}" readonly class="form-control" onfocus="this.removeAttribute('readonly');">
                        </p>
                        <p><strong>Fakülte:</strong> 
                            <input type="text" id="facultyName" value="${userData.facultyName}" readonly class="form-control" onfocus="this.removeAttribute('readonly');">
                        </p>
                        <p><strong>Bölüm:</strong> 
                            <input type="text" id="departmentName" value="${userData.departmentName}" readonly class="form-control" onfocus="this.removeAttribute('readonly');">
                        </p>
                        <button class="btn btn-custom mt-3" onclick="updateProfile()">Güncelle</button>
                 </div>
        `;

    } catch (error) {
        console.error("Profil bilgileri yüklenirken hata:", error);
        alertify.error(`${error.message}`);
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

function getUserNotes() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID'); // Login olduktan sonra zaten kaydediyorsun
    const notesContainer = document.getElementById('contentAreaItem');

    fetch(`https://localhost:7149/api/Note/user-notes/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Kullanıcı notları çekilemedi.");
            }
            return response.json();
        })
        .then(data => {


            if (!data || data.length === 0) {
                notesContainer.innerHTML = `<div class='col'><div class='card p-3 text-center' style="background:white ;color:#42999b;"><strong>Hiç not eklenmemiş.</strong></div></div>`;
                return;
            }

            data.forEach(note => {
                const noteId = `pdf-canvas-${note.noteID}`;
                const noteCard = `
                
                    <div class='d-flex col-md-4 mb-4'>
            <div class='card p-3 shadow-sm'>
                <h5>${note.title}</h5>
                <p>${note.description || 'Açıklama yok.'}</p>
                <div class="canvas-container">
                    <canvas id="${noteId}" style="width: 100%; max-height: 300px;"></canvas>
                    <div class="hover-icon">
                        <a href="https://localhost:7149${note.filePath}" target="_blank"><i class="bi bi-search"></i></a>
                    </div>
                </div>
                <div class="note-footer d-flex justify-content-between align-items-center">
                    <p><strong>Ders:</strong> ${note.courseName || 'Bilinmiyor'}</p>
                    <p class="text-muted" style="color:white !important;">${new Date(note.uploadDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
                `;
                notesContainer.innerHTML += noteCard;
            });



            setTimeout(() => {
                data.forEach(note => {
                    const noteId = `pdf-canvas-${note.noteID}`;
                    renderPDF(note.filePath, noteId);
                });
            }, 500);
        })
        .catch(error => {
            notesContainer.innerHTML = `<div class='col'><div class='card p-3'>${error.message}</div></div>`;
            console.error('Hata:', error);
        });
}
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

function renderPDF(pdfUrl, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const requestUrl = `https://localhost:7149/api/Note/note-files?filePath=${pdfUrl}`;

    pdfjsLib.getDocument(requestUrl).promise.then(pdf => {
        return pdf.getPage(1);
    }).then(page => {
        const viewport = page.getViewport({ scale: 1.0 });
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











