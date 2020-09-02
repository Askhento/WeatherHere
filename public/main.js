const mymap = L.map('mapid').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
}).addTo(mymap);


function getWeather() {
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async pos =>{
            //console.log(pos);
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            document.getElementById('lat').textContent = lat.toFixed(2);
            document.getElementById('lon').textContent = lon.toFixed(2);


            const data = {'lat' : lat, 'lon' : lon};

            const response = await fetch(`/weather/${lat},${lon}`, {
                body : JSON.stringify(data),
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'  
                }
            });
            const json = await response.json();

            console.log(json);
            const tempString = (parseFloat(json.weather.main.temp) - 273.5).toFixed(2) + "˚C";
            document.getElementById('temp').textContent = tempString;
            const locationName = json.weather.name;
            
            let popUpString = `Temp at ${locationName} is : ${tempString}\n`;

            const aqResults = json.aq.results;
            if(aqResults.length > 0) {
                console.log(aqResults[0]);
            }


            marker = L.marker([0, 0]).addTo(mymap).bindPopup(popUpString).openPopup();
            marker.setLatLng(data);
            mymap.setView([lat, lon], 15);


        });
    } 

}
