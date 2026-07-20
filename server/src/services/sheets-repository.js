import { env } from '../config/env.js';
import { TABLES } from '../data/tables.js';
import { getSheetsClient } from './google-client.js';

function tableConfig(tableName) {
  const table = TABLES[tableName];
  if (!table) throw new Error(`Tabla desconocida: ${tableName}`);
  return table;
}

function normalizeCell(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export class SheetsRepository {
  constructor({ spreadsheetId = env.GOOGLE_SPREADSHEET_ID } = {}) {
    if (!spreadsheetId) throw new Error('GOOGLE_SPREADSHEET_ID no está configurado.');
    this.spreadsheetId = spreadsheetId;
    this.sheets = getSheetsClient();
  }

  async ensureTables() {
    const metadata = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
      fields: 'sheets.properties'
    });

    const existing = new Map(
      (metadata.data.sheets || []).map((sheet) => [sheet.properties.title, sheet.properties])
    );

    const addRequests = Object.values(TABLES)
      .filter((table) => !existing.has(table.sheet))
      .map((table) => ({ addSheet: { properties: { title: table.sheet } } }));

    if (addRequests.length) {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: { requests: addRequests }
      });
    }

    for (const table of Object.values(TABLES)) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `'${table.sheet}'!A1:${this.columnLetter(table.headers.length)}1`,
        valueInputOption: 'RAW',
        requestBody: { values: [table.headers] }
      });
    }
  }

  columnLetter(number) {
    let result = '';
    let n = number;
    while (n > 0) {
      const remainder = (n - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      n = Math.floor((n - 1) / 26);
    }
    return result;
  }

  async readAll(tableName) {
    const table = tableConfig(tableName);
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `'${table.sheet}'!A:${this.columnLetter(table.headers.length)}`
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return [];

    return rows.slice(1).map((row, index) => {
      const record = { _rowNumber: index + 2 };
      table.headers.forEach((header, columnIndex) => {
        record[header] = normalizeCell(row[columnIndex]);
      });
      return record;
    });
  }

  async findById(tableName, id) {
    const records = await this.readAll(tableName);
    return records.find((record) => record.id === id) || null;
  }

  async findOne(tableName, field, value) {
    const records = await this.readAll(tableName);
    return records.find((record) => record[field] === value) || null;
  }

  async append(tableName, record) {
    const table = tableConfig(tableName);
    const values = table.headers.map((header) => normalizeCell(record[header]));
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `'${table.sheet}'!A:${this.columnLetter(table.headers.length)}`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
    return record;
  }

  async updateById(tableName, id, patch) {
    const table = tableConfig(tableName);
    const current = await this.findById(tableName, id);
    if (!current) return null;

    const merged = { ...current, ...patch, id };
    const values = table.headers.map((header) => normalizeCell(merged[header]));
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `'${table.sheet}'!A${current._rowNumber}:${this.columnLetter(table.headers.length)}${current._rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: { values: [values] }
    });
    delete merged._rowNumber;
    return merged;
  }

  async deleteById(tableName, id) {
    const table = tableConfig(tableName);
    const current = await this.findById(tableName, id);
    if (!current) return false;

    const metadata = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
      fields: 'sheets.properties'
    });
    const sheet = (metadata.data.sheets || []).find(
      (item) => item.properties.title === table.sheet
    );
    if (!sheet) throw new Error(`No existe la hoja ${table.sheet}`);

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: current._rowNumber - 1,
                endIndex: current._rowNumber
              }
            }
          }
        ]
      }
    });
    return true;
  }
}

export const sheetsRepository = new SheetsRepository();
