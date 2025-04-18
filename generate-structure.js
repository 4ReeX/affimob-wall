const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const LANDINGS_ROOT = path.join(__dirname, 'landings');
const OPERATORS_FILE = path.join(__dirname, 'landings-structure.json');

async function scanOperator(operatorPath) {
    const structure = [];

    async function scanDirectory(dirPath) {
        const entries = await readdir(dirPath);

        for (const entry of entries) {
            const entryPath = path.join(dirPath, entry);
            const entryStat = await stat(entryPath);

            if (entryStat.isDirectory()) {
                const children = await scanDirectory(entryPath);
                const hasIndex = children.some(child => child.name === 'index.html');

                structure.push({
                    name: entry,
                    type: hasIndex ? 'landing' : 'folder',
                    path: path.relative(operatorPath, entryPath).replace(/\\/g, '/'),
                    children: hasIndex ? null : children
                });
            }
        }

        return structure;
    }

    return scanDirectory(operatorPath);
}

async function generateOperatorStructure(operatorDir) {
    try {
        const operatorPath = path.join(LANDINGS_ROOT, operatorDir);
        const structure = await scanOperator(operatorPath);
        const outputPath = path.join(operatorPath, 'structure.json');

        await writeFile(outputPath, JSON.stringify(structure, null, 2));
        console.log(`Generated structure for ${operatorDir}`);

        return {
            name: operatorDir,
            type: 'operator',
            path: operatorDir
        };
    } catch (error) {
        console.error(`Error processing ${operatorDir}:`, error);
        return null;
    }
}

async function main() {
    try {
        // Получаем список операторов
        const operators = await readdir(LANDINGS_ROOT);
        const operatorEntries = [];

        // Генерируем структуры для каждого оператора
        for (const operator of operators) {
            const operatorEntry = await generateOperatorStructure(operator);
            if (operatorEntry) operatorEntries.push(operatorEntry);
        }

        // Сохраняем основной файл структуры
        const mainStructure = {
            name: 'landings',
            type: 'root',
            children: operatorEntries
        };

        await writeFile(OPERATORS_FILE, JSON.stringify(mainStructure, null, 2));
        console.log('Main structure file generated successfully!');

    } catch (error) {
        console.error('Error generating structure:', error);
    }
}

main();
