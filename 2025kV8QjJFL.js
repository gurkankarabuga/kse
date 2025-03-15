document.addEventListener('DOMContentLoaded', function() {
    const serialNumberInput = document.getElementById('serial-number-input').value;
    const resultContainer = document.getElementById('result-container');

    if (serialNumberInput === '2025kV8QjJFL') {
        document.getElementById('company-name').innerText = 'KSE İçecekleri A.Ş';
        document.getElementById('product-quantity').innerText = '1.500.000';
        document.getElementById('product-name').innerText = 'Kutu İçecek';
        document.getElementById('carbon-result').innerText = '11.70 kg CO2e';
        document.getElementById('serial-number').innerText = '2025kV8QjJFL';
        document.getElementById('emission-label').innerText = 'B';
        resultContainer.style.display = 'block';
    } else {
        alert('Geçersiz Seri Numarası');
        resultContainer.style.display = 'none';
    }
});