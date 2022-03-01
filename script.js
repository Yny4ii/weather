const link = "http://api.weatherstack.com/current?access_key=a96e19761603d5344e2b41560963b0db";

const root = document.getElementById('root');
const popUp = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');
const closeButton = document.getElementById('close');

let store = {
    city: "Ukraine",
    observationTime: "00:00 AM",
    isDay: "yes",
    description: "",
    properties: {
        cloudCover: {},
        humidity: {},
        pressure: {},
        uvIndex: {},
        visibility: {},
        windSpeed: {},
    }
}


const fetchData = async () => {
    try {
        const result = await fetch(`${link}&query=${store.city}`);
        const data = await result.json();
        const {
            current: {
                cloudcover: cloudCover,
                temperature,
                observation_time: observationTime,
                pressure,
                humidity,
                visibility,
                weather_descriptions: description,
                uv_index: uvIndex,
                is_day: isDay,
                wind_speed: windSpeed,

            }
        } = data;
        store = {
            ...store,
            temperature,
            observationTime,
            description: description[0],

            properties: {
                cloudCover: {
                    title: 'cloud cover',
                    value: `${cloudCover}%`,
                    icon: 'cloud.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity}%`,
                    icon: 'humidity.png'
                },
                windSpeed: {
                    title: 'wind speed',
                    value: `${windSpeed} km/h`,
                    icon: 'wind.png'
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure}`,
                    icon: 'gauge.png'
                }, uvIndex: {
                    title: 'uv index',
                    value: `${uvIndex}`,
                    icon: 'uv-index.png'
                }, visibility: {
                    title: 'visibility',
                    value: `${visibility}`,
                    icon: 'visibility.png'
                },
            },
        }
        ;
        renderComponent();
    } catch (err) {
        console.log(err)
    }
};
const getImage = (description) => {
    const value = description.toString().toLowerCase();

    switch (value) {
        case "partly cloudy":
            return "partly.png";
        case "fog":
            return "fog.png";
        case "sunny":
            return "sunny.png";
        case "cloud":
            return "cloud.png";
        default:
            return "the.png";
    }
};


const renderProperty = (properties) => {
    return Object.values(properties).map(({title, value, icon}) => {
        console.log(value)
        return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    }).join("");
}


const markup = () => {
    const {city, description, observationTime, temperature, isDay, properties} = store;

    const containerClass = isDay === 'yes' ? "is-day" : "";

    return `<div class="container ${containerClass}">
        <div class="top">
            <div class="city">
                <div class="city-subtitle">Weather today</div>
                <div class="city-title" id="city">
                    <span>${city}</span>
                </div>
            </div>
            <div class="city-info">
                <div class="top-left">
                    <img class="icon" src="./img/${getImage(description)}" alt=""/>
                    <div class="description">${description}</div>
                </div>

                <div class="top-right">
                    <div class="city-info__subtitle">as of ${observationTime}</div>
                    <div class="city-info__title">${temperature}°</div>
                </div>
            </div>
        </div>
        <div id="properties">${renderProperty(properties)}</div>
    </div>`

}
const toggleClass = () => {
    popUp.classList.toggle("active");
};

const renderComponent = () => {
    root.innerHTML = markup();
    const city = document.getElementById("city");
    city.addEventListener("click", toggleClass);
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value
    };
};

const handleSubmit = (e) => {
    e.preventDefault();
    if(!store.city) return null;
    fetchData();
    toggleClass();
}

const handleClose = () =>{
    toggleClass();
}
form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);
closeButton.addEventListener('click', handleClose);


fetchData();