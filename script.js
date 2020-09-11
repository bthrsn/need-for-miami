// Переменная отвечает за путь к приложению
const url = require('url').format({
  protocol: 'file',
  slashes: true,
  pathname: require('path').join(__dirname, 'index.html')
});

// Деструктуризацией объекта получим нужные нам свойства электрона
const {app, BrowserWindow}  = require('electron')

// Переменная отвечает за статус приложения
let win;

// Функция которая создаеит приложение
function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 850,
  });
// Загрузка приложения
  win.loadURL(url);
// Закрытие приложения
  win.on('closed', function() {
    win = null;
  });
}

// Чтобы приложение запустилось
app.on('ready', createWindow);

// Для мак и iOS, чтобы закрывалось
app.on('window-all-closed', function() {
  app.quit();
})
