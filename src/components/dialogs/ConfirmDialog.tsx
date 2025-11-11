import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
}

/**
 * A generic confirmation dialog component.
 *
 * @param cd - The component props.
 * @param cd.open Controls whether the dialog is open.
 * @param cd.onOpenChange Callback fired when the open state should change.
 * @param cd.onConfirm Callback fired when the confirm action is triggered.
 * @param cd.title The dialog title text.
 * @param cd.description The dialog description text.
 * @param cd.confirmText Override text for the confirmation button.
 * @param cd.cancelText Override text for the cancel button.
 * @param cd.isLoading If true, disables actions and shows loading indicator.
 * @param cd.variant Allows changing button variant (default or destructive).
 * @returns The ConfirmDialog component.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
