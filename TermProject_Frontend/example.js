// API endpoint'i
const apiUrl = 'https://localhost:44310/api/University';

// Fetch ile veri al
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("API'den Gelen Veri:", data); // Veriyi kontrol et

        // <select> elementini bul
        const universitySelect = document.getElementById('university-select');

        if (universitySelect) {
            console.log("university-select bulundu, seçenekler ekleniyor...");

            // Gelen her üniversite için bir <option> oluştur
            data.forEach(university => {
                const option = document.createElement('option');
                option.value = university;  // Option'un value değeri
                option.textContent = university; // Görünen metin
                universitySelect.appendChild(option);
            });
        } else {
            console.error("university-select elementi bulunamadı! ID'yi kontrol et.");
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

