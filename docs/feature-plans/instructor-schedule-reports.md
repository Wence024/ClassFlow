# Instructor Schedule Reports & Export System

## Overview

This feature enables generating comprehensive schedule reports for instructors, showing their teaching load, contact hours, and class assignments organized by day and time. The reports can be exported to PDF/Excel formats for administrative and payroll purposes.

## Feature Requirements

### Primary Goals
1. Generate detailed instructor schedules with load calculations
2. Export reports in PDF and Excel formats
3. Calculate teaching load based on lecture/lab contact hours
4. Display comprehensive class information per time slot
5. Group schedules by day combinations (MW, TTh, F, Sat)

### Report Structure (Based on Sample)

**Header Section:**
- Instructor name (prefix, first name, last name, suffix)
- Department/College affiliation
- Semester (e.g., "First Semester S.Y. 2025-2026")
- Report generation date

**Schedule Tables (Grouped by Day Combination):**

| Column | Description | Source |
|--------|-------------|--------|
| Time | Time slot (e.g., "7:30 - 9:00") | From period_index + schedule_configuration |
| Subject(s) | Course code/name | From courses table |
| Dept | Department code | From departments table |
| Room | Classroom code/location | From classrooms table |
| Contact hr/wk - Lec | Lecture hours per week | Calculated from course metadata |
| Contact hr/wk - Lab | Lab hours per week | Calculated from course metadata |
| Units | Course units | From courses table (new field) |
| Load | Teaching load factor | Calculated using load formula |
| Class Size | Number of students | From class_groups.student_count |

**Footer Section:**
- Total contact hours (Lec + Lab)
- Total units
- Total teaching load
- Instructor signature line

## Implementation Plan

### Phase 1: Database Schema Extensions

#### 1.1 Add Course Metadata
```sql
-- Add units and contact hours to courses table
ALTER TABLE courses ADD COLUMN units DECIMAL(3,1);
ALTER TABLE courses ADD COLUMN lecture_hours DECIMAL(3,1);
ALTER TABLE courses ADD COLUMN lab_hours DECIMAL(3,1);
ALTER TABLE courses ADD COLUMN course_type TEXT CHECK (course_type IN ('lecture', 'lab', 'lecture_lab'));
```

#### 1.2 Add Load Calculation Configuration
```sql
-- Create table for load calculation rules
CREATE TABLE teaching_load_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID REFERENCES semesters(id),
  lecture_load_factor DECIMAL(3,2) DEFAULT 1.0,
  lab_load_factor DECIMAL(3,2) DEFAULT 0.75,
  max_load_per_semester DECIMAL(4,1) DEFAULT 24.0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Phase 2: Service Layer - Load Calculation

#### 2.1 Create Load Calculation Service
**File:** `src/features/reports/services/loadCalculationService.ts`

**Functions:**
- `calculateCourseLoad(course, scheduleConfig)` - Calculate load for a single course
- `calculateInstructorTotalLoad(instructorId, semesterId)` - Calculate total load for instructor
- `getContactHoursPerWeek(course, periodCount, classDays)` - Calculate weekly contact hours
- `calculateTeachingUnits(course)` - Calculate teaching units

**Load Calculation Formula:**
```
Load = (Lecture Hours × Lecture Factor) + (Lab Hours × Lab Factor)

