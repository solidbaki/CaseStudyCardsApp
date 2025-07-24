const DEVELOP_API_URL = 'http://localhost:3000/api/batch-develop';
const ENERGY_API_URL = 'http://localhost:3000/api/energy';

const userEnergySpan = document.getElementById('userEnergy');
const cardsGridContainer = document.querySelector('.cards-grid-container');
const messageArea = document.getElementById('messageArea');

const cardDefinitions = {
    'cardABC': { 
        name: 'Uzun Kılıç',
        levels: {
            1: { name: 'Gümüş Diş', description: 'Sade, keskin bir savaş kılıcı.' },
            2: { name: 'Zümrüt Yürek', description: 'Can alıcı darbeler için güçlendirildi.' },
            3: { name: 'Altın Pençe', description: 'Kralların kanını döken efsanevi keskinlik.' }
        }
    },
    'cardXYZ': { 
        name: 'Savaş Baltası',
        levels: {
            1: { name: 'Ay Parçası', description: 'Hafif ve hızlı bir balta.' },
            2: { name: 'Zümrüt Kesik', description: 'Derin yaralar açan büyülü çelik.' },
            3: { name: 'Efsane Yarma', description: 'Tek vuruşta kale kapısı deler.' }
        }
    },
    'cardDEF': { 
        name: 'Büyü Asası',
        levels: {
            1: { name: 'Gölge Dalı', description: 'Temel büyü asası.' },
            2: { name: 'Zümrüt Kök', description: 'Doğanın gücüyle titreşir.' },
            3: { name: 'Altın Kök', description: 'Yıldızları yere indirir, zamanı büker.' }
        }
    },
    'cardGHI': {
        name: 'Kalkan',
        levels: {
            1: { name: 'Gümüş Siperi', description: 'Basit bir koruma aracı.' },
            2: { name: 'Zümrüt Zırh', description: 'Gelen saldırıyı yansıtır.' },
            3: { name: 'Altın Duvar', description: 'Tanrılar bile geçemez.' }
        }
    },
    'cardJKL': { 
        name: 'Savaş Çekici',
        levels: {
            1: { name: 'Taş Parçalayıcı', description: 'Ağır ve yıkıcı.' },
            2: { name: 'Zümrüt Ezici', description: 'Zırhları paramparça eder.' },
            3: { name: 'Altın Hüküm', description: 'Dünyayı çatlatır, düşmanları ezer.' }
        }
    },
    'cardMNO': { 
        name: 'Eğri Kılıç',
        levels: {
            1: { name: 'Gümüş Pençe', description: 'Hafif ve çevik bir bıçak.' },
            2: { name: 'Zümrüt Çengel', description: 'Derin kesikler için eğildi.' },
            3: { name: 'Altın Yılan', description: 'Gölge gibi kayar, kaderi biçer.' }
        }
    },
    'cardPQR': { 
        name: 'Kısa Kılıç',
        levels: {
            1: { name: 'Gölge Kesik', description: 'Hızlı saldırılar için ideal.' },
            2: { name: 'Zümrüt Fısıltı', description: 'Sessiz ama ölümcül.' },
            3: { name: 'Altın Dilim', description: 'Zamanda bile iz bırakır.' }
        }
    },
    'cardSTU': { 
        name: 'Büyü Kitabı',
        levels: {
            1: { name: 'Gümüş Sayfalar', description: 'Temel büyüleri içerir.' },
            2: { name: 'Zümrüt Kehanet', description: 'Geleceği okur, kaderi değiştirir.' },
            3: { name: 'Altın Kitabe', description: 'Evrenin sırlarını fısıldar, gerçekliği ezer.' }
        }
    }
};

let currentUser = {
    id: 'user123',
    energy: 100 
};

let userCards = {

    'cardABC': { id: 'cardABC', level: 1, progress: 0, imageIndex: 1 },
    'cardXYZ': { id: 'cardXYZ', level: 1, progress: 0, imageIndex: 2 },
    'cardDEF': { id: 'cardDEF', level: 1, progress: 0, imageIndex: 3 },
    'cardGHI': { id: 'cardGHI', level: 1, progress: 0, imageIndex: 4 },
    'cardJKL': { id: 'cardJKL', level: 1, progress: 0, imageIndex: 5 },
    'cardMNO': { id: 'cardMNO', level: 1, progress: 0, imageIndex: 6 },
    'cardPQR': { id: 'cardPQR', level: 1, progress: 0, imageIndex: 7 },
    'cardSTU': { id: 'cardSTU', level: 1, progress: 0, imageIndex: 8 },

};

const MAX_CARD_LEVEL = 3; 


function updateEnergyUI() {
    userEnergySpan.textContent = currentUser.energy;
}

function showMessage(msg, type = 'info') {
    messageArea.textContent = msg;
    messageArea.className = `message-area ${type}`;
    setTimeout(() => {
        messageArea.textContent = '';
        messageArea.className = 'message-area';
    }, 3000);
}

function renderCard(cardId) {
    const cardData = userCards[cardId];
    const cardElement = document.getElementById(`card-${cardId}`);
    if (!cardElement) return;

    const levelDef = cardDefinitions[cardId].levels[cardData.level] || cardDefinitions[cardId].levels[MAX_CARD_LEVEL];
    const isMaxLevel = cardData.level >= MAX_CARD_LEVEL;
    const isProgressFull = cardData.progress >= 100;

    cardElement.querySelector('.card-level').textContent = `Seviye ${cardData.level}`;
    cardElement.querySelector('.level-name').textContent = levelDef.name;
    cardElement.querySelector('.level-description').textContent = levelDef.description;
    
    const progressBar = cardElement.querySelector('.progress-bar');
    const progressText = cardElement.querySelector('.progress-text');
    const developButton = cardElement.querySelector('.develop-one-button');
    const batchDevelopButton = cardElement.querySelector('.batch-develop-button');
    const batchDevelopInput = cardElement.querySelector('.batch-clicks-input');

    progressBar.style.width = `${cardData.progress}%`;
    progressText.textContent = `${cardData.progress}%`;

    if (isMaxLevel) {
        developButton.textContent = 'Maks Seviye';
        developButton.disabled = true;
        batchDevelopButton.disabled = true;
        if(batchDevelopInput) batchDevelopInput.disabled = true;
        showMessage(`${cardDefinitions[cardId].name} maksimum seviyeye ulaştı!`, 'success');
    } else if (isProgressFull) {
        developButton.textContent = 'Yükselt!';
        developButton.disabled = false;
        batchDevelopButton.disabled = false;
        if(batchDevelopInput) batchDevelopInput.disabled = false;
    } else {
        developButton.textContent = 'Geliştir';
        developButton.disabled = false;
        batchDevelopButton.disabled = false;
        if(batchDevelopInput) batchDevelopInput.disabled = false;
    }
}

function renderAll() {
    updateEnergyUI();
    cardsGridContainer.innerHTML = ''; 
    Object.values(userCards).forEach(cardData => {
        const cardElement = createCardElement(cardData);
        cardsGridContainer.appendChild(cardElement);
        renderCard(cardData.id); 
    });
}

