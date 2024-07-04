import { useState, useEffect } from 'react';
import { format } from 'date-fns-tz';

const useFormattedDate = (fechaOriginal) => {
  const [fechaFormateada, setFechaFormateada] = useState('');

  useEffect(() => {
    if (!fechaOriginal) {
      setFechaFormateada('');
      return;
    }

    try {
      const fecha = new Date(fechaOriginal);
      const formato = 'dd/MM/yyyy hh:mm a';
      const zonaHoraria = 'America/Panama';
      const fechaFormateada = format(fecha, formato, { timeZone: zonaHoraria });

      setFechaFormateada(fechaFormateada);

    } catch (error) {
      setFechaFormateada('');
    }
  }, [fechaOriginal]);

  return <span>{fechaFormateada}</span>;
};

export default useFormattedDate;
