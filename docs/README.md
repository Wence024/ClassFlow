# ⭐ **HMIS INTEGRATION PROJECT GUIDELINES**

**Hospital Management Information System (HMIS)**
**React + Next.js + Tailwind/ShadCN + TypeScript + Supabase**

---

## **📋 Table of Contents**

- [Project Overview](#-project-overview)
- [Core System Requirements](#-core-system-requirements)
  - [1. Authentication & Role-Based Access](#1-authentication--role-based-access)
  - [2. Core Hospital Management Modules](#2-core-hospital-management-modules)
  - [3. Security Requirements](#3-security-requirements)
  - [4. Containerization & Deployment Integration](#4-containerization--deployment-integration)
  - [5. Enterprise Integration Patterns (EIP)](#5-enterprise-integration-patterns-eip)
  - [6. Integrated System Testing](#6-integrated-system-testing)
  - [7. Monitoring & Logging](#7-monitoring--logging)
  - [8. Performance & Scalability](#8-performance--scalability)
  - [9. Project Documentation](#9-project-documentation)
  - [10. Final Presentation](#10-final-presentation)
- [Grading Rubric](#-grading-rubric)

---

## **📌 PROJECT OVERVIEW**

Students will design and develop a **Hospital Management Information System (HMIS)** that demonstrates mastery of **System Integration and Architecture** principles—focusing on secure integration, containerization, enterprise patterns, testing, monitoring, and performance optimization.

The system must support the following roles:

- **Admin**
- **Staff / Department Personnel**
- **Doctors & Nurses**
- **Patients**

The HMIS must be **fully modular**, integrated, secure, and deployment-ready.

---

## **📘 CORE SYSTEM REQUIREMENTS**

### **1. Authentication & Role-Based Access**

The system must implement:

- Multi-role login (Admin, Staff, Doctor/Nurse, Patient)
- Role-Based Access Control (RBAC) using Supabase Auth
- Secure session management
- Enforced Row Level Security (RLS) policies

**Expected Output:**

- Secure login + dashboards
- Access-restricted API routes
- Documentation of roles & permissions

---

### **2. Core Hospital Management Modules**

Your HMIS must include **at least seven** fully integrated modules:

#### ✔ **Patient Management**

- Registration, profile, admission, discharge, transfer
- Patient queue system

#### ✔ **Doctor & Nurse Management**

- Scheduling
- Assignments
- Daily patient rounds
- Medical notes

#### ✔ **Pharmacy Management**

- Inventory tracking
- Medicine dispensing
- Automated deductions
- Prescription verification

#### ✔ **Billing & Accounting**

- Automated billing generation
- Insurance claims
- Payment tracking
- Outstanding balance monitoring

#### ✔ **Laboratory Management**

- Test requests
- Diagnostic results
- Report generation

#### ✔ **Electronic Medical Records (EMR)**

- Full patient medical history
- Lab results
- Past treatments
- Doctor notes

#### ✔ **Administration & HR**

- Staff profiles
- Department assignment
- Attendance & payroll overview

### **Implementation Priority Order**

To ensure successful completion, follow this recommended priority order for implementation:

#### **Phase 1: Foundation Setup**

- Authentication & Role-Based Access
- Database schema design
- Basic UI framework with shadcn components
- Security middleware implementation
- Core user management

#### **Phase 2: Core Modules** (Implement Sequentially)

1. **Patient Management** (Foundation for all other modules)
2. **Doctor & Nurse Management** (Integrates with Patient & EMR)
3. **EMR Management** (Depends on Patient & Doctor/Nurse)
4. **Laboratory Management** (Integrates with Patient & EMR)
5. **Pharmacy Management** (Integrates with Patient & Prescriptions)
6. **Billing & Accounting** (Aggregates data from all modules)
7. **Administration & HR** (Manages system users)

#### **Phase 3: Integration & Enterprise Patterns**

- Implement Enterprise Integration Patterns (EIPs) between modules
- Set up message routing and transformation
- Create data aggregation pipelines
- Connect all modules with consistent APIs

#### **Phase 4: Testing & Monitoring**

- Implement comprehensive testing (component + e2e)
- Set up monitoring and logging
- Performance optimization
- Containerization and deployment preparation

---

### **3. Security Requirements**

The HMIS must demonstrate secure integration practices:

#### ✔ Data encryption (in transit & at rest)

- HTTPS enforced

- Sensitive fields protected
- Confidential data not exposed in logs

#### ✔ Mitigation of integration vulnerabilities

- XSS/CSRF protection

- SQL injection prevention
- No hardcoded credentials
- Secure API endpoints

#### ✔ Secure coding practices

- Input validation

- Sanitization
- Safe error handling

#### ✔ Access Policies

- Supabase RLS

- Access control diagrams
- Least-privilege design

---

### **4. Containerization & Deployment Integration**

Students must demonstrate system containerization using:

#### ✔ **Docker**

- Dockerfile for the HMIS

- Docker Compose for frontend + auxiliary services

#### ✔ **Container Orchestration (Simulation Allowed)**

- Deployment & Service YAML

- Explanation of scaling behavior
- Service discovery

#### ✔ **Integration Explanation**

- How containers communicate

- How services integrate with Supabase

---

### **5. Enterprise Integration Patterns (EIP)**

Implement **at least three** of the following:

- **Message Routing** (based on roles or departments)
- **Message Transformation** (standardizing data formats)
- **Aggregator** (collating EMR data in one view)
- **Splitter** (breaking prescriptions into items)
- **Filter** (filtering staff schedules, patient lists, etc.)

**Recommended Implementation Approach:**

#### **Pattern 1: Message Routing**

- Route notifications based on user roles (admins get all notifications, doctors get patient-specific alerts)
- Implement request routing to appropriate services based on resource type

#### **Pattern 2: Message Transformation**

- Transform raw patient data into standardized medical record formats
- Convert internal DTOs to API-compatible request/response formats
- Normalize data formats from different hospital devices/systems

#### **Pattern 3: Aggregator**

- Combine patient data from multiple sources (EMR, lab results, pharmacy) into unified patient view
- Aggregate statistics across departments for reporting dashboards

**Implementation Requirements:**

- Create clear diagrams showing how each pattern works in your system
- Show actual code implementation of the patterns
- Document the benefits of each implemented pattern
- Demonstrate how patterns improve system integration

---

### **6. Integrated System Testing**

Demonstrate testing of integrated modules:

#### ✔ Component Testing with Cypress

- Test all UI components in isolation using Cypress component testing
- Verify component behavior, state changes, and user interactions
- Create tests for each component in the `cypress/components/` directory

#### ✔ End-to-End Testing with Cypress

- Complete user workflows from login → navigation → data update → logout
- Test critical business flows across multiple modules
- Verify cross-module functionality and data flow
- Create tests in the `cypress/e2e/` directory

#### ✔ Module Integration Tests

- Test interactions between different modules (e.g., patient registration → doctor assignment → EMR creation)
- Verify data consistency across modules
- Test business logic spanning multiple components

#### ✔ Mock Services

- Mock external services (Supabase API calls, third-party integrations)
- Use Cypress intercepts for API response mocking
- Create realistic test data to simulate real-world usage

**Testing Coverage Requirements:**

- All UI components must have corresponding component tests
- Critical user journeys must have end-to-end test coverage
- Error scenarios and edge cases must be tested
- Authentication and authorization flows must be verified

---

### **7. Monitoring & Logging**

Implement basic observability:

#### ✔ Monitoring

- Prometheus / Grafana dashboard (local OK)

- Track API latency, uptime, error rate, request volume

#### ✔ Centralized Logging

- ELK Stack or alternative

- Authentication logs
- Error logs

#### ✔ Health Checks

- /api/health endpoint

- Alert triggers (email/log-based)

---

### **8. Performance & Scalability**

Your HMIS must demonstrate:

#### ✔ Load-Balancing Strategy

- Explanation of Nginx or API Gateway

#### ✔ Scaling Strategy

- Horizontal vs vertical scaling

- How the system scales using container orchestration

#### ✔ Caching Strategy

- SWR / React Query

- Caching lab reports, schedules, queue data

#### ✔ CDN integration

- Supabase Storage (CDN enabled)

---

### **9. Project Documentation**

Your final document must contain:

- System architecture diagram
- Database ERD
- Integration diagrams
- EIP diagrams
- Security documentation
- Testing reports
- Monitoring screenshots
- Deployment & scaling explanation
- Reflection

---

### **10. Final Presentation**

Students must demonstrate:

- Live system walkthrough
- Module integration
- Security implementations
- Containerization & orchestration
- Enterprise patterns
- Monitoring & logs
- Testing results

---

## **📊 GRADING RUBIC (100%)**

| **Category**                         | **Criteria**                                                  | **Weight** |
| ------------------------------------ | ------------------------------------------------------------- | ---------- |
| **System Functionality (Modules)**   | Completeness of 7+ modules, accuracy, usability               | **25%**    |
| **Security Implementation**          | Encryption, RLS, secure coding, vulnerability mitigation      | **15%**    |
| **Containerization & Orchestration** | Working Docker setup, deployment scripts, scaling explanation | **10%**    |
| **Enterprise Integration Patterns**  | Correct application of ≥3 EIPs + diagrams                     | **10%**    |
| **Testing (Integration + E2E)**      | API tests, mock data, automated tests                         | **10%**    |
| **Monitoring & Logging**             | Dashboard, health check, integrated logs                      | **10%**    |
| **Performance & Scalability**        | Load balancing, caching, scaling strategy                     | **10%**    |
| **Documentation Quality**            | Completeness, clarity, diagrams, professionalism              | **5%**     |
| **Final Presentation & Demo**        | Clarity, confidence, working system, Q&A                      | **5%**     |

## **🎯 IMPLEMENTATION SUCCESS STRATEGY**

### **Clear Development Approach**

To successfully implement this HMIS project, follow these key strategies:

#### **1. Understand the Interconnected Nature**

- Each module must connect with others (Patient Management connects to EMR, Pharmacy, Lab, etc.)
- Design your APIs with integration in mind
- Plan data flow between modules early in development

#### **2. Focus on Component Reusability**

- Build components that can work across multiple modules
- Ensure components are properly tested (both in isolation and integrated)
- Use consistent design patterns across the application

#### **3. Implement Gradually with Integration Testing**

- Start with basic functionality and gradually add complexity
- Test each integration point as you build it
- Use mocks to test components without full backend connections

#### **4. Document Your Integration Points**

- Keep diagrams updated as you implement modules
- Document the Enterprise Integration Patterns you implement
- Show how security and authentication flows across your system

#### **5. Prioritize Critical User Flows**

- Focus on the most important workflows first (e.g., patient registration → doctor assignment → EMR creation)
- Ensure these flows work perfectly before adding advanced features
- Test end-to-end scenarios that span multiple modules

#### **6. Test Early and Often**

- Write component tests as you build components
- Create end-to-end tests that validate complete workflows
- Use realistic test data that reflects actual hospital operations

By following this structured approach, you'll have a much better chance of completing all requirements successfully and creating a cohesive, integrated system that meets all project objectives.

## **🛠️ Development**

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd hmis2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then update the `.env.local` file with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run type-check` - Run TypeScript type checking
- `npm run test:e2e` - Open Cypress E2E tests
- `npm run test:e2e:headless` - Run Cypress tests in headless mode

### Project Structure

```txt
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configuration
├── models/             # Type definitions
├── services/           # Business logic and API services
└── types/              # Global TypeScript types
```

### Code Quality

This project follows these coding principles:

- **Readable, Maintainable Code**: Clear naming conventions and proper separation of concerns
- **Scalable Architecture**: Feature-based structure with services and hooks
- **Consistent Error Handling**: Centralized error handling with custom error classes
- **Security Best Practices**: Input sanitization, secure headers, and authentication
- **Performance Awareness**: Optimized rendering and caching strategies
- **Version Control Discipline**: Conventional commits with automated linting
- **Accessibility**: WCAG compliant components and keyboard navigation
- **Modern UI/UX**: Consistent design patterns with shadcn/ui
