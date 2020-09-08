const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div');

car.classList.add('car');

// Объект для управления автомобилем
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

// Объект для статуса игры, подсчета очков и остановки игры
const settings = {
  start: false,
  score: 0,
  speed: 3,
};

function startGame() {
  start.classList.add('hide');
  // Меняем статус игры в объекте
  settings.start = true;
  // Добавляем машину
  gameArea.append(car);
  // Специальная функция в js для анимации
  requestAnimationFrame(playGame);
}

function playGame() {
  console.log('Play game!');
  // Делаем рекурсию, чтобы движения были плавными
  if(settings.start) {
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  event.preventDefault();
  // Если нажали вправо, наш автомобиль и поедет вправо
  keys[event.key] = true;
}
function stopRun(event) {
  event.preventDefault();
  // Когда отпускаем кнопку, автомобиль перестает ехать
  keys[event.key] = false;
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

