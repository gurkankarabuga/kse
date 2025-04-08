function generateSerialNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let serial = '2025';
    for (let i = 0; i < 8; i++) {
        serial += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return serial;
}

function login() {
    const vergiNo = document.getElementById('vergiNo').value;
    const password = document.getElementById('password').value;

    if (vergiNo.length === 10 && !isNaN(vergiNo) && password) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    } else {
        alert('Lütfen geçerli bir Vergi Numarası (10 haneli sayı) ve Şifre giriniz.');
    }
}

function calculateAll() {
    const energyForm = document.getElementById('energy-form');
    const transportForm = document.getElementById('transport-form');
    const wasteForm = document.getElementById('waste-form');
    const waterForm = document.getElementById('water-form');
    const materialsForm = document.getElementById('materials-form');
    const processForm = document.getElementById('process-form');
    const productName = document.getElementById('product-name').value;
    const productQuantity = parseFloat(document.getElementById('product-quantity').value) || 1;

    let carbonFootprint = 0;

    const energyInputs = energyForm.querySelectorAll('input[type="number"]');
    energyInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        carbonFootprint += value * getEnergyCoefficient(input.id);
    });

    const transportInputs = transportForm.querySelectorAll('input[type="number"]');
    transportInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        carbonFootprint += value * getTransportCoefficient(input.id);
    });

    const wasteInputs = wasteForm.querySelectorAll('input[type="number"]');
    wasteInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        carbonFootprint += value * getWasteCoefficient(input.id);
    });

    const waterInputs = waterForm.querySelectorAll('input[type="number"]');
    waterInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        carbonFootprint += value * getWaterCoefficient(input.id);
    });

    const materialsInputs = materialsForm.querySelectorAll('input[type="number"]');
    materialsInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        carbonFootprint += value * getMaterialsCoefficient(input.id);
    });

    const processInputs = processForm.querySelectorAll('input[type="number"]');
    processInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        carbonFootprint += value * getProcessCoefficient(input.id);
    });

    const carbonFootprintPerProduct = carbonFootprint / productQuantity;

    let emissionLabel = '';
    if (carbonFootprintPerProduct <= 1) emissionLabel = 'A++';
    else if (carbonFootprintPerProduct <= 5) emissionLabel = 'A+';
    else if (carbonFootprintPerProduct <= 10) emissionLabel = 'A';
    else if (carbonFootprintPerProduct <= 25) emissionLabel = 'B';
    else if (carbonFootprintPerProduct <= 50) emissionLabel = 'C';
    else emissionLabel = 'D';

    const serialNumber = generateSerialNumber();

    const resultData = {
        productName: productName,
        carbonFootprint: carbonFootprintPerProduct.toFixed(2) + ' kg CO2e',
        serialNumber: serialNumber,
        emissionLabel: emissionLabel
    };
    localStorage.setItem('carbonEmissionData', JSON.stringify(resultData));

    document.getElementById('product-name-result').innerText = productName;
    document.getElementById('carbon-result').innerText = carbonFootprintPerProduct.toFixed(2) + ' kg CO2e';
    document.getElementById('serial-number').innerText = serialNumber;
    document.getElementById('emission-label').innerText = emissionLabel; // Etiketi ekranda göster
    document.getElementById('result-container').style.display = 'block';
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.classList.toggle('active');
    } else {
        console.error('Menü elementi bulunamadı!');
    }
}

function getEnergyCoefficient(id) {
    const coefficients = {
        'coal-electricity': 0.5, 'natural-gas-electricity': 0.5, 'nuclear-electricity': 0.5,
        'hydro-electricity': 0.5, 'wind-electricity': 0.5, 'solar-electricity': 0.5,
        'biomass-electricity': 0.5, 'natural-gas-consumption': 2.75, 'gasoline-consumption': 2.3,
        'diesel-consumption': 2.3, 'lpg-consumption': 2.3, 'motorin-consumption': 2.3,
        'coal-consumption': 2.5, 'fuel-oil-consumption': 2.5, 'mazot-consumption': 2.5
    };
    return coefficients[id] || 0;
}

function getTransportCoefficient(id) {
    const coefficients = {
        'company-gasoline-cars': 2.3, 'company-diesel-cars': 2.6, 'company-lpg-cars': 2.6,
        'company-electric-cars': 0.5, 'company-hybrid-cars': 1.5, 'personal-car-usage': 2.3,
        'public-transport-usage': 0.1, 'bicycle-usage': 0, 'walking-distance': 0,
        'short-flights': 250, 'medium-flights': 500, 'long-flights': 1000
    };
    return coefficients[id] || 0;
}

function getWasteCoefficient(id) {
    const coefficients = {
        'composting': 0, 'landfilling': 2.5, 'incineration': 3.0, 'paper-recycling': 0.1,
        'plastic-recycling': 0.1, 'glass-recycling': 0.1, 'metal-recycling': 0.1
    };
    return coefficients[id] || 0;
}

function getWaterCoefficient(id) {
    const coefficients = {
        'drinking-water': 0.5, 'process-water': 0.5, 'waste-water-treatment': 0.2
    };
    return coefficients[id] || 0;
}

function getMaterialsCoefficient(id) {
    const coefficients = {
        'steel-production': 1.9, 'aluminium-production': 1.5, 'cement-production': 1.1,
        'paper-production': 0.5, 'road-transport': 2.3, 'sea-transport': 1.2, 'air-transport': 3.5
    };
    return coefficients[id] || 0;
}

function getProcessCoefficient(id) {
    const coefficients = {
        'ammonia-production': 1.8, 'nitric-acid-production': 1.7, 'adipic-acid-production': 1.6,
        'iron-steel-production': 1.9, 'cement-production-industrial': 1.1, 'ceramic-production': 1.2,
        'glass-production': 1.3, 'chemical-production': 1.5
    };
    return coefficients[id] || 0;
}
