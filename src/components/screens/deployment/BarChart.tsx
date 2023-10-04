import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

function getLast7Days(): string[] {
  const dates: string[] = []

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString())
  }

  return dates.reverse()
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      title: { text: 'Number of rows', display: true },
    },
  },
}

const labels = getLast7Days()

export const data = {
  labels,
  datasets: [
    {
      label: 'Success',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 175 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Failed',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 25 })),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export function BarChart() {
  return (
    <div className="col-span-4">
      <h4 className="mt-6 text-lg font-medium">Last 7 Days</h4>
      <Bar className="w-1/2" options={options} data={data} />
    </div>
  )
}
