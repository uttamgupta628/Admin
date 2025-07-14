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

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: {
    id: string | number;
    ownerName: string;
    laundryName: string;
    address: string;
  };
  onSave: (formData: {
    ownerName: string;
    laundryName: string;
    address: string;
  }) => void;
}

export default function EditModal({
  isOpen,
  onClose,
  owner,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState(owner);

  // Update formData when owner prop changes
  useEffect(() => {
    setFormData(owner);
  }, [owner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-white">
        <DialogHeader>
          <DialogTitle>Edit Laundry Owner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="laundryName">Laundry Name</Label>
            <Input
              id="laundryName"
              name="laundryName"
              value={formData.laundryName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
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
