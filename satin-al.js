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
let productUnit = '';
let productQuantity = 0;

function verifySerialNumber() {
    const serialNumberInput = document.getElementById('serial-number-input').value;
    const resultContainer = document.getElementById('result-panel');
    
    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));

    if (storedData && serialNumberInput === storedData.serialNumber) {
        document.getElementById('product-name').innerText = storedData.productName;
        currentEmission = parseFloat(storedData.carbonFootprint);
        productUnit = storedData.productUnit;
        productQuantity = parseFloat(storedData.totalCarbonFootprint) / currentEmission; // Miktarı geri hesapla
        document.getElementById('current-emission').innerText = `${currentEmission.toFixed(4)} kg CO2e/${productUnit}`;
        document.getElementById('current-label').innerText = storedData.emissionLabel;
        resultContainer.style.display = 'flex';

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

    const emissionTargets = productUnit === 'kg' ? {
        'A++': 0.5,
        'A+': 1.0,
        'A': 1.5,
        'B': 2.0,
        'C': 2.5,
        'D': 3.0
    } : {
        'A++': 0.4,
        'A+': 0.8,
        'A': 1.2,
        'B': 1.6,
        'C': 2.0,
        'D': 2.4
    };

    targetEmission = emissionTargets[targetLabel];
    const deltaEmission = currentEmission - targetEmission;
    if (deltaEmission <= 0) {
        document.getElementById('cost').innerText = '0';
        return;
    }

    const baseCostPerKg = 2.8; // Dünya karbon fiyatı: 80 USD/ton = 2.8 TL/kg (35 TL/USD)
    const costMultipliers = {
        'A++': 2.0,
        'A+': 1.8,
        'A': 1.6,
        'B': 1.4,
        'C': 1.2,
        'D': 1.0
    };
    const multiplier = costMultipliers[targetLabel];
    const totalCost = (deltaEmission * baseCostPerKg * multiplier * productQuantity) / 2; // Tutar yarıya indirildi

    document.getElementById('cost').innerText = totalCost.toFixed(2);
}

function makePayment() {
    const totalCost = parseFloat(document.getElementById('cost').innerText);
    if (totalCost <= 0) {
        alert('Lütfen geçerli bir hedef etiket seçin.');
        return;
    }

    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));
    storedData.carbonFootprint = targetEmission.toFixed(4);
    storedData.emissionLabel = document.getElementById('target-label').value;
    storedData.totalCarbonFootprint = (targetEmission * productQuantity).toFixed(4);

    localStorage.setItem('carbonEmissionData', JSON.stringify(storedData));

    const treeCostPerYear = 6700; // 1 ağaç yılda 6.7 ton CO2 emiyor (TEMA verisi)
    const treeCount = Math.ceil((currentEmission - targetEmission) * productQuantity / 6700 * 4); // Ağaç sayısı 4 kat artırıldı

    document.getElementById('new-emission').innerText = `${targetEmission.toFixed(4)} kg CO2e/${productUnit}`;
    document.getElementById('new-label').innerText = storedData.emissionLabel;
    document.getElementById('tree-contribution').innerText = `Ödemenizle ${treeCount} ağaç dikimine katkı sağladınız.`;
    document.getElementById('result-panel').style.display = 'none';
    document.getElementById('payment-result-panel').style.display = 'flex';
}