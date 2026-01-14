const tg = window.Telegram.WebApp;
tg.expand();

// === ДАННЫЕ ===
const dutiesData = [
    { category: "🌅 Открытие", items: ["Включить свет", "Открыть шторы", "Включить приточку", "Надеть униформу", "Проверить чистоту", "Проверить ингредиенты", "Включить бойлер", "Кофемашина (разогрев)", "Настроить помол", "Заварить батч-брю"] },
    { category: "🔄 Смена", items: ["Протирать столы (каждый час)"] },
    { category: "🌙 Закрытие", items: ["Проверить остатки", "Выключить оборудование", "Вынести мусор", "Чистота зоны"] }
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

// === ЛОГИКА ===
let savedState = JSON.parse(localStorage.getItem('sunbula_checklist')) || {};

function renderList(containerId, dataArray, prefix) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    dataArray.forEach(group => {
        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerText = group.category;
        container.appendChild(header);

        group.items.forEach(itemText => {
            const itemId = prefix + "|" + itemText;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = itemId;
            if (savedState[itemId]) checkbox.checked = true;

            checkbox.addEventListener('change', () => {
                savedState[itemId] = checkbox.checked;
                localStorage.setItem('sunbula_checklist', JSON.stringify(savedState));
            });

            const checkmark = document.createElement('div');
            checkmark.className = 'checkmark';
            checkboxDiv.append(checkbox, checkmark);

            const label = document.createElement('span');
            label.innerText = itemText;
            label.onclick = () => checkbox.click();

            itemDiv.append(checkboxDiv, label);
            container.appendChild(itemDiv);
        });
    });
}

renderList('duties', dutiesData, 'duty');
renderList('products', productsData, 'prod');

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function sendData() {
    const report = { duties: [], products: [] };
    
    dutiesData.forEach(g => g.items.forEach(i => {
        report.duties.push({ title: i, done: savedState['duty|' + i] || false });
    }));
    productsData.forEach(g => g.items.forEach(i => {
        report.products.push({ title: i, done: savedState['prod|' + i] || false });
    }));

    if(!confirm("Закрыть смену?")) return;
    localStorage.removeItem('sunbula_checklist');
    tg.sendData(JSON.stringify(report));
}