document.addEventListener("DOMContentLoaded", async () => {
    const authContainer = document.getElementById("auth-container");

    if (authContainer) {
        const token = localStorage.getItem("token");


        if (token) {
            authContainer.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="default-profile.png" class="profile-pic" alt="Profil" />
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="profileDropdown">
                        <li><a class="dropdown-item" href="profile.html">Profilim</a></li>
                        <li><a class="dropdown-item" href="#" id="logout">Çıkış Yap</a></li>
                    </ul>
                </div>
            `;

            document.getElementById("logout").addEventListener("click", function () {
                localStorage.removeItem("token");
                window.location.reload();
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
});
