import { format } from 'date-fns'
import {
  Tooltip,
  XAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import CustomTooltip from './custom-tooltip'

const LineVariant = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, 'dd, MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />

        <Tooltip content={<CustomTooltip />} />

        <Line
          dataKey="income"
          stroke="#3D82F6"
          strokeWidth={2}
          className="drop-shadow-lg"
        />
        <Line
          dataKey="expenses"
          stroke="#F43F5E"
          strokeWidth={2}
          className="drop-shadow-lg"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineVariant
