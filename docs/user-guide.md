# ClassFlow User Guide

Welcome to ClassFlow! This guide will help you get started with creating and organizing your class schedule.

## User Roles

ClassFlow has two primary user roles with different capabilities:

- **Admin**: Can configure system-wide settings, such as the academic schedule, and manages the master list of shared resources like instructors and classrooms. Admins can also manage departments and programs.
- **Program Head**: Manages the components, class sessions, and timetable for their specific academic program. Each program is associated with a department.

## Core Concepts

### Navigation

ClassFlow features a collapsible sidebar for efficient navigation:

- **Expanded Sidebar (Default)**: Shows navigation icons with text labels for easy identification
- **Collapsed Sidebar**: Click the toggle button (☰) in the header to collapse the sidebar to icon-only mode, maximizing screen space for content-dense pages
- **Tooltips**: When collapsed, hover over any navigation icon to see its full label
- **State Persistence**: Your sidebar preference persists as you navigate between pages

To toggle the sidebar, click the collapse/expand button at the top-left of the header, next to the "ClassFlow" title.

### Data Components

- **Components**: These are the building blocks of your schedule.
  - **Courses**: The subjects being taught (e.g., "CS101").
  - **Class Groups**: The group of students taking the class (e.g., "Section A").
  - **Instructors & Classrooms**: Shared, school-wide resources managed by an Admin.
- **Class Sessions**: A specific combination of a Course, Group, Instructor, and Classroom for a set duration. These are the items you place on the timetable.
- **Timetable**: The main grid where you can visually schedule your Class Sessions.

- **Departments**: Organizational units that contain multiple programs (e.g., "Computer Science Department").
- **Programs**: Academic programs within a department (e.g., "Bachelor of Science in Computer Science").

## How to Build Your Schedule: A Step-by-Step Guide

### Step 0: Configure Departments and Programs (Admin Only)

1. Navigate to the **Manage Departments** page.
2. Create departments that organize your institution (e.g., "Computer Science", "Engineering").
3. Navigate to the **Manage Programs** page.
4. Create programs and assign each to a department (e.g., "BS Computer Science" → "Computer Science Department").

### Step 1: Manage Your Components

1. Navigate to the **Manage Components** page.
2. Use the tabs (**Courses**, **Class Groups**, etc.) to view the building blocks of your schedule.
3. As a **Program Head**, you can create and manage the Courses and Class Groups that belong to your program.
4. The lists of **Instructors** and **Classrooms** are managed by an Administrator. You can view this shared list to select them for your classes.

### Step 2: Create Your Class Sessions

1. Navigate to the **Manage Classes** page.
2. Use the form to combine your components into schedulable classes, specifying the course, group, instructor, classroom, and duration.
3. The form will **instantly warn you** of potential issues, like the number of students exceeding a room's capacity.

### Step 3: Schedule on the Timetable

1. Navigate to the **Timetable** page. You will see a comprehensive schedule for all programs.
    - **Note:** Sessions belonging to other programs will appear "grayed out" and are read-only.
2. Your unassigned class sessions are in the **"Available Classes"** drawer at the bottom.
3. **Drag** a class from the drawer and **drop** it onto an empty slot in one of *your program's* rows.

## Frequently Asked Questions (FAQ)

- **Why can’t I drop a class in a certain spot?**
    As you drag a session, available slots will be highlighted in **green**. If a slot is highlighted in **red**, it means there is a conflict (e.g., the instructor or classroom is already booked by another program). You can only drop sessions on green slots.

- **How do I move or remove a class?**
    You can only move or remove classes that belong to your program.
  - To **move** a class, drag it from its current position to a new, valid slot.
  - To **remove** a class from the schedule, drag it from the timetable and drop it back into the "Available Classes" drawer.

- **Is my data saved automatically?**
    Yes. All changes are saved instantly. Thanks to the real-time system, any changes you make will be immediately visible to other users, and their changes will be visible to you.
