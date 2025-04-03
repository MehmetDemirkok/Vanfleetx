import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  driver: string;
}

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle;
  onSave: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
  onSave,
}: VehicleDialogProps) {
  const [formData, setFormData] = React.useState<Omit<Vehicle, 'id'>>({
    plateNumber: '',
    model: '',
    status: 'active',
    lastMaintenance: '',
    driver: '',
  });

  React.useEffect(() => {
    if (vehicle) {
      setFormData({
        plateNumber: vehicle.plateNumber,
        model: vehicle.model,
        status: vehicle.status,
        lastMaintenance: vehicle.lastMaintenance,
        driver: vehicle.driver,
      });
    } else {
      setFormData({
        plateNumber: '',
        model: '',
        status: 'active',
        lastMaintenance: '',
        driver: '',
      });
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plateNumber" className="text-right">
                Plate Number
              </Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) =>
                  setFormData({ ...formData, plateNumber: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Vehicle['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastMaintenance" className="text-right">
                Last Maintenance
              </Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) =>
                  setFormData({ ...formData, lastMaintenance: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver" className="text-right">
                Driver
              </Label>
              <Input
                id="driver"
                value={formData.driver}
                onChange={(e) =>
                  setFormData({ ...formData, driver: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{vehicle ? 'Save Changes' : 'Add Vehicle'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 