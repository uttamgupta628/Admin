import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ParkingLot {
  _id: string;
  images: string[];
  parkingName: string;
  contactNumber: string;
  address: string;
  price: number;
  about: string;
  gpsLocation?: {
    type: string;
    coordinates: [number, number];
  };
  generalAvailable?: {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[];
  spacesList?: Record<
    string,
    {
      count: number;
      price: number;
    }
  >;
}

interface Booking {
  _id: string;
  rentedSlot: string;
  rentFrom: string;
  rentTo: string;
  totalHours: number;
  amountToPaid: number;
}

const ParkingLotList: React.FC = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchParkingLots = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-list-of-parking-lots`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParkingLots(res.data.data);
    } catch (err) {
      console.error('Failed to fetch parking lots:', err);
    }
  };

  const fetchBookings = async (lotId: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-bookings-by-parking-lot/${lotId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    }
  };

  const fetchParkingLotDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-parking-lot/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedLot(res.data.data);
      setCurrentImageIndex(0);
    } catch (err) {
      console.error('Failed to fetch parking lot details:', err);
    }
  };

  const handleDeleteLot = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this parking lot?'))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/admin/delete-parking-lot/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedLot(null);
      fetchParkingLots();
      alert('Parking lot deleted successfully.');
    } catch (err) {
      console.error('Failed to delete parking lot:', err);
      alert('Failed to delete parking lot.');
    }
  };

  useEffect(() => {
    fetchParkingLots();
  }, []);
  const handleOpenDetails = (id: string) => {
    setBookings([]);
    fetchParkingLotDetails(id);
    fetchBookings(id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Parking Lot Management
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingLots.map((lot) => (
            <div
              key={lot._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={
                    lot.images && lot.images.length > 0
                      ? lot.images[0]
                      : 'https://via.placeholder.com/400x200?text=No+Image'
                  }
                  alt={lot.parkingName}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-xl font-semibold text-white">
                    {lot.parkingName}
                  </h2>
                  <p className="text-sm text-white/90">
                    ₹{lot.price} / vehicle
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-2">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {lot.about}
                </p>

                <p className="text-gray-600 text-sm">
                  📞{' '}
                  <span className="font-medium">
                    {lot.contactNumber || 'N/A'}
                  </span>
                </p>

                <p className="text-gray-600 text-sm">
                  📍 <span className="font-medium">{lot.address}</span>
                </p>

                <p className="text-gray-600 text-sm">
                  🚗 Slot Types:{' '}
                  <span className="font-medium">
                    {lot.spacesList ? Object.keys(lot.spacesList).length : 0}
                  </span>
                </p>

                <p className="text-gray-600 text-sm">
                  🕑 Open Now:{' '}
                  <span className="font-medium">
                    {lot.generalAvailable &&
                    lot.generalAvailable.find(
                      (d) =>
                        d.day.toLowerCase() ===
                        new Date()
                          .toLocaleString('en-US', { weekday: 'long' })
                          .toLowerCase()
                    )?.isOpen
                      ? 'Yes'
                      : 'No'}
                  </span>
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleOpenDetails(lot._id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleDeleteLot(lot._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedLot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setSelectedLot(null)}
                className="absolute top-4 right-3 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                &times;
              </button>

              {/* Image Slider */}
              {selectedLot.images && selectedLot.images.length > 0 ? (
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedLot.images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + selectedLot.images.length) %
                          selectedLot.images.length
                      )
                    }
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                  >
                    &#11166;
                  </button>

                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % selectedLot.images.length
                      )
                    }
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                  >
                    &#11166;
                  </button>
                </div>
              ) : (
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                  <img
                    src="https://via.placeholder.com/600x300?text=No+Image"
                    alt="No Image"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedLot.parkingName}
                  </h2>
                  <p className="text-gray-600">{selectedLot.about}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Contact Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span>{' '}
                      {selectedLot.contactNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Address:</span>{' '}
                      {selectedLot.address}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Pricing
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Base Price:</span> ₹
                      {selectedLot.price}
                    </p>
                  </div>
                </div>

                {/* Slots */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Parking Slots
                  </h3>
                  {selectedLot.spacesList &&
                  Object.keys(selectedLot.spacesList).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(selectedLot.spacesList).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-indigo-50 p-3 rounded-lg border border-indigo-100"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-indigo-800 capitalize">
                                {key}
                              </span>
                              <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                {value.count} available
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              Price: ₹{value.price}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="italic text-gray-500 text-center py-2">
                      No slots listed
                    </p>
                  )}
                </div>

                {/* Availability */}
                {selectedLot.generalAvailable && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Opening Hours
                    </h3>
                    <ul className="space-y-2">
                      {selectedLot.generalAvailable.map((day, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-700 capitalize">
                            {day.day}
                          </span>
                          {day.isOpen ? (
                            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                              {day.openTime} - {day.closeTime}
                            </span>
                          ) : (
                            <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                              Closed
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Bookings Section */}
                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    Bookings
                    <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      {bookings.length}
                    </span>
                  </h3>

                  {bookings.length > 0 ? (
                    <div className="space-y-2">
                      {bookings.map((b, idx) => (
                        <div
                          key={b._id}
                          className={`border border-gray-100 rounded p-3 text-sm flex flex-col gap-1 ${
                            idx % 2 === 0 ? 'bg-gray-50' : ''
                          }`}
                        >
                          <div>
                            <strong>Slot:</strong> {b.rentedSlot}
                          </div>
                          <div>
                            <strong>From:</strong>{' '}
                            {new Date(b.rentFrom).toLocaleString()}
                          </div>
                          <div>
                            <strong>To:</strong>{' '}
                            {new Date(b.rentTo).toLocaleString()}
                          </div>
                          <div>
                            <strong>Total Hours:</strong> {b.totalHours}
                          </div>
                          <div>
                            <strong>Amount Paid:</strong> ₹
                            {b.amountToPaid.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-gray-500">
                      No bookings available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLotList;
