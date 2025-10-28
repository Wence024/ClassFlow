/**
 * @file This barrel file re-exports all components from the `ui` directory.
 * This allows for cleaner and more convenient imports from other parts of the application.
 */

// Shadcn components
export { Alert, AlertDescription, AlertTitle } from './alert';
export { Button, buttonVariants } from './button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';
export { Input } from './input';
export { Label } from './label';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Toaster } from './sonner';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// Form components
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form';

// Custom components
export { default as ColorPicker } from './custom/color-picker';
export { default as ConfirmModal } from './custom/confirm-modal';
export { default as ErrorBoundary } from './custom/error-boundary';
export { default as ErrorMessage } from './custom/error-message';
export { default as FormField } from './custom/form-field';
export { default as ItemCard, type ItemCardBadge } from './custom/item-card';
export { default as LoadingSpinner } from './custom/loading-spinner';
export { ResourceSelectorModal, type PrioritizedItem } from './custom/resource-selector-modal';
export { default as TabNavigation } from './custom/tab-navigation';
export { default as CustomTooltip } from './custom/tooltip';
