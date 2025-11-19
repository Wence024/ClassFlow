/**
 * UI component for Create Class Session use case.
 * 
 * This is a simplified demonstration of the vertical slice pattern.
 * In a full implementation, this would include a complete form UI.
 */

import { Button } from '@/components/ui';
import LoadingSpinner from '@/components/ui/custom/loading-spinner';
import { useCreateClassSession } from './hook';

/**
 * Simple demonstration component for creating class sessions.
 * 
 * NOTE: This is a pilot implementation demonstrating the vertical slice pattern.
 * A full implementation would include the complete form with all selectors.
 */
export function CreateClassSessionForm() {
  const { isCreating } = useCreateClassSession();

  const handleDemoCreate = async () => {
    // This is just a demo - in reality, this would be called from a form submit
    console.log('Create class session workflow');
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Create Class Session (Pilot)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This demonstrates the vertical slice architecture pattern.
        The full form implementation would go here.
      </p>
      <Button onClick={handleDemoCreate} disabled={isCreating}>
        {isCreating && <LoadingSpinner />}
        Create Session
      </Button>
    </div>
  );
}
