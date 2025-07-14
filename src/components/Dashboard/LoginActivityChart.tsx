import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { day: 'Mon', logins: 500 },
  { day: 'Tue', logins: 450 },
  { day: 'Wed', logins: 600 },
  { day: 'Thu', logins: 700 },
  { day: 'Fri', logins: 650 },
  { day: 'Sat', logins: 550 },
  { day: 'Sun', logins: 400 },
];

export default function LoginActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Login Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="logins" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
