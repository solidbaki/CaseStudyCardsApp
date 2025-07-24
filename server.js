const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


const users = {
    'user123': { 
        id: 'user123',
        username: 'testuser',
        energy: 100
    }
};


const cards = {
    'cardABC': { 
        id: 'cardABC',
        userId: 'user123', 
        level: 1,
        progress: 0
    },
    'cardXYZ': {
        id: 'cardXYZ',
        userId: 'user123',
        level: 5,
        progress: 70
    }
};


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('No Surrender Backend API (In-Memory) Çalışıyor!');
});

app.get('/api/energy', (req, res) => {
    const userId = 'user123';
    const user = users[userId];

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.status(200).json({ energy: user.energy });
});

app.post('/api/batch-develop', (req, res) => {
    const { cardId, clicks } = req.body;
    const userId = 'user123'; 

    if (!cardId || typeof clicks !== 'number' || clicks <= 0) {
        return res.status(400).json({ message: 'Geçersiz istek parametreleri.' });
    }

    const user = users[userId];
    const card = cards[cardId];

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    if (!card || card.userId !== userId) {
        return res.status(404).json({ message: 'Kart bulunamadı veya yetkiniz yok.' });
    }

    
    let currentEnergy = user.energy;
    let currentProgress = card.progress;
    let currentLevel = card.level;
    const MAX_LEVEL = 10; 

    for (let i = 0; i < clicks; i++) {
        if (currentProgress < 100) {
            if (currentEnergy >= 1) {
                currentProgress += 2;
                currentEnergy -= 1;
            } else {
                break; 
            }
        } else {
           
            if (currentLevel < MAX_LEVEL) {
                currentProgress = 0; 
                currentLevel += 1;
            } else {
                break; 
            }
        }

        if (currentProgress >= 100 && currentLevel < MAX_LEVEL) {
            currentProgress = Math.min(100, currentProgress); 
        }
    }

    user.energy = currentEnergy;
    card.progress = currentProgress;
    card.level = currentLevel;

    res.status(200).json({
        progress: card.progress,
        energy: user.energy,
        level: card.level
    });
});


app.listen(PORT, () => {
    console.log(`Backend working on http://localhost:${PORT}`);
});