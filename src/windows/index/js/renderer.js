import './../../../style.css';
import nav from './../../../modules/nav.mjs'
import weather from './../../../modules/weather.mjs'
import currency from './../../../modules/currency.mjs'
import eventsCalendar from './../../../modules/eventsCalendar.mjs'
import tasks from './../../../modules/tasks.mjs'
import {tasksData} from'./data.mjs'
import log from 'electron-log/renderer';

import { swiffyslider } from 'swiffy-slider'
import "swiffy-slider/css"

nav();
weather();
currency();
eventsCalendar();
tasks(tasksData)

log.info(`This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`);
const updateImageHeights = () =>{
  const slider = document.querySelector('.slider-container');
  const sliderImages = slider.querySelectorAll('[newCardCarusel="img"]');
  const sliderHeight = slider.offsetHeight; // Получаем высоту родителя
  
  sliderImages.forEach((img) => {
    img.style.height = sliderHeight + 'px'; // Устанавливаем высоту для каждого изображения
  });
}

window.addEventListener("load", () => {
  swiffyslider.init();
  //fix height img slider
  updateImageHeights();

  document.querySelector('[calculatorOpen]').addEventListener('click', () => {
    window.api.calculatorOpen();
  })
  document.querySelector('[obsidianOpen]').addEventListener('click', () => {
    window.api.ObsidianOpen();
  })
  document.querySelector('[executionScript]').addEventListener('click', () => {
    window.api.executionScript();
  })
});

window.addEventListener('resize', () => {
  updateImageHeights();
});

// Call Dialog 
// electrondialog.openDialog('showOpenDialog', {
//   title: 'Выберите файл',
//   buttonLabel: 'Сохранить',
//   properties: ['openFile']
// }).then(result => console.log(result));


// Notification
// api.send({
//   title: "Адам Веб",
//   body : "Добрый день",
// })

// window.local.page('userCards.html');

