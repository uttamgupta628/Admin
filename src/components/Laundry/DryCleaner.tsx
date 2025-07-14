import React, { useEffect, useState } from "react";
import axios from "axios";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface Owner {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface DryCleaner {
  _id: string;
  shopname: string;
  address: Address;
  phoneNumber: string;
  contactPerson: string;
  shopimage: string[];
  owner: Owner;
  rating: number;
}

const DryCleanerList: React.FC = () => {
  const [dryCleaners, setDryCleaners] = useState<DryCleaner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchDryCleaners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/admin/get-all-dry-cleaners",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDryCleaners(response.data.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch dry cleaners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDryCleaners();
  }, []);

  if (loading) return <div className="text-center p-4">Loading dry cleaners...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dryCleaners.length > 0 ? (
        dryCleaners.map((cleaner) => (
          <div key={cleaner._id} className="border rounded-lg shadow p-4 bg-white">
            <img
              src={
                cleaner.shopimage?.[0] ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={cleaner.shopname}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-1">{cleaner.shopname}</h2>
            <p className="text-gray-600 mb-1">📍 {cleaner.address?.street}, {cleaner.address?.city}</p>
            <p className="text-gray-800">📞 {cleaner.phoneNumber}</p>
            <p className="text-gray-800">👤 {cleaner.contactPerson}</p>
            <p className="text-sm text-gray-600">⭐ Rating: {cleaner.rating}</p>
            {cleaner.owner && (
              <div className="mt-2 text-sm">
                <p><strong>Owner:</strong> {cleaner.owner.fullName}</p>
                <p>Email: {cleaner.owner.email}</p>
                <p>Phone: {cleaner.owner.phoneNumber}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No dry cleaners found.</p>
      )}
    </div>
  );
};

export default DryCleanerList;
