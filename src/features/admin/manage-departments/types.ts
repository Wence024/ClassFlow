/**
 * Types for the manage departments use case.
 */

export type DepartmentFormData = {
  name: string;
  code: string;
};

export type DepartmentAction = 'edit' | 'delete' | 'view';
