function verifySerialNumber() {
    const serialNumberInput = document.getElementById('serial-number-input').value;
    const resultContainer = document.getElementById('result-container');
    
    // LocalStorage'dan veriyi al
    const storedData = JSON.parse(localStorage.getItem('carbonEmissionData'));

    if (storedData && serialNumberInput === storedData.serialNumber) {
        // Veriler eşleşirse bilgileri göster
        document.getElementById('product-name').innerText = storedData.productName; // Ürün adını ekledik
        document.getElementById('carbon-result').innerText = storedData.carbonFootprint;
        document.getElementById('serial-number').innerText = storedData.serialNumber;
        document.getElementById('emission-label').innerText = storedData.emissionLabel;
        resultContainer.style.display = 'block';
    } else {
        alert('Geçersiz Seri Numarası');
        resultContainer.style.display = 'none';
    }
}