Where:
- Lecture Factor = 1.0 (standard)
- Lab Factor = 0.75 (typically lower)
- Hours = (Period Count × Period Duration) / 60 × Class Days Per Week
```

#### 2.2 Create Report Data Service
**File:** `src/features/reports/services/instructorReportService.ts`

**Functions:**
- `getInstructorScheduleData(instructorId, semesterId)` - Fetch all schedule data
- `groupScheduleByDays(assignments)` - Group by day combinations (MW, TTh, F, Sat)
- `formatScheduleForExport(scheduleData)` - Format data for export
- `calculateReportTotals(scheduleData)` - Calculate summary totals

### Phase 3: Frontend Components

#### 3.1 Instructor Reports Page
**File:** `src/features/reports/pages/InstructorReportsPage.tsx`

**Features:**
- Instructor selection dropdown (filtered by role/department)
- Semester selection dropdown
- Preview button (shows report in UI)
- Export buttons (PDF, Excel)
- Load calculation summary widget

#### 3.2 Report Preview Component
**File:** `src/features/reports/components/InstructorSchedulePreview.tsx`

**Features:**
- Render report structure matching sample image
- Group schedules by day combination
- Display all required columns
- Show totals at bottom
- Print-friendly styling

#### 3.3 Day Group Components
**File:** `src/features/reports/components/DayGroupTable.tsx`

**Props:**
- `dayLabel` (e.g., "MONDAY AND WEDNESDAY")
- `timeSlots` (array of schedule entries)
- `scheduleConfig` (for time calculations)

#### 3.4 Load Summary Widget
**File:** `src/features/reports/components/LoadSummaryWidget.tsx`

**Displays:**
- Total lecture hours
- Total lab hours
- Total units
- Total teaching load
- Load status (under/at/over recommended load)

### Phase 4: Export Functionality

#### 4.1 PDF Export Service
**File:** `src/features/reports/services/pdfExportService.ts`

**Dependencies:** Add `jspdf` and `jspdf-autotable`

**Functions:**
- `generateInstructorReportPDF(reportData)` - Generate PDF document
- `formatTableForPDF(dayGroup)` - Format tables for PDF
- `addHeaderSection(doc, instructor, semester)` - Add report header
- `addFooterSection(doc, totals)` - Add totals and signature

#### 4.2 Excel Export Service
**File:** `src/features/reports/services/excelExportService.ts`

**Dependencies:** Add `xlsx` or `exceljs`

**Functions:**
- `generateInstructorReportExcel(reportData)` - Generate Excel workbook
- `createScheduleSheet(workbook, dayGroup)` - Create sheet per day group
- `formatExcelTable(worksheet, data)` - Apply formatting
- `addFormulasForTotals(worksheet)` - Add Excel formulas for totals

### Phase 5: Hooks and State Management

#### 5.1 useInstructorReport Hook
**File:** `src/features/reports/hooks/useInstructorReport.ts`

**Features:**
- Fetch instructor schedule data
- Calculate load and totals
- Handle loading/error states
- Cache report data

#### 5.2 useReportExport Hook
**File:** `src/features/reports/hooks/useReportExport.ts`

**Features:**
- Handle PDF export with loading state
- Handle Excel export with loading state
- Error handling for export failures
- Download file management

### Phase 6: Types and Validation

#### 6.1 Report Types
**File:** `src/features/reports/types/instructorReport.ts`

```typescript
interface InstructorScheduleEntry {
  timeSlot: string;
  courses: CourseScheduleInfo[];
  department: string;
  classroom: string;
  lecHours: number;
  labHours: number;
  units: number;
  load: number;
  classSize: number;
}

