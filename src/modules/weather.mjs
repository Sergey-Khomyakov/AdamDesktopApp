import clouds from '../assets/weather/Cloud.svg';
import cloudsRain from '../assets/weather/CloudRain.svg';
import cloudsSnow from '../assets/weather/CloudSnow.svg';
import cloudsSun from '../assets/weather/Sun.svg';
import cloudsLightning from '../assets/weather/CloudLightning.svg';
import cloudsDrizzle from '../assets/weather/CloudRain.svg';
import cloudsFog from '../assets/weather/CloudFog.svg';

export default function() {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const data = await window.api.weather();
            if(data !== undefined) {
                const weatherWidget = document.querySelector('[weatherWidget]');
                const weatherWidgetIcon = weatherWidget.querySelector('[weatherWidget="icon"]');
                const weatherWidgetTemp = weatherWidget.querySelector('[weatherWidget="temp"]');
                const weatherWidgetTitle = weatherWidget.querySelector('[weatherWidget="title"]');
                const weatherWidgetCity = weatherWidget.querySelector('[weatherWidget="city"]');
                let city = "Москва";
                let weatherTitle = "";
                let icon = "";
                if(data.weather[0].main === "Clouds") {
                    weatherTitle = "Облачно";
                    icon = clouds;
                } else if(data.weather[0].main === "Rain") {
                    weatherTitle = "Дождь";
                    icon = cloudsRain;
                } else if(data.weather[0].main === "Snow") {
                    weatherTitle = "Снег";
                    icon = cloudsSnow;
                } else if(data.weather[0].main === "Clear") {
                    weatherTitle = "Ясно";
                    icon = cloudsSun;
                } else if(data.weather[0].main === "Drizzle") {
                    weatherTitle = "Дождь";
                    icon = cloudsDrizzle;
                } else if(data.weather[0].main === "Thunderstorm") {
                    weatherTitle = "Гроза";
                    icon = cloudsLightning;
                } else if(data.weather[0].main === "Mist") {
                    weatherTitle = "Туман";
                    icon = cloudsFog;
                }
                weatherWidgetIcon.src = icon;
                weatherWidgetIcon.append(icon);
                weatherWidgetTemp.textContent = `${Math.round(data.main.temp)} °C`;
                weatherWidgetTitle.textContent = weatherTitle;
                weatherWidgetCity.textContent = city;
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    });
}