function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'none';
    }
}

function login() {
    const vergiNo = document.getElementById('vergiNo').value;
    const password = document.getElementById('password').value;

    if (vergiNo.length === 10 && !isNaN(vergiNo) && password) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    } else {
        alert('Lütfen geçerli bir Vergi Numarası ve Şifre giriniz.');
    }
}

let currentEmission = 0;
let targetEmission = 0;

function verifySerialNumber() {
    const serialNumberInput = document.getElementById('serial-number-input').value;
    const resultContainer = document.getElementById('result-panel');
    
    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));

    if (storedData && serialNumberInput === storedData.serialNumber) {
        document.getElementById('product-name').innerText = storedData.productName;
        currentEmission = parseFloat(storedData.carbonFootprint);
        document.getElementById('current-emission').innerText = currentEmission.toFixed(2) + ' kg CO2e';
        document.getElementById('current-label').innerText = storedData.emissionLabel;
        resultContainer.style.display = 'flex';

        // Mevcut etikete göre dropdown seçeneklerini sınırlandır
        const targetLabelSelect = document.getElementById('target-label');
        const currentLabel = storedData.emissionLabel;
        const labels = ['A++', 'A+', 'A', 'B', 'C', 'D'];
        const currentIndex = labels.indexOf(currentLabel);
        for (let i = 0; i < targetLabelSelect.options.length; i++) {
            const optionLabel = targetLabelSelect.options[i].value;
            const optionIndex = labels.indexOf(optionLabel);
            targetLabelSelect.options[i].disabled = optionIndex >= currentIndex;
        }
    } else {
        alert('Geçersiz Seri Numarası');
        resultContainer.style.display = 'none';
    }
}

function calculateCost() {
    const targetLabel = document.getElementById('target-label').value;
    if (!targetLabel) {
        document.getElementById('cost').innerText = '0';
        return;
    }

    const emissionTargets = {
        'A++': 0.99,
        'A+': 1,
        'A': 5,
        'B': 10,
        'C': 25,
        'D': 50
    };

    targetEmission = emissionTargets[targetLabel];
    const deltaEmission = currentEmission - targetEmission;
    if (deltaEmission <= 0) {
        document.getElementById('cost').innerText = '0';
        return;
    }

    const baseCostPerKg = 0.74; // 1 kg CO2e = 0.74 TL (20 Euro/ton, 1 Euro = 37 TL)
    const costMultiplier = 1 + (deltaEmission / 50);
    const totalCost = deltaEmission * baseCostPerKg * costMultiplier;

    document.getElementById('cost').innerText = totalCost.toFixed(2);
}

function makePayment() {
    const totalCost = parseFloat(document.getElementById('cost').innerText);
    if (totalCost <= 0) {
        alert('Lütfen geçerli bir hedef etiket seçin.');
        return;
    }

    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));
    storedData.carbonFootprint = targetEmission.toFixed(2) + ' kg CO2e';

    const emissionTargets = {
        'A++': 0.99,
        'A+': 1,
        'A': 5,
        'B': 10,
        'C': 25,
        'D': 50
    };
    let newLabel = 'D';
    for (const [label, threshold] of Object.entries(emissionTargets)) {
        if (targetEmission <= threshold) {
            newLabel = label;
            break;
        }
    }
    storedData.emissionLabel = newLabel;

    localStorage.setItem('carbonEmissionData', JSON.stringify(storedData));

    const treeCostPerYear = 110.45; // 1 ağaç yılda 6.7 ton CO2 tüketiyor, maliyeti 110.45 TL
    const treeCount = Math.ceil(totalCost / treeCostPerYear);

    document.getElementById('new-emission').innerText = targetEmission.toFixed(2) + ' kg CO2e';
    document.getElementById('new-label').innerText = newLabel;
    document.getElementById('tree-contribution').innerText = `Ödemenizle ${treeCount} ağaç dikimine katkı sağladınız.`;
    document.getElementById('result-panel').style.display = 'none';
    document.getElementById('payment-result-panel').style.display = 'flex';
}