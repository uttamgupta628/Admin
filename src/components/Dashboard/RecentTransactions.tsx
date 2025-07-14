import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const transactions = [
  {
    user: 'John Doe',
    amount: '$50',
    service: 'Ride Share',
    date: '2025-03-05',
  },
  { user: 'Jane Smith', amount: '$30', service: 'Laundry', date: '2025-03-04' },
  {
    user: 'Mike Johnson',
    amount: '$20',
    service: 'Food Delivery',
    date: '2025-03-03',
  },
  {
    user: 'Alice Brown',
    amount: '$40',
    service: 'Car Parking',
    date: '2025-03-02',
  },
  {
    user: 'Chris Evans',
    amount: '$100',
    service: 'Ride Share',
    date: '2025-03-01',
  },
];

export default function RecentTransactions() {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="border-collapse border border-gray-300 w-full">
            <TableHeader>
              <TableRow className="bg-gray-200 text-gray-700 font-bold text-sm">
                <TableHead className="border border-gray-300 px-4 py-2">
                  User
                </TableHead>
                <TableHead className="border border-gray-300 px-4 py-2">
                  Amount
                </TableHead>
                <TableHead className="border border-gray-300 px-4 py-2">
                  Service
                </TableHead>
                <TableHead className="border border-gray-300 px-4 py-2">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <TableCell className="border border-gray-300 px-4 py-2 text-gray-900">
                    {tx.user}
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2 text-gray-900">
                    {tx.amount}
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2 text-gray-900">
                    {tx.service}
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2 text-gray-900">
                    {tx.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
