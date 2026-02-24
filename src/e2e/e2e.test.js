/**
 * @jest-environment node
 */

import puppeteer from 'puppeteer';

describe('CRUD App e2e testing', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true, // Для GitHub Actions
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('should show validation errors on empty form submit', async () => {
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.container');

        const addBtn = await page.$('#add-btn');
        await addBtn.click();

        // Ждем появления модального окна
        await page.waitForSelector('#modal:not(.hidden)');

        // Кликаем "Сохранить", оставив поля пустыми
        const saveBtn = await page.$('.save-btn');
        await saveBtn.click();

        // Проверяем, что появились красные подсказки об ошибках
        const nameErrorVisible = await page.$eval('#name-error', el => !el.classList.contains('hidden'));
        const priceErrorVisible = await page.$eval('#price-error', el => !el.classList.contains('hidden'));

        expect(nameErrorVisible).toBeTruthy();
        expect(priceErrorVisible).toBeTruthy();
    });

    test('should add a new item successfully', async () => {
        await page.goto('http://localhost:8080');
        await page.waitForSelector('.container');

        // Изначально у нас 2 товара в таблице
        let rows = await page.$$('tbody tr');
        expect(rows.length).toBe(2);

        // Открываем модалку
        const addBtn = await page.$('#add-btn');
        await addBtn.click();
        await page.waitForSelector('#modal:not(.hidden)');

        // Вводим название
        const nameInput = await page.$('#name-input');
        await nameInput.type('Samsung Galaxy S23');

        // Вводим цену
        const priceInput = await page.$('#price-input');
        await priceInput.type('70000');

        // Сохраняем
        const saveBtn = await page.$('.save-btn');
        await saveBtn.click();

        // Ждем, пока модалка закроется
        await page.waitForSelector('#modal.hidden');

        // Проверяем, что в таблице теперь 3 товара
        rows = await page.$$('tbody tr');
        expect(rows.length).toBe(3);

        const pageText = await page.$eval('tbody', el => el.textContent);
        expect(pageText.includes('Samsung Galaxy S23')).toBeTruthy();
    });
});