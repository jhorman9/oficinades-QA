import React, { useState } from 'react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');

  const generatePassword = (event) => {
    event.preventDefault();
    const maxLength = 10;

    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialChars = '*.-_';

    const getRandomChar = (charSet) => {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      return charSet[randomIndex];
    };

    let newPassword = getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    newPassword += getRandomChar('abcdefghijklmnopqrstuvwxyz');
    newPassword += getRandomChar('0123456789');
    newPassword += getRandomChar(specialChars);

    for (let i = newPassword.length; i < maxLength; i++) {
      const randomCharSet = charset + specialChars;
      newPassword += getRandomChar(randomCharSet);
    }

    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    newPassword = newPassword.slice(0, maxLength);

    setPassword(newPassword);
  };

  return (
    <div>
      <button onClick={generatePassword} type='button' className='btn btn-secondary mb-2'>Generar aquí</button>
      <p>Contraseña: <span className='color-primary'>{password}</span></p>
    </div>
  );
};

export default PasswordGenerator;
