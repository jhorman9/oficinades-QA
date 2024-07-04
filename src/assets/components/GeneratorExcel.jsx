import { format, parseISO } from 'date-fns';
import React from 'react';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';

const GeneratorExcel = ({ data, name, titles, rowDetail }) => {

    const newDate = new Date();

    const downloadExcel = () => {
        const dataArray = data.map(rowDetail);
        const ws = XLSX.utils.aoa_to_sheet(dataArray);
        titles.forEach((title, index) => {
            const cell = String.fromCharCode(65 + index) + '1';
            XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: cell });
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        writeFile(wb, `${name}-${format(parseISO(newDate.toISOString()), 'dd/MM/yyyy HH:mm:ss.SSS')}.xlsx`);
    };

    return (
        <div className="App">
            <button className='btn btn-secondary' onClick={downloadExcel}>Descargar Excel</button>
        </div>
    );
}

export default GeneratorExcel;