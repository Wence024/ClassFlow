import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (message: string) => void;
  isLoading?: boolean;
  resourceName?: string;
}

/**
 * A dialog for rejecting a resource request with a required message.
 *
 * @param props - The component props.
 * @param props.open - Whether the dialog is open.
 * @param props.onOpenChange - Callback to change the open state.
 * @param props.onConfirm - Callback when the rejection is confirmed with a message.
 * @param props.isLoading - Whether the rejection is in progress.
 * @param props.resourceName - The name of the resource being rejected.
 * @returns The RejectionDialog component.
 */
export default function RejectionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  resourceName,
}: RejectionDialogProps) {
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    if (message.trim()) {
      onConfirm(message);
      setMessage('');
    }
  };

  const handleClose = () => {
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Resource Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            You are rejecting the request for <strong>{resourceName}</strong>.
            Please provide a reason for the program head.
          </p>
          <div className="space-y-2">
            <Label htmlFor="rejection-message">Rejection Reason *</Label>
            <Input
              id="rejection-message"
              placeholder="Enter reason for rejection..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? 'Rejecting...' : 'Reject Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
