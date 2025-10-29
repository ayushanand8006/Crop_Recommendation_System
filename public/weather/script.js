const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const notFound = document.querySelector('.not-found');

searchButton.addEventListener('click', () => {
    const APIKey = '5aa2a7f358363fb09da262cecde29fde';  // Replace with your OpenWeatherMap API key
    const city = document.getElementById('search-btn').value;

    if (city === '') {
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                notFound.classList.add('active');
                return;
            }

            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');

            const temperature = document.querySelector('.temperature');
            const description = document.querySelector('.description');
            const humidity = document.querySelector('.humidity span');
            const wind = document.querySelector('.wind span');

            temperature.textContent = `${data.main.temp}°C`;
            description.textContent = data.weather[0].description;
            humidity.textContent = `${data.main.humidity }%`;
            wind.textContent = `${data.wind.speed} Km/h`;
        })
        .catch(error => console.error(error));
});