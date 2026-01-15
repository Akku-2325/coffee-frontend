let tg = window.Telegram.WebApp;
tg.expand(); 

let duties = [
    { title: "Включить свет / музыку / вывеску", done: false },
    { title: "Настроить помол (Эспрессо)", done: false },
    { title: "Проверить молоко в холодильнике", done: false },
    { title: "Визуальная чистота бара", done: false },
    { title: "Чистота в зале (столики)", done: false },
    { title: "Вынести мусор", done: false },
    { title: "Выключить оборудование (вечер)", done: false },
    { title: "Закрыть смену в кассе", done: false }
];

let products = [
    { title: "Эспрессо смесь (Зерно)", done: false },
    { title: "Молоко обычное 3.2%", done: false },
    { title: "Молоко альтернативное", done: false },
    { title: "Стаканы S / M / L", done: false },
    { title: "Крышки для стаканов", done: false },
    { title: "Сиропы (Ваниль, Карамель...)", done: false },
    { title: "Салфетки / Трубочки", done: false },
    { title: "Сахар / Сахзам", done: false },
    { title: "Вода бутилированная", done: false },
    { title: "Химия (средство для посуды)", done: false }
];


function render() {
    renderDuties();
    renderProducts();
}

function renderDuties() {
    const list = document.getElementById('duties-list');
    list.innerHTML = ''; 

    duties.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = `item ${item.done ? 'checked' : ''}`;
        div.onclick = () => toggleDuty(index);
        
        let icon = item.done ? '✅' : '⬜';
        
        div.innerHTML = `
            <div class="icon">${icon}</div>
            <div class="title">${item.title}</div>
        `;
        list.appendChild(div);
    });
}

function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = '';

    products.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = `item ${item.done ? 'checked' : ''}`;
        div.onclick = () => toggleProduct(index);
        
        let icon = item.done ? '📦' : '🔻';
        
        div.innerHTML = `
            <div class="icon">${icon}</div>
            <div class="title">${item.title}</div>
        `;
        list.appendChild(div);
    });
}



function toggleDuty(index) {
    duties[index].done = !duties[index].done;
    renderDuties();
}

function toggleProduct(index) {
    products[index].done = !products[index].done;
    renderProducts();
}


function goToStep2() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    window.scrollTo(0, 0);
}

function goToStep1() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
}


function sendData() {
    let commentDuties = document.getElementById("comment-duties").value;
    let commentProducts = document.getElementById("comment-products").value;


    let data = {
        duties: duties,           
        products: products,       
        comment_duties: commentDuties,     
        comment_products: commentProducts 
    };

    tg.sendData(JSON.stringify(data));
    
    tg.close(); 
}

render();