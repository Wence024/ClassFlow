# ClassFlow User Guide

Welcome to ClassFlow! This guide will help you get started with creating and organizing your class schedule.

## Core Concepts

- **Components**: These are the building blocks of your schedule. There are four types:
  - **Courses**: The subjects being taught (e.g., "Introduction to Programming," with a course code like "CS101").
  - **Class Groups**: The group of students taking the class (e.g., "Section A," with a student count).
  - **Instructors**: The people teaching the courses, with details like their full name, email, and phone number.
  - **Classrooms**: The physical locations where classes are held, including their capacity.
- **Class Sessions**: A "Class Session" is a specific combination of one Course, one Group, one Instructor, one Classroom, and a duration (in periods). These are the items you will place on the timetable.
- **Timetable**: The main grid where you can visually schedule your Class Sessions.

## How to Build Your Schedule: A Step-by-Step Guide

### Step 1: Add Your Components

Before you can schedule anything, you need to define your building blocks.

1. Navigate to the **Manage Components** page from the sidebar.
2. Use the tabs at the top (**Courses**, **Class Groups**, **Classrooms**, **Instructors**) to switch between component types.
3. For each type, fill out the form to add all the components you will need.
    - **Tip:** When you create a new component, it will be assigned a random color to help with visual organization!
    - **For Instructors**, you can enter detailed information like their full name, contact info, and contract type. A short code will be auto-generated for you.
    - **For Classrooms and Class Groups**, you can specify the room's capacity and the number of students.
4. Use the **search bar** at the top of the list to quickly find components if the list gets long.

### Step 2: Create Your Class Sessions

Now, combine your components into schedulable classes.

1. Navigate to the **Manage Classes** page from the sidebar.
2. Use the form to create the combinations you need, specifying the course, group, instructor, classroom, and the **duration in periods**. For example:
    - **Course:** "Intro to Programming"
    - **Group:** "Section A"
    - **Instructor:** "Dr. Jane Doe"
    - **Classroom:** "Room 101"
    - **Duration:** 2 periods
3. As you select a class group and classroom, the form will **instantly warn you** if there is a potential conflict, such as the number of students exceeding the room's capacity.

### Step 3: Schedule on the Timetable

This is where you visually build your schedule.

1. Navigate to the **Timetable** page from the sidebar.
   - **Note:** Class sessions in the drawer with a yellow warning badge have a potential issue (like a capacity conflict) that you should review.
2. You will see all the Class Sessions you created in the **"Available Classes"** drawer at the bottom.
3. Simply **drag** a class from the drawer and **drop** it onto an empty, dashed slot in the timetable grid. The system will automatically prevent you from creating conflicts.

## Frequently Asked Questions (FAQ)

- **Why can’t I drop a class in a certain spot?**
    As you drag a session over the grid, available slots will be marked with a **green highlight**. If a slot shows a **red highlight**, it means there is a conflict (e.g., the instructor is already busy). You can only drop sessions on green slots. After an invalid drop, a notification will provide more details.

- **How do I move a scheduled class?**
    Just drag the class from its current position on the grid and drop it into a new, valid time slot.

- **How do I remove a class from the schedule?**
    Drag the class from the timetable grid and drop it back into the "Available Classes" drawer at the bottom.

- **Is my data saved automatically?**
    Yes. All changes you make are saved instantly and securely. You can log out and log back in from any device, and your schedule will be there.
