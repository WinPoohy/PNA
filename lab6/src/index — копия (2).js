const express = require('express');
const cors = require('cors');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_FILE_PATH);

app.use(cors());
app.use(express.json());

// --- ЛР №6: РАЗДАЧА СТАТИКИ ---
// Важно: Эта строчка должна идти ПЕРЕД всеми app.get('*')
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Сначала проверяем маршруты API
app.use('/stocks', stocksRouter);

// Твой проверочный маршрут
app.get('/test', (req, res) => {
    res.send('Бэкенд видит запрос!');
});

// ГЛАВНОЕ: Отдаем фронтенд при заходе в корень
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// ОБЯЗАТЕЛЬНО: Если мы переходим на /design или /calc через бэкенд
// этот блок поможет Express найти нужный HTML в папке dist
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    if (page.includes('.')) return next(); // если просят картинку или файл — идем дальше
    res.sendFile(path.join(__dirname, '..', 'dist', `${page}.html`), (err) => {
        if (err) next(); // если такого .html нет — идем к 404 ошибке
    });
});

// В самом конце обработчик 404
app.use((req, res) => {
    res.status(404).send('Извините, ресурс не найден в системе МГТУ');
});

app.listen(PORT, () => {
    console.log(`Сервер МГТУ запущен на http://localhost:3000`);
});
