import { useState } from 'react';
import { toast } from 'sonner';
import type { InstructorReport } from '../types/instructorReport';
import { generateInstructorReportPDF } from '../services/pdfExportService';
import { generateInstructorReportExcel } from '../services/excelExportService';

/**
 * Hook to handle PDF and Excel export with loading states.
 */
export function useReportExport() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const exportToPDF = async (report: InstructorReport) => {
    setIsExportingPDF(true);
    try {
      generateInstructorReportPDF(report);
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const exportToExcel = async (report: InstructorReport) => {
    setIsExportingExcel(true);
    try {
      generateInstructorReportExcel(report);
      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to generate Excel report');
    } finally {
      setIsExportingExcel(false);
    }
  };

  return {
    exportToPDF,
    exportToExcel,
    isExportingPDF,
    isExportingExcel,
  };
}
