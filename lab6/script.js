window.onload = function() {
    const outputElement = document.getElementById("result");
    if (!outputElement) return;

    let a = ''; // первое число
    let b = ''; // второе число
    let selectedOperation = null;

    function updateDisplay() {
        if (a === "Ошибка") {
            outputElement.innerHTML = "Ошибка";
            return;
        }

        // 1. Вспомогательная функция для форматирования чисел
        function formatPart(val) {
            if (val === '' || val === '-') return val;
            let num = Number(val);
            let str = val.toString();

            // Экспонента, если число слишком длинное (больше 9 цифр)
            if (str.replace('-', '').replace('.', '').length > 9 || Math.abs(num) >= 1000000000) {
                return num.toExponential(4);
            }
            return str;
        }

        // 2. Сборка выражения
        let partA = formatPart(a);
        let partB = formatPart(b);
        let op = selectedOperation || '';

        // Заменяем знаки на красивые для экрана
        if (op === '*') op = '×';
        if (op === '/') op = '÷';

        // Собираем всё в одну строку с пробелами
        let fullExpression = partA;
        if (op) fullExpression += ` ${op} `;
        if (partB) fullExpression += partB;

        // 3. ЗАЩИТА ОТ ВЫХОДА ЗА ГРАНИЦЫ
        // Если строка слишком длинная для экрана (например, больше 14 символов)
        if (fullExpression.length > 14) {
            outputElement.style.fontSize = "20px"; // Уменьшаем шрифт
        } else {
            outputElement.style.fontSize = "40px"; // Возвращаем стандартный (настройте под свой CSS)
        }

        outputElement.innerHTML = fullExpression || '0';
    }

    // 1. ОБРАБОТКА ЦИФР И ТОЧКИ
    document.querySelectorAll('[id^="btn_digit_"]').forEach(btn => {
        btn.onclick = function() {
            let digit = this.id.split('_').pop();
            if (digit === 'dot') digit = '.';

            if (!selectedOperation) {
                // Если в 'a' уже есть 9 цифр, не даем вводить больше (защита)
                if (a.replace(/[^0-9]/g, '').length >= 9 && digit !== '.') return;
                if (digit === '.' && a.includes('.')) return;
                a = (a === '0' && digit !== '.') ? digit : a + digit;
            } else {
                if (b.replace(/[^0-9]/g, '').length >= 9 && digit !== '.') return;
                if (digit === '.' && b.includes('.')) return;
                b = (b === '0' && digit !== '.') ? digit : b + digit;
            }
            updateDisplay();
        };
    });

    // 2. СМЕНА ЗНАКА (+/-)
    const signBtn = document.getElementById("btn_op_sign");
    if (signBtn) {
        signBtn.onclick = () => {
            if (selectedOperation && b && b != '-') {
                b = (parseFloat(b) * -1).toString();
                updateDisplay(b);
            } else if (a && a != '-') {
                a = (parseFloat(a) * -1).toString();
                updateDisplay(a);
            }
        };
    }

    // 3. ПРОЦЕНТ (%)
    const percentBtn = document.getElementById("btn_op_percent");
    if (percentBtn) {
        percentBtn.onclick = () => {
            if (selectedOperation && b) {
                b = (parseFloat(b) / 100).toString();
                updateDisplay(b);
            } else if (a) {
                a = (parseFloat(a) / 100).toString();
                updateDisplay(a);
            }
        };
    }

    // 4. ОПЕРАЦИИ (+, -, x, /)
    document.querySelectorAll('.my-btn.primary:not(.execute)').forEach(btn => {
        btn.onclick = function() {
            let opText = this.innerText.toLowerCase();
            let currentOp = (opText === 'x' || opText === '×') ? '*' : opText;

            // ЛОГИКА МИНУСА (если число еще не введено)
            if (currentOp === '-' && b == '-') {
                if (a === '') { a = '-'; updateDisplay(); return; }
                if (selectedOperation && b === '') { b = '-'; updateDisplay(); return; }
            }

            if (a === '' || a === '-') return;
            if (b !== '' && b !== '-') calculate(); // Считаем промежуточный результат

            selectedOperation = currentOp;
            updateDisplay();
        };
    });

    // 5. РАСЧЕТ (=)
    function calculate() {
        if (a === '' || b === '' || !selectedOperation) return;

        let numA = parseFloat(a);
        let numB = parseFloat(b);
        let res = 0;

        switch (selectedOperation) {
            case '+': res = numA + numB; break;
            case '-': res = numA - numB; break;
            case '*': res = numA * numB; break;
            case '/': res = (numB === 0) ? "Ошибка" : numA / numB; break;
        }

        a = res.toString();
        b = '';
        selectedOperation = null;
        updateDisplay();
        let colorValue = Math.abs(Math.floor(a)) % 16777216;
        let hexColor = "#" + colorValue.toString(16).padStart(6, '0');
        outputElement.style.color = hexColor;
    }

    const equalBtn = document.getElementById("btn_op_equal");
    if (equalBtn) equalBtn.onclick = calculate;

    // 6. ОЧИСТКА (C)
    const clearBtn = document.getElementById("btn_op_clear");
    if (clearBtn) {
        clearBtn.onclick = () => {
            a = ''; b = ''; selectedOperation = null;
            updateDisplay(0);
        };
    }

    // ЛОГИКА УЧЕБНОЙ НЕДЕЛИ
    function updateWeek() {
        const weekElem = document.getElementById('week-info');
        if (!weekElem) return;

        const now = new Date();
        const start = new Date(now.getFullYear(), 8, 1); // 1 сентября
        start.setDate(start.getDate() - (start.getDay() || 7) + 1);
        const weekNum = Math.ceil((now - start) / (7 * 24 * 60 * 60 * 1000));

        if (weekNum > 0 && weekNum <= 17) {
            const parity = (weekNum % 2 !== 0) ? "Чис" : "Знам";
            weekElem.innerText = `${weekNum} нед. (${parity})`;
        } else {
            weekElem.innerText = "Каникулы";
        }
    }
    updateWeek();
};
