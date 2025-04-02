document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
});

function checkAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
        alertify.alert("Erişim Hatası", "Bu sayfaya erişebilmek için önce giriş yapmalısınız!", function () {
            window.location.href = "../login/login.html";
        }).set({
            transition: 'fade', // Geçiş efekti
            closable: false // Kullanıcı kapatamaz
        });
    }
}

