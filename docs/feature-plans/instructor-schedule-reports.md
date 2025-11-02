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
ALTER TABLE courses ADD COLUMN lecture_hours DECIMAL(3,1); -- For display only
ALTER TABLE courses ADD COLUMN lab_hours DECIMAL(3,1);     -- For display only

-- Backfill with default values to avoid null issues
UPDATE courses SET units = 3.0 WHERE units IS NULL;
UPDATE courses SET lecture_hours = 3.0 WHERE lecture_hours IS NULL;
UPDATE courses SET lab_hours = 0.0 WHERE lab_hours IS NULL;
```

**Note**: The `lecture_hours` and `lab_hours` fields are for display/informational purposes only. Load calculation uses only the `units` field with the formula: **Load = Total Units / 3**.

#### 1.2 Add Load Calculation Configuration
```sql
-- Create table for load calculation rules
CREATE TABLE teaching_load_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID REFERENCES semesters(id),
  department_id UUID REFERENCES departments(id),
  units_per_load DECIMAL(3,1) DEFAULT 3.0, -- 3 units = 1 load
  standard_load DECIMAL(3,1) DEFAULT 7.0,   -- Standard teaching load
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(semester_id, department_id)
);

-- Insert default configuration
INSERT INTO teaching_load_config (semester_id, department_id, units_per_load, standard_load)
SELECT id, NULL, 3.0, 7.0 FROM semesters WHERE is_active = true;
```

**Note on Customization**: The `units_per_load` and `standard_load` can be configured per semester and optionally per department. This provides flexibility for different institutional policies without added complexity. Simply update the config row for specific departments that need different rules.

### Phase 2: Service Layer - Load Calculation

#### 2.1 Create Load Calculation Service
**File:** `src/features/reports/services/loadCalculationService.ts`

**Functions:**
- `calculateCourseLoad(course, loadConfig)` - Calculate load for a single course
- `calculateInstructorTotalLoad(instructorId, semesterId, departmentId?)` - Calculate total load for instructor
- `getContactHoursPerWeek(course, periodCount, classDays)` - Calculate weekly contact hours
- `getLoadStatus(totalLoad, standardLoad)` - Determine if overloaded/underloaded

**Load Calculation Formula:**
```
Load = Total Units / Units Per Load

Default Formula:
- Units Per Load = 3.0 (configurable per department/semester)
- Load = Total Units / 3

Example:
- Instructor teaches 21 units → 21 / 3 = 7 load
- Standard Load = 7
- Status = "AT_STANDARD"

Load Status Rules:
- totalLoad < standardLoad × 0.9 → "UNDERLOADED" (Yellow warning)
- standardLoad × 0.9 ≤ totalLoad ≤ standardLoad × 1.1 → "AT_STANDARD" (Green)
- totalLoad > standardLoad × 1.1 → "OVERLOADED" (Red warning)
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

## Access Control Model

**Role-Based Report Access:**

| Role | Can Generate Reports For | Rationale |
|------|--------------------------|-----------|
| **Admin** | ALL instructors (any department) | Full system visibility for administrative purposes |
| **Department Head** | Instructors in THEIR department only | Direct management responsibility for departmental instructors |
| **Program Head** | Instructors teaching in THEIR program (filtered by department) | Need visibility into instructors teaching their courses, but limited to department scope via program relationship |

