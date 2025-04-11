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
    const productUnit = document.getElementById('product-unit').value;
    const productQuantity = parseFloat(document.getElementById('product-quantity').value) || 0.001;
    const vergiNo = localStorage.getItem('vergiNo');

    if (!productName || productQuantity <= 0) {
        alert('Lütfen geçerli bir ürün adı ve miktar giriniz.');
        return;
    }

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
        emissionData.energy += value * getEnergyCoefficient(input.id, productUnit);
    });

    // Ulaşım Hesaplaması
    const transportInputs = transportForm.querySelectorAll('input[type="number"]');
    transportInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.transport += value * getTransportCoefficient(input.id, productUnit);
    });

    // Atık Yönetimi Hesaplaması
    const wasteInputs = wasteForm.querySelectorAll('input[type="number"]');
    wasteInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.waste += value * getWasteCoefficient(input.id, productUnit);
    });

    // Su Tüketimi ve Atık Su Hesaplaması
    const waterInputs = waterForm.querySelectorAll('input[type="number"]');
    waterInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.water += value * getWaterCoefficient(input.id, productUnit);
    });

    // Hammadde ve Malzeme Kullanımı Hesaplaması
    const materialsInputs = materialsForm.querySelectorAll('input[type="number"]');
    materialsInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.materials += value * getMaterialsCoefficient(input.id, productUnit);
    });

    // İşlemler ve Proses Emisyonları Hesaplaması
    const processInputs = processForm.querySelectorAll('input[type="number"]');
    processInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        emissionData.process += value * getProcessCoefficient(input.id, productUnit);
    });

    // Toplam karbon ayak izi
    let totalCarbonFootprint = emissionData.energy + emissionData.transport + emissionData.waste + emissionData.water + emissionData.materials + emissionData.process;

    // Birim başına karbon ayak izi hesaplaması
    let carbonFootprintPerUnit = totalCarbonFootprint / productQuantity;

    // Karbon Emisyon Etiketi Belirleme
    let emissionLabel = '';
    const labelThresholds = productUnit === 'kg' ? {
        'A++': 0.5,
        'A+': 1.0,
        'A': 1.5,
        'B': 2.0,
        'C': 2.5
    } : {
        'A++': 0.4,
        'A+': 0.8,
        'A': 1.2,
        'B': 1.6,
        'C': 2.0
    };

    if (carbonFootprintPerUnit <= labelThresholds['A++']) {
        emissionLabel = 'A++';
    } else if (carbonFootprintPerUnit <= labelThresholds['A+']) {
        emissionLabel = 'A+';
    } else if (carbonFootprintPerUnit <= labelThresholds['A']) {
        emissionLabel = 'A';
    } else if (carbonFootprintPerUnit <= labelThresholds['B']) {
        emissionLabel = 'B';
    } else if (carbonFootprintPerUnit <= labelThresholds['C']) {
        emissionLabel = 'C';
    } else {
        emissionLabel = 'D';
    }

    // Seri numarası oluştur
    const serialNumber = generateSerialNumber();

    // Sonuçları LocalStorage'a kaydet
    const resultData = {
        productName: productName,
        productUnit: productUnit,
        carbonFootprint: carbonFootprintPerUnit.toFixed(4),
        totalCarbonFootprint: totalCarbonFootprint.toFixed(4),
        serialNumber: serialNumber,
        emissionLabel: emissionLabel,
        emissionData: emissionData,
        vergiNo: vergiNo
    };
    localStorage.setItem('carbonEmissionData', JSON.stringify(resultData));

    // Sonuçları Göster
    document.getElementById('product-name-result').innerText = productName;
    document.getElementById('vergi-no-result').innerText = vergiNo;
    document.getElementById('carbon-result').innerText = `${carbonFootprintPerUnit.toFixed(4)} kg CO2e/${productUnit}`;
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
                label: `Emisyon (kg CO2e/${productUnit})`,
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
                            size: 12
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
                            label += context.raw.toFixed(4) + ` kg CO2e/${productUnit}`;
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
    doc.text(`Toplam Karbon Salınım Miktarı: ${storedData.carbonFootprint} kg CO2e/${storedData.productUnit}`, 10, 40);
    doc.text(`Seri Numarası: ${storedData.serialNumber}`, 10, 50);
    doc.text(`Karbon Emisyon Etiketi: ${storedData.emissionLabel}`, 10, 60);
    doc.text('Emisyon Dağılımı (kg CO2e):', 10, 70);
    doc.text(`Enerji: ${storedData.emissionData.energy.toFixed(4)}`, 10, 80);
    doc.text(`Ulaşım: ${storedData.emissionData.transport.toFixed(4)}`, 10, 90);
    doc.text(`Atık: ${storedData.emissionData.waste.toFixed(4)}`, 10, 100);
    doc.text(`Su: ${storedData.emissionData.water.toFixed(4)}`, 10, 110);
    doc.text(`Malzeme: ${storedData.emissionData.materials.toFixed(4)}`, 10, 120);
    doc.text(`Proses: ${storedData.emissionData.process.toFixed(4)}`, 10, 130);

    doc.save('karbon-salinim-raporu.pdf');
}

function getEnergyCoefficient(id, unit) {
    const baseCoefficients = {
        'coal-electricity': 0.90,
        'natural-gas-electricity': 0.40,
        'nuclear-electricity': 0.01,
        'hydro-electricity': 0.02,
        'wind-electricity': 0.01,
        'solar-electricity': 0.04,
        'biomass-electricity': 0.20,
        'natural-gas-consumption': 1.85,
        'gasoline-consumption': 2.30,
        'diesel-consumption': 2.65,
        'lpg-consumption': 1.50,
        'motorin-consumption': 2.65,
        'coal-consumption': 2.35,
        'fuel-oil-consumption': 3.05,
        'mazot-consumption': 3.05
    };
    const scaleFactor = unit === 'kg' ? 1 : 0.8;
    return (baseCoefficients[id] || 0) * scaleFactor;
}

function getTransportCoefficient(id, unit) {
    const baseCoefficients = {
        'company-gasoline-cars': 0.17,
        'company-diesel-cars': 0.15,
        'company-lpg-cars': 0.13,
        'company-electric-cars': 0.04,
        'company-hybrid-cars': 0.08,
        'personal-car-usage': 0.17,
        'public-transport-usage': 0.03,
        'bicycle-usage': 0,
        'walking-distance': 0,
        'short-flights': 85,
        'medium-flights': 140,
        'long-flights': 240
    };
    const scaleFactor = unit === 'kg' ? 1 : 0.8;
    return (baseCoefficients[id] || 0) * scaleFactor;
}

function getWasteCoefficient(id, unit) {
    const baseCoefficients = {
        'composting': 0.01,
        'landfilling': 0.45,
        'incineration': 0.75,
        'paper-recycling': 0.04,
        'plastic-recycling': 0.09,
        'glass-recycling': 0.02,
        'metal-recycling': 0.01
    };
    const scaleFactor = unit === 'kg' ? 1 : 0.8;
    return (baseCoefficients[id] || 0) * scaleFactor;
}

function getWaterCoefficient(id, unit) {
    const baseCoefficients = {
        'drinking-water': 0.0002,
        'process-water': 0.0004,
        'waste-water-treatment': 0.0006
    };
    const scaleFactor = unit === 'kg' ? 1 : 0.8;
    return (baseCoefficients[id] || 0) * scaleFactor;
}

function getMaterialsCoefficient(id, unit) {
    const baseCoefficients = {
        'steel-production': 1.7,
        'aluminium-production': 10.5,
        'cement-production': 0.85,
        'paper-production': 1.0,
        'road-transport': 0.09,
        'sea-transport': 0.01,
        'air-transport': 0.55
    };
    const scaleFactor = unit === 'kg' ? 1 : 0.8;
    return (baseCoefficients[id] || 0) * scaleFactor;
}

function getProcessCoefficient(id, unit) {
    const baseCoefficients = {
        'ammonia-production': 1.5,
        'nitric-acid-production': 2.6,
        'adipic-acid-production': 2.9,
        'iron-steel-production': 1.7,
        'cement-production-industrial': 0.85,
        'ceramic-production': 0.55,
        'glass-production': 0.75,
        'chemical-production': 1.4
    };
    const scaleFactor = unit === 'kg' ? 1 : 0.8;
    return (baseCoefficients[id] || 0) * scaleFactor;
}