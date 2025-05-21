document.addEventListener("DOMContentLoaded", async () => {
    const authContainer = document.getElementById("auth-container");
    const topLikedContainer = document.getElementById("top-liked-container");

    getTopLikedNotes();

    if (authContainer) {
        const token = localStorage.getItem("token");
        const fullName = localStorage.getItem("fullName");
        const userID = localStorage.getItem("userID");
        const profilePic = localStorage.getItem('profileImage') || '../img/pp-blue.png'; // varsayılan resim

        if (token && fullName) {
            authContainer.innerHTML = `
                <div class="dropdown">
                    <button class="dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="${profilePic}" class="profile-pic" alt="Profil">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
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
                localStorage.removeItem("token");
                localStorage.removeItem("fullName");
                localStorage.removeItem("userID");
                window.location.reload();
                // window.location.href = "../login.html"; // Giriş sayfasına yönlendir
            });

        } else {
            authContainer.innerHTML = `
                <a href="../login/login.html" class="btn btn-outline-custom">Giriş / Üye Ol</a>
            `;
        }
    }

    // İstatistikleri çekme işlemi
    try {
        const response = await fetch("https://localhost:7149/api/Statistics");
        const data = await response.json();

        const universityCountEl = document.getElementById("university-count");
        const userCountEl = document.getElementById("user-count");
        const noteCountEl = document.getElementById("note-count");

        function animateCount(el, target) {
            if (!el) return; // Element kontrolü
            let current = 0;
            const increment = Math.ceil(target / 100);
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(interval);
                } else {
                    el.textContent = current;
                }
            }, 20);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(universityCountEl, data.universities);
                    animateCount(userCountEl, data.users);
                    animateCount(noteCountEl, data.notes);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.85 });

        const staticsEl = document.getElementById("statics");
        if (staticsEl) {
            observer.observe(staticsEl);
        }

    } catch (error) {
        console.error("İstatistikleri çekerken hata oluştu:", error);
    }

    // En çok beğenilen notları çeken fonksiyon
    // async function fetchTopLikedNotes() {
    //     try {
    //         const response = await fetch("https://localhost:7149/api/Note/top-liked");

    //         if (!response.ok) {
    //             throw new Error(`Sunucu hatası: ${response.status}`);
    //         }

    //         const notes = await response.json();

    //         if (!topLikedContainer) return;

    //         topLikedContainer.innerHTML = ""; // Önce temizle

    //         notes.forEach(note => {
    //             const card = document.createElement("div");
    //             card.className = "col-md-4";

    //             card.innerHTML = `
    //                 <div class="card p-3 shadow-lg rounded-4 text-center">
    //                     <h5>${note.title}</h5>
    //                     <p><i class="bi bi-hand-thumbs-up-fill me-1" style="color: #42999b;"></i>${note.likeCount}</p>
    //                     <p class="text-muted">${note.fullName}</p>
    //                 </div>
    //             `;

    //             topLikedContainer.appendChild(card);
    //         });

    //     } catch (err) {
    //         console.error("En çok beğenilen notlar alınırken hata oluştu:", err);
    //     }
    // }


    // Top 3 en yüksek like alan notları getir ve göster
    async function getTopLikedNotes() {
        const notesContainer = document.getElementById('top-liked-container');
        notesContainer.innerHTML = '';

        try {
            const response = await fetch('https://localhost:7149/api/Note/top-liked');
            const data = await response.json();

            const topNotes = data
                .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
                .slice(0, 3);

            topNotes.forEach((note, index) => {
                const noteId = `pdf-canvas-${index}`;
                const noteCard = `
                    <div class='col-md-4 mb-4'>
                        <div class='card p-3 position-relative'>
                               
                            <div class="position-absolute d-flex align-items-center" style="top: 10px; right: 10px; color: #42999b;">
                                <i class="bi bi-hand-thumbs-up fs-5"></i>
                                <span class="ms-1">${note.likeCount}</span>
                            </div>
    
                            <h5>${note.title}</h5>
    
                            <div class="canvas-container mt-2 mb-2">
                                <canvas id="${noteId}" style="width: 100%; max-height: 300px;"></canvas>
                                <div class="hover-icon">
                                    <a href="https://localhost:7149${note.filePath}" target="_blank"><i class="bi bi-search"></i></a>
                                </div>
                            </div>
    
                            <div class="note-footer d-flex justify-content-between align-items-center mt-3">
    <div class="d-flex align-items-center">
        <img src="https://localhost:7149${note.profileImage}" alt="profil" width="32" height="32" class="rounded-circle me-2" onerror="this.src='../img/pp-blue.png'">
        <strong>${note.fullName}</strong>
    </div>
    <p class="text-muted mb-0">${new Date(note.uploadDate).toLocaleDateString()}</p>
</div>
    
                        </div>
                    </div>`;

                notesContainer.insertAdjacentHTML('beforeend', noteCard);
                renderPDF(note.filePath, noteId);
            });

        } catch (error) {
            notesContainer.innerHTML = `<div class='col'><div class='card p-3'>${error.message}</div></div>`;
            console.error('Hata:', error);
        }
    }


    // PDF.js ayarı
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // PDF önizlemesini canvas'a çiz
    function renderPDF(pdfUrl, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

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

    // Sayfa yüklendiğinde top 3 notu getir
    document.addEventListener('DOMContentLoaded', getTopLikedNotes);


});
