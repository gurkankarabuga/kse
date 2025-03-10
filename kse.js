function calculateEnergy() {
    // Elektrik tüketimi
    let coalElectricity = parseFloat(document.getElementById('coal-electricity').value) || 0;
    let naturalGasElectricity = parseFloat(document.getElementById('natural-gas-electricity').value) || 0;
    let nuclearElectricity = parseFloat(document.getElementById('nuclear-electricity').value) || 0;
    let hydroElectricity = parseFloat(document.getElementById('hydro-electricity').value) || 0;
    let windElectricity = parseFloat(document.getElementById('wind-electricity').value) || 0;
    let solarElectricity = parseFloat(document.getElementById('solar-electricity').value) || 0;
    let biomassElectricity = parseFloat(document.getElementById('biomass-electricity').value) || 0;

    // Doğal gaz tüketimi
    let naturalGasConsumption = parseFloat(document.getElementById('natural-gas-consumption').value) || 0;

    // Likit yakıtlar
    let gasolineConsumption = parseFloat(document.getElementById('gasoline-consumption').value) || 0;
    let dieselConsumption = parseFloat(document.getElementById('diesel-consumption').value) || 0;
    let lpgConsumption = parseFloat(document.getElementById('lpg-consumption').value) || 0;
    let motorinConsumption = parseFloat(document.getElementById('motorin-consumption').value) || 0;

    // Diğer fosil yakıtlar
    let coalConsumption = parseFloat(document.getElementById('coal-consumption').value) || 0;
    let fuelOilConsumption = parseFloat(document.getElementById('fuel-oil-consumption').value) || 0;
    let mazotConsumption = parseFloat(document.getElementById('mazot-consumption').value) || 0;

    // Karbon ayak izi hesaplama (basit bir örnek)
    let carbonFootprint = (coalElectricity + naturalGasElectricity + nuclearElectricity + hydroElectricity + windElectricity + solarElectricity + biomassElectricity) * 0.5 + 
                          naturalGasConsumption * 2.75 + 
                          (gasolineConsumption + dieselConsumption + lpgConsumption + motorinConsumption) * 2.3 + 
                          (coalConsumption + fuelOilConsumption + mazotConsumption) * 2.5;

    alert('Toplam Karbon Salınım Miktarı: ' + carbonFootprint.toFixed(2) + ' kg CO2e');
}

function calculateTransport() {
    // Ulaşım
    let companyGasolineCars = parseFloat(document.getElementById('company-gasoline-cars').value) || 0;
    let companyDieselCars = parseFloat(document.getElementById('company-diesel-cars').value) || 0;
    let companyLpgCars = parseFloat(document.getElementById('company-lpg-cars').value) || 0;
    let companyElectricCars = parseFloat(document.getElementById('company-electric-cars').value) || 0;
    let companyHybridCars = parseFloat(document.getElementById('company-hybrid-cars').value) || 0;
    let personalCarUsage = parseFloat(document.getElementById('personal-car-usage').value) || 0;
    let publicTransportUsage = parseFloat(document.getElementById('public-transport-usage').value) || 0;
    let bicycleUsage = parseFloat(document.getElementById('bicycle-usage').value) || 0;
    let walkingDistance = parseFloat(document.getElementById('walking-distance').value) || 0;
    let shortFlights = parseFloat(document.getElementById('short-flights').value) || 0;
    let mediumFlights = parseFloat(document.getElementById('medium-flights').value) || 0;
    let longFlights = parseFloat(document.getElementById('long-flights').value) || 0;

    // Karbon ayak izi hesaplama (basit bir örnek)
    let carbonFootprint = (companyGasolineCars + personalCarUsage) * 2.3 + 
                          (companyDieselCars + companyLpgCars) * 2.6 + 
                          companyElectricCars * 0.5 + 
                          companyHybridCars * 1.5 + 
                          publicTransportUsage * 0.1 + 
                          shortFlights * 250 + 
                          mediumFlights * 500 + 
                          longFlights * 1000;

    alert('Toplam Karbon Salınım Miktarı: ' + carbonFootprint.toFixed(2) + ' kg CO2e');
}

function calculateWaste() {
    // Atık yönetimi
    let composting = parseFloat(document.getElementById('composting').value) || 0;
    let landfilling = parseFloat(document.getElementById('landfilling').value) || 0;
    let incineration = parseFloat(document.getElementById('incineration').value) || 0;
    let paperRecycling = parseFloat(document.getElementById('paper-recycling').value) || 0;
    let plasticRecycling = parseFloat(document.getElementById('plastic-recycling').value) || 0;
    let glassRecycling = parseFloat(document.getElementById('glass-recycling').value) || 0;
    let metalRecycling = parseFloat(document.getElementById('metal-recycling').value) || 0;

    // Karbon ayak izi hesaplama (basit bir örnek)
    let carbonFootprint = landfilling * 2.5 + 
                          incineration * 3.0 + 
                          (paperRecycling + plasticRecycling + glassRecycling + metalRecycling) * 0.1;

    alert('Toplam Karbon Salınım Miktarı: ' + carbonFootprint.toFixed(2) + ' kg CO2e');
}

function calculateWater() {
    // Su tüketimi ve atık su
    let drinkingWater = parseFloat(document.getElementById('drinking-water').value) || 0;
    let processWater = parseFloat(document.getElementById('process-water').value) || 0;
    let wasteWaterTreatment = parseFloat(document.getElementById('waste-water-treatment').value) || 0;

    // Karbon ayak izi hesaplama (basit bir örnek)
    let carbonFootprint = (drinkingWater + processWater) * 0.5 + 
                          wasteWaterTreatment * 0.2;

    alert('Toplam Karbon Salınım Miktarı: ' + carbonFootprint.toFixed(2) + ' kg CO2e');
}

function calculateMaterials() {
    // Hammadde ve malzeme kullanımı
    let steelProduction = parseFloat(document.getElementById('steel-production').value) || 0;
    let aluminiumProduction = parseFloat(document.getElementById('aluminium-production').value) || 0;
    let cementProduction = parseFloat(document.getElementById('cement-production').value) || 0;
    let paperProduction = parseFloat(document.getElementById('paper-production').value) || 0;
    let roadTransport = parseFloat(document.getElementById('road-transport').value) || 0;
    let seaTransport = parseFloat(document.getElementById('sea-transport').value) || 0;
    let airTransport = parseFloat(document.getElementById('air-transport').value) || 0;

    // Karbon ayak izi hesaplama (basit bir örnek)
    let carbonFootprint = steelProduction * 1.9 + 
                          aluminiumProduction * 1.5 + 
                          cementProduction * 1.1 + 
                          paperProduction * 0.5 + 
                          roadTransport * 2.3 + 
                          seaTransport * 1.2 + 
                          airTransport * 3.5;

    document('Toplam Karbon Salınım Miktarı: ' + carbonFootprint.toFixed(2) + ' kg CO2e');
}

function calculateProcess() {
    // İşlemler ve proses emisyonları
    let ammoniaProduction = parseFloat(document.getElementById('ammonia-production').value) || 0;
    let nitricAcidProduction = parseFloat(document.getElementById('nitric-acid-production').value) || 0;
    let adipicAcidProduction = parseFloat(document.getElementById('adipic-acid-production').value) || 0;
    let ironSteelProduction = parseFloat(document.getElementById('iron-steel-production').value) || 0;
    let cementProductionIndustrial = parseFloat(document.getElementById('cement-production-industrial').value) || 0;
    let ceramicProduction = parseFloat(document.getElementById('ceramic-production').value) || 0;
    let glassProduction = parseFloat(document.getElementById('glass-production').value) || 0;
    let chemicalProduction = parseFloat(document.getElementById('chemical-production').value) || 0;

    // Karbon ayak izi hesaplama (basit bir örnek)
    let carbonFootprint = ammoniaProduction * 1.8 + 
                          nitricAcidProduction * 1.7 + 
                          adipicAcidProduction * 1.6 + 
                          ironSteelProduction * 1.9 + 
                          cementProductionIndustrial * 1.1 + 
                          ceramicProduction * 1.2 + 
                          glassProduction * 1.3 + 
                          chemicalProduction * 1.5;

    alert('Toplam Karbon Salınım Miktarı: ' + carbonFootprint.toFixed(2) + ' kg CO2e');
}
