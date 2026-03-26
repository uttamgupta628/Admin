import { useEffect, useState } from 'react';
import NavbarWrapper from '@/components/Wrapper/NavbarWrapper';
import { useNavigate } from 'react-router-dom';
import {
  // BarChart,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  // UserCheck,
  Briefcase,
  // Calendar,
  LogOut,
} from 'lucide-react';
import TopMerchantsTable from '@/components/Dashboard/TopMerchantsTable';
import TopUsersTable from '@/components/Dashboard/TopUsersTable';

interface DashboardStats {
  totalMerchants: number;
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  revenueChange: number;
  ordersChange: number;
  merchantsChange: number;
  usersChange: number;
}

interface RecentOrder {
  id: string;
  user: string;
  amount: number;
  status: string;
  date: string;
  type: string;
  serviceName: string;
}

// Mock data for charts (replace with API calls)
const mockUserGrowth = [
  { month: 'Jan', users: 120, merchants: 40 },
  { month: 'Feb', users: 150, merchants: 45 },
  { month: 'Mar', users: 180, merchants: 52 },
  { month: 'Apr', users: 220, merchants: 60 },
  { month: 'May', users: 270, merchants: 68 },
  { month: 'Jun', users: 310, merchants: 75 },
];

const mockServiceUsage = [
  { name: 'Parking Lot', value: 450 },
  { name: 'Garage', value: 280 },
  { name: 'Dry Cleaner', value: 190 },
  { name: 'Residence Parking', value: 320 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No admin token found!');
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/logout`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert(data.message || 'Logout failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }
  };

  // Fetch dashboard summary data (same as before)
  const fetchDashboardStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Replace with real API endpoints
      const merchantsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-all-merchants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const merchantsData = await merchantsRes.json();
      const totalMerchants =
        merchantsData.statusCode === 200
          ? merchantsData.data.merchants.length
          : 0;

      const usersRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-all-users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const usersData = await usersRes.json();
      const totalUsers =
        usersData.statusCode === 200 ? usersData.data.users.length : 0;

      setStats({
        totalMerchants,
        totalUsers,
        totalRevenue: 125000, // replace with actual data
        totalOrders: 452,
        revenueChange: 12.5,
        ordersChange: 8.3,
        merchantsChange: 5.2,
        usersChange: 15.7,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent orders from backend
  const fetchRecentOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/recent-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.statusCode === 200) {
        setRecentOrders(data.data);
      } else {
        console.error('Failed to fetch recent orders', data.message);
        setRecentOrders([]);
      }
    } catch (error) {
      console.error('Error fetching recent orders', error);
      setRecentOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    changeType = 'increase',
    prefix = '',
    suffix = '',
  }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-800">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center text-sm">
          {changeType === 'increase' ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }
          >
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <NavbarWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </NavbarWrapper>
    );
  }

  return (
    <NavbarWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Merchants"
              value={stats?.totalMerchants || 0}
              icon={Store}
              change={stats?.merchantsChange}
              changeType="increase"
            />
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              change={stats?.usersChange}
              changeType="increase"
            />
            <StatCard
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              icon={DollarSign}
              prefix="₹"
              change={stats?.revenueChange}
              changeType="increase"
            />
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={ShoppingBag}
              change={stats?.ordersChange}
              changeType="increase"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Growth Trends
                </h2>
                <span className="text-xs text-gray-500">Last 6 months</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockUserGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="merchants"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Merchants"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Service Distribution
                </h2>
                <span className="text-xs text-gray-500">Total bookings</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockServiceUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {mockServiceUsage.map((entry, index) => (
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
            </div>
          </div>

          {/* Recent Orders Activity - Now with real data */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Orders
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.serviceName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent orders found.
              </div>
            )}
          </div>

          {/* Top Merchants and Users Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Top Merchants
                </h2>
                <p className="text-sm text-gray-500">
                  Highest performing merchants
                </p>
              </div>
              <TopMerchantsTable />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Top Users
                </h2>
                <p className="text-sm text-gray-500">Most active users</p>
              </div>
              <TopUsersTable />
            </div>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default Home;
