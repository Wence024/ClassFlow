# HMIS User Stories & Access Matrix

## Role Definitions

| Role | Description |
|------|-------------|
| `admin` | Full system access - manages users, settings, and all modules |
| `doctor` | Medical professionals - handles consultations, records, prescriptions |
| `nurse` | Clinical support - patient care, vitals, queue management |
| `pharmacist` | Pharmacy operations - inventory, prescription dispensing |
| `lab_tech` | Laboratory technician - lab requests, test results |
| `billing_clerk` | Finance staff - billing, payments, insurance claims |
| `receptionist` | Front desk - patient registration, appointments, queue |
| `staff` | General department personnel (catch-all for other roles) |
| `patient` | End users - view own records, appointments, prescriptions |

## Role → Module Access Matrix

| Module | Admin | Doctor | Nurse | Pharmacist | Lab Tech | Billing Clerk | Receptionist | Staff | Patient |
|--------|:-----:|:------:|:-----:|:----------:|:--------:|:-------------:|:------------:|:-----:|:-------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patients | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | Own |
| Appointments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | Own |
| Medical Records | ✅ | ✅ | View | ❌ | View | ❌ | ❌ | ❌ | Own |
| Patient Queue | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Prescriptions | ✅ | ✅ | View | ✅ | ❌ | ❌ | ❌ | ❌ | Own |
| Lab Requests | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | Own |
| Pharmacy | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Own |
| Staff Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Departments | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Legend
- ✅ = Full access (CRUD)
- View = Read-only access
- Own = Access to own records only
- ❌ = No access

## User Stories by Role

### Admin
- As an admin, I can manage all users and assign roles
- As an admin, I can view and configure all system settings
- As an admin, I can manage departments and staff assignments
- As an admin, I can access all reports and analytics

### Doctor
- As a doctor, I can view my patient list and their medical history
- As a doctor, I can create and update medical records
- As a doctor, I can write prescriptions for patients
- As a doctor, I can request lab tests and view results
- As a doctor, I can manage my appointment schedule

### Nurse
- As a nurse, I can record patient vitals and update records
- As a nurse, I can manage the patient queue
- As a nurse, I can view prescriptions and assist with medication
- As a nurse, I can schedule appointments for patients

### Pharmacist
- As a pharmacist, I can view and dispense prescriptions
- As a pharmacist, I can manage pharmacy inventory
- As a pharmacist, I can track medication stock levels

### Lab Technician
- As a lab tech, I can view pending lab requests
- As a lab tech, I can enter and update lab results
- As a lab tech, I can mark tests as completed

### Billing Clerk
- As a billing clerk, I can create and manage patient bills
- As a billing clerk, I can process payments
- As a billing clerk, I can handle insurance claims

### Receptionist
- As a receptionist, I can register new patients
- As a receptionist, I can schedule and manage appointments
- As a receptionist, I can manage the patient queue

### Patient
- As a patient, I can view my medical records
- As a patient, I can see my upcoming appointments
- As a patient, I can view my prescriptions
- As a patient, I can view my lab results
- As a patient, I can see my billing history

---

## Module Workflow Sequences by Role

This section documents the step-by-step module flows each role follows to complete their primary tasks.

### Admin Workflows

**User Management Flow**
```
Staff Management → Add/Edit User → Assign Role → Assign Department
```

**System Configuration Flow**
```
Settings → Configure Modules → Set Permissions → Review Audit Logs
```

**Department Setup Flow**
```
Departments → Create Department → Assign Head Doctor → Add Staff Members
```

---

### Doctor Workflows

**Patient Consultation Flow**
```
Dashboard → Patient Queue → Select Patient → Medical Records → 
Create/Update Record → Write Prescription → Request Lab Tests (optional) → 
Complete Consultation → Return to Queue
```

**Prescription Writing Flow**
```
Patient Queue/Records → Select Patient → Prescriptions → 
Add Medications → Set Dosage/Frequency → Save → Send to Pharmacy
```

**Lab Request Flow**
```
Medical Records → Request Lab Test → Select Tests → Set Priority → 
Submit Request → (Later) View Lab Results
```

**Appointment Management Flow**
```
Dashboard → Appointments → View Schedule → Accept/Reschedule Appointments
```

---

### Nurse Workflows

