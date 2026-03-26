import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Eye,
  X,
  CreditCard,
  User,
  Mail,
  Phone,
  Building,
  ArrowLeft,
  TrendingUp,
  Users,
  Briefcase,
  Banknote,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

interface Merchant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  haveParkingLot: boolean;
  haveGarage: boolean;
  haveDryCleaner: boolean;
  haveResidenceParking: boolean;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName?: string;
    branch?: string;
    branchName?: string;
    upiId?: string;
  };
}

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName?: string;
  ifscCode: string;
  branch?: string;
  branchName?: string;
  upiId?: string;
}

export default function AllMerchantsTable() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const fetchMerchants = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found — redirecting to login.');
      navigate('/');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-all-merchants`,
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
        setMerchants(data.data.merchants);
      } else {
        console.error('Failed to fetch merchants', data.message);
      }
    } catch (error) {
      console.error('Fetch merchants error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async (merchantId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found — redirecting to login.');
      navigate('/');
      return;
    }

    setLoadingBankDetails(true);
    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/api/users/admin/bank-details/${merchantId}?userType=merchant`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.statusCode === 200 && data.data) {
          setBankDetails(data.data);
          return;
        }
      }
      setBankDetails(null);
    } catch (error) {
      console.error('Fetch bank details error:', error);
      setBankDetails(null);
    } finally {
      setLoadingBankDetails(false);
    }
  };

  const handleDelete = async (merchantId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found — redirecting to login.');
      navigate('/');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this merchant?'))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/admin/delete-merchant/${merchantId}`,
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
        alert('Merchant deleted successfully!');
        fetchMerchants();
      } else {
        alert('Failed to delete merchant: ' + data.message);
      }
    } catch (error) {
      console.error('Delete merchant error:', error);
    }
  };

  const handleViewDetails = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowDetailsModal(true);
    if (merchant.bankDetails) {
      setBankDetails(merchant.bankDetails);
      setLoadingBankDetails(false);
    } else {
      setBankDetails(null);
      fetchBankDetails(merchant._id);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMerchant(null);
    setBankDetails(null);
  };

  const getMerchantType = (merchant: Merchant) => {
    const types = [];
    if (merchant.haveParkingLot) types.push('Parking Lot');
    if (merchant.haveGarage) types.push('Garage');
    if (merchant.haveDryCleaner) types.push('Dry Cleaner');
    if (merchant.haveResidenceParking) types.push('Residence Parking');
    return types.length ? types.join(', ') : 'N/A';
  };

  const getMerchantServices = (merchant: Merchant) => [
    { name: 'Parking Lot', active: merchant.haveParkingLot },
    { name: 'Garage', active: merchant.haveGarage },
    { name: 'Dry Cleaner', active: merchant.haveDryCleaner },
    { name: 'Residence Parking', active: merchant.haveResidenceParking },
  ];

  // Filter merchants based on search
  useEffect(() => {
    const filtered = merchants.filter((merchant) => {
      const fullName =
        `${merchant.firstName} ${merchant.lastName}`.toLowerCase();
      const email = merchant.email.toLowerCase();
      const phone = merchant.phoneNumber;
      const term = searchTerm.toLowerCase();
      return (
        fullName.includes(term) || email.includes(term) || phone.includes(term)
      );
    });
    setFilteredMerchants(filtered);
    setCurrentPage(1);
  }, [searchTerm, merchants]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMerchants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Merchant Type',
      'Has Bank Details',
    ];
    const rows = filteredMerchants.map((m) => [
      `"${m.firstName} ${m.lastName}"`,
      m.email,
      m.phoneNumber,
      getMerchantType(m),
      m.bankDetails ? 'Yes' : 'No',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'merchants.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Stats and chart data
  const totalMerchants = merchants.length;
  const merchantsWithBankDetails = merchants.filter(
    (m) => m.bankDetails
  ).length;

  const serviceBarData = [
    {
      name: 'Parking Lot',
      value: merchants.filter((m) => m.haveParkingLot).length,
    },
    { name: 'Garage', value: merchants.filter((m) => m.haveGarage).length },
    {
      name: 'Dry Cleaner',
      value: merchants.filter((m) => m.haveDryCleaner).length,
    },
    {
      name: 'Residence Parking',
      value: merchants.filter((m) => m.haveResidenceParking).length,
    },
  ];

  const servicePieData = serviceBarData.map((item, idx) => ({
    ...item,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx % 4],
  }));

  useEffect(() => {
    fetchMerchants();
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
            <CardTitle className="text-xl text-gray-800">
              All Merchants
            </CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardHeader>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Merchants</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalMerchants}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <Banknote className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">With Bank Details</p>
                <p className="text-2xl font-bold text-gray-800">
                  {merchantsWithBankDetails}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <Briefcase className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-800">
                  {serviceBarData.filter((s) => s.value > 0).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Services/Merchant</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalMerchants
                    ? (
                        merchants.reduce(
                          (acc, m) =>
                            acc +
                            (m.haveParkingLot ? 1 : 0) +
                            (m.haveGarage ? 1 : 0) +
                            (m.haveDryCleaner ? 1 : 0) +
                            (m.haveResidenceParking ? 1 : 0),
                          0
                        ) / totalMerchants
                      ).toFixed(1)
                    : '0'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        {!loading && totalMerchants > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Services Distribution (Bar)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      name="Number of Merchants"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Services Distribution (Pie)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={servicePieData}
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
                      {servicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
                    Merchant Type
                  </TableHead>
                  <TableHead className="border px-4 py-2">Actions</TableHead>
                  <TableHead className="border px-4 py-2">Details</TableHead>
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
                  currentItems.map((merchant) => (
                    <TableRow
                      key={merchant._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {merchant.firstName} {merchant.lastName}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {merchant.email}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {merchant.phoneNumber}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-gray-900">
                        {getMerchantType(merchant)}
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(merchant._id)}
                          title="Delete Merchant"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </TableCell>
                      <TableCell className="border px-4 py-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(merchant)}
                          title="View Details & Bank Info"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
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
                      No merchants found.
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
                {Math.min(indexOfLastItem, filteredMerchants.length)} of{' '}
                {filteredMerchants.length} merchants
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

      {/* Merchant Details Modal */}
      {showDetailsModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                Merchant Details
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-md font-semibold mb-2 text-gray-800">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-xs text-gray-500">Name</span>
                    <p className="text-gray-900">
                      {selectedMerchant.firstName} {selectedMerchant.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="text-gray-900 break-all">
                      {selectedMerchant.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-xs text-gray-500">Phone</span>
                    <p className="text-gray-900">
                      {selectedMerchant.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-md font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Services Offered
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {getMerchantServices(selectedMerchant).map((service) => (
                  <div
                    key={service.name}
                    className={`flex items-center gap-2 p-2 rounded ${
                      service.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.active ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Bank Details
              </h3>
              {loadingBankDetails ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Loading...</span>
                </div>
              ) : bankDetails ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">
                        Account Holder
                      </span>
                      <p className="font-medium">
                        {bankDetails.accountHolderName}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        Account Number
                      </span>
                      <p className="font-mono">{bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Bank Name</span>
                      <p>{bankDetails.bankName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">IFSC Code</span>
                      <p className="font-mono">{bankDetails.ifscCode}</p>
                    </div>
                    {(bankDetails.branchName || bankDetails.branch) && (
                      <div>
                        <span className="text-xs text-gray-500">Branch</span>
                        <p>{bankDetails.branchName || bankDetails.branch}</p>
                      </div>
                    )}
                    {bankDetails.upiId && (
                      <div>
                        <span className="text-xs text-gray-500">UPI ID</span>
                        <p className="font-mono">{bankDetails.upiId}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    No bank details found.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() =>
                  navigate(`/admin/merchant/${selectedMerchant._id}`)
                }
                variant="outline"
                size="sm"
              >
                Full Details
              </Button>
              <Button onClick={closeDetailsModal} size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
