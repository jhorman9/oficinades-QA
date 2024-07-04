import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarComponent = ({ejex, ejey}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: false,
    },
    scales: {
      x: {
        title: {
          display: true,
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false, 
        },
      },
      y: {
        title: {
          display: true,
        },
        ticks: {
          min: 0,
          max: 90,
          stepSize: 15,
          // autoSkip: false,
        },
        grid: {
          display: true, 
        },
      },
    },
    layout: {
      padding: {
        top: 40,
        left: -25,
        bottom: -20,
      },
    },
    animation: {
      duration: 0,
    },
  };
  

  const baseColor = '#006491';

  const getBarColor = (index) => {
    return index === ejey.length - 1 ? '#5c6b94' : baseColor;
  };

  const data = {
    labels: ejex,
    datasets: [
      {
        backgroundColor: ejey?.map((value, index) => getBarColor(index)),
        data: ejey,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarComponent;