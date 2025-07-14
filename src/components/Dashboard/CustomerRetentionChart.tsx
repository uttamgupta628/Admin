import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'Jan', retention: 70 },
  { month: 'Feb', retention: 68 },
  { month: 'Mar', retention: 72 },
  { month: 'Apr', retention: 75 },
  { month: 'May', retention: 78 },
  { month: 'Jun', retention: 80 },
];

export default function CustomerRetentionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Retention Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="retention"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