interface InstructorReport {
  instructor: Instructor;
  semester: Semester;
  schedules: {
    mondayWednesday: InstructorScheduleEntry[];
    tuesdayThursday: InstructorScheduleEntry[];
    friday: InstructorScheduleEntry[];
    saturday: InstructorScheduleEntry[];
  };
  totals: {
    lecHours: number;
    labHours: number;
    totalUnits: number;
    totalLoad: number;
  };
}
```

## User Flows

### Flow 1: Generate Report for Current User (Instructor Role)
1. Instructor navigates to "My Schedule Report"
2. Selects semester (defaults to active semester)
3. Clicks "Preview Report"
4. System generates report preview
5. Instructor reviews load calculations
6. Clicks "Export to PDF" or "Export to Excel"
7. System downloads report file

### Flow 2: Admin/Department Head Generates Report for Any Instructor
1. Admin navigates to "Instructor Reports"
2. Selects department (filters instructor list)
3. Selects instructor from dropdown
4. Selects semester
5. Clicks "Generate Report"
6. System shows preview with load summary
7. Admin exports report in desired format

### Flow 3: Batch Export for All Instructors
1. Admin navigates to "Batch Reports"
2. Selects department
3. Selects semester
4. Clicks "Generate All Reports"
5. System generates reports for all instructors in department
6. System creates ZIP file with all PDFs
7. Admin downloads batch export

## UI/UX Requirements

### Report Preview Styling
- Match sample image layout
- Use print-friendly fonts (e.g., Times New Roman)
- Clear table borders
- Proper spacing for readability
- Signature line at bottom
- Page breaks for printing

### Load Calculation Display
- Use color coding:
  - Green: Under recommended load
  - Yellow: At recommended load
  - Red: Over recommended load
- Show visual progress bar for load percentage
- Display warning if over maximum load

### Export Options
- PDF: High-quality, print-ready format
- Excel: Editable format with formulas
- Filename format: `{instructor_code}_{semester}_Schedule.pdf`

## Technical Considerations

### Performance
- Cache report data to avoid recalculation
- Use React Query for data fetching
- Lazy load export libraries (code splitting)
- Generate reports server-side for large datasets (future)

### Data Integrity
- Validate course metadata before calculation
- Handle missing units/hours gracefully
- Show warnings for incomplete course data
- Audit trail for load calculations

### Accessibility
- Keyboard navigation for all controls
- Screen reader support for tables
- High contrast mode support
- Printable without JavaScript

## Testing Requirements

### Unit Tests
- [ ] Load calculation formulas
- [ ] Time slot formatting
- [ ] Day grouping logic
- [ ] Total calculations
- [ ] Export filename generation

### Integration Tests
- [ ] Report data fetching with real database
- [ ] Export to PDF with sample data
- [ ] Export to Excel with sample data
- [ ] Batch export for multiple instructors

### E2E Tests
- [ ] Complete report generation flow
- [ ] Export and verify file download
- [ ] Preview report accuracy
- [ ] Load calculation display

## Migration Strategy

### Step 1: Add Course Metadata (Week 1)
- Run migration to add columns
- Backfill existing courses with default values
- Update course forms to include new fields

### Step 2: Implement Load Calculation (Week 2)
- Create service layer
- Add unit tests
- Create load configuration UI for admins

### Step 3: Build Report UI (Week 3)
- Create report preview components
- Add instructor selection
- Implement load summary display

### Step 4: Add Export Functionality (Week 4)
- Implement PDF export
- Implement Excel export
- Add download functionality
- Test with real data

### Step 5: Polish and Deploy (Week 5)
- Responsive design adjustments
- Print styling
- Performance optimization
- User acceptance testing

## Future Enhancements

1. **Email Reports:** Automatically email reports to instructors
2. **Historical Comparison:** Compare load across semesters
3. **Load Balancing:** Suggest schedule adjustments to balance load
4. **Custom Templates:** Allow institutions to customize report format
5. **Multi-language Support:** Generate reports in multiple languages
6. **Digital Signatures:** Add digital signature capability
7. **Analytics Dashboard:** Aggregate teaching load across department
8. **Conflict Warnings:** Highlight scheduling conflicts in report

## Dependencies

### New NPM Packages
```json
{
  "jspdf": "^2.5.2",
  "jspdf-autotable": "^3.8.4",
  "xlsx": "^0.18.5"
}
```

### Updated Database Schema
- courses: +3 columns (units, lecture_hours, lab_hours, course_type)
- teaching_load_config: new table
- Updated RLS policies for reports access

## Success Metrics

- [ ] Reports generated successfully for all instructors
- [ ] Load calculations match manual calculations (100% accuracy)
- [ ] Export time < 3 seconds for individual report
- [ ] Batch export handles 50+ instructors efficiently
- [ ] Zero data integrity issues in production
- [ ] 90%+ user satisfaction with report format
