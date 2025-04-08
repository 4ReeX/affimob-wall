const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Укажите путь к основной директории, где находятся папки с index.html
const baseDir = '/Users/marazmen/Documents/screenshots-mymoodfun-beeline/mymood_screenshots/LP/mymood/Juddy/';
const screenshotsBaseDir = '/Users/marazmen/Documents/screenshots-mymoodfun-beeline/mymood_screenshots/Juddy'; // Папка для сохранения скриншотов

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 414, height: 896 });

    // Функция для создания задержки
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Обработка каждой папки с index.html
    async function processFolder(folderPath) {
        const filePath = path.join(folderPath, 'index.html');
        if (fs.existsSync(filePath)) {
            console.log(`Открываем файл: ${filePath}`);
            await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });

            // Задержка для полной загрузки контента страницы
            await delay(1000);

            const folderName = path.basename(folderPath);
            const screenshotsFolder = path.join(screenshotsBaseDir, folderName);

            // Создаем папку для скриншотов, если не существует
            if (!fs.existsSync(screenshotsFolder)) {
                fs.mkdirSync(screenshotsFolder, { recursive: true });
            }

            // 1. Скриншот после загрузки страницы
            await page.screenshot({ path: path.join(screenshotsFolder, 'AoC-первый_экран.png') });
            console.log(`Скриншот сохранен: initial_screenshot.png`);

            // Убедимся, что страница загружена
            await page.waitForSelector('#app', { visible: true }); // Ждем, пока элемент Vue станет видимым

            // 2. Запускаем метод sendOTP
            await page.evaluate(() => {
                console.log("Вызов метода sendOTP");
                const app = document.getElementById('app');
                if (app && app.__vue__) {
                    app.__vue__.sendOTP();
                }
            });

            await delay(1000); // Ждем обновления интерфейса после выполнения метода
            await page.screenshot({ path: path.join(screenshotsFolder, 'АоС-второй_экран.png') });
            console.log(`Скриншот сохранен: after_sendOTP.png`);

            // 3. Теперь просто вызываем метод submitPassword
            await page.evaluate(() => {
                console.log("Вызов метода submitPassword");
                const app = document.getElementById('app');
                if (app && app.__vue__) {
                    app.__vue__.submitPassword();
                }
            });

            await delay(1000); // Ждем обновления интерфейса после выполнения метода
            await page.screenshot({ path: path.join(screenshotsFolder, '2-click-первый_экран.png') });
            console.log(`Скриншот сохранен: after_submitPassword.png`);

            // 4. Вызываем метод onConfirmAge
            await page.evaluate(() => {
                console.log("Вызов метода onConfirmAge");
                const app = document.getElementById('app');
                if (app && app.__vue__) {
                    app.__vue__.onConfirmAge();
                }
            });

            await delay(1000); // Ждем обновления интерфейса после выполнения метода
            await page.screenshot({ path: path.join(screenshotsFolder, '2-click-второй.png') });
            console.log(`Скриншот сохранен: after_onConfirmAge.png`);

        } else {
            console.log(`index.html не найден в папке: ${folderPath}`);
        }
    }

    // Перебор всех папок в директории baseDir
    const folders = fs.readdirSync(baseDir).filter(name => fs.lstatSync(path.join(baseDir, name)).isDirectory());
    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        await processFolder(folderPath);
    }

    await browser.close();
})();
