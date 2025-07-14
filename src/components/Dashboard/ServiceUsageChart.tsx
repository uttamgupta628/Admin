import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { name: 'Laundry', value: 30 },
  { name: 'Ride Share', value: 25 },
  { name: 'Car Parking', value: 20 },
  { name: 'Food Delivery', value: 15 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#8b5cf6'];

export default function ServiceUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Usage</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((__, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
