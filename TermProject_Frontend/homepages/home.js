document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("https://localhost:44310/api/Statistics"); // API URL'ni kontrol et
        const data = await response.json();

        // HTML'deki ilgili alanları al
        const universityCountEl = document.getElementById("university-count");
        const userCountEl = document.getElementById("user-count");
        const noteCountEl = document.getElementById("note-count");

        // Sayıyı 0'dan hedef değere kadar artıran fonksiyon
        function animateCount(el, target) {
            let current = 0;
            const increment = Math.ceil(target / 100); // Hız ayarlaması
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target; // Hedef değere ulaşınca durdur
                    clearInterval(interval);
                } else {
                    el.textContent = current;
                }
            }, 20); // Artış hızı (milisaniye)
        }

        // Observer API kullanarak istatistikleri ekranda görünce başlat
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(universityCountEl, data.universities);
                    animateCount(userCountEl, data.users);
                    animateCount(noteCountEl, data.notes);
                    observer.disconnect(); // Animasyonu bir kere çalıştır ve sonra gözlemlemeyi durdur
                }
            });
        }, { threshold: 0.85 }); // %85 görünür olduğunda başlasın

        observer.observe(document.getElementById("statics"));

    } catch (error) {
        console.error("İstatistikleri çekerken hata oluştu:", error);
    }
});
