const express = require('express');
const cors = require('cors');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

// Инициализация базы данных
const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_FILE_PATH);

app.use(cors());
app.use(express.json());

// Логгер
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 1. СНАЧАЛА отдаем статические файлы (Bundle из папки dist)
// Если файл существует (например, design.html), Express отдаст его сразу
app.use(express.static(path.join(__dirname, '..', 'dist')));

// 2. ЗАТЕМ маршруты API
app.use('/stocks', stocksRouter);

// 3. ИСПРАВЛЕНИЕ ДЛЯ EXPRESS 5:
// Используем регулярное выражение (.*) вместо обычной звёздочки для перехвата всех путей
// Это нужно для работы Single Page Application (чтобы при любом адресе открывался index.html)
app.get(/^(?!\/stocks).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Обработка главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`   СЕРВЕР МГТУ ЗАПУЩЕН НА ПОРТУ ${PORT}`);
    console.log(`   Адрес сайта: http://localhost:${PORT}`);
    console.log(`=================================================\n`);
});