**Key Principles:**
- **Instructor Management** is a Department Head responsibility (create/edit/delete)
- **Report Generation** is available to Program Heads for coordination and planning
- **Program Heads** can only see instructors from their department (via program's department_id)
- Reports are READ-ONLY - no management actions available to Program Heads
- Cross-department resource usage is visible but filtered appropriately by role

**Note**: Instructor users do not exist as a role in the system. Only Program Heads, Department Heads, and Admins can generate instructor reports.

## User Flows

### Flow 1: Program Head Generates Report for Department Instructor
1. Program Head navigates to "Instructor Reports"
2. System auto-filters to their department's instructors (via program.department_id)
3. System displays info banner: "Viewing instructors from your department only"
4. Selects instructor from filtered dropdown
5. Selects semester (defaults to active semester)
6. Clicks "Generate Report"
7. System validates schedule configuration exists for semester
8. System shows preview with load summary
9. Reviews load calculations (units, load, status)
10. Clicks "Export to PDF" or "Export to Excel"
11. System downloads report file

### Flow 2: Department Head Generates Report
1. Department Head navigates to "Instructor Reports"
2. System auto-filters to their department's instructors
3. System displays info banner: "Viewing instructors from your department only"
4. Selects instructor from dropdown
5. Selects semester
6. Clicks "Generate Report"
7. System shows preview with load summary
8. Department Head exports report in desired format

### Flow 3: Admin Generates Report for Any Instructor
1. Admin navigates to "Instructor Reports"
2. System shows ALL instructors (no filtering)
3. Selects instructor from complete dropdown
4. Selects semester
5. Clicks "Generate Report"
6. System shows preview with load summary
7. Admin exports report in desired format

### Flow 4: Batch Export for All Instructors (Future Enhancement)
1. Admin/Department Head navigates to "Batch Reports"
2. Selects department (Admin only - Department Heads see their department by default)
3. Selects semester
4. Clicks "Generate All Reports"
5. System generates reports for all instructors in department
6. System creates ZIP file with all PDFs
7. User downloads batch export

### Error Handling Flows

#### Missing Schedule Configuration
1. User selects semester without schedule configuration
2. System shows error: "No schedule configuration found for this semester"
3. System prompts Admin to configure schedule first
4. Provides link to Schedule Configuration page

#### No Instructor Assignments
1. User selects instructor with no class assignments in semester
2. System shows warning: "No class assignments found for this instructor"
3. Report displays empty schedule tables
4. Load calculation shows 0 units, 0 load

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
  - Green: At standard load (within 10% of 7)
  - Yellow: Underloaded (below 6.3)
  - Red: Overloaded (above 7.7)
- Show visual progress bar: current load / standard load
- Display formula: "Total Units / 3 = Load"
- Show standard load reference: "Standard: 7"

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

## Implementation Status

### ✅ Completed (As of 2025-11-01)

**Phase 1: Database Schema**
- ✅ `courses` table extended with `units`, `lecture_hours`, `lab_hours` columns
- ✅ `teaching_load_config` table created with semester/department-specific rules
- ✅ Default configuration inserted for active semesters

**Phase 2: Service Layer**
- ✅ `loadCalculationService.ts` - Load calculation with configurable rules
- ✅ `instructorReportService.ts` - Report data fetching (fixed query structure)
- ✅ Two-step query approach for instructor assignments (avoids nested filter issues)

**Phase 3: Frontend Components**
- ✅ `InstructorReportsPage.tsx` - Main page with role-based filtering
- ✅ `InstructorSchedulePreview.tsx` - Report preview component
- ✅ `DayGroupTable.tsx` - Day-grouped schedule display
- ✅ `LoadSummaryWidget.tsx` - Load calculation summary

**Phase 4: Export Functionality**
- ✅ `pdfExportService.ts` - PDF generation with jsPDF
- ✅ `excelExportService.ts` - Excel export with xlsx
- ✅ File download handling

**Phase 5: Hooks**
- ✅ `useInstructorReport.ts` - Data fetching and caching
- ✅ `useReportExport.ts` - Export state management

**Phase 6: Types**
- ✅ `instructorReport.ts` - Complete type definitions
- ✅ Load calculation types

### 🔧 Critical Fixes Applied

**Issue 1: Invalid Supabase Query Syntax (FIXED)**
- **Problem:** `.eq('class_session.instructor_id', instructorId)` doesn't work with PostgREST
- **Solution:** Implemented two-step query:
  1. First fetch all `class_sessions` where `instructor_id` matches
  2. Then fetch `timetable_assignments` using `IN (session_ids)`
- **File:** `src/features/reports/services/instructorReportService.ts`

**Issue 2: Empty Assignments Handling (FIXED)**
- **Problem:** No early return when instructor has no sessions
- **Solution:** Added empty state return after step 1 if no sessions found
- **Benefit:** Avoids unnecessary query and provides proper empty report structure

### 📋 Access Control Implementation

**Role-Based Filtering:**
- ✅ Admins see ALL instructors
- ✅ Department Heads see THEIR department's instructors
- ✅ Program Heads see their department's instructors (via program.department_id)
- ✅ Info banners display for non-admins
- ✅ `useDepartmentId` hook properly infers department from program

### 🧪 Testing Requirements

#### Unit Tests
- [ ] Load calculation formulas
- [ ] Time slot formatting
- [ ] Day grouping logic
- [ ] Total calculations
- [ ] Export filename generation
- [ ] Two-step query logic

#### Integration Tests
- [ ] Report data fetching with real database
- [ ] Export to PDF with sample data
- [ ] Export to Excel with sample data
- [ ] Empty instructor report handling
- [ ] Role-based instructor filtering

#### E2E Tests
- [ ] Complete report generation flow
- [ ] Export and verify file download
- [ ] Preview report accuracy
- [ ] Load calculation display
- [ ] Empty state rendering

## Verification Steps

1. **Test Course Management:**
   - Create new course with lecture and lab hours
   - Verify units auto-calculate correctly
   - Override units and verify custom value persists
   - Edit existing course and verify all fields populate

2. **Test Report Generation:**
   - Select an instructor with confirmed timetable assignments
   - Verify active semester is pre-selected
   - Verify focus is on instructor select
   - Verify all course details display in `Name (CODE)` format
   - Verify department shows short code (e.g., "CS", "IT")
   - Check "Contact hr/wk" merged header spans Lec/Lab columns
   - Check load calculations match manual calculations

3. **Test Empty States:**
   - Select instructor with no assignments
   - Verify graceful empty state handling

4. **Test Exports:**
   - Generate PDF and verify formatting
   - Verify merged header cells render correctly in PDF
   - Generate Excel and verify data structure
   - Test print functionality

5. **Test Role-Based Access:**
   - Admin: Can view all instructors
   - Department Head: Can view department instructors only
   - Program Head: Can view department instructors only

6. **Verify Data Accuracy:**
   - Course names and codes display correctly in reports
   - Department codes match database values
   - Lecture/lab hours match course definitions
   - Units match course configuration (auto or custom)
   - Teaching load calculations are accurate
   - Class sizes reflect actual enrollment
- [ ] Filename format: `{instructor_code}_{semester}_Schedule.{ext}`

### 5. Load Configuration
- [ ] `teaching_load_config` table has entries for active semester
- [ ] Default values: `units_per_load = 3.0`, `standard_load = 7.0`
- [ ] Load calculation uses config from database (not hardcoded)

## Migration Strategy (COMPLETED)

### ✅ Step 1: Add Course Metadata (COMPLETED)
- ✅ Ran migration to add `units`, `lecture_hours`, `lab_hours` columns
- ✅ Backfilled existing courses with default values
- ✅ Updated course forms to include new fields

### ✅ Step 2: Implement Load Calculation (COMPLETED)
- ✅ Created `loadCalculationService.ts`
- ✅ Created `teaching_load_config` table with RLS policies
- ⚠️ Unit tests needed

### ✅ Step 3: Build Report UI (COMPLETED)
- ✅ Created report preview components
- ✅ Added instructor selection with role-based filtering
- ✅ Implemented load summary display with color coding

### ✅ Step 4: Add Export Functionality (COMPLETED)
- ✅ Implemented PDF export with jsPDF
- ✅ Implemented Excel export with xlsx
- ✅ Added download functionality
- ⚠️ Needs testing with various edge cases

### 🔄 Step 5: Polish and Testing (IN PROGRESS)
- ✅ Responsive design implemented
- ✅ Print styling (@media print rules)
- ⚠️ Performance optimization needed (query caching)
- ⚠️ Comprehensive testing needed

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
- courses: +3 columns (units, lecture_hours, lab_hours) - for display purposes
- teaching_load_config: new table with units_per_load, standard_load, and optional department_id
- Updated RLS policies for reports access (program_head and above only)

## Success Metrics

- [ ] Reports generated successfully for all instructors
- [ ] Load calculations match manual calculations (100% accuracy)
- [ ] Export time < 3 seconds for individual report
- [ ] Batch export handles 50+ instructors efficiently
- [ ] Zero data integrity issues in production
- [ ] 90%+ user satisfaction with report format
