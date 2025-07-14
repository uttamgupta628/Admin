import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { CustomArrowProps } from 'react-slick';

interface Garage {
  _id: string;
  garageName: string;
  about: string;
  address: string;
  contactNumber: string;
  vehicleType: string;
  images: string[];
  isActive: boolean;
  isVerified: boolean;
  emergencyContact?: {
    person: string;
    number: string;
  };
  location?: {
    coordinates: [number, number];
  };
  generalAvailable?: {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    is24Hours: boolean;
  }[];
  totalBookings?: number;
  totalAmount?: number;
  slotsBooked?: string[];
  spacesList?: Record<
    string,
    {
      count: number;
      price: number;
    }
  >;
}

const GarageList: React.FC = () => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchGarages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/admin/get-all-garages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const garagesData: Garage[] = response.data.data;

      const bookingsSummary = await Promise.all(
        garagesData.map(async (garage) => {
          try {
            const bookingsResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/users/admin/get-garage-booking-summary/${garage._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const bookings = bookingsResponse.data.data;
            const totalBookings = bookings.totalBookings || 0;
            const totalAmount = bookings.totalAmount || 0;
            const slotsBooked = bookings.slotsBooked || [];

            return { totalBookings, totalAmount, slotsBooked };
          } catch (error) {
            console.error(
              `Failed to fetch bookings for ${garage.garageName}`,
              error
            );
            return { totalBookings: 0, totalAmount: 0, slotsBooked: [] };
          }
        })
      );

      const garagesWithSummary = garagesData.map((garage, i) => ({
        ...garage,
        ...bookingsSummary[i],
      }));

      setGarages(garagesWithSummary);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch garages');
    } finally {
      setLoading(false);
    }
  };

  const deleteGarage = async (garageId: string) => {
    setIsDeleting(garageId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/admin/delete-garage/${garageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGarages((prev) => prev.filter((g) => g._id !== garageId));
    } catch (error) {
      console.error('Failed to delete garage:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    fetchGarages();
  }, []);

  const PrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
    <button
      className="absolute top-1/2 left-2 z-10 bg-white rounded-full p-2 shadow -translate-y-1/2"
      onClick={onClick}
    >
      <FaArrowLeft className="text-gray-800" />
    </button>
  );

  const NextArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
    <button
      className="absolute top-1/2 right-2 z-10 bg-white rounded-full p-2 shadow -translate-y-1/2"
      onClick={onClick}
    >
      <FaArrowRight className="text-gray-800" />
    </button>
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading garages...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading garages
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchGarages}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Garage Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {garages.length} {garages.length === 1 ? 'garage' : 'garages'}{' '}
              registered in the system
            </p>
          </div>
          <div className="w-full sm:w-auto"></div>
        </div>

        {garages.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No garages found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no garages registered in the system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {garages.map((garage) => (
              <div
                key={garage._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {garage.images && garage.images.length > 0 ? (
                    <img
                      src={garage.images[0]}
                      alt="Garage"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                      {garage.garageName}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        garage.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {garage.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {garage.about}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 font-medium">Bookings</p>
                      <p className="text-gray-900 font-semibold">
                        {garage.totalBookings ?? 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500 font-medium">Earnings</p>
                      <p className="text-gray-900 font-semibold">
                        ₹{garage.totalAmount?.toLocaleString() ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <button
                      onClick={() => setSelectedGarage(garage)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => deleteGarage(garage._id)}
                      disabled={isDeleting === garage._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isDeleting === garage._id ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedGarage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedGarage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="h-64 bg-gray-200 relative">
                {selectedGarage.images && selectedGarage.images.length > 0 ? (
                  <Slider
                    {...{
                      dots: true,
                      infinite: selectedGarage.images.length > 1,
                      speed: 500,
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: true,
                      nextArrow: <NextArrow />,
                      prevArrow: <PrevArrow />,
                    }}
                  >
                    {selectedGarage.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Garage ${idx}`}
                        className="w-full h-64 object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/800x400?text=No+Image')
                        }
                      />
                    ))}
                  </Slider>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedGarage.garageName}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedGarage.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedGarage.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{selectedGarage.about}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Contact Information
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span>{' '}
                      {selectedGarage.address}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Phone:</span>{' '}
                      {selectedGarage.contactNumber}
                    </p>
                    {selectedGarage.emergencyContact && (
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Emergency:</span>{' '}
                        {selectedGarage.emergencyContact.person} (
                        {selectedGarage.emergencyContact.number})
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Business Metrics
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Total Bookings:</span>{' '}
                      {selectedGarage.totalBookings ?? 0}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Total Earnings:</span> ₹
                      {selectedGarage.totalAmount?.toLocaleString() ?? 0}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Vehicle Type:</span>{' '}
                      {selectedGarage.vehicleType}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Slot
                  </h3>
                  {selectedGarage.spacesList &&
                  Object.keys(selectedGarage.spacesList).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(selectedGarage.spacesList).map(
                        ([key, value]: any, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                          >
                            <div className="font-medium text-gray-700">
                              {key}
                            </div>
                            <div className="text-sm text-gray-600">
                              Count: {value.count}
                            </div>
                            <div className="text-sm text-gray-600">
                              Price: ₹{value.price}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No spaces listed.</p>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Booked Slots
                  </h3>
                  {selectedGarage.slotsBooked &&
                  selectedGarage.slotsBooked.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedGarage.slotsBooked.map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No slots currently booked.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarageList;
