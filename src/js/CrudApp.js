export default class CrudApp {
    constructor() {
        this.items = [
            { id: 1, name: 'iPhone 14', price: 80000 },
            { id: 2, name: 'MacBook Pro', price: 150000 }
        ];

        // Находим все нужные элементы на странице
        this.tableBody = document.querySelector('#table-body');
        this.modal = document.querySelector('#modal');
        this.form = document.querySelector('#crud-form');
        this.nameInput = document.querySelector('#name-input');
        this.priceInput = document.querySelector('#price-input');
        this.nameError = document.querySelector('#name-error');
        this.priceError = document.querySelector('#price-error');
        this.modalTitle = document.querySelector('#modal-title');

        // Переменная для хранения ID товара, который мы сейчас редактируем
        this.editingId = null;

        this.init();
    }

    init() {
        this.render(); // Отрисовываем начальную таблицу

        // Открытие модалки по кнопке "+"
        document.querySelector('#add-btn').addEventListener('click', () => this.showModal());

        // Закрытие модалки по кнопке "Отмена"
        document.querySelector('#cancel-btn').addEventListener('click', () => this.hideModal());

        // Отправка формы (нажатие на "Сохранить")
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        // Делегирование событий: слушаем клики внутри таблицы
        this.tableBody.addEventListener('click', (e) => {
            const btn = e.target;
            if (btn.classList.contains('edit-btn')) {
                const id = Number(btn.dataset.id);
                this.showModal(id);
            } else if (btn.classList.contains('delete-btn')) {
                const id = Number(btn.dataset.id);
                this.deleteItem(id);
            }
        });
    }

    // Метод перерисовки таблицы на основе массива this.items
    render() {
        this.tableBody.innerHTML = '';
        this.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>
          <button class="icon-btn edit-btn" data-id="${item.id}">✎</button>
          <button class="icon-btn delete-btn" data-id="${item.id}">✕</button>
        </td>
      `;
            this.tableBody.appendChild(tr);
        });
    }

    showModal(id = null) {
        this.editingId = id;

        // Скрываем ошибки, если они остались с прошлого раза
        this.nameError.classList.add('hidden');
        this.priceError.classList.add('hidden');

        if (id !== null) {
            // Режим редактирования: заполняем поля
            this.modalTitle.textContent = 'Редактировать товар';
            const item = this.items.find(i => i.id === id);
            this.nameInput.value = item.name;
            this.priceInput.value = item.price;
        } else {
            // Режим добавления нового: очищаем поля
            this.modalTitle.textContent = 'Добавить товар';
            this.nameInput.value = '';
            this.priceInput.value = '';
        }

        this.modal.classList.remove('hidden');
    }

    hideModal() {
        this.modal.classList.add('hidden');
    }

    saveItem() {
        const name = this.nameInput.value.trim();
        const price = Number(this.priceInput.value); // Переводим в число

        let isValid = true;

        // Валидация названия
        if (!name) {
            this.nameError.classList.remove('hidden');
            isValid = false;
        } else {
            this.nameError.classList.add('hidden');
        }

        // Валидация цены
        if (!price || price <= 0) {
            this.priceError.classList.remove('hidden');
            isValid = false;
        } else {
            this.priceError.classList.add('hidden');
        }

        if (!isValid) return; // Если есть ошибки, прерываем сохранение

        if (this.editingId !== null) {
            // Обновляем существующий товар
            const item = this.items.find(i => i.id === this.editingId);
            item.name = name;
            item.price = price;
        } else {
            // Создаем новый товар (уникальный ID на основе времени)
            const newItem = {
                id: performance.now(),
                name,
                price
            };
            this.items.push(newItem);
        }

        this.hideModal();
        this.render(); // Перерисовываем DOM
    }

    deleteItem(id) {
        // Просто отфильтровываем массив, удаляя нужный элемент
        this.items = this.items.filter(item => item.id !== id);
        this.render(); // Перерисовываем DOM
    }
}