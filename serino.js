function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = 'none';
    }
}

function verifySerialNumber() {
    const serialNumberInput = document.getElementById('serial-number-input').value;
    const resultContainer = document.getElementById('result-panel');
    
    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));

    if (storedData && serialNumberInput === storedData.serialNumber) {
        document.getElementById('product-name').innerText = storedData.productName;
        document.getElementById('carbon-result').innerText = `${storedData.carbonFootprint} kg CO2e/${storedData.productUnit}`;
        document.getElementById('serial-number').innerText = storedData.serialNumber;
        document.getElementById('emission-label').innerText = storedData.emissionLabel;
        resultContainer.style.display = 'flex';

        const updatedEmission = parseFloat(storedData.carbonFootprint);
        const emissionData = storedData.emissionData;
        const productUnit = storedData.productUnit;
        const totalCarbonFootprint = parseFloat(storedData.totalCarbonFootprint);

        const ctx = document.getElementById('simple-emission-chart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Enerji', 'Ulaşım', 'Atık', 'Su', 'Malzeme', 'Proses'],
                datasets: [{
                    label: `Emisyon (kg CO2e/${productUnit})`,
                    data: [
                        (emissionData.energy / parseFloat(storedData.totalCarbonFootprint)) * totalCarbonFootprint || 0,
                        (emissionData.transport / parseFloat(storedData.totalCarbonFootprint)) * totalCarbonFootprint || 0,
                        (emissionData.waste / parseFloat(storedData.totalCarbonFootprint)) * totalCarbonFootprint || 0,
                        (emissionData.water / parseFloat(storedData.totalCarbonFootprint)) * totalCarbonFootprint || 0,
                        (emissionData.materials / parseFloat(storedData.totalCarbonFootprint)) * totalCarbonFootprint || 0,
                        (emissionData.process / parseFloat(storedData.totalCarbonFootprint)) * totalCarbonFootprint || 0
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
    } else {
        alert('Geçersiz Seri Numarası');
        resultContainer.style.display = 'none';
    }
}