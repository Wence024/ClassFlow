import React from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import type { Department } from '../../types/department';
import type { DepartmentFormData } from '../../types/validation';
import { FormControl, FormField as RHFFormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DepartmentFieldsProps = {
  control: Control<DepartmentFormData>;
  errors: FieldErrors<DepartmentFormData>;
};

/**
 * Renders the input fields for a department form.
 *
 * @param df - The props for the component.
 * @param df.control - The react-hook-form control object.
 * @returns The rendered form fields.
 */
export const DepartmentFields: React.FC<DepartmentFieldsProps> = ({ control }) => {
  return (
    <>
      <RHFFormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Computer Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <RHFFormField
        control={control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., CS" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

type DepartmentCardProps = {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
};

/**
 * Renders a card displaying department information with edit and delete buttons.
 *
 * @param dc - The props for the component.
 * @param dc.department - The department data to display.
 * @param dc.onEdit - Callback function for the edit action.
 * @param dc.onDelete - Callback function for the delete action.
 * @returns The rendered department card.
 */
export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onEdit, onDelete }) => {
  return (
    <Card className="p-4 flex items-center gap-2">
      <div className="flex-1">
        <div className="font-medium">{department.name}</div>
        <div className="text-sm text-gray-500">{department.code}</div>
      </div>
      <Button variant="secondary" onClick={() => onEdit(department)}>Edit</Button>
      <Button variant="destructive" onClick={() => onDelete(department.id)}>Delete</Button>
    </Card>
  );
};