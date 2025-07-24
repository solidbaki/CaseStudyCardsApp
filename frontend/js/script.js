// no-surrender-frontend/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const imageSection = document.querySelector('.image-section');
    const totalImages = 24; // Toplam resim sayısı

    // Resimleri dinamik olarak oluştur ve ekle
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.src = `assets/images/weapons (${i}).png`;
        img.alt = `Weapon ${i}`;
        imageSection.appendChild(img);
    }

    // Bu sayfada backend API etkileşimi olmadığı için,
    // önceki script.js içeriğini (developButton vb.) bu dosyadan kaldırıyoruz.
    // O kısım, "ns case study" sayfasının JS'ine ait olacak.
});