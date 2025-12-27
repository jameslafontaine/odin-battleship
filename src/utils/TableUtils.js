/**
 * @fileoverview Generic table utilities for rendering, managing, and interacting with HTML tables.
 *
 * Responsibilities:
 * - Ensure table structure (colgroup, thead, tbody)
 * - Render table headers and rows dynamically from JS objects
 * - Support sorting, filtering, pagination, column visibility, and row striping
 * - Provide row/cell manipulation helpers
 *
 * Example:
 *   const tableAPI = initTable("libraryTable", myDataArray);
 *   tableAPI.sort("pages");
 *   tableAPI.filter(item => item.read);
 *
 * @module TableUtils
 */

import { createElement, clearChildren } from './UIUtils.js';

// =================
// Constants
// =================
const DEFAULT_TABLE_CLASS = "library-table";
const ROWS_PER_PAGE = 5;

// =================
// Table Rendering Functions
// =================

function ensureTableStructure(table) {
    if (!table.querySelector("colgroup")) table.insertBefore(createElement("colgroup"), table.firstChild);
    if (!table.querySelector("thead")) table.appendChild(createElement("thead"));
    if (!table.querySelector("tbody")) table.appendChild(createElement("tbody"));
}

function insertColgroup(table, obj) {
    const colgroup = table.querySelector("colgroup");
    clearChildren(colgroup);
    Object.keys(obj).forEach(() => colgroup.appendChild(document.createElement("col")));
}

function addTableHeader(obj, thead, onSort) {
    clearChildren(thead);
    const row = createElement("tr", ["library-head-row"]);

    Object.keys(obj).forEach(key => {
        const th = createElement("th", ["library-head-cell"]);
        th.setAttribute("scope", "col");
        th.textContent = key;
        th.style.cursor = "pointer";

        if (onSort) th.addEventListener("click", () => onSort(key));
        row.appendChild(th);
    });

    thead.appendChild(row);
}

function addTableRow(obj, tbody) {
    const row = createElement("tr", ["library-record"]);
    if (obj.id !== undefined) row.dataset.id = obj.id;

    Object.entries(obj).forEach(([key, value]) => {
        const td = createElement("td", [`${key}-cell`, "library-cell"]);
        td.textContent = value;
        row.appendChild(td);
    });

    tbody.appendChild(row);
}

function removeTableRow(id) {
    const recordToRemove = document.querySelector(`[data-id="${id}"]`);
    if (recordToRemove) recordToRemove.remove();
}

function updateTableCell(obj, colName) {
    const rowToUpdate = document.querySelector(`[data-id="${obj.id}"]`);
    if (!rowToUpdate) return;
    const cell = rowToUpdate.querySelector(`.${colName}-cell`);
    if (cell) cell.textContent = obj[colName];
}

function addRowsFromArray(arr, tbody) {
    arr.forEach(obj => addTableRow(obj, tbody));
}

function clearTableBody(table) {
    const tbody = table.querySelector("tbody");
    clearChildren(tbody);
}

// =================
// Table Features
// =================

function sortArrayByKey(arr, key, ascending = true) {
    return arr.slice().sort((a, b) => {
        if (a[key] < b[key]) return ascending ? -1 : 1;
        if (a[key] > b[key]) return ascending ? 1 : -1;
        return 0;
    });
}

function filterArray(arr, predicate) {
    return arr.filter(predicate);
}

function paginateArray(arr, page = 1, perPage = ROWS_PER_PAGE) {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
}

function toggleColumn(table, colIndex, visible) {
    Array.from(table.rows).forEach(row => {
        const cell = row.cells[colIndex];
        if (cell) cell.style.display = visible ? "" : "none";
    });
}

function stripeRows(tbody) {
    Array.from(tbody.rows).forEach((row, idx) => {
        row.classList.toggle("odd-row", idx % 2 === 0);
        row.classList.toggle("even-row", idx % 2 !== 0);
    });
}

// =================
// Main Execution / Initialization
// =================

function initTable(tableId, dataArray) {
    const table = document.getElementById(tableId);
    if (!table || !dataArray?.length) return;

    table.classList.add(DEFAULT_TABLE_CLASS);
    ensureTableStructure(table);

    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");

    insertColgroup(table, dataArray[0]);

    let currentData = [...dataArray];
    let ascending = true;

    const render = (data) => {
        clearTableBody(table);
        addRowsFromArray(data, tbody);
        stripeRows(tbody);
    };

    const handleSort = (key) => {
        currentData = sortArrayByKey(currentData, key, ascending);
        ascending = !ascending;
        render(currentData);
    };

    addTableHeader(dataArray[0], thead, handleSort);
    render(currentData);

    return {
        sort: handleSort,
        filter: (predicate) => { currentData = filterArray(dataArray, predicate); render(currentData); },
        paginate: (page, perPage = ROWS_PER_PAGE) => render(paginateArray(currentData, page, perPage)),
        toggleColumn: (index, visible) => toggleColumn(table, index, visible),
    };
}

export {
    initTable,
    clearTableBody,
    addTableRow,
    addRowsFromArray,
    removeTableRow,
    updateTableCell,
    sortArrayByKey,
    filterArray,
    paginateArray,
    toggleColumn,
    stripeRows,
};
