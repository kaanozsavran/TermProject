document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("https://localhost:44310/api/Statistics"); // API URL'ni kontrol et
        const data = await response.json();

        // Verileri HTML'deki ilgili yerlere ekleyelim
        document.getElementById("university-count").textContent = data.universities;
        document.getElementById("user-count").textContent = data.users;
        document.getElementById("note-count").textContent = data.notes;
    } catch (error) {
        console.error("İstatistikleri çekerken hata oluştu:", error);
    }
});
