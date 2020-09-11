// Сначала объявляются переменный для игры

// Объект для статуса игры, подсчета очков и остановки игры
const SETTINGS = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0,
};

// Максимальное количество встречных машин
const MAX_ENEMY = 8;
// Часто есть в размерах высоты - зададим как переменную
const HEIGHT_ELEM = 100;

// Потом переменные с данными со страницы
const score = document.querySelector('.score'),
      modal = document.querySelector('.modal'),
      // menu = document.querySelector('.modal-menu'), 
      start = document.querySelectorAll('.start'),
      gameArea = document.querySelector('.gameArea'),
      // Создаем машину
      car = document.createElement('div'),
      // Создаем музыкальное сопровождение
      audio = document.createElement('audio'),
      crash = new Audio('./crash.mp3');

  car.classList.add('car');
  gameArea.classList.add('hide');
  score.classList.add('hide');

  audio.src = 'audio.mp3';
  audio.volume = 0.5;
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

// Жестко задаем высоту для поля, чтоббы полосы на дороге не слеплялись
const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);
gameArea.style.height = countSection * HEIGHT_ELEM;

// Функци вычисления количества полос на дороге
const getQuantityElements = (heightElement) =>  (gameArea.offsetHeight / heightElement) + 1;

const startGame = (e) => {

  // Запускаем игру в зависимости от кнопки сложности
  const target = e.target;
  // if (target === start) {
  //   return;
  // } 
switch (target.id) {
  case'easy':
    SETTINGS.speed = 3;
    SETTINGS.traffic = 4;
    break;
  case'medium':
    SETTINGS.speed = 5;
    SETTINGS.traffic = 3;
    break;
  case'hard':
    SETTINGS.speed = 8;
    SETTINGS.traffic = 2;
    break;
}
  
  audio.play();
  modal.classList.add('hide');  

  // Очищаем поле перед началом игры
  gameArea.innerHTML = '';
  gameArea.classList.remove('hide');
  score.classList.remove('hide');

  // Цикл для создания линий на дороге
  for(let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = `${i * HEIGHT_ELEM}px`;
    line.style.height = `${HEIGHT_ELEM / 2}px`;
    // Свойство y и его значение для функции движения полос
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  // Цикл для создания машин на дороге
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * SETTINGS.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY + 1);
    enemy.classList.add('enemy');

    enemy.y = -HEIGHT_ELEM * SETTINGS.traffic * (i + 1);
    enemy.style.top = `${enemy.y}px`;
    // В игру добавляем разные модели машинок
    enemy.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
    gameArea.append(enemy);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
  }

  // Подсчет очков
  SETTINGS.score = 0;
  // localStorage.setItem('score', 0);
  // Меняем статус игры в объекте
  SETTINGS.start = true;

  // Добавляем машину
  gameArea.append(car);
  car.style.cssText = `
  left: ${gameArea.offsetWidth / 2 - car.offsetWidth / 2}px;
  top: auto;
  bottom: 10px
  `;

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
    if(line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
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
    // Если точки соприкосновения далеко - уменьшить или увеличить на несколько пикселей выражения
    if  (carRect.top <= enemyRect.bottom && 
      carRect.right >= enemyRect.left && 
      carRect.left <= enemyRect.right && 
      carRect.bottom >= enemyRect.top) {
        SETTINGS.start = false;
        audio.pause();
        crash.play();
        modal.classList.remove('hide');
        // score.style.top = start.offsetHeight;
        // Запись в localStorage
        if (localStorage.getItem('score') < SETTINGS.score) {
          localStorage.setItem('score', SETTINGS.score);
          score.innerHTML = `SCORE:${SETTINGS.score}<br>YOU GOT A NEW RECORD!`;
        } else {
          score.innerHTML = `SCORE:${SETTINGS.score}. TRY HARDER!<br>YOUR LATEST RECORD WAS ${localStorage.getItem('score')}`;
        }
      }

    item.y += SETTINGS.speed / 2;
    item.style.top = `${item.y}px`;

    // Возвращаем первые машины обратно
    if(item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * SETTINGS.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
      // Делаем так, чтобы машинки постоянно менялись
      const randomEnemy = Math.floor(Math.random() * MAX_ENEMY + 1);
      item.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
    }
  });
};

const playGame = () => {
  // Делаем рекурсию, чтобы движения были плавными
  if(SETTINGS.start) {
    SETTINGS.score += SETTINGS.speed;
    score.innerHTML = `SCORE<br>${SETTINGS.score}`;
    score.style.top = '0';
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

start.forEach(button => button.addEventListener('click', startGame));

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
