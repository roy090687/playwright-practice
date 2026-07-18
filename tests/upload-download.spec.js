import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'fs';
const ExcelJS = require('exceljs')

function readExcel(workSheet, searchText) {
    let found = false;
    const rowColumn = { row: -1, column: -1 };
    workSheet.eachRow((row, rowNumber) => {
        if (found) return;
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                rowColumn.row = rowNumber;
                rowColumn.column = colNumber;
                console.log(`Row: ${rowColumn.row}, Column: ${rowColumn.column}`);
                found = true;
                return;
            }
        })
    })
    return rowColumn;
}

async function writeExceltest(searchText, newText, path) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path)
    const sheet = workbook.getWorksheet('Sheet1');
    const output = readExcel(sheet, searchText);

    // Write to the excel
    const cell = sheet.getCell(output.row, output.column);
    cell.value = newText;
    await workbook.xlsx.writeFile(path);
}

async function UpdatePriceBasedOnSearch(searchText, newValue, updatePrice, path) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path)
    const sheet = workbook.getWorksheet('Sheet1');
    const output = readExcel(sheet, searchText);

    // update price based on search text
    const cell = sheet.getCell(output.row, (output.column + updatePrice.colChange));
    cell.value = newValue;
    await workbook.xlsx.writeFile(path);
}

async function runFunctions(path) {
    await writeExceltest("Apple", "Republic", path);
    await UpdatePriceBasedOnSearch("Kivi", 600, { colChange: 2 }, path);
    console.log("Both updates applied and done sequentially.")
}

//const filePath = "C:/Users/SNEHASISH/Downloads/download.xlsx";

test('Upload download excel validation', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

    // Capture the download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;

    // Create a root-level downloads folder and save file there
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
    }
    const filePath = path.join(downloadsDir, 'download.xlsx');
    await download.saveAs(filePath);

    // Run your Excel functions on the saved file
    await runFunctions(filePath);

    // Upload back
    await page.locator("#fileinput").setInputFiles(filePath);
});