**Patient Vitals Recording Flow**
```
Dashboard → Patient Queue → Call Patient → Record Vitals → 
Update Medical Record → Assign to Doctor Queue
```

**Queue Management Flow**
```
Patient Queue → View Waiting Patients → Call Next → 
Update Status (Waiting → In Progress → Completed)
```

**Prescription Assistance Flow**
```
Prescriptions → View Active Prescriptions → Assist with Medication → 
Update Administration Notes
```

---

### Pharmacist Workflows

**Prescription Dispensing Flow**
```
Dashboard → Prescriptions → View Pending → Verify Prescription → 
Check Inventory → Dispense Medication → Mark as Dispensed → 
Update Inventory
```

**Inventory Management Flow**
```
Pharmacy → Inventory → Check Stock Levels → Reorder Low Stock → 
Update Quantities → Track Expiry Dates
```

---

### Lab Technician Workflows

**Lab Test Processing Flow**
```
Dashboard → Lab Requests → View Pending Tests → 
Process Sample → Enter Results → Mark as Completed → 
Submit for Doctor Review
```

**Result Entry Flow**
```
Lab Requests → Select Request → Enter Test Values → 
Add Notes/Observations → Save Results → Notify Doctor
```

---

### Billing Clerk Workflows

**Bill Generation Flow**
```
Dashboard → Billing → Select Patient → Add Services/Items → 
Calculate Total → Apply Insurance (if applicable) → Generate Bill
```

**Payment Processing Flow**
```
Billing → View Pending Bills → Select Bill → Process Payment → 
Update Payment Status → Issue Receipt
```

**Insurance Claim Flow**
```
Billing → Insurance Claims → Create Claim → Attach Documents → 
Submit to Provider → Track Claim Status
```

---

### Receptionist Workflows

**Patient Registration Flow**
```
Dashboard → Patients → Add New Patient → Enter Demographics → 
Add Emergency Contact → Add Insurance Info → Save Patient
```

**Appointment Scheduling Flow**
```
Appointments → Check Doctor Availability → Select Time Slot → 
Assign Patient → Confirm Appointment → Send Notification
```

**Queue Management Flow**
```
Patient Queue → Check-in Patient → Assign Queue Number → 
Direct to Department → Update Queue Status
```

---

### Staff (General) Workflows

**Basic Patient Lookup Flow**
```
Dashboard → Patients → Search Patient → View Basic Info
```

**Appointment Viewing Flow**
```
Dashboard → Appointments → View Department Schedule
```

---

### Patient (Self-Service) Workflows

**View Medical History Flow**
```
Dashboard → Medical Records → View Past Visits → 
View Diagnoses → Download Reports
```

**Appointment Booking Flow**
```
Dashboard → Appointments → View Available Slots → 
Select Doctor/Department → Book Appointment → Receive Confirmation
```

**Prescription Access Flow**
```
Dashboard → Prescriptions → View Active/Past Prescriptions → 
View Medication Details → Check Refill Status
```

**Lab Results Access Flow**
```
Dashboard → Lab Results → View Test Results → 
Download Reports → View Historical Data
```

**Billing History Flow**
```
Dashboard → Billing → View Outstanding Bills → 
View Payment History → Download Invoices
```

---

## Module Dependencies

| Module | Depends On |
|--------|------------|
| Medical Records | Patients |
| Appointments | Patients, Staff (Doctors) |
| Patient Queue | Patients, Appointments, Departments |
| Prescriptions | Medical Records, Pharmacy Inventory |
| Lab Requests | Medical Records, Lab Tests |
| Lab Results | Lab Requests |
| Billing | Patients, Medical Records, Prescriptions, Lab Results |
| Pharmacy | Prescriptions, Inventory |

## Recommended Implementation Order

1. **Core Infrastructure**: Authentication, User Roles, Departments
2. **Patient Management**: Patient Registration, Search, CRUD ✅
3. **Appointment System**: Scheduling, Calendar, Doctor Assignment
4. **Queue Management**: Check-in, Queue Display, Status Updates
5. **Medical Records**: Consultation Notes, Vitals, Attachments
6. **Prescriptions**: Create, Dispense, Track
7. **Lab Module**: Requests, Results, Reports
8. **Pharmacy**: Inventory, Dispensing, Stock Alerts
9. **Billing**: Invoicing, Payments, Insurance Claims
