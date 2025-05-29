import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import React from 'react';

export const BarChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: data || [12000, 19000, 15000, 20000, 25000, 22000],
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderRadius: 4,
      }
    ]
  };

  return <BarChart data={chartData} />;
};

export const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Direct', 'Organic', 'Referral', 'Social'],
    datasets: [
      {
        data: data || [35, 25, 20, 20],
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(236, 72, 153, 0.7)'
        ],
        borderWidth: 0,
      }
    ]
  };

  return <PieChart data={chartData} />;
};