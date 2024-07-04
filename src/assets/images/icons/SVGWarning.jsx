import React from 'react';

export const SVGWarning = () => {
  const svgStyle = {
    fill: '#fff',
    stroke: '#006491',
    strokeWidth: '2.82px',
    strokeMiterlimit: 10,
  };

  const cls2Style = {
    fill: '#006491',
    stroke: '#fff',
    strokeWidth: '2.21px',
  };

  return (
    <svg width='50' height={'50'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.24 82.12">
      <g id="Capa_9" data-name="Capa 9">
        <path style={svgStyle} d="M46.75,10.83,80.66,68.17A4.28,4.28,0,0,1,77,74.63H9.87a4.28,4.28,0,0,1-3.71-6.42L39.37,10.87A4.27,4.27,0,0,1,46.75,10.83Z" />
        <polygon style={cls2Style} points="43.12 15.21 75.58 70.09 11.35 70.09 43.12 15.21" />
        <path style={{ fill: '#fff' }} d="M46.7,55.89H39.54a.61.61,0,0,1-.61-.57L37.9,36a.61.61,0,0,1,.61-.64h8.85A.61.61,0,0,1,48,36l-.66,19.33A.61.61,0,0,1,46.7,55.89Z" />
        <rect style={{ fill: '#fff' }} x="38.86" y="58.88" width="8.14" height="5.64" rx="0.76" />
      </g>
    </svg>
  );
};