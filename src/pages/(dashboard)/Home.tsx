import { useEffect, useState, useCallback } from 'react';
import NavbarWrapper from '@/components/Wrapper/NavbarWrapper';
import { useNavigate } from 'react-router-dom';
import {
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
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  Briefcase,
  LogOut,
  Car,
  Home as HomeIcon,
  Shirt,
  RefreshCw,
  Eye,
  Calendar,
  Filter,
  ChevronDown,
} from 'lucide-react';
import TopMerchantsTable from '@/components/Dashboard/TopMerchantsTable';
import TopUsersTable from '@/components/Dashboard/TopUsersTable';

// ─── Types ────────────────────────────────────────────────────
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
  email: string;
  amount: number;
  status: string;
  date: string;
  type: string;
  typeColor: string;
  serviceName: string;
  serviceAddress: string;
  slot: string;
  paymentMethod: string;
}

// ─── Constants ────────────────────────────────────────────────
const mockUserGrowth = [
  { month: 'Jan', users: 120, merchants: 40, revenue: 45000 },
  { month: 'Feb', users: 150, merchants: 45, revenue: 52000 },
  { month: 'Mar', users: 180, merchants: 52, revenue: 61000 },
  { month: 'Apr', users: 220, merchants: 60, revenue: 74000 },
  { month: 'May', users: 270, merchants: 68, revenue: 89000 },
  { month: 'Jun', users: 310, merchants: 75, revenue: 102000 },
];

const SERVICE_COLORS: Record<string, string> = {
  Garage: '#6366f1',
  Parking: '#10b981',
  Residence: '#f59e0b',
  DryCleaner: '#ec4899',
};

const TYPE_ICONS: Record<string, any> = {
  Garage: Car,
  Parking: Car,
  Residence: HomeIcon,
  DryCleaner: Shirt,
};

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  failed: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'increase',
  prefix = '',
  suffix = '',
  accent,
}: {
  title: string;
  value: number | string;
  icon: any;
  change?: number;
  changeType?: 'increase' | 'decrease';
  prefix?: string;
  suffix?: string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl font-bold mt-1.5 text-gray-900 tracking-tight">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            {suffix}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {changeType === 'increase' ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={
                  changeType === 'increase'
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }
              >
                {Math.abs(change)}%
              </span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${accent} flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Service Badge ────────────────────────────────────────────
function ServiceBadge({ type }: { type: string }) {
  const color = SERVICE_COLORS[type] || '#6b7280';
  const Icon = TYPE_ICONS[type] || ShoppingBag;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <Icon className="w-3 h-3" />
      {type}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<RecentOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [serviceDistribution, setServiceDistribution] = useState<
    { name: string; value: number }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  // ── Auth helper ──
  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return null;
    }
    return token;
  };

  // ── Logout ──
  const handleLogout = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/logout`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert(data.message || 'Logout failed');
      }
    } catch {
      alert('Something went wrong!');
    }
  };

  // ── Fetch Stats ──
  const fetchDashboardStats = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const [merchantsRes, usersRes] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/api/users/admin/get-all-merchants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(`${import.meta.env.VITE_API_URL}/api/users/admin/get-all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const merchantsData = await merchantsRes.json();
      const usersData = await usersRes.json();
      setStats({
        totalMerchants:
          merchantsData.statusCode === 200
            ? merchantsData.data.merchants.length
            : 0,
        totalUsers:
          usersData.statusCode === 200 ? usersData.data.users.length : 0,
        totalRevenue: 0,
        totalOrders: 0,
        revenueChange: 12.5,
        ordersChange: 8.3,
        merchantsChange: 5.2,
        usersChange: 15.7,
      });
    } catch (e) {
      console.error('Failed to fetch dashboard stats', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch Orders ──
  const fetchRecentOrders = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/recent-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.statusCode === 200) {
        const orders: RecentOrder[] = data.data.orders || data.data || [];
        setRecentOrders(orders);
        setFilteredOrders(orders);

        // Update stats with real revenue/orders
        setStats((prev) =>
          prev
            ? {
                ...prev,
                totalRevenue:
                  data.data.totalRevenue ||
                  orders.reduce((s, o) => s + o.amount, 0),
                totalOrders: data.data.totalOrders || orders.length,
              }
            : prev
        );

        // Build service distribution from real data
        const dist: Record<string, number> = {};
        orders.forEach((o) => {
          dist[o.type] = (dist[o.type] || 0) + 1;
        });
        setServiceDistribution(
          Object.entries(dist).map(([name, value]) => ({ name, value }))
        );
      }
    } catch (e) {
      console.error('Error fetching recent orders', e);
      setRecentOrders([]);
      setFilteredOrders([]);
    } finally {
      setOrdersLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  // ── Filter orders ──
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredOrders(recentOrders);
    } else {
      setFilteredOrders(recentOrders.filter((o) => o.type === activeFilter));
    }
  }, [activeFilter, recentOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecentOrders();
  };

  const filterTypes = ['All', 'Garage', 'Parking', 'Residence', 'DryCleaner'];

  // ── Order Detail Modal ──
  const OrderModal = ({
    order,
    onClose,
  }: {
    order: RecentOrder;
    onClose: () => void;
  }) => (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="text-sm font-mono font-semibold text-gray-800">
              #{order.id.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Customer</span>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {order.user}
              </p>
              <p className="text-xs text-gray-400">{order.email}</p>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Service</span>
            <div className="text-right">
              <ServiceBadge type={order.type} />
              <p className="text-xs text-gray-600 mt-1">{order.serviceName}</p>
            </div>
          </div>
          {order.slot && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Slot</span>
              <span className="text-sm font-semibold text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded">
                {order.slot}
              </span>
            </div>
          )}
          {order.serviceAddress && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Address</span>
              <span className="text-sm text-gray-700 text-right max-w-[200px]">
                {order.serviceAddress}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Amount</span>
            <span className="text-base font-bold text-gray-900">
              ${Number(order.amount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Payment</span>
            <span className="text-sm text-gray-700">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">Status</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
            >
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm text-gray-700">
              {new Date(order.date).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <NavbarWrapper>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading dashboard…</p>
          </div>
        </div>
      </NavbarWrapper>
    );
  }

  const completedCount = recentOrders.filter(
    (o) => o.status === 'completed'
  ).length;
  const pendingCount = recentOrders.filter(
    (o) => o.status === 'pending'
  ).length;
  const failedCount = recentOrders.filter((o) => o.status === 'failed').length;

  return (
    <NavbarWrapper>
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 space-y-6">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Merchants"
              value={stats?.totalMerchants || 0}
              icon={Store}
              change={stats?.merchantsChange}
              changeType="increase"
              accent="bg-indigo-500"
            />
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              change={stats?.usersChange}
              changeType="increase"
              accent="bg-emerald-500"
            />
            <StatCard
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              icon={DollarSign}
              prefix="$"
              change={stats?.revenueChange}
              changeType="increase"
              accent="bg-amber-500"
            />
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders || recentOrders.length}
              icon={ShoppingBag}
              change={stats?.ordersChange}
              changeType="increase"
              accent="bg-rose-500"
            />
          </div>

          {/* ── Order Status Summary ── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {completedCount}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Completed</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Pending</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{failedCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Failed</p>
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Revenue Area Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Growth
                    Trends
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Users, merchants & revenue over 6 months
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={mockUserGrowth}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorMerchants"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorUsers)"
                    name="Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="merchants"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorMerchants)"
                    name="Merchants"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Service Distribution Pie */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" /> Service
                  Split
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Orders by service type
                </p>
              </div>
              {serviceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {serviceDistribution.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={SERVICE_COLORS[entry.name] || '#6b7280'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Loading chart…</p>
                  </div>
                </div>
              )}
              {/* Legend */}
              <div className="mt-3 space-y-1.5">
                {serviceDistribution.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            SERVICE_COLORS[item.name] || '#6b7280',
                        }}
                      />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Revenue Bar Chart ── */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
              <DollarSign className="w-4 h-4 text-amber-500" /> Monthly Revenue
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockUserGrowth} barSize={32}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [
                    `$${v.toLocaleString('en-IN')}`,
                    'Revenue',
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Recent Orders ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> Recent
                    Orders
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {filteredOrders.length} orders shown
                  </p>
                </div>
                {/* Filter pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {filterTypes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        activeFilter === f
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Fetching orders…</p>
                </div>
              </div>
            ) : filteredOrders.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {[
                          'Order ID',
                          'Customer',
                          'Service',
                          'Type',
                          'Amount',
                          'Status',
                          'Date',
                          '',
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-indigo-50/30 transition-colors group"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                            #{order.id.slice(-8)}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <p className="font-semibold text-gray-800 text-sm">
                              {order.user}
                            </p>
                            <p className="text-xs text-gray-400">
                              {order.email}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm text-gray-700 font-medium">
                              {order.serviceName}
                            </p>
                            {order.slot && (
                              <span className="text-xs text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                {order.slot}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <ServiceBadge type={order.type} />
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap font-bold text-gray-900">
                            ${Number(order.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                            {new Date(order.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-indigo-100 rounded-lg text-indigo-600"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {order.user}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            #{order.id.slice(-8)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ServiceBadge type={order.type} />
                          <span className="text-xs text-gray-500">
                            {order.serviceName}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          ${Number(order.amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No orders found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {activeFilter !== 'All'
                    ? `No ${activeFilter} orders yet`
                    : 'Orders will appear here once placed'}
                </p>
              </div>
            )}
          </div>

          {/* ── Top Merchants & Users ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                    <Store className="w-4 h-4 text-indigo-500" /> Top Merchants
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Highest performing
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/merchants')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                </button>
              </div>
              <TopMerchantsTable />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                    <Users className="w-4 h-4 text-emerald-500" /> Top Users
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Most active users
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                </button>
              </div>
              <TopUsersTable />
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </NavbarWrapper>
  );
}

export default Home;
