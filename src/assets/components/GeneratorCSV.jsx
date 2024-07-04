import { format, parseISO } from 'date-fns';
import React from 'react';

const GeneratorCSV = ({ data, name, title, rowDetail }) => {
    const newDate = new Date();
    
    const downloadCSV = () => {
        const csvData = [title, ...data.map(rowDetail)];
        const csvContent = "data:text/csv;charset=utf-8," +encodeURIComponent(csvData.map(row => row.join(",")).join("\n"));
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", `${name}-${format(parseISO(newDate.toISOString()), 'dd/MM/yyyy HH:mm:ss.SSS')}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="App">
            <button className='btn btn-secondary' onClick={downloadCSV}>Descargar CSV</button>
        </div>
    );
}

export default GeneratorCSV;