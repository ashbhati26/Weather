const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const loadingContainer = document.querySelector('.loading-container');

// Default city when the page loads
let cityInput = "New Delhi";

// Add click event listeners to each city in the panel
cities.forEach((city) => { 
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0"; // Hide the app while loading
    });
});

form.addEventListener('submit',(e) => {
    if (search.value.length === 0) {
        alert("Please type in a city name");
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0"; // Hide the app while loading
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year){
    const weekday = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

function fetchWeatherData(){
    loadingContainer.style.display = 'block'; // Show loading circle

    fetch(`https://api.weatherapi.com/v1/current.json?key=daf73d61d8064274b43181748242202&q=${cityInput}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('City not found');
        }
        return response.json();
    })
    .then(data => {
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;
        const date = new Date(data.location.localtime);
        const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        const dayOfMonth = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day} ${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}/${month < 10 ? '0' + month : month}/${year}`;
        dateOutput.innerHTML = formattedDate;
        timeOutput.innerHTML = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        nameOutput.innerHTML = data.location.name;
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        // Hide loading circle after data is fetched
        loadingContainer.style.display = 'none';

        let timeOfDay = "day";
        const code = data.current.condition.code;

        if (!data.current.is_day) {
            timeOfDay = "night";
        }
        // Set background and button color based on weather code
        // (Assuming you have corresponding images in your folder)
        if (code == 1000) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = '#fa6d1b';
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            if (timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
        } else {
            app.style.backgroundImage = `url(./images/${timeOfDay}/snow.jpg)`;
            btn.style.background = "#4d72aa";
            if (timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            }
        }
        
        // Show the app after data is fetched
        app.style.opacity = "1";
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);

        // Hide loading circle in case of error
        loadingContainer.style.display = 'none';

        // Show the app again
        app.style.opacity = "1";

        // Alert for specific error
        if (error.message === 'City not found') {
            alert('City not found, please try again');
        } else {
            // Generic error message
            alert('An error occurred, please try again');
        }
    });
}

// Call fetchWeatherData initially
fetchWeatherData();