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
import { allLaundryOwnersList } from '@/Constants/Laundry';
import EditModal from '@/components/Laundry/EditModal';
import ConfirmModal from '@/components/Laundry/ConfirmModal';

// Pagination Configuration
const itemsPerPage = 10;

function LaundryOwners() {
  const [allLaundryOwners, setAllLaundryOwners] =
    useState(allLaundryOwnersList);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string | number | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allLaundryOwners.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(allLaundryOwners.length / itemsPerPage)) {
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
        <h1 className="text-3xl font-bold">Laundry Owners</h1>

        <Card className="border-0 h-full">
          <CardHeader>
            <CardTitle>List of Laundry Owners</CardTitle>
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
                        Laundry Name
                      </TableHead>
                      <TableHead className="border border-gray-300 px-4 py-2">
                        Address
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
                          className={`border border-gray-300 px-4 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.id}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-4 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.ownerName}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-4 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.laundryName}
                        </TableCell>
                        <TableCell
                          className={`border border-gray-300 px-4 py-2 ${!owner.isActivated ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                          {owner.address}
                        </TableCell>
                        <TableCell className="border border-gray-300 px-4 py-2 text-gray-900 space-x-2">
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
                {Math.ceil(allLaundryOwners.length / itemsPerPage)}
              </span>
              <Button
                onClick={nextPage}
                disabled={
                  currentPage ===
                  Math.ceil(allLaundryOwners.length / itemsPerPage)
                }
                className={`px-4 py-2 rounded-md ${currentPage === Math.ceil(allLaundryOwners.length / itemsPerPage) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 text-white'}`}
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
          allLaundryOwners.find((owner) => owner.id === selectedOwner) || {
            id: '',
            ownerName: '',
            laundryName: '',
            address: '',
            isActivated: false,
          }
        }
        onSave={(formData) => {
          setAllLaundryOwners(
            allLaundryOwners.map((owner) =>
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
          setAllLaundryOwners(
            allLaundryOwners.filter((owner) => owner.id !== selectedOwner)
          );
          setIsDeleteModalOpen(false);
        }}
        title="Delete Owner"
        message="Are you sure you want to delete this owner?"
      />

      <ConfirmModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={() => {
          setAllLaundryOwners(
            allLaundryOwners.map((owner) =>
              owner.id === selectedOwner
                ? { ...owner, isActivated: !owner.isActivated }
                : owner
            )
          );
          setIsDeactivateModalOpen(false);
        }}
        title={
          allLaundryOwners.find((owner) => owner.id === selectedOwner)
            ?.isActivated
            ? 'Deactivate Owner'
            : 'Activate Owner'
        }
        message="Are you sure you want to change the activation status of this owner?"
      />
    </NavbarWrapper>
  );
}

export default LaundryOwners;
