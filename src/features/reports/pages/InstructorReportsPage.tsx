import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import { useAllInstructors } from '@/features/classSessionComponents/hooks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useInstructorReport } from '../hooks/useInstructorReport';
import { useReportExport } from '../hooks/useReportExport';
import { InstructorSchedulePreview } from '../components/InstructorSchedulePreview';
import { LoadSummaryWidget } from '../components/LoadSummaryWidget';
import LoadingSpinner from '@/components/ui/custom/loading-spinner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDepartmentId } from '@/features/auth/hooks/useDepartmentId';

/**
 * Page for generating and exporting instructor schedule reports.
 */
export default function InstructorReportsPage() {
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

  const { user } = useAuth();
  const departmentId = useDepartmentId();
  const { instructors: allInstructors, isLoading: isLoadingInstructors } = useAllInstructors();
  
  // Filter instructors based on role
  const instructors = useMemo(() => {
    if (!user || !allInstructors) return [];
    
    // Admin sees all instructors
    if (user.role === 'admin') return allInstructors;
    
    // Department Head and Program Head see only their department's instructors
    if (departmentId) {
      return allInstructors.filter(i => i.department_id === departmentId);
    }
    
    return [];
  }, [allInstructors, user, departmentId]);
  
  const { data: semesters = [], isLoading: isLoadingSemesters } = useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: report, isLoading: isLoadingReport } = useInstructorReport(
    selectedInstructorId,
    selectedSemesterId
  );

  const { exportToPDF, exportToExcel, isExportingPDF, isExportingExcel } = useReportExport();

  const handlePrint = () => {
    window.print();
  };

  const activeSemester = semesters.find(s => s.is_active);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Schedule Reports</h1>
      </div>

      {/* Access Control Info Banner */}
      {user?.role !== 'admin' && departmentId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📋 Viewing instructors from your department only. 
            {user?.role === 'program_head' && ' You can generate reports for instructors teaching in your program.'}
          </p>
        </div>
      )}

      {/* Controls */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Instructor</label>
            <Select value={selectedInstructorId || ''} onValueChange={setSelectedInstructorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an instructor..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingInstructors ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  instructors.map((instructor: any) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.code} - {instructor.first_name} {instructor.last_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Semester</label>
            <Select 
              value={selectedSemesterId || ''} 
              onValueChange={setSelectedSemesterId}
              defaultValue={activeSemester?.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a semester..." />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSemesters ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name} {semester.is_active ? '(Active)' : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={() => report && exportToPDF(report)}
              disabled={!report || isExportingPDF}
              className="flex-1"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {isExportingPDF ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button
              onClick={() => report && exportToExcel(report)}
              disabled={!report || isExportingExcel}
              variant="outline"
              className="flex-1"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {isExportingExcel ? 'Exporting...' : 'Export Excel'}
            </Button>
            <Button
              onClick={handlePrint}
              disabled={!report}
              variant="outline"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoadingReport && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Report Display */}
      {report && !isLoadingReport && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <LoadSummaryWidget report={report} />
          </div>
          
          <div className="lg:col-span-3">
            <Card className="p-6">
              <InstructorSchedulePreview report={report} />
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedInstructorId && !selectedSemesterId && !isLoadingReport && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Select an instructor and semester to generate a schedule report.
          </p>
        </Card>
      )}
    </div>
  );
}