function createCardElement(cardData) {
    const cardDef = cardDefinitions[cardData.id];
    if (!cardDef) {
        console.error(`Kart tanımı bulunamadı: ${cardData.id}`);
        return null;
    }

    const currentLevelDef = cardDef.levels[cardData.level] || cardDef.levels[MAX_CARD_LEVEL]; // Mevcut seviyenin tanımı

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.id = `card-${cardData.id}`;
    cardDiv.innerHTML = `
        <div class="card-image-wrapper">
            <img src="assets/images/weapons (${cardData.imageIndex}).png" alt="${cardDef.name}" class="card-image">
            <div class="card-level">Seviye ${cardData.level}</div>
            <div class="card-description-overlay">
                <span class="level-name">${currentLevelDef.name}</span>
                <span class="level-description">${currentLevelDef.description}</span>
            </div>
        </div>
        <div class="progress-section">
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${cardData.progress}%;"></div>
                <span class="progress-text">${cardData.progress}%</span>
            </div>
        </div>
        <div class="card-actions">
            <button class="develop-one-button">Geliştir</button>
            <button class="toggle-batch-button">Çoklu Geliştir</button>
        </div>
        <div class="multi-develop-controls" style="display: none;">
            <input type="number" class="batch-clicks-input" value="10" min="1" max="50">
            <button class="batch-develop-button">Geliştir X</button>
        </div>
    `;

    cardDiv.querySelector('.develop-one-button').addEventListener('click', () => handleDevelop(cardData.id, 1));

    const toggleBatchButton = cardDiv.querySelector('.toggle-batch-button');
    const multiDevelopControls = cardDiv.querySelector('.multi-develop-controls');
    toggleBatchButton.addEventListener('click', () => {
        multiDevelopControls.style.display = multiDevelopControls.style.display === 'none' ? 'flex' : 'none';
    });

    cardDiv.querySelector('.batch-develop-button').addEventListener('click', () => {
        const clicksInput = cardDiv.querySelector('.batch-clicks-input');
        const clicks = parseInt(clicksInput.value, 10);
        if (isNaN(clicks) || clicks <= 0) {
            showMessage('Lütfen geçerli bir sayı girin.', 'error');
            return;
        }
        handleDevelop(cardData.id, clicks);
    });

    return cardDiv;
}


async function fetchEnergy() {
    try {
        const response = await fetch(ENERGY_API_URL);
        if (!response.ok) {
            throw new Error('Enerji bilgisi alınamadı.');
        }
        const data = await response.json();
        currentUser.energy = data.energy;
        updateEnergyUI();
    } catch (error) {
        console.error('Enerji çekme hatası:', error);
        showMessage('Enerji bilgisi alınamadı.', 'error');
    }
}

async function handleDevelop(cardId, clicks) {
    const card = userCards[cardId];
    if (!card) return;

    const oldCardProgress = card.progress;
    const oldCardLevel = card.level;
    const oldUserEnergy = currentUser.energy;

    let clicksToSimulate = clicks;
    let simulatedEnergyCost = 0;

    if (card.progress < 100) { 
        clicksToSimulate = Math.min(clicks, currentUser.energy, (100 - card.progress) / 2);
        simulatedEnergyCost = clicksToSimulate;
    } else if (card.progress === 100 && card.level < MAX_CARD_LEVEL) { 
        clicksToSimulate = clicks; 
        simulatedEnergyCost = 0;
    } else {
        showMessage('Kart geliştirilemez (maks seviye veya enerji yok).', 'info');
        return;
    }


    currentUser.energy -= simulatedEnergyCost;
    card.progress = Math.min(100, card.progress + (clicksToSimulate * 2));
    if (card.progress >= 100 && card.level < MAX_CARD_LEVEL) {
        card.progress = 100; 
    }
    updateEnergyUI();
    renderCard(cardId);
    
    try {
        const response = await fetch(DEVELOP_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId, clicks }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Geliştirme işlemi başarısız oldu.');
        }

        const data = await response.json();
        currentUser.energy = data.energy;
        userCards[cardId].progress = data.progress;
        userCards[cardId].level = data.level; 

        updateEnergyUI();
        renderCard(cardId); 

        if (data.progress === 0 && data.level > oldCardLevel) {
            showMessage(`${cardDefinitions[cardId].name} seviye ${data.level}'e atladı!`, 'success');
        } else if (data.progress > oldCardProgress) {
             showMessage(`${cardDefinitions[cardId].name} başarıyla geliştirildi!`, 'success');
        } else {
            showMessage(`${cardDefinitions[cardId].name} zaten maksimumda veya enerji yetersiz.`, 'info');
        }

    } catch (error) {
        console.error('Geliştirme hatası:', error);
        currentUser.energy = oldUserEnergy;
        userCards[cardId].progress = oldCardProgress;
        userCards[cardId].level = oldCardLevel;
        updateEnergyUI();
        renderCard(cardId);
        showMessage(`Hata: ${error.message}`, 'error');
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await fetchEnergy();
    renderAll();
});