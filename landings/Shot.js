const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const baseDir = '/Users/marazmen/Documents/screenshots-mymoodfun-beeline/mymood_screenshots/LP/kolgot/';
const screenshotsBaseDir = '/Users/marazmen/Documents/screenshots-mymoodfun-beeline/mymood_screenshots/kolgot';
const archivesDir = '/Users/marazmen/Documents/screenshots-mymoodfun-beeline/mymood_screenshots/kolgot/zip';

// Функция для архивации папки
async function archiveFolder(folderPath, folderName) {
    const outputPath = path.join(archivesDir, `${folderName}.zip`);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            console.log(`Архив создан: ${outputPath}`);
            resolve();
        });

        archive.on('error', err => reject(err));
        archive.pipe(output);
        archive.directory(folderPath, false);
        archive.finalize();
    });
}

(async () => {
    // Создаем папку для архивов если ее нет
    if (!fs.existsSync(archivesDir)) {
        fs.mkdirSync(archivesDir, { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 414, height: 896 });

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function processFolder(folderPath) {
        const filePath = path.join(folderPath, 'index.html');
        if (fs.existsSync(filePath)) {
            console.log(`Открываем файл: ${filePath}`);
            await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
            await delay(400); // Сокращенная задержка

            const folderName = path.basename(folderPath);
            const screenshotsFolder = path.join(screenshotsBaseDir, folderName);

            if (!fs.existsSync(screenshotsFolder)) {
                fs.mkdirSync(screenshotsFolder, { recursive: true });
            }

            // 1. Первый скриншот
            await page.screenshot({ path: path.join(screenshotsFolder, 'AoC-первый_экран.png') });
            console.log('Скриншот сохранен: AoC-первый_экран.png');

            await page.waitForSelector('#app', { visible: true, timeout: 2000 });

            // 2. Метод sendOTP
            await page.evaluate(() => {
                const app = document.getElementById('app');
                if (app && app.__vue__) {
                    app.__vue__.sendOTP();
                }
            });
            await delay(400);
            await page.screenshot({ path: path.join(screenshotsFolder, 'АоС-второй_экран.png') });

            // 3. Метод submitPassword
            await page.evaluate(() => {
                const app = document.getElementById('app');
                if (app && app.__vue__) {
                    app.__vue__.submitPassword();
                }
            });
            await delay(400);
            await page.screenshot({ path: path.join(screenshotsFolder, '2-click-первый_экран.png') });

            // 4. Метод onConfirmAge
            await page.evaluate(() => {
                const app = document.getElementById('app');
                if (app && app.__vue__) {
                    app.__vue__.onConfirmAge();
                }
            });
            await delay(400);
            await page.screenshot({ path: path.join(screenshotsFolder, '2-click-второй.png') });

            // Архивируем папку после создания скриншотов
            await archiveFolder(folderPath, folderName);

        } else {
            console.log(`index.html не найден в папке: ${folderPath}`);
        }
    }

    // Обработка всех папок
    const folders = fs.readdirSync(baseDir)
        .filter(name => fs.lstatSync(path.join(baseDir, name)).isDirectory());

    for (const folder of folders) {
        await processFolder(path.join(baseDir, folder));
    }

    await browser.close();
    console.log('Обработка всех лендингов завершена!');
})();
