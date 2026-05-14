const express = require('express');
const cors = require('cors'); // Обязательно для связи с сайтом
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

// 1. Настройка пути к данным (Указываем, что они в src/data)
const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');

// 2. Инициализация сервиса
stocksService.init(DATA_FILE_PATH);

app.use(cors()); // РАЗРЕШАЕМ ДОСТУП САЙТУ
app.use(express.json());

// Логировщик: будет писать в консоль терминала каждый запрос
// Ты сразу увидишь, если кто-то (или ты через Postman) зашел на сайт
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] Исполняется запрос: ${req.method} на адрес ${req.url}`);
    next(); // "Пропускаем" запрос дальше к маршрутам
});


// -------------------------------------------------------------------
// 3. Роутинг (Куда ведут адреса)
// -------------------------------------------------------------------

// Группируем все запросы, начинающиеся на /stocks, в специальном роутере
// То есть GET /stocks, POST /stocks и т.д. пойдут в файл routes/stocks.js
app.use('/stocks', stocksRouter);


// -------------------------------------------------------------------
// 4. Обработка ошибок
// -------------------------------------------------------------------

// Если пользователь ввел адрес, которого не существует
app.use((req, res) => {
    res.status(404).json({ error: 'Извините, такого адреса в Электронном Университете нет' });
});

// Если в коде произошла фатальная ошибка (сервер "упал")
app.use((err, req, res, next) => {
    console.error(err.stack); // Пишем ошибку в консоль
    res.status(500).json({ error: 'Внутренняя ошибка сервера МГТУ' });
});


// -------------------------------------------------------------------
// 5. Запуск
// -------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`   Сервер МГТУ запущен!`);
    console.log(`   Адрес: http://localhost:${PORT}`);
    console.log(`   Попробуй отправить GET-запрос в Postman на /stocks`);
    console.log(`=================================================\n`);
});

// --- ЛР №6: РАЗДАЧА СТАТИКИ ---
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/stocks', stocksRouter);

// Дополнительно: чтобы при переходе на корень открывался наш собранный фронтенд
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Обработка 404 и ошибок остается ниже...
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
