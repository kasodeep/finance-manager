import { formatCurrency } from '@/lib/utils'

import {
  RadialBar,
  Legend,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354']

const RadialVariant = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="40%"
        barSize={10}
        innerRadius="90%"
        outerRadius="40%"
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }))}
      >
        {/* legend to display name of category. */}
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2"
                  >
                    {/* circle. */}
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />

                    {/* name and percentage. */}
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm">
                        {formatCurrency(entry.payload.value)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          }}
        />

        {/* radial. */}
        <RadialBar
          label={{ position: 'insideStart', fill: '#FFF', fontSize: '12px' }}
          background
          dataKey="amount"
        />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

export default RadialVariant