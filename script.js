document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});

function fetchData() {
    fetch('https://waterdatafortexas.org/reservoirs/basin/rio-grande/recent-conditions.geojson', {
         mode: 'no-cors'
    }) // Replace with the actual data source URL
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayPercentageFull(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('dataContainer').textContent = 'Failed to load data.';
    });
}

function displayPercentageFull(data) {
    let combinedCapacity = 0;
    let combinedStorage = 0;

    // Filter data to only include Amistad and Falcon reservoirs
    data.features.filter(feature => feature.properties.short_name === 'Amistad' || feature.properties.short_name === 'Falcon')
        .forEach(feature => {
            let capacity = feature.properties.conservation_capacity;
            let storage = feature.properties.conservation_storage;

            // Add to combined capacity and storage
            combinedCapacity += capacity;
            combinedStorage += storage;
        });

    // Calculate combined percentage full
    let combinedPercentageFull = (combinedStorage / combinedCapacity * 100).toFixed(1);

    // Prepare and update the content in the HTML
    const content = `<div><h1>Reservoir Fill Levels</h1><p>Combined Reservoirs (Amistad and Falcon) are ${combinedPercentageFull}% full.</p></div>`;
    document.getElementById('dataContainer').innerHTML = content;
}
