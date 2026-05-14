const fileService = require('./fileService');

// Переменная для хранения пути к файлу данных, будет установлена при инициализации
let dataFilePath;

// Функция инициализации сервиса с путем к файлу данных
const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (!title) return stocks;
    const lower = title.toLowerCase();
    return stocks.filter(s => s.title && s.title.toLowerCase() === lower);
};



const findOne = (id) => {
    const stocks = fileService.readData(dataFilePath);
    return stocks.find(stock => stock.id === id);
};

const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);

    // Генерация ID: берем максимальный ID + 1
    const newId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id)) + 1
        : 1;

    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);

    return newStock;
};

const update = (id, stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const index = stocks.findIndex(s => s.id === id);

    if (index === -1) return null;

    stocks[index] = { ...stocks[index], ...stockData };
    fileService.writeData(dataFilePath, stocks);

    return stocks[index];
};

const remove = (id) => {
    const stocks = fileService.readData(dataFilePath);
    const filteredStocks = stocks.filter(s => s.id !== id);

    if (filteredStocks.length === stocks.length) {
        return false; // Ничего не удалили
    }

    fileService.writeData(dataFilePath, filteredStocks);
    return true;
};

const findPathofWord = (substring) => {
    const stocks = fileService.readData(dataFilePath);
    if (!substring) {
        return stocks; // если подстрока не задана – вернуть все
    }
    const lowerQuery = substring.toLowerCase();
    return stocks.filter(stock =>
        stock.title && stock.title.toLowerCase().includes(lowerQuery)
    );
};

module.exports = { init, findPathofWord, findOne, create, update, remove, findAll };
