import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, X, CreditCard, User, Mail, Phone, Building } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/admin/get-all-merchants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.statusCode === 200) {
        console.log('Merchants data:', data.data.merchants); // Debug log
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
      // Try the most likely correct endpoint based on your backend structure
      const endpoints = [
        // First try: Generic admin bank details endpoint with userType
        `${import.meta.env.VITE_API_URL}/api/users/admin/bank-details/${merchantId}?userType=merchant`,
        // Second try: Specific merchant bank details endpoint
        `${import.meta.env.VITE_API_URL}/api/users/admin/merchant/bank-details/${merchantId}?userType=merchant`,
        // Third try: Alternative merchant endpoint
        `${import.meta.env.VITE_API_URL}/api/merchants/bank-details/${merchantId}`,
        // Fourth try: Direct merchant API
        `${import.meta.env.VITE_API_URL}/api/merchant/${merchantId}/bank-details`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
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
              console.log(`Success with endpoint: ${endpoint}`);
              return;
            }
          } else if (res.status === 404) {
            console.log(`404 for endpoint: ${endpoint}`);
            continue; // Try next endpoint
          }
        } catch (endpointError) {
          console.log(`Error with endpoint ${endpoint}:`, endpointError);
          continue; // Try next endpoint
        }
      }

      // If all endpoints failed, set bank details to null
      console.log('All endpoints failed, no bank details found');
      setBankDetails(null);

    } catch (error: any) {
      console.error('General fetch bank details error:', error);
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

    if (!window.confirm('Are you sure you want to delete this merchant?')) return;

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
    
    // Check if bank details are already in the merchant object
    if (merchant.bankDetails) {
      console.log('Bank details found in merchant object:', merchant.bankDetails);
      setBankDetails(merchant.bankDetails);
      setLoadingBankDetails(false);
    } else {
      console.log('No bank details in merchant object, trying API...');
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

  const getMerchantServices = (merchant: Merchant) => {
    return [
      { name: 'Parking Lot', active: merchant.haveParkingLot },
      { name: 'Garage', active: merchant.haveGarage },
      { name: 'Dry Cleaner', active: merchant.haveDryCleaner },
      { name: 'Residence Parking', active: merchant.haveResidenceParking },
    ];
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <>
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">All Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <Table className="border-collapse w-full">
              <TableHeader>
                <TableRow className="bg-gray-200 text-gray-700 font-bold text-sm">
                  <TableHead className="border px-4 py-2">Name</TableHead>
                  <TableHead className="border px-4 py-2">Email</TableHead>
                  <TableHead className="border px-4 py-2">Phone</TableHead>
                  <TableHead className="border px-4 py-2">Merchant Type</TableHead>
                  <TableHead className="border px-4 py-2">Actions</TableHead>
                  <TableHead className="border px-4 py-2">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : merchants.length > 0 ? (
                  merchants.map((merchant) => (
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
                    <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                      No merchants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Merchant Details Modal */}
      {showDetailsModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6" />
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

            {/* Merchant Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">
                      {selectedMerchant.firstName} {selectedMerchant.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{selectedMerchant.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{selectedMerchant.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <Building className="w-5 h-5" />
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
              <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Details
              </h3>

              {loadingBankDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading bank details...</span>
                </div>
              ) : bankDetails ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Account Holder:</span>
                      <p className="text-gray-900 font-medium">{bankDetails.accountHolderName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Account Number:</span>
                      <p className="text-gray-900 font-mono">{bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Bank Name:</span>
                      <p className="text-gray-900">{bankDetails.bankName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">IFSC Code:</span>
                      <p className="text-gray-900 font-mono">{bankDetails.ifscCode}</p>
                    </div>
                    {(bankDetails.branchName || bankDetails.branch) && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Branch:</span>
                        <p className="text-gray-900">{bankDetails.branchName || bankDetails.branch}</p>
                      </div>
                    )}
                    {bankDetails.upiId && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">UPI ID:</span>
                        <p className="text-gray-900 font-mono">{bankDetails.upiId}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 italic">No bank details found for this merchant.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Bank details may not be configured yet.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => navigate(`/admin/merchant/${selectedMerchant._id}`)}
                variant="outline"
                className="px-6"
              >
                Go to Full Details
              </Button>
              <Button
                onClick={closeDetailsModal}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}