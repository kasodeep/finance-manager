import { format } from 'date-fns'
import {
  Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import CustomTooltip from './custom-tooltip'

const AreaVariant = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3D82F6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3D82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#F43F5E" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#F43F5E" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value)
            const options = { day: '2-digit', month: 'short' }
            return date.toLocaleDateString(undefined, options)
          }}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          strokeWidth={2}
          stroke="#3D82F6"
          fill="url(#income)"
          className="drop-shadow-lg"
        />

        <Area
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          strokeWidth={2}
          stroke="#F43F5E"
          fill="url(#expenses)"
          className="drop-shadow-lg"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default AreaVariant
