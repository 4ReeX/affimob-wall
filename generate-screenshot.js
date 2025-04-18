const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const [basePath, outputDir, zipDir] = process.argv.slice(2);

async function run() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 414, height: 896 });

    try {
        const folderName = path.basename(basePath);
        const screenshotPath = path.join(outputDir, folderName);

        if (!fs.existsSync(screenshotPath)) {
            fs.mkdirSync(screenshotPath, { recursive: true });
        }

        await page.goto(`file://${path.join(basePath, 'index.html')}`, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Делаем основной скриншот
        const mainScreenshot = path.join(screenshotPath, `main_${Date.now()}.png`);
        await page.screenshot({ path: mainScreenshot });

        // Архивируем папку
        const zipPath = path.join(zipDir, `${folderName}.zip`);
        await archiveFolder(basePath, zipPath);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

async function archiveFolder(source, zipPath) {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(source, false);
        archive.finalize();
    });
}

run();
