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
  traffic: 3,
};

// Функци вычисления количества полос на дороге
const getQuantityElements = (heightElement) =>  document.documentElement.clientHeight / heightElement + 1;

 const startGame = () => {
  start.classList.add('hide');
  // Цикл для создания линий на дороге
  for(let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    // Свойство y и его значение для функции движения полос
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  // Цикл для создания машин на дороге
  for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * settings.traffic * (i + 1);
    enemy.style.top = enemy.y + 'px';
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    gameArea.appendChild(enemy);
  }

  // Меняем статус игры в объекте
  settings.start = true;

  // Добавляем машину
  gameArea.append(car);

  // Для манипулирования css свойством left
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;

  // Специальная функция в js для анимации
  requestAnimationFrame(playGame);
}

// Функция для движения дороги
const moveRoad = () => {
  let lines = document.querySelectorAll('.line');
  lines.forEach(line=> {
    line.y += settings.speed;
    line.style.top = line.y + 'px';
    
    // Возвращаем первые линии обратно
    if(line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  })
}

// Функция для создания других машин
const moveEnemy = () => {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    item.y += settings.speed / 2;
    item.style.top = item.y + 'px';

    // Возвращаем первые машины обратно
    if(item.y >= document.documentElement.clientHeight) {
      item.y = -100 * settings.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
};

 const playGame = () => {
  // Делаем рекурсию, чтобы движения были плавными
  if(settings.start) {
    moveRoad();
    moveEnemy();

    // Условия дл передвижения машины
    if (keys.ArrowLeft && settings.x > 0) {
      settings.x -= settings.speed;
    }
    if (keys.ArrowRight  && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
      settings.x += settings.speed;
    }
    if (keys.ArrowDown  && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
      settings.y += settings.speed;
    }
    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed;
    }

    // Чтобы верхнее условие заработало - добавляем значение settings.x и y в стили
    car.style.left = settings.x + 'px';
    car.style.top = settings.y + 'px';
    requestAnimationFrame(playGame);
  }
}

 const startRun = (event) => {
  // Условие, чтобы старница обновлялась на f5
  if (event.key !== 'F5' && event.key !== 'F12') {
    event.preventDefault();
    // Если нажали вправо, наш автомобиль и поедет вправо
    keys[event.key] = true;  
  }
}
 const stopRun = (event) => {
  event.preventDefault();
  // Когда отпускаем кнопку, автомобиль перестает ехать
  keys[event.key] = false;
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

