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
