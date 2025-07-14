import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MerchantDetailsPage() {
  const { id } = useParams();
  const [merchant, setMerchant] = useState<any>(null);
  const navigate = useNavigate();

  const fetchMerchant = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/admin/get-merchant/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.statusCode === 200) {
        setMerchant(data.data.merchant);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, [id]);

  if (!merchant)
    return (
      <div className="text-center mt-16 text-gray-600 text-lg">Loading Merchant Details...</div>
    );

  return (
    <Card className="max-w-3xl mx-auto mt-10 border border-gray-300 shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">Merchant Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {merchant.firstName} {merchant.lastName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {merchant.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {merchant.phoneNumber}
          </p>
          <p>
            <span className="font-semibold">User Type:</span> {merchant.userType}
          </p>
          <p>
            <span className="font-semibold">Services:</span>{' '}
            {merchant.haveGarage && 'Garage, '}
            {merchant.haveParkingLot && 'Parking Lot, '}
            {merchant.haveDryCleaner && 'Dry Cleaner, '}
            {merchant.haveResidenceParking && 'Residence Parking, '}
            {!merchant.haveGarage &&
              !merchant.haveParkingLot &&
              !merchant.haveDryCleaner &&
              !merchant.haveResidenceParking && 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Country:</span> {merchant.country || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">State:</span> {merchant.state || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Zip Code:</span> {merchant.zipCode || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Verified:</span>{' '}
            {merchant.isVerified ? 'Yes' : 'No'}
          </p>

          {/* Queries section */}
          {merchant.queries?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Queries:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {merchant.queries.map((query: any, index: number) => (
                  <li key={index}>
                    <p className="font-medium">{query.subject}</p>
                    <p className="text-sm text-gray-600">{query.message}</p>
                    <p className="text-xs text-gray-500 italic">Status: {query.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ⬅ Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
