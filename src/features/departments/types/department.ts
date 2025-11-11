export type Department = {
  id: string;
  name: string;
  code: string;
  created_at?: string | null;
};

export type DepartmentInsert = {
  name: string;
  code: string;
};

export type DepartmentUpdate = Partial<DepartmentInsert>;
