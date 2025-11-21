# ClassFlow

ClassFlow is a modern, real-time class scheduling application designed for academic departments. Built with a **vertical slice architecture** organized by user roles (Admin, Department Head, Program Head), it provides intuitive drag-and-drop timetabling, comprehensive resource management, and secure role-based access control.

## Architecture

ClassFlow uses a **vertical slice architecture** where features are organized by user workflows rather than technical layers. Each role has dedicated feature slices that encapsulate all layers (UI, logic, services) for complete user journeys.

```
src/features/
├── admin/              # System-wide management
├── department-head/    # Department resource management
├── program-head/       # Program scheduling & sessions
└── shared/            # Cross-role features
```

**Key Benefits:**
- Clear separation of concerns by user role
- Easy to understand and navigate
- Testable end-to-end workflows
- Scalable for growing teams

For detailed architecture documentation, see [VERTICAL_SLICE_ARCHITECTURE.md](./docs/VERTICAL_SLICE_ARCHITECTURE.md).

---

## Key Features

### 🔐 Secure Multi-Role System
- **Admin**: System configuration, user management, department/program setup
- **Department Head**: Instructor management, cross-department request approval
- **Program Head**: Course/session creation, timetable scheduling, resource requests

### 📅 Interactive Timetabling
- Drag-and-drop grid interface with real-time validation
- Multiple view modes (by class group, classroom, or instructor)
- Instant conflict detection and visual feedback
- Cross-department resource request workflow
- Pending operations tracking with confirmation dialogs

### 📊 Comprehensive Management
- **Courses & Groups**: Full CRUD with visual organization (auto-color assignment)
- **Class Sessions**: Create schedulable sessions with conflict detection
- **Instructors**: Department-scoped management with detailed attributes
- **Classrooms**: Capacity-based management with location tracking
- **Schedule Configuration**: Flexible periods per day, class days, start times

### 📈 Reporting & Analytics
- Instructor schedule reports with teaching load calculations
- Exportable to PDF and Excel formats
- Multi-day grouping for detailed analysis
- Load tracking with configurable standards

### ⚡ Real-Time Collaboration
- Live updates via Supabase subscriptions
- Optimistic UI updates with rollback on errors
- Synchronized state across all connected clients

### 🧪 Comprehensive Testing
- 100% test coverage on all critical workflows
- Unit, integration, and E2E tests
- Security-focused permission testing
- Fast execution with Vitest and Cypress

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/classflow.git
cd classflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Initial Setup

1. **Configure Supabase**: Set up your Supabase project and run the migrations in `supabase/migrations/`
2. **Create Admin User**: Use Supabase dashboard to create your first admin user
3. **Configure Schedule**: Set periods per day, class days, and start times
4. **Create Departments & Programs**: Set up your organizational structure
5. **Invite Users**: Add department heads and program heads

For detailed setup instructions, see [Getting Started Guide](./docs/getting-started.md).

---

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
```

### Testing
```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e          # E2E tests with Cypress
npm run test:coverage     # Generate coverage report
```

### Pre-merge Check
```bash
npm run premerge     # Run lint, type-check, test, and format
```

---

## Documentation

### Core Documentation
- **[Getting Started](./docs/getting-started.md)** - Setup and configuration guide
- **[Vertical Slice Architecture](./docs/VERTICAL_SLICE_ARCHITECTURE.md)** - Architecture patterns and conventions
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - Testing strategy and best practices
- **[Refactoring Status](./docs/REFACTORING_STATUS.md)** - Migration progress and roadmap

### Developer Guides
- **[Coding Guidelines](./docs/coding-guidelines.md)** - Code style and conventions
- **[Security Recommendations](./docs/security-recommendations.md)** - Security best practices
- **[User Guide](./docs/user-guide.md)** - End-user documentation

### Project History
- **[Changelogs](./docs/changelogs/)** - Detailed change history and maintenance logs
- **[C4 Diagrams](./docs/c4-diagrams/)** - System architecture diagrams

---

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React DnD** - Drag-and-drop functionality

### State Management
- **TanStack Query** - Server state and caching
- **React Context** - Global UI state

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **Row Level Security (RLS)** - Database-level permissions

### Testing
- **Vitest** - Unit and integration tests
- **Testing Library** - React component testing
- **Cypress** - E2E testing
- **MSW** - API mocking

---

## Project Structure

```
src/
├── features/                    # Vertical slices by role
│   ├── admin/                   # Admin workflows
│   │   ├── manage-users/
│   │   ├── manage-departments/
│   │   ├── manage-programs/
│   │   ├── manage-classrooms/
│   │   └── schedule-config/
│   ├── department-head/         # Department Head workflows
│   │   ├── manage-instructors/
│   │   ├── approve-request/
│   │   ├── reject-request/
│   │   └── view-department-requests/
│   ├── program-head/            # Program Head workflows
│   │   ├── manage-class-sessions/
│   │   ├── manage-components/   # Courses, groups, etc.
│   │   ├── schedule-class-session/
│   │   ├── request-cross-dept-resource/
│   │   └── view-pending-requests/
│   └── shared/                  # Cross-role features
│       ├── auth/
│       ├── view-reports/
│       └── schedule-config/
├── lib/                         # Infrastructure layer
│   ├── services/               # Centralized database operations
│   ├── utils/                  # Shared utilities
│   └── validation/             # Centralized validation
├── components/                  # Reusable UI components
│   ├── ui/                     # shadcn/ui primitives
│   ├── dialogs/                # Shared dialogs
│   └── layout/                 # Layout components
├── types/                      # Global type definitions
├── routes/                     # Route configuration
└── integrations/               # Third-party integrations
```

---

## Contributing

### Workflow
1. Create a feature branch from `main`
2. Make your changes following the coding guidelines
3. Write tests for new functionality
4. Run `npm run premerge` to verify quality
5. Submit a pull request with a clear description

### Code Standards
- Follow TypeScript best practices
- Write JSDoc comments for exported functions
- Maintain cognitive complexity ≤ 10
- Achieve 80%+ test coverage on new code
- Use semantic tokens for styling (no hardcoded colors)

See [Coding Guidelines](./docs/coding-guidelines.md) for detailed standards.

---

## Recent Changes

### Version 2.0 - Vertical Slice Architecture (November 2025)
- ✅ Complete refactoring to vertical slice architecture
- ✅ Role-based feature organization (Admin, Department Head, Program Head)
- ✅ Centralized services and validation in `lib/`
- ✅ 100% test coverage on critical workflows
- ✅ Updated documentation and architecture guides

See [Changelogs](./docs/changelogs/) for detailed change history.

---

## License

This project is licensed under the MIT License.

---

## Support

For issues, questions, or contributions:
- Create an issue in the GitHub repository
- Review the documentation in the `docs/` directory
- Check the [Testing Guide](./docs/TESTING_GUIDE.md) for test-related questions
- See [Architecture Guide](./docs/VERTICAL_SLICE_ARCHITECTURE.md) for design patterns
