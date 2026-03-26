import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowLeft,
  Users,
  Car,
  UserX,
  ShoppingBag,
  X,
  Clock,
  Package,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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
import { Input } from '@/components/ui/input';

interface User {
  _id: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  carLicensePlateImage?: string;
}

interface Order {
  _id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AllUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
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
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-all-users`,
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

  const fetchUserOrders = async (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setOrdersLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-user-orders/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.statusCode === 200) {
        setOrders(data.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
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
        `${import.meta.env.VITE_API_URL}/api/users/admin/delete-user/${userId}`,
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

  const handleViewOrders = (user: User) => {
    setSelectedUser(user);
    fetchUserOrders(user._id);
    setShowOrdersModal(true);
  };

  const closeOrdersModal = () => {
    setShowOrdersModal(false);
    setSelectedUser(null);
    setOrders([]);
  };

  // Filter users based on search
  useEffect(() => {
    const filtered = users.filter((user) => {
      const name = user.firstName.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phoneNumber;
      const term = searchTerm.toLowerCase();
      return (
        name.includes(term) || email.includes(term) || phone.includes(term)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'License Plate'];
    const rows = filteredUsers.map((user) => [
      `"${user.firstName}"`,
      user.email,
      user.phoneNumber,
      user.carLicensePlateImage || 'N/A',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalUsers = users.length;
  const usersWithPlate = users.filter((u) => u.carLicensePlateImage).length;
  const usersWithoutPlate = totalUsers - usersWithPlate;

  const pieData = [
    { name: 'With License Plate', value: usersWithPlate, color: '#3b82f6' },
    { name: 'No License Plate', value: usersWithoutPlate, color: '#ef4444' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-lg border border-gray-200 shadow-sm"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <CardTitle className="text-xl text-gray-800">All Users</CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardHeader>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <Car className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">With License Plate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {usersWithPlate}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <UserX className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">No License Plate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {usersWithoutPlate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        {!loading && totalUsers > 0 && (
          <Card className="mx-6 mb-4 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5" />
                License Plate Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Search and Export */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 pb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Table */}
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
                  <TableHead className="border px-4 py-2">Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : currentItems.length > 0 ? (
                  currentItems.map((user, index) => (
                    <TableRow
                      key={user._id}
                      className={
                        index % 2 === 0
                          ? 'bg-gray-50 hover:bg-gray-100 transition duration-150'
                          : 'bg-white hover:bg-gray-100 transition duration-150'
                      }
                    >
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {user.firstName}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-gray-900 break-all">
                        {user.email}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {user.carLicensePlateImage ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user.carLicensePlateImage}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user._id)}
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrders(user)}
                          className="flex items-center gap-1"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Orders
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-500 py-6"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredUsers.length)} of{' '}
                {filteredUsers.length} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Modal */}
      {showOrdersModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Orders - {selectedUser.firstName}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeOrdersModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading orders...</span>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card
                    key={order._id}
                    className="border border-gray-200 shadow-sm"
                  >
                    <CardHeader className="bg-gray-50 rounded-t-lg p-4">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-gray-600" />
                          <span className="font-mono text-sm text-gray-600">
                            Order #{order._id.slice(-6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium text-gray-600">
                                Item
                              </th>
                              <th className="text-center py-2 font-medium text-gray-600">
                                Qty
                              </th>
                              <th className="text-right py-2 font-medium text-gray-600">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, idx) => (
                              <tr key={idx} className="border-b last:border-0">
                                <td className="py-2 text-gray-800">
                                  {item.name}
                                </td>
                                <td className="py-2 text-center text-gray-800">
                                  {item.quantity}
                                </td>
                                <td className="py-2 text-right text-gray-800">
                                  ₹{item.price}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td
                                colSpan={2}
                                className="py-2 text-right font-medium"
                              >
                                Total:
                              </td>
                              <td className="py-2 text-right font-bold text-gray-900">
                                ₹{order.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 italic">
                  No orders found for this user.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
