let emissionData = {
    energy: 0,
    transport: 0,
    waste: 0,
    water: 0,
    materials: 0,
    process: 0
};

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
        localStorage.setItem('vergiNo', vergiNo);
    } else {
        alert('Lütfen geçerli bir Vergi Numarası ve Şifre giriniz.');
    }
}

function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'none';
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
    const vergiNo = localStorage.getItem('vergiNo');

    // Kategorilere göre emisyonları sıfırla
    emissionData = {
        energy: 0,
        transport: 0,
        waste: 0,
        water: 0,
        materials: 0,
        process: 0
    };

    // Enerji Tüketimi Hesaplaması
    const energyInputs = energyForm.querySelectorAll('input[type="number"]');
    energyInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.energy += value * getEnergyCoefficient(input.id);
    });

    // Ulaşım Hesaplaması
    const transportInputs = transportForm.querySelectorAll('input[type="number"]');
    transportInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.transport += value * getTransportCoefficient(input.id);
    });

    // Atık Yönetimi Hesaplaması
    const wasteInputs = wasteForm.querySelectorAll('input[type="number"]');
    wasteInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.waste += value * getWasteCoefficient(input.id);
    });

    // Su Tüketimi ve Atık Su Hesaplaması
    const waterInputs = waterForm.querySelectorAll('input[type="number"]');
    waterInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.water += value * getWaterCoefficient(input.id);
    });

    // Hammadde ve Malzeme Kullanımı Hesaplaması
    const materialsInputs = materialsForm.querySelectorAll('input[type="number"]');
    materialsInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.materials += value * getMaterialsCoefficient(input.id);
    });

    // İşlemler ve Proses Emisyonları Hesaplaması
    const processInputs = processForm.querySelectorAll('input[type="number"]');
    processInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.process += value * getProcessCoefficient(input.id);
    });

    // Toplam karbon ayak izi
    let totalCarbonFootprint = emissionData.energy + emissionData.transport + emissionData.waste + emissionData.water + emissionData.materials + emissionData.process;

    // Ürün başına karbon ayak izi hesaplaması
    let carbonFootprintPerProduct = totalCarbonFootprint / productQuantity;

    // Karbon Emisyon Etiketi Belirleme
    let emissionLabel = '';
    if (carbonFootprintPerProduct <= 1) {
        emissionLabel = 'A++';
    } else if (carbonFootprintPerProduct <= 5) {
        emissionLabel = 'A+';
    } else if (carbonFootprintPerProduct <= 10) {
        emissionLabel = 'A';
    } else if (carbonFootprintPerProduct <= 25) {
        emissionLabel = 'B';
    } else if (carbonFootprintPerProduct <= 50) {
        emissionLabel = 'C';
    } else {
        emissionLabel = 'D';
    }

    // Seri numarası oluştur
    const serialNumber = generateSerialNumber();

    // Sonuçları LocalStorage'a kaydet
    const resultData = {
        productName: productName,
        carbonFootprint: carbonFootprintPerProduct.toFixed(2) + ' kg CO2e',
        totalCarbonFootprint: totalCarbonFootprint.toFixed(2),
        serialNumber: serialNumber,
        emissionLabel: emissionLabel,
        emissionData: emissionData,
        vergiNo: vergiNo
    };
    localStorage.setItem('carbonEmissionData', JSON.stringify(resultData));

    // Sonuçları Göster
    document.getElementById('product-name-result').innerText = productName;
    document.getElementById('vergi-no-result').innerText = vergiNo;
    document.getElementById('carbon-result').innerText = carbonFootprintPerProduct.toFixed(2) + ' kg CO2e';
    document.getElementById('serial-number').innerText = serialNumber;
    document.getElementById('emission-label').innerText = emissionLabel;
    document.getElementById('result-panel').style.display = 'flex';

    // Pasta Grafiği Oluştur
    const ctx = document.getElementById('emission-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Enerji', 'Ulaşım', 'Atık', 'Su', 'Malzeme', 'Proses'],
            datasets: [{
                label: 'Emisyon (kg CO2e)',
                data: [
                    emissionData.energy || 0,
                    emissionData.transport || 0,
                    emissionData.waste || 0,
                    emissionData.water || 0,
                    emissionData.materials || 0,
                    emissionData.process || 0
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#1B5E20',
                        font: {
                            size: 12 // Grafik etiketlerinin yazı boyutu küçültüldü
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw.toFixed(2) + ' kg CO2e';
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function downloadReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));

    doc.setFontSize(16);
    doc.text('Karbon Salınım Etiketi Raporu', 10, 10);
    doc.setFontSize(12);
    doc.text(`Ürün Adı: ${storedData.productName}`, 10, 20);
    doc.text(`Vergi Numarası: ${storedData.vergiNo}`, 10, 30);
    doc.text(`Toplam Karbon Salınım Miktarı: ${storedData.carbonFootprint}`, 10, 40);
    doc.text(`Seri Numarası: ${storedData.serialNumber}`, 10, 50);
    doc.text(`Karbon Emisyon Etiketi: ${storedData.emissionLabel}`, 10, 60);
    doc.text('Emisyon Dağılımı (kg CO2e):', 10, 70);
    doc.text(`Enerji: ${storedData.emissionData.energy.toFixed(2)}`, 10, 80);
    doc.text(`Ulaşım: ${storedData.emissionData.transport.toFixed(2)}`, 10, 90);
    doc.text(`Atık: ${storedData.emissionData.waste.toFixed(2)}`, 10, 100);
    doc.text(`Su: ${storedData.emissionData.water.toFixed(2)}`, 10, 110);
    doc.text(`Malzeme: ${storedData.emissionData.materials.toFixed(2)}`, 10, 120);
    doc.text(`Proses: ${storedData.emissionData.process.toFixed(2)}`, 10, 130);

    doc.save('karbon-salinim-raporu.pdf');
}

function getEnergyCoefficient(id) {
    const coefficients = {
        'coal-electricity': 0.95,        // kg CO2e/kWh
        'natural-gas-electricity': 0.43, // kg CO2e/kWh
        'nuclear-electricity': 0.012,    // kg CO2e/kWh
        'hydro-electricity': 0.024,      // kg CO2e/kWh
        'wind-electricity': 0.011,       // kg CO2e/kWh
        'solar-electricity': 0.045,      // kg CO2e/kWh
        'biomass-electricity': 0.23,     // kg CO2e/kWh
        'natural-gas-consumption': 1.89, // kg CO2e/m3
        'gasoline-consumption': 2.31,    // kg CO2e/litre
        'diesel-consumption': 2.68,      // kg CO2e/litre
        'lpg-consumption': 1.51,         // kg CO2e/litre
        'motorin-consumption': 2.68,     // kg CO2e/litre
        'coal-consumption': 2.4,         // kg CO2e/kg
        'fuel-oil-consumption': 3.1,     // kg CO2e/kg
        'mazot-consumption': 3.1         // kg CO2e/kg
    };
    return coefficients[id] || 0;
}

function getTransportCoefficient(id) {
    const coefficients = {
        'company-gasoline-cars': 0.18,   // kg CO2e/km
        'company-diesel-cars': 0.16,     // kg CO2e/km
        'company-lpg-cars': 0.14,        // kg CO2e/km
        'company-electric-cars': 0.05,   // kg CO2e/km
        'company-hybrid-cars': 0.09,     // kg CO2e/km
        'personal-car-usage': 0.18,      // kg CO2e/km
        'public-transport-usage': 0.04,  // kg CO2e/km
        'bicycle-usage': 0,              // kg CO2e/km
        'walking-distance': 0,           // kg CO2e/km
        'short-flights': 90,             // kg CO2e/uçuş
        'medium-flights': 150,           // kg CO2e/uçuş
        'long-flights': 250              // kg CO2e/uçuş
    };
    return coefficients[id] || 0;
}

function getWasteCoefficient(id) {
    const coefficients = {
        'composting': 0.02,              // kg CO2e/kg
        'landfilling': 0.5,              // kg CO2e/kg
        'incineration': 0.8,             // kg CO2e/kg
        'paper-recycling': 0.05,         // kg CO2e/kg
        'plastic-recycling': 0.1,        // kg CO2e/kg
        'glass-recycling': 0.03,         // kg CO2e/kg
        'metal-recycling': 0.02          // kg CO2e/kg
    };
    return coefficients[id] || 0;
}

function getWaterCoefficient(id) {
    const coefficients = {
        'drinking-water': 0.0003,        // kg CO2e/litre
        'process-water': 0.0005,         // kg CO2e/litre
        'waste-water-treatment': 0.0007  // kg CO2e/litre
    };
    return coefficients[id] || 0;
}

function getMaterialsCoefficient(id) {
    const coefficients = {
        'steel-production': 1.8,         // kg CO2e/kg
        'aluminium-production': 11,      // kg CO2e/kg
        'cement-production': 0.9,        // kg CO2e/kg
        'paper-production': 1.1,         // kg CO2e/kg
        'road-transport': 0.1,           // kg CO2e/km
        'sea-transport': 0.02,           // kg CO2e/km
        'air-transport': 0.6             // kg CO2e/km
    };
    return coefficients[id] || 0;
}

function getProcessCoefficient(id) {
    const coefficients = {
        'ammonia-production': 1.6,       // kg CO2e/kg
        'nitric-acid-production': 2.7,   // kg CO2e/kg
        'adipic-acid-production': 3.0,   // kg CO2e/kg
        'iron-steel-production': 1.8,    // kg CO2e/kg
        'cement-production-industrial': 0.9, // kg CO2e/kg
        'ceramic-production': 0.6,       // kg CO2e/kg
        'glass-production': 0.8,         // kg CO2e/kg
        'chemical-production': 1.5       // kg CO2e/kg
    };
    return coefficients[id] || 0;
}