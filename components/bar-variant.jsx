import { format } from 'date-fns'
import {
  Tooltip,
  XAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import CustomTooltip from './custom-tooltip'

const BarVariant = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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

        <Bar dataKey="income" fill="#3D82F6" className="drop-shadow-lg" />
        <Bar dataKey="expenses" fill="#F43F5E" className="drop-shadow-lg" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarVariant
