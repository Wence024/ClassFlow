'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster component that wraps the `Sonner` toaster to provide custom styles and options.
 *
 * @param props - The props passed to the `Sonner` toaster component. These can include toast options and class names.
 * @returns A React component that renders the `Sonner` toaster with customized styles.
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          // Only style elements that don't interfere with richColors backgrounds
          description: 'text-sm opacity-90',
          actionButton: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
          cancelButton: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
