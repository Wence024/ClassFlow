import React from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import type { Program } from '@/types/program';
import type { ProgramFormData } from '@/types/validation/program';
import {
  FormControl,
  FormField as RHFFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProgramFieldsProps = {
  control: Control<ProgramFormData>;
  errors: FieldErrors<ProgramFormData>;
  departmentOptions: { id: string; name: string }[];
};

/**
 * Renders the input fields for a program form.
 *
 * @param pf - The props for the component.
 * @param pf.control - The react-hook-form control object.
 * @param pf.departmentOptions - List of departments for selection.
 * @returns The rendered form fields.
 */
export const ProgramFields: React.FC<ProgramFieldsProps> = ({ control, departmentOptions }) => {
  return (
    <>
      <RHFFormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Bachelor of Science in Computer Science" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <RHFFormField
        control={control}
        name="short_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., BSCS" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <RHFFormField
        control={control}
        name="department_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <FormControl>
              <select
                {...field}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">-- Select Department --</option>
                {departmentOptions.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

type ProgramCardProps = {
  program: Program;
  onEdit: (program: Program) => void;
  onDelete: (id: string) => void;
  departmentName?: string;
};

/**
 * Renders a card displaying program information with edit and delete buttons.
 *
 * @param pc - The props for the component.
 * @param pc.program - The program data to display.
 * @param pc.onEdit - Callback function for the edit action.
 * @param pc.onDelete - Callback function for the delete action.
 * @param pc.departmentName - The name of the department this program belongs to.
 * @returns The rendered program card.
 */
export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onEdit,
  onDelete,
  departmentName,
}) => {
  return (
    <Card className="p-4 flex items-center gap-2">
      <div className="flex-1">
        <div className="font-medium">{program.name}</div>
        <div className="text-sm text-gray-500">{program.short_code}</div>
        {departmentName && (
          <div className="text-xs text-muted-foreground mt-1">Department: {departmentName}</div>
        )}
      </div>
      <Button variant="secondary" onClick={() => onEdit(program)}>
        Edit
      </Button>
      <Button variant="destructive" onClick={() => onDelete(program.id)}>
        Delete
      </Button>
    </Card>
  );
};
