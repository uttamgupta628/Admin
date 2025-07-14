import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Residence {
  _id: string;
  images: string[];
  residenceName: string;
  about: string;
  address: string;
  price: number;
  contactNumber: string;
}

interface Booking {
  _id: string;
  vehicleNumber: string;
  bookedSlot: string;
  bookingPeriod: {
    from: string;
    to: string;
  };
  amountToPaid: number;
}

const ResidenceList: React.FC = () => {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [selectedResidence, setSelectedResidence] = useState<Residence | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchResidences = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/merchants/residence/search",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResidences(res.data.data);
    } catch (err) {
      console.error("Failed to fetch residences:", err);
    }
  };

  const fetchResidenceDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/merchants/residence/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedResidence(res.data.data);
      setCurrentImageIndex(0);
    } catch (err) {
      console.error("Failed to fetch residence details:", err);
    }
  };

  const fetchBookings = async (id: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/merchants/residence/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
    }
  };

  const handleDeleteResidence = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this residence?"))
    return;

  try {
    await axios.delete(
  `http://localhost:5000/api/users/admin/delete-residence/${id}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

    setSelectedResidence(null);
    fetchResidences();
    alert("Residence deleted successfully.");
  } catch (err) {
    console.error("Failed to delete residence:", err);
    alert("Failed to delete residence.");
  }
};



  useEffect(() => {
    fetchResidences();
  }, []);

  const handleOpenDetails = (id: string) => {
    setBookings([]);
    fetchResidenceDetails(id);
    fetchBookings(id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Residence List</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg px-4 py-2"
          >
            ← Back
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residences.map((residence) => (
            <div
              key={residence._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={
                    residence.images && residence.images.length > 0
                      ? residence.images[0]
                      : "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={residence.residenceName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-xl font-semibold text-white">
                    {residence.residenceName}
                  </h2>
                  <p className="text-sm text-white/90">₹{residence.price}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {residence.about}
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  📞 {residence.contactNumber}
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  📍 {residence.address}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleOpenDetails(residence._id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg py-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteResidence(residence._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedResidence && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                onClick={() => setSelectedResidence(null)}
                className="absolute top-4 right-3 text-gray-500 text-2xl"
              >
                &times;
              </button>

              {/* Image Slider */}
              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                {selectedResidence.images.length > 0 ? (
                  <>
                    <img
                      src={selectedResidence.images[currentImageIndex]}
                      alt="Residence"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) =>
                            (prev - 1 + selectedResidence.images.length) %
                            selectedResidence.images.length
                        )
                      }
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      &#11166;
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) =>
                            (prev + 1) % selectedResidence.images.length
                        )
                      }
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      &#11166;
                    </button>
                  </>
                ) : (
                  <img
                    src="https://via.placeholder.com/600x300?text=No+Image"
                    alt="No Image"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {selectedResidence.residenceName}
              </h2>
              <p className="text-gray-600 mb-4">{selectedResidence.about}</p>

              <div className="space-y-2">
                <p>
                  📞 <strong>{selectedResidence.contactNumber}</strong>
                </p>
                <p>
                  📍 <strong>{selectedResidence.address}</strong>
                </p>
                <p>
                  💰 <strong>₹{selectedResidence.price}</strong>
                </p>
              </div>

              {/* Bookings */}
              <div className="border border-gray-200 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  Bookings
                  <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {bookings.length}
                  </span>
                </h3>

                {bookings.length > 0 ? (
                  <div className="space-y-2">
                    {bookings.map((b) => (
                      <div
                        key={b._id}
                        className="border border-gray-100 rounded p-3 text-sm bg-gray-50"
                      >
                        <div>
                          <strong>Vehicle:</strong> {b.vehicleNumber}
                        </div>
                        <div>
                          <strong>Slot:</strong> {b.bookedSlot}
                        </div>
                        <div>
                          <strong>From:</strong>{" "}
                          {new Date(b.bookingPeriod.from).toLocaleString()}
                        </div>
                        <div>
                          <strong>To:</strong>{" "}
                          {new Date(b.bookingPeriod.to).toLocaleString()}
                        </div>
                        <div>
                          <strong>Amount Paid:</strong> ₹
                          {b.amountToPaid.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500">No bookings found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidenceList;
