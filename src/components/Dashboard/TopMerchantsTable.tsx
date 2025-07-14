import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye } from 'lucide-react';
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
}

export default function AllMerchantsTable() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleViewDetails = (merchantId: string) => {
    navigate(`/admin/merchant/${merchantId}`);
  };

  const getMerchantType = (merchant: Merchant) => {
    const types = [];
    if (merchant.haveParkingLot) types.push('Parking Lot');
    if (merchant.haveGarage) types.push('Garage');
    if (merchant.haveDryCleaner) types.push('Dry Cleaner');
    if (merchant.haveResidenceParking) types.push('Residence Parking');
    return types.length ? types.join(', ') : 'N/A';
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
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
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
                    </TableCell>
                    <TableCell className="border px-4 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(merchant._id)}
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
  );
}
