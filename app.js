// Определение погоды для текущей геолокации

window.addEventListener("load", () => {

  let long
  let lat
  const locationTimezone = document.querySelector('.location-timezone')
  const temperatureDegree = document.querySelector('.temperature-degree')
  const temperatureDescription = document.querySelector('.temperature-description')
  const degreeSection = document.querySelector('.degree-section')
  const degreeSectionSpan = degreeSection.querySelector('span')

  const iconID = 'icon1'
  //  Функция для установки анимированной иконки Skycons
  const setIcon = (iconID, icon) => {
    const skycons = new Skycons({ "color": "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase()
    skycons.play();
    skycons.set(iconID, Skycons[currentIcon]);
  }

  // Отображение температуры в шкалах Фарингейт или Цельсий
  const FaringateToCelsia = (temperature) => () => {
    if (degreeSectionSpan.textContent === "F") {
      const celsius = (temperature - 32) * (5 / 9)
      temperatureDegree.textContent = Math.round(celsius * 10) / 10
      degreeSectionSpan.textContent = "C"
    } else {
      temperatureDegree.textContent = temperature
      degreeSectionSpan.textContent = "F"
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition
      (position => {
        long = position.coords.longitude
        lat = position.coords.latitude
        const proxy = 'http://cors-anywhere.herokuapp.com/'
        const apiKey = "d3468954f0cad3701c3e8fcc75dcf5e2"
        const api = `${proxy}https://api.darksky.net/forecast/${apiKey}/${long},${lat}`

        fetch(api)
          .then(response => response.json())
          .then(data => {
            const timezone = data.timezone
            const { temperature, summary, icon } = data.currently
            locationTimezone.textContent = timezone
            temperatureDegree.textContent = temperature
            temperatureDescription.textContent = summary
            setIcon(iconID, icon) // Skycons иконка
            const handler = FaringateToCelsia(temperature) // замыкание
            degreeSection.addEventListener("click", handler) // формат 
          })
      })

  } else {
    h1.textContent = "Geolocation is not supported by this browser"
  }

}) // end window