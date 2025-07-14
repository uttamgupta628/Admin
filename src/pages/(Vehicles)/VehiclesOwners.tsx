import NavbarWrapper from '@/components/Wrapper/NavbarWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { allVehicleOwnersList } from '@/Constants/Vehicles';
import EditModal from '@/components/Vehicles/EditModal';
import ConfirmModal from '@/components/Vehicles/ConfirmModal';

// Pagination Configuration
const itemsPerPage = 5;

function VehicleOwners() {
  const [allVehicleOwners, setAllVehicleOwners] =
    useState(allVehicleOwnersList);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string | number | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allVehicleOwners.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(allVehicleOwners.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <NavbarWrapper>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Vehicle Owners</h1>

        <Card className="border-0 h-full">
          <CardHeader>
            <CardTitle>List of Vehicle Owners</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Scrollable Table Container */}
            <div className="overflow-x-auto">
              <div className="max-h- overflow-y-auto">
                <Table className="border-collapse border border-gray-300 w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-200 text-gray-700 font-bold text-sm">
                      <TableHead className="border border-gray-300 px-4 py-2">
                        ID
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Owner Name
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Vehicle Number
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Vehicle Model
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Address
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Owner Contact
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Status
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Other Info
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((owner, index) => (
                      <TableRow
                        key={owner.id}
                        className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                      >
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.id}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.ownerName}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.vehicleNo}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.vehicleInfo}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.address}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.ownerContact}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2 font-semibold ${owner.isActivated ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {owner.isActivated ? 'Active' : 'Inactive'}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-2 py-2`}
                        >
                          {owner.otherInfo ? (
                            <div className="space-y-1">
                              {Object.entries(owner.otherInfo).map(
                                ([key, value]) => (
                                  <p key={key} className="text-sm">
                                    <span className="font-semibold">
                                      {key}:
                                    </span>{' '}
                                    {value}
                                  </p>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500">No Info</p>
                          )}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-4 py-2 space-x-2">
                          {owner.isActivated && (
                            <Button
                              onClick={() => {
                                setIsEditModalOpen(true);
                                setSelectedOwner(owner.id);
                              }}
                              className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600 active:bg-blue-700"
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              setIsDeleteModalOpen(true);
                              setSelectedOwner(owner.id);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600 active:bg-red-700"
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={() => {
                              setIsDeactivateModalOpen(true);
                              setSelectedOwner(owner.id);
                            }}
                            className={`${owner.isActivated ? 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700' : 'bg-green-500 hover:bg-green-600 active:bg-green-700'} text-white px-2 py-1 rounded-md text-xs`}
                          >
                            {owner.isActivated ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
              >
                Previous
              </Button>
              <span className="text-gray-700 font-semibold">
                Page {currentPage} of{' '}
                {Math.ceil(allVehicleOwners.length / itemsPerPage)}
              </span>
              <Button
                onClick={nextPage}
                disabled={
                  currentPage ===
                  Math.ceil(allVehicleOwners.length / itemsPerPage)
                }
                className={`px-4 py-2 rounded-md ${currentPage === Math.ceil(allVehicleOwners.length / itemsPerPage) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        owner={
          allVehicleOwners.find((owner) => owner.id === selectedOwner) || {
            id: '',
            ownerName: '',
            vehicleNo: '',
            vehicleInfo: '',
            address: '',
            ownerContact: '',
            otherInfo: {
              SerialNo: '',
              EngineNo: '',
              ChassisNo: '',
              FuelType: '',
              Transmission: '',
              RegistrationDate: '',
              InsuranceExpiry: '',
              PollutionExpiry: '',
              FitnessExpiry: '',
              PermitExpiry: '',
            },
          }
        }
        onSave={(formData) => {
          setAllVehicleOwners(
            allVehicleOwners.map((owner) =>
              owner.id === selectedOwner ? { ...owner, ...formData } : owner
            )
          );
          setIsEditModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setAllVehicleOwners(
            allVehicleOwners.filter((owner) => owner.id !== selectedOwner)
          );
          setIsDeleteModalOpen(false);
        }}
        title="Delete Owner"
        message="Are you sure you want to delete this vehicle owner?"
      />

      <ConfirmModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={() => {
          setAllVehicleOwners(
            allVehicleOwners.map((owner) =>
              owner.id === selectedOwner
                ? { ...owner, isActivated: !owner.isActivated }
                : owner
            )
          );
          setIsDeactivateModalOpen(false);
        }}
        title={
          allVehicleOwners.find((owner) => owner.id === selectedOwner)
            ?.isActivated
            ? 'Deactivate Owner'
            : 'Activate Owner'
        }
        message="Are you sure you want to change the activation status of this owner?"
      />
    </NavbarWrapper>
  );
}

export default VehicleOwners;
