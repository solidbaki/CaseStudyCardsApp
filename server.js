// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Bellek İçi Veri Depolama ---
// Gerçek bir uygulamada bu veriler veritabanında tutulur.
// Kullanıcı verilerini tutan bir obje
const users = {
    'user123': { // Örnek bir kullanıcı ID'si
        id: 'user123',
        username: 'testuser',
        energy: 100 // Başlangıç enerjisi
    }
};

// Kart verilerini tutan bir obje
// Anahtar: cardId, Değer: Kart Bilgileri
const cards = {
    'cardABC': { // Örnek bir kart ID'si
        id: 'cardABC',
        userId: 'user123', // Bu kart hangi kullanıcıya ait
        level: 1,
        progress: 0
    },
    'cardXYZ': { // Başka bir örnek kart
        id: 'cardXYZ',
        userId: 'user123',
        level: 5,
        progress: 70
    }
};
// --- Bellek İçi Veri Depolama Sonu ---


// Middleware'ler
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ana rota
app.get('/', (req, res) => {
    res.send('No Surrender Backend API (In-Memory) Çalışıyor!');
});


// Enerji bilgilerini almak için GET endpoint'i
// Normalde kullanıcı kimliği token'dan alınır, şimdilik sabit bir kullanıcı kullanıyoruz.
app.get('/api/energy', (req, res) => {
    const userId = 'user123'; // Sabit kullanıcı ID'si
    const user = users[userId];

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.status(200).json({ energy: user.energy });
});

// Kartları ve enerjiyi güncelleyen batch geliştirme endpoint'i
app.post('/api/batch-develop', (req, res) => {
    const { cardId, clicks } = req.body;
    const userId = 'user123'; // Sabit kullanıcı ID'si (Normalde kimlik doğrulamadan alınır)

    // İstek doğrulama
    if (!cardId || typeof clicks !== 'number' || clicks <= 0) {
        return res.status(400).json({ message: 'Geçersiz istek parametreleri.' });
    }

    // Kullanıcı ve kartın varlığını kontrol et
    const user = users[userId];
    const card = cards[cardId];

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    if (!card || card.userId !== userId) { // Kartın kullanıcıya ait olup olmadığını da kontrol et
        return res.status(404).json({ message: 'Kart bulunamadı veya yetkiniz yok.' });
    }

    // Geliştirme mantığı
    let currentEnergy = user.energy;
    let currentProgress = card.progress;
    let currentLevel = card.level;
    const MAX_LEVEL = 10; // Örnek maksimum seviye

    for (let i = 0; i < clicks; i++) {
        if (currentProgress < 100) {
            if (currentEnergy >= 1) {
                currentProgress += 2;
                currentEnergy -= 1;
            } else {
                break; // Enerji bitti
            }
        } else {
            // Progress 100 ise ve maksimum seviyeye ulaşılmadıysa seviye atla
            if (currentLevel < MAX_LEVEL) {
                currentProgress = 0; // Progress sıfırlanır
                currentLevel += 1;
            } else {
                break; // Maksimum seviyeye ulaşıldı
            }
        }

        // Progress 100'e ulaştığında seviye atlama kontrolü (bir tıklama içinde)
        if (currentProgress >= 100 && currentLevel < MAX_LEVEL) {
            // Eğer tam 100 olduysa ve seviye atlanması gerekiyorsa
            // Bir sonraki iterasyonda seviye atlanacaktır.
            // Bu, ilerlemenin 100'ü geçmemesini sağlar.
            currentProgress = Math.min(100, currentProgress); // Progress 100'ü geçmemeli
        }
    }

    // Bellekteki verileri güncelle
    user.energy = currentEnergy;
    card.progress = currentProgress;
    card.level = currentLevel;

    res.status(200).json({
        progress: card.progress,
        energy: user.energy,
        level: card.level
    });
});
// --- API Uç Noktaları Sonu ---


// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`No Surrender Backend (In-Memory) http://localhost:${PORT} adresinde çalışıyor`);
    console.log('NOT: Bu uygulama verileri hafızada tutar ve yeniden başlatıldığında sıfırlanır.');
});