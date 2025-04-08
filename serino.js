function verifySerialNumber() {
    const serialNumberInput = document.getElementById('serial-number-input').value;
    const resultContainer = document.getElementById('result-container');
    
    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));

    if (storedData && serialNumberInput === storedData.serialNumber) {
        document.getElementById('product-name').innerText = storedData.productName;
        document.getElementById('carbon-result').innerText = storedData.carbonFootprint;
        document.getElementById('serial-number').innerText = storedData.serialNumber;
        document.getElementById('emission-label').innerText = storedData.emissionLabel;
        resultContainer.style.display = 'block';
    } else {
        alert('Geçersiz Seri Numarası');
        resultContainer.style.display = 'none';
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.classList.toggle('active');
    } else {
        console.error('Menü elementi bulunamadı!');
    }
}
