// Подключаем модуль для чтения из терминала
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//2.10
function countPrefixMatches(words, str) {
    let count = 0;
    const wordsArray = words.split(',').map(w => w.trim());
    for (let word of wordsArray) {
        if (str.startsWith(word)) {
            count++;
        }
    }
    return count;
}

// 3.6
function rleEncode(serialCode) {
    if (!serialCode) return "";
    let result = "";
    let count = 1;
    for (let i = 1; i <= serialCode.length; i++) {
        if (i < serialCode.length && serialCode[i] === serialCode[i - 1]) {
            count++;
        } else {
            result += serialCode[i - 1] + count;
            count = 1;
        }
    }
    return result;
}

console.log("\n===============================================");
console.log("   ИНЖЕНЕРНЫЙ МОДУЛЬ МГТУ им. Н.Э. БАУМАНА     ");
console.log("===============================================");
console.log("1. Проверка префиксов проекта (Задание 2.10)");
console.log("2. Оптимизация серийного кода (RLE - Задание 3.6)");
console.log("3. Выход");

function mainMenu() {
    rl.question("\nВыберите пункт меню (1-3): ", (answer) => {
        if (answer === '1') {
            rl.question("Введите базу префиксов через запятую (например a,ab,abc): ", (words) => {
                rl.question("Введите код проекта для проверки: ", (str) => {
                    console.log(`\n[РЕЗУЛЬТАТ]: Найдено ${countPrefixMatches(words, str)} совпадений.`);
                    mainMenu();
                });
            });
        } else if (answer === '2') {
            rl.question("Введите серийный номер для сжатия (например AAAABBBCC): ", (code) => {
                console.log(`\n[РЕЗУЛЬТАТ]: Оптимизированный код: ${rleEncode(code)}`);
                mainMenu();
            });
        } else if (answer === '3') {
            console.log("Завершение работы системы. До свидания!");
            rl.close();
        } else {
            console.log("Ошибка: Выберите пункт от 1 до 3.");
            mainMenu();
        }
    });
}

mainMenu();
