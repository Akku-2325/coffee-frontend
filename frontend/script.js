const tg = window.Telegram.WebApp;
tg.expand();

// === ДАННЫЕ ===
const dutiesData = [
    { category: "🌅 Открытие", items: ["Включить свет / музыку", "Открыть шторы", "Включить приточку", "Надеть униформу", "Проверить чистоту", "Проверить ингредиенты", "Включить бойлер", "Кофемашина (разогрев)", "Настроить помол", "Заварить батч-брю"] },
    { category: "🔄 Смена", items: ["Протирать столы (каждый час)", "Проверить чистоту бара", "Улыбаться гостям"] },
    { category: "🌙 Закрытие", items: ["Проверить остатки", "Выключить оборудование", "Вынести мусор", "Чистота зоны", "Закрыть смену в кассе"] }
];

const productsData = [
    { category: "☕️ Зерна", items: ["Эспрессо", "Фильтр"] },
    { category: "🥛 Молоко", items: ["Обычное", "Кокос", "Банан", "Миндаль", "Овсяное", "Безлактозное", "Сливки"] },
    { category: "🧊 Прочее", items: ["Кокосовая вода", "Швепс", "Лёд"] },
    { category: "🍊 Фрукты", items: ["Лимон", "Апельсин", "Лайм", "Имбирь", "Маракуйя"] },
    { category: "❄️ Морозка", items: ["Малина", "Брусника"] },
    { category: "🥣 Пюре", items: ["Ананас", "Апельсин", "Маракуйя", "Манго", "Облепиха", "Персик"] },
    { category: "🍵 Чай", items: ["Черный", "Зеленый", "Улун", "Жасмин", "Дары иссыкуля", "Чабрец", "Анис", "Гвоздика", "Корица"] },
    { category: "🧂 Сыпучие", items: ["Сахар тр.", "Сахар бел.", "Какао", "Мед", "Фруктоза", "Ванилин", "Ксантан", "Лимонка", "Матча"] },
    { category: "🍯 Сиропы", items: ["Карамель", "Сол. карамель", "Лесной орех", "Попкорн", "Шоколад", "Айриш", "Ваниль", "Кокос"] },
    { category: "🥤 Посуда", items: ["Стаканы S/M/L", "Крышки гор.", "Стаканы хол.", "Крышки хол.", "Капхолдеры", "Фильтры батч", "Фильтры воронка"] }
];

// Восстанавливаем сохраненное
let savedState = JSON.parse(localStorage.getItem('sunbula_checklist')) || {};

function renderList(targetId, dataArray, prefix) {
    const container = document.getElementById(targetId);
    container.innerHTML = "";

    dataArray.forEach(group => {
        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerText = group.category;
        container.appendChild(header);

        group.items.forEach(itemText => {
            const uniqueId = `${prefix}|${group.category}|${itemText}`;
            
            // Создаем строку (DIV)
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            
            // Контейнер для чекбокса
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-container';

            // Сам чекбокс (скрытый)
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = uniqueId;
            if (savedState[uniqueId]) checkbox.checked = true;

            const checkmark = document.createElement('div');
            checkmark.className = 'checkmark';
            checkboxDiv.append(checkbox, checkmark);

            // Текст
            const textSpan = document.createElement('span');
            textSpan.innerText = itemText;

            itemDiv.append(checkboxDiv, textSpan);
            container.appendChild(itemDiv);

            // === 🔥 ЖЕЛЕЗОБЕТОННЫЙ КЛИК 🔥 ===
            // Мы вешаем клик на весь DIV. 
            // При клике мы программно меняем состояние чекбокса.
            itemDiv.onclick = function() {
                checkbox.checked = !checkbox.checked; // Инвертируем галочку
                savedState[uniqueId] = checkbox.checked; // Сохраняем
                localStorage.setItem('sunbula_checklist', JSON.stringify(savedState));
            };
        });
    });
}

// Рендер
renderList('duties-container', dutiesData, 'duty');
renderList('products-container', productsData, 'prod');

// Табы
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    window.scrollTo(0, 0);
}

// Кнопка "Отметить все"
function markAllProducts() {
    productsData.forEach(group => {
        group.items.forEach(item => {
            let uniqueId = `prod|${group.category}|${item}`;
            
            savedState[uniqueId] = true;

            let el = document.getElementById(uniqueId);
            if (el) el.checked = true;
        });
    });
    // Сохраняем в память
    localStorage.setItem('sunbula_checklist', JSON.stringify(savedState));
    
    // Вибрация
    if(window.navigator.vibrate) window.navigator.vibrate(50);
}

function sendData() {
    let comm1 = document.getElementById("comment-duties").value;
    let comm2 = document.getElementById("comment-products").value;

    const report = { 
        duties: [], 
        products: [],
        comment_duties: comm1,
        comment_products: comm2
    };
    
    dutiesData.forEach(g => g.items.forEach(i => {
        let uniqueId = `duty|${g.category}|${i}`;
        report.duties.push({ title: i, done: savedState[uniqueId] || false });
    }));

    productsData.forEach(g => g.items.forEach(i => {
        let uniqueId = `prod|${g.category}|${i}`;
        report.products.push({ title: i, done: savedState[uniqueId] || false });
    }));

    if(!confirm("Закрыть смену?")) return;

    localStorage.removeItem('sunbula_checklist');
    tg.sendData(JSON.stringify(report));
    tg.close();
}