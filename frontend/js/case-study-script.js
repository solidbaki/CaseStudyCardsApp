document.addEventListener('DOMContentLoaded', () => {
    const energyProgressBarFill = document.querySelector('.energy-bar-fill');
    const energyRegenTime = document.querySelector('.energy-regen-time');
    const energyLabel = document.querySelector('.energy-label');
    const energyIcon = document.querySelector('.energy-icon');

   
    let currentEnergyPercentage = 75; 
    energyProgressBarFill.style.width = `${currentEnergyPercentage}%`;


    let minutes = 1;
    let seconds = 59;

    function updateRegenTimer() {
        if (minutes === 0 && seconds === 0) {
            energyRegenTime.textContent = "%1 Yenilendi!"; 
    
            return;
        }

        if (seconds === 0) {
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        const formattedMinutes = String(minutes).padStart(1, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        energyRegenTime.textContent = `%1 Yenilenmesine Kalan: ${formattedMinutes}:${formattedSeconds}`;
    }

});