import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleOtherInfo {
  SerialNo: string;
  EngineNo: string;
  ChassisNo: string;
  FuelType?: string;
  Transmission?: string;
  RegistrationDate?: string;
  InsuranceExpiry?: string;
  PollutionExpiry?: string;
  FitnessExpiry?: string;
  PermitExpiry?: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: {
    id: string | number;
    ownerName: string;
    vehicleNo: string;
    vehicleInfo: string;
    address: string;
    ownerContact: string;
    otherInfo?: VehicleOtherInfo;
  };
  onSave: (formData: {
    ownerName: string;
    vehicleNo: string;
    vehicleInfo: string;
    address: string;
    ownerContact: string;
    otherInfo?: VehicleOtherInfo;
  }) => void;
}

export default function EditModal({
  isOpen,
  onClose,
  owner,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState(owner);

  useEffect(() => {
    setFormData(owner);
  }, [owner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtherInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setFormData({
      ...formData,
      // @ts-ignore
      otherInfo: { ...formData.otherInfo, [key]: e.target.value },
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Vehicle Owner</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vehicleNo">Vehicle Number</Label>
              <Input
                id="vehicleNo"
                name="vehicleNo"
                value={formData.vehicleNo}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vehicleInfo">Vehicle Model</Label>
              <Input
                id="vehicleInfo"
                name="vehicleInfo"
                value={formData.vehicleInfo}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ownerContact">Owner Contact</Label>
              <Input
                id="ownerContact"
                name="ownerContact"
                value={formData.ownerContact}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.otherInfo && (
            <div className="mt-6">
              <Label>Other Information</Label>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(formData.otherInfo).map(([key, value]) => (
                  <div className="flex flex-col gap-2" key={key}>
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      id={key}
                      type={
                        key.includes('Date') || key.includes('Expiry')
                          ? 'date'
                          : 'text'
                      }
                      value={value}
                      onChange={(e) => handleOtherInfoChange(e, key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button
            className="bg-red-600 text-white"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="bg-green-600 text-white" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
