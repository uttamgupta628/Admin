import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function AllUsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found — redirecting to login.');
      navigate('/');
      return;
    }

    try {
      const res = await fetch(
        'http://localhost:5000/api/users/admin/get-all-users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.statusCode === 200) {
        setUsers(data.data.users);
      } else {
        console.error('Failed to fetch users', data.message);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found — redirecting to login.');
      navigate('/');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/admin/delete-user/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.statusCode === 200) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Failed to delete user: ' + data.message);
      }
    } catch (error) {
      console.error('Delete user error:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-gray-200 text-gray-700 font-bold text-sm">
                <TableHead className="border px-4 py-2">Name</TableHead>
                <TableHead className="border px-4 py-2">Email</TableHead>
                <TableHead className="border px-4 py-2">Phone</TableHead>
                <TableHead className="border px-4 py-2">
                  Car License Plate
                </TableHead>
                <TableHead className="border px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user: any, index: number) => (
                  <TableRow
                    key={user._id}
                    className={
                      index % 2 === 0
                        ? 'bg-gray-50'
                        : 'bg-white hover:bg-gray-100 transition duration-150'
                    }
                  >
                    <TableCell className="border px-4 py-2 text-gray-900">
                      {user.firstName}
                    </TableCell>
                    <TableCell className="border px-4 py-2 text-gray-900">
                      {user.email}
                    </TableCell>
                    <TableCell className="border px-4 py-2 text-gray-900">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="border px-4 py-2 text-gray-900">
                      {user.carLicensePlateImage ? (
                        user.carLicensePlateImage
                      ) : (
                        <span className="text-gray-500 italic">N/A</span>
                      )}
                    </TableCell>

                    <TableCell className="border px-4 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
