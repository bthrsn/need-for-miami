// Сначала объявляются переменный для игры

// Объект для статуса игры, подсчета очков и остановки игры
const SETTINGS = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

// Максимальное количество встречных машин
const MAX_ENEMY = 7;

// Потом переменные с данными со страницы
const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      // Создаем машину
      car = document.createElement('div'),
      // Создаем музыкальное сопровождение
      audio = document.createElement('audio');

  car.classList.add('car');

  audio.src = 'audio.mp3';
  audio.volume = 0.5;
  // audio.type = 'audio/mp3';
  audio.style.cssText = `
    position: absolute;
    top: -1000px;
  `;

// Объект для управления автомобилем
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

// Функци вычисления количества полос на дороге
const getQuantityElements = (heightElement) =>  document.documentElement.clientHeight / heightElement + 1;

const startGame = () => {
  audio.play();
  start.classList.add('hide');

  // Цикл для создания линий на дороге
  for(let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * 100}px`;
    // Свойство y и его значение для функции движения полос
    line.y = i * 100;
    gameArea.append(line);
  }

  // Цикл для создания машин на дороге
  for (let i = 0; i < getQuantityElements(100 * SETTINGS.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY + 1);
    enemy.classList.add('enemy');
    enemy.y = -100 * SETTINGS.traffic * (i + 1);
    enemy.style.top = `${enemy.y}px`;
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    // В игру добавляем азные модели машинок
    enemy.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;

    gameArea.append(enemy);
  }

  // Меняем статус игры в объекте
  SETTINGS.start = true;

  // Добавляем машину
  gameArea.append(car);
  // Добавляем музыку
  gameArea.append(audio);

  // Для манипулирования css свойством left
  SETTINGS.x = car.offsetLeft;
  SETTINGS.y = car.offsetTop;

  // Специальная функция в js для анимации
  requestAnimationFrame(playGame);
}

// Функция для движения дороги
const moveRoad = () => {
  let lines = document.querySelectorAll('.line');
  lines.forEach(line=> {
    line.y += SETTINGS.speed;
    line.style.top = `${line.y}px`;
    
    // Возвращаем первые линии обратно
    if(line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  })
}

// Функция для создания других машин
const moveEnemy = () => {

  // Добавляем встречные машины на страницу
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    // Здесь объявим переменные, которые получают свойства размеров и позицию машин
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    // Условия для столкновения
    if  (carRect.top <= enemyRect.bottom && 
      carRect.right >= enemyRect.left && 
      carRect.left <= enemyRect.right && 
      carRect.bottom >= enemyRect.top) {
        SETTINGS.start = false;
        audio.pause();
        alert('CRASH!');    
      }

    item.y += SETTINGS.speed / 2;
    item.style.top = `${item.y}px`;

    // Возвращаем первые машины обратно
    if(item.y >= document.documentElement.clientHeight) {
      item.y = -100 * SETTINGS.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      // Делаем так, чтобы машинки постоянно менялись
      const randomEnemy = Math.floor(Math.random() * MAX_ENEMY + 1);
      item.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
    }
  });
};

const playGame = () => {
  // Делаем рекурсию, чтобы движения были плавными
  if(SETTINGS.start) {
    moveRoad();
    moveEnemy();

    // Условия дл передвижения машины
    if (keys.ArrowLeft && SETTINGS.x > 0) {
      SETTINGS.x -= SETTINGS.speed;
    }
    if (keys.ArrowRight  && SETTINGS.x < (gameArea.offsetWidth - car.offsetWidth)) {
      SETTINGS.x += SETTINGS.speed;
    }
    if (keys.ArrowDown  && SETTINGS.y < (gameArea.offsetHeight - car.offsetHeight)) {
      SETTINGS.y += SETTINGS.speed;
    }
    if (keys.ArrowUp && SETTINGS.y > 0) {
      SETTINGS.y -= SETTINGS.speed;
    }

    // Чтобы верхнее условие заработало - добавляем значение SETTINGS.x и y в стили
    car.style.left = `${SETTINGS.x}px`;
    car.style.top = `${SETTINGS.y}px`;
    requestAnimationFrame(playGame);
  }
}

const startRun = (event) => {
  // Условие, чтобы в объект keys не добавлялись новые свойства
  if(keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    // Если нажали вправо, наш автомобиль и поедет вправо
    keys[event.key] = true;  
  }
}

const stopRun = (event) => {
  if(keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    // Когда отпускаем кнопку, автомобиль перестает ехать
    keys[event.key] = false;
  }
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

