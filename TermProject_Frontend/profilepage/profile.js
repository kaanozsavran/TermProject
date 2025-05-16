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
    //SAYFA AÇILINCA "Profilim" SEÇENEĞİNİ YÜKLE 
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
        imgElement.src = fullUrl || '../img/pp-white.png';
        localStorage.setItem('profileImage', fullUrl);
    } catch (error) {
        console.error(error);
        const imgElement = document.getElementById('profileImage');
        imgElement.src = '../img/pp-white.png';
    }
}

// Kullanıcı Durumunu Kontrol Et ve Dropdown'u Oluştur
function setupAuthDropdown() {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');
    const authContainer = document.getElementById("authContainer");
    const profilePic = localStorage.getItem('profileImage') || '../img/pp-white.png'; // varsayılan resim


    if (token && fullName) {
        authContainer.innerHTML = `
            <div class="dropdown">
                <button class="dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="${profilePic}" class="profile-pic" alt="Profil">
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
                        <button type="submit" class="btn  updateButton">Şifreyi Güncelle</button>
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
                const response = await fetch(`https://localhost:7149/api/User/password-change/${userID}`, {
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


// Profil Bilgilerini Backend'den Al ve Dropdown Menülerini Hazırla
async function loadUserProfile() {
    const token = localStorage.getItem('token');

    if (!token) {
        alertify.error("Kullanıcı girişi yapılmamış.");
        return;
    }

    try {
        // Kullanıcı bilgilerini al
        const response = await fetch(`https://localhost:7149/api/User/getUserInformation`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
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
                    <select id="universityDropdown" class="form-select">
                        <option value="">Yükleniyor...</option>
                    </select>
                </p>
                <p><strong>Fakülte:</strong> 
                    <select id="facultyDropdown" class="form-select" disabled>
                        <option value="">Önce üniversite seçin</option>
                    </select>
                </p>
                <p><strong>Bölüm:</strong> 
                    <select id="departmentDropdown" class="form-select" disabled>
                        <option value="">Önce fakülte seçin</option>
                    </select>
                </p>
                <button class="btn btn-custom mt-3" onclick="updateProfile()">Güncelle</button>
            </div>
        `;

        // Üniversite listesini yükle
        await loadUniversities(userData.universityName);

        // Eğer kullanıcının mevcut bir üniversitesi varsa, onun fakültelerini yükle
        if (userData.universityName) {
            // Üniversite ID'sini bul
            const universityDropdown = document.getElementById('universityDropdown');
            for (let i = 0; i < universityDropdown.options.length; i++) {
                if (universityDropdown.options[i].text === userData.universityName) {
                    universityDropdown.selectedIndex = i;
                    await loadFaculties(universityDropdown.value, userData.facultyName);
                    break;
                }
            }
        }

        // Eğer kullanıcının mevcut bir fakültesi varsa, onun bölümlerini yükle
        if (userData.facultyName) {
            const facultyDropdown = document.getElementById('facultyDropdown');
            for (let i = 0; i < facultyDropdown.options.length; i++) {
                if (facultyDropdown.options[i].text === userData.facultyName) {
                    facultyDropdown.selectedIndex = i;
                    await loadDepartments(facultyDropdown.value, userData.departmentName);
                    break;
                }
            }
        }

        // Event listeners ekle
        document.getElementById('universityDropdown').addEventListener('change', async function () {
            const universityId = this.value;
            if (universityId) {
                await loadFaculties(universityId);
            } else {
                const facultyDropdown = document.getElementById('facultyDropdown');
                facultyDropdown.innerHTML = '<option value="">Önce üniversite seçin</option>';
                facultyDropdown.disabled = true;

                const departmentDropdown = document.getElementById('departmentDropdown');
                departmentDropdown.innerHTML = '<option value="">Önce fakülte seçin</option>';
                departmentDropdown.disabled = true;
            }
        });

        document.getElementById('facultyDropdown').addEventListener('change', async function () {
            const facultyId = this.value;
            if (facultyId) {
                await loadDepartments(facultyId);
            } else {
                const departmentDropdown = document.getElementById('departmentDropdown');
                departmentDropdown.innerHTML = '<option value="">Önce fakülte seçin</option>';
                departmentDropdown.disabled = true;
            }
        });

    } catch (error) {
        console.error("Profil bilgileri yüklenirken hata:", error);
        alertify.error(`${error.message}`);
    }
}

// Üniversiteleri yükle ve dropdown'a ekle
async function loadUniversities(currentUniversity = null) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:7149/api/University', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Üniversite listesi alınamadı!");
        }

        const universities = await response.json();
        const universityDropdown = document.getElementById('universityDropdown');

        // Dropdown'ı temizle
        universityDropdown.innerHTML = '<option value="">Üniversite seçin</option>';

        // Üniversiteleri dropdown'a ekle
        universities.forEach(university => {
            const option = document.createElement('option');
            option.value = university.universityID;
            option.textContent = university.universityName;
            universityDropdown.appendChild(option);

            // Eğer bu üniversite kullanıcının mevcut üniversitesi ise seç
            if (currentUniversity && university.universityName === currentUniversity) {
                option.selected = true;
            }
        });

        universityDropdown.disabled = false;
    } catch (error) {
        console.error("Üniversiteler yüklenirken hata:", error);
        alertify.error(`${error.message}`);
    }
}

// Fakülteleri yükle ve dropdown'a ekle
async function loadFaculties(universityId, currentFaculty = null) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://localhost:7149/api/Faculty?universityId=${universityId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Fakülte listesi alınamadı!");
        }

        const faculties = await response.json();
        const facultyDropdown = document.getElementById('facultyDropdown');

        // Dropdown'ı temizle
        facultyDropdown.innerHTML = '<option value="">Fakülte seçin</option>';

        // Fakülteleri dropdown'a ekle
        faculties.forEach(faculty => {
            const option = document.createElement('option');
            option.value = faculty.facultyID;
            option.textContent = faculty.facultyName;
            facultyDropdown.appendChild(option);

            // Eğer bu fakülte kullanıcının mevcut fakültesi ise seç
            if (currentFaculty && faculty.facultyName === currentFaculty) {
                option.selected = true;
            }
        });

        facultyDropdown.disabled = false;

        // Bölüm dropdown'ını sıfırla
        const departmentDropdown = document.getElementById('departmentDropdown');
        departmentDropdown.innerHTML = '<option value="">Önce fakülte seçin</option>';
        departmentDropdown.disabled = true;
    } catch (error) {
        console.error("Fakülteler yüklenirken hata:", error);
        alertify.error(`${error.message}`);
    }
}

// Bölümleri yükle ve dropdown'a ekle
async function loadDepartments(facultyId, currentDepartment = null) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://localhost:7149/api/Department/faculty/${facultyId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Bölüm listesi alınamadı!");
        }

        const departments = await response.json();
        const departmentDropdown = document.getElementById('departmentDropdown');

        // Dropdown'ı temizle
        departmentDropdown.innerHTML = '<option value="">Bölüm seçin</option>';

        // Bölümleri dropdown'a ekle
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.departmentID;
            option.textContent = department.departmentName;
            departmentDropdown.appendChild(option);

            // Eğer bu bölüm kullanıcının mevcut bölümü ise seç
            if (currentDepartment && department.departmentName === currentDepartment) {
                option.selected = true;
            }
        });

        departmentDropdown.disabled = false;
    } catch (error) {
        console.error("Bölümler yüklenirken hata:", error);
        alertify.error(`${error.message}`);
    }
}

// Profil bilgilerini güncelleme fonksiyonu
async function updateProfile() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');

    if (!token || !userId) {
        alertify.error("Kullanıcı girişi yapılmamış veya kullanıcı ID bulunamadı.");
        return;
    }

    // Form değerlerini al
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();

    // Dropdown seçimlerini al
    const universityDropdown = document.getElementById('universityDropdown');
    const facultyDropdown = document.getElementById('facultyDropdown');
    const departmentDropdown = document.getElementById('departmentDropdown');

    const universityId = universityDropdown.value;
    const facultyId = facultyDropdown.value;
    const departmentId = departmentDropdown.value;

    // Seçilen değerlerin metin karşılıklarını al
    const universityName = universityId ? universityDropdown.options[universityDropdown.selectedIndex].text : '';
    const facultyName = facultyId ? facultyDropdown.options[facultyDropdown.selectedIndex].text : '';
    const departmentName = departmentId ? departmentDropdown.options[departmentDropdown.selectedIndex].text : '';

    // Validasyon kontrolleri
    if (!fullName) {
        alertify.error("Ad Soyad alanı boş olamaz!");
        return;
    }


    if (!universityId) {
        alertify.error("Lütfen bir üniversite seçin!");
        return;
    }

    if (!facultyId) {
        alertify.error("Lütfen bir fakülte seçin!");
        return;
    }

    if (!departmentId) {
        alertify.error("Lütfen bir bölüm seçin!");
        return;
    }

    // Güncelleme verisi hazırla
    const updateData = {
        fullName: fullName,
        email: email,
        universityName: universityName,
        facultyName: facultyName,
        departmentName: departmentName,
    };

    try {
        const response = await fetch(`https://localhost:7149/api/User/userinfo-change/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Profil güncellenemedi!");
        }

        const result = await response.json();

        // Lokalda saklanan adı güncelle
        localStorage.setItem('fullName', fullName);

        alertify.success(result.message);
        // Dropdown değerlerini güncelle
        setupAuthDropdown(); // Üst menüdeki profil adını da güncelle

    } catch (error) {
        console.error("Profil güncelleme hatası:", error);

    }
}



document.getElementById('profilePicInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const imgElement = document.getElementById('profileImage');

    const userID = localStorage.getItem('userID'); // localStorage'dan userId çekiliyor
    if (!userID) {
        alert("Kullanıcı ID bulunamadı. Lütfen giriş yapın."); //you need to add alertfiy
        return;
    }

    const apiUrl = `https://localhost:7149/api/User/${userID}/upload-profile-picture`;

    if (file && imgElement) {
        // 1. Görseli hemen ekranda göster
        const reader = new FileReader();
        reader.onload = function (e) {
            imgElement.src = e.target.result;
            localStorage.setItem('profileImage', e.target.result);
        };
        reader.readAsDataURL(file);

        // 2. FormData ile dosyayı gönder (DTO'daki isim: ProfilePicture)
        const formData = new FormData();
        formData.append("ProfilePicture", file); // DTO'daki isimle birebir aynı olmalı

        fetch(apiUrl, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.text(); // Ok result.Message dönüyor
                } else {
                    return response.text().then(text => { throw new Error(text); });
                }
            })
            .then(message => {
                console.log('Sunucudan yanıt:', message);
                alert(message); //you need to add alertfiy
            })
            .catch(error => {
                console.error('Hata:', error);
                alert("Profil fotoğrafı yüklenirken hata oluştu: " + error.message); //you need to add alertfiy
            });
    }
});

function getUserNotes() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');
    const notesContainer = document.getElementById('contentArea');

    notesContainer.innerHTML = '';

    fetch(`https://localhost:7149/api/Note/user-notes/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Kullanıcı notları çekilemedi.");
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                notesContainer.innerHTML = `<div class='col'><div class='card p-3 text-center' style="background:white ;color:#42999b;"><strong>Hiç not eklenmemiş.</strong></div></div>`;
                return;
            }

            const row = document.createElement('div');
            row.className = 'row';

            data.forEach(note => {
                const noteId = `pdf-canvas-${note.noteID}`;
                const noteCard = document.createElement('div');
                noteCard.className = 'col-md-4 mb-4 d-flex';
                noteCard.innerHTML = `
                <div class='card p-3 shadow-sm w-100 position-relative'>
                    <div class="edit-icon position-absolute" data-note-id="${note.noteID}">
                        <i class="bi bi-pencil-square"></i>
                    </div>
                    <h5>${note.title}</h5>
                    <p>${note.description || 'Açıklama yok.'}</p>
                    <div class="canvas-container">
                        <canvas id="${noteId}" style="width: 100%; max-height: 300px;"></canvas>
                        <div class="hover-icon">
                            <a href="https://localhost:7149${note.filePath}" target="_blank"><i class="bi bi-search"></i></a>
                        </div>
                    </div>
                    <div class="note-footer mt-3 position-relative" style="min-height: 50px;">
                        <p class="mb-1"><strong>Ders:</strong> ${note.courseName || 'Bilinmiyor'}</p>
                        <p class="text-muted position-absolute" style="top: 37px; right: -5px; font-size: 0.9rem; color:white !important;">
                            ${new Date(note.uploadDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            `;

                row.appendChild(noteCard);
            });

            notesContainer.appendChild(row);

            setTimeout(() => {
                data.forEach(note => {
                    const noteId = `pdf-canvas-${note.noteID}`;
                    renderPDF(note.filePath, noteId);
                });
            }, 500);

            // Modal edit fonksiyonu
            document.querySelectorAll('.edit-icon').forEach(icon => {
                icon.addEventListener('click', function () {
                    const noteId = this.dataset.noteId;
                    const noteCard = this.closest('.card');
                    const currentTitle = noteCard.querySelector('h5').innerText;
                    const currentDescription = noteCard.querySelector('p').innerText === 'Açıklama yok.' ? '' : noteCard.querySelector('p').innerText;

                    // Eski modal varsa kaldır
                    const existingModal = document.getElementById('editNoteModal');
                    if (existingModal) existingModal.remove();

                    // Modal popup içine silme ikonu ve buton eklendi
                    const modal = document.createElement('div');
                    modal.id = 'editNoteModal';
                    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center;
                    justify-content: center; z-index: 9999;">
            <div class="bg-info text-white p-4 rounded" style="width: 600px; position: relative; background-color: #42999b !important;">
                <h5 class="fw-bold mb-3">Notu Düzenle</h5>
                <input type="text" id="editTitle" placeholder="Başlık" class="form-control mb-3" value="${currentTitle}" />
                <textarea id="editDescription" placeholder="Açıklama" class="form-control mb-3">${currentDescription}</textarea>
                <div class="text-end mt-3">
                    <button id="saveNoteBtn" class="btn btn-sm fw-bold text-white" style="background-color: white;color:#42999b !important; cursor:pointer;">Kaydet</button>
                    <button id="deleteNoteBtn" class="btn btn-sm fw-bold text-white" style="background-color: white;color:#42999b !important; cursor:pointer;">Notu Sil</button>
                </div>
                <span id="closeModalBtn" style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px; color: white;">&times;</span>
            </div>
        </div>
                `;
                    document.body.appendChild(modal);

                    // Kapatma işlemi (X işaretine tıklanması)
                    document.getElementById('closeModalBtn').addEventListener('click', () => {
                        modal.remove();
                    });

                    // Kaydet butonu
                    document.getElementById('saveNoteBtn').addEventListener('click', function () {
                        const updatedTitle = document.getElementById('editTitle').value;
                        const updatedDesc = document.getElementById('editDescription').value;

                        fetch(`https://localhost:7149/api/Note/${noteId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                noteID: parseInt(noteId),
                                title: updatedTitle,
                                description: updatedDesc
                            })
                        })
                            .then(res => {
                                if (!res.ok) throw new Error('Güncelleme başarısız!');
                                return res.json();
                            })
                            .then(() => {
                                noteCard.querySelector('h5').innerText = updatedTitle;
                                noteCard.querySelector('p').innerText = updatedDesc || 'Açıklama yok.';
                                modal.remove();
                                alertify.success("Not başarıyla güncellendi.");

                            })
                            .catch(err => alert(err.message)); //you need to add alertfiy
                    });

                    // Silme butonu fonksiyonu
                    document.getElementById('deleteNoteBtn').addEventListener('click', function () {
                        // Modalı geçici olarak gizle
                        document.getElementById('editNoteModal').style.display = 'none';
                        alertify.confirm(
                            "Notu Sil",
                            "Bu notu silmek istediğinize emin misiniz?",
                            function () {
                                fetch(`https://localhost:7149/api/Note/deletenotes/${noteId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                })
                                    .then(res => {
                                        if (!res.ok) throw new Error('Not silinemedi!');

                                        // Başarılıysa kartı sayfadan kaldır
                                        noteCard.parentElement.remove();
                                        modal.remove();

                                        // Alertify ile kullanıcıya mesaj göster
                                        alertify.success('Not başarıyla silindi.');
                                    })
                                    .catch(err => {
                                        alertify.error(err.message); // Hata durumunda Alertify ile hata mesajı
                                    });
                            },
                            function () {
                                // İptal edilirse modalı tekrar göster
                                document.getElementById('editNoteModal').style.display = 'flex';
                                alertify.message("Silme işlemi iptal edildi.");
                            }
                        ).set('labels', { ok: 'Evet', cancel: 'Hayır' });
                    });
                });
            });

        })
        .catch(error => {
            notesContainer.innerHTML = `<div class='col'><div class='card p-3 text-center text-danger'><strong>${error.message}</strong></div></div>`;
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