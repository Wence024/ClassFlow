# Incomplete Sessions - User Guide

Step-by-step guide for program heads to create and manage sessions without immediate resource assignment.

---

## What Are Incomplete Sessions?

Incomplete sessions are class sessions created **without** assigning an instructor and/or classroom. Resources can be assigned later when you're ready to schedule them in the timetable.

### Benefits
- ✅ **Faster setup** - Create all sessions upfront without waiting for resource decisions
- ✅ **Flexible scheduling** - Assign resources when you see availability in the timetable
- ✅ **Visual planning** - See all sessions in the drawer and drag them when ready
- ✅ **Iterative workflow** - Make resource decisions at placement time

### Visual Indicators
Incomplete sessions are easy to identify:
- 🚧 **Dashed orange border** in timetable cells
- ⚠️ **Warning badge** showing "Needs resources"
- **Tooltip** displays "⚠️ Not assigned" for missing resources

---

## Scenario 1: Quick Session Creation

**Goal:** Create a session when you haven't decided on instructor or classroom yet.

### Step-by-Step

1. **Navigate to Class Management**
   - Go to "Manage Classes" page
   - Click "Create New Class Session" button

2. **Fill Required Fields**
   - **Course:** Select from dropdown (e.g., "Math 101")
   - **Class Group:** Select from dropdown (e.g., "Group A")
   - **Period Count:** Enter duration (e.g., 2 periods)

3. **Leave Resources Empty** (Optional)
   - **Instructor:** Leave empty or click "Clear selection"
   - **Classroom:** Leave empty or click "Clear selection"
   - ℹ️ *Both fields are optional - you can assign them later*

4. **Submit Form**
   - Click "Create Session" button
   - Success toast appears: "Session created successfully"

5. **Result**
   - Session appears in the timetable drawer
   - Has dashed orange border indicating incomplete status
   - Shows ⚠️ badge with missing resources

### Example Workflow
```
You need to create 10 Math 101 sessions for Group A, but you haven't 
decided which instructors will teach which sections yet.

✅ Create all 10 sessions without instructors
✅ Review instructor availability in the timetable
✅ Assign instructors when placing each session
```

---

## Scenario 2: Assigning Resources Later

**Goal:** Assign instructor and classroom to an incomplete session via the timetable.

### Step-by-Step

1. **Open the Timetable**
   - Navigate to "Scheduler" or "Timetable" page
   - Ensure you're in the correct semester

2. **Locate Incomplete Session**
   - Look in the drawer at the bottom of the page
   - Incomplete sessions have:
     - Dashed orange border
     - ⚠️ Warning badge
     - Course name and group

3. **Choose View Mode** (Important!)
   - **Class-Group View** (Recommended for incomplete sessions)
     - System will suggest available instructor + classroom
     - Easiest for first-time placement
   - **Instructor View** (If session already has instructor)
     - Can only place if instructor is assigned
     - Choose classroom when dropping
   - **Classroom View** (If session already has classroom)
     - Can only place if classroom is assigned
     - Choose instructor when dropping

4. **Drag Session to Timetable**
   - Click and hold the incomplete session card in the drawer
   - Drag to the desired time slot (day + period)
   - Green indicators show available slots
   - Red indicators show conflicts

5. **Resource Assignment Modal Appears** (Class-Group View)
   - Modal shows:
     - Session details (course, group, duration)
     - Suggested instructor (based on availability)
     - Suggested classroom (based on availability)
   - You can:
     - Accept suggestions
     - Change to different instructor/classroom
     - See real-time conflict warnings

6. **Confirm Assignment**
   - Review the selected resources
   - Click "Confirm" button
   - Wait for success toast

7. **Result**
   - Session appears in the timetable cell
   - No longer has dashed border
   - Resources are now assigned

### Example Workflow
```
You created an incomplete Math 101 session earlier.
Now you're ready to schedule it.

✅ Switch to Class-Group View
✅ Drag session to Monday, Period 2
✅ Modal suggests: Dr. Smith (available) + Room 101 (available)
✅ Confirm the suggestion
✅ Session is now complete and placed
```

---

## Scenario 3: Reassigning Resources

**Goal:** Change the instructor or classroom for an existing session.

### Why Reassign?
- Instructor's schedule changed
- Better classroom became available
- Balancing teaching loads
- Student accessibility requirements

### Step-by-Step: Reassign Instructor

1. **Switch to Instructor View**
   - Use view mode selector at top of timetable
   - Select "Instructor View"

2. **Locate the Session**
   - Find the session in the **current instructor's row**
   - Session shows course name and time

3. **Identify Target Instructor**
   - Scroll to find the new instructor's row
   - Check availability (green indicators)
   - Note: You can move to any time slot simultaneously

4. **Drag Session to New Row**
   - Click and hold the session cell
   - Drag to **different instructor's row**
   - Can be same time slot or different time slot
   - Release when over desired cell

5. **Confirmation Dialog Appears**
   - Shows:
     - **From:** Current instructor name
     - **To:** New instructor name
     - **Time:** New time slot (if changed)
   - Warning if cross-department (requires approval)

6. **Confirm Reassignment**
   - Click "Confirm" or "Continue" button
   - Wait for success toast

7. **Result**
   - Session updates with new instructor
   - Session moves to new time slot (if changed)
   - Timetable refreshes to show changes

### Step-by-Step: Reassign Classroom

1. **Switch to Classroom View**
   - Use view mode selector at top of timetable
   - Select "Classroom View"

2. **Locate the Session**
   - Find the session in the **current classroom's row**

3. **Drag to Different Classroom Row**
   - Same process as instructor reassignment
   - Drag to new classroom's row

4. **Confirm in Dialog**
   - Shows classroom change
   - Warns of capacity issues if applicable

5. **Result**
   - Session assigned to new classroom

### Example Workflow
```
Dr. Smith is unavailable on Monday, but Dr. Jones is free.
You need to reassign the Math 101 session.

✅ Switch to Instructor View
✅ Find session in Dr. Smith's row (Monday P2)
✅ Drag to Dr. Jones' row (Monday P2 or any other slot)
✅ Confirm: "Change instructor from Dr. Smith to Dr. Jones"
✅ Session now assigned to Dr. Jones
```

---

## Scenario 4: Partially Complete Sessions

**Goal:** Manage a session that has one resource but not the other.

### Case 1: Has Instructor, Missing Classroom

**How it happened:**
- Created session and assigned instructor immediately
- OR reassigned instructor but classroom became unavailable

**How to complete:**
1. Switch to **Instructor View** (session will show in assigned instructor's row)
2. Session appears in the drawer (not placed yet)
3. Drag to desired time slot
4. System prompts for classroom selection
5. Choose classroom and confirm

**Alternative:**
1. Edit session in "Manage Classes"
2. Assign classroom directly in the form
3. Save changes

### Case 2: Has Classroom, Missing Instructor

**How it happened:**
- Created session and assigned classroom immediately
- OR reassigned classroom but instructor unavailable

**How to complete:**
1. Switch to **Classroom View** (session will show in assigned classroom's row)
2. Session appears in the drawer (not placed yet)
3. Drag to desired time slot
4. System prompts for instructor selection
5. Choose instructor and confirm

**Alternative:**
1. Edit session in "Manage Classes"
2. Assign instructor directly in the form
3. Save changes

---

## Important Notes

### View Mode Restrictions

| View Mode | Can Place Incomplete? | Can Place Partial? | Can Reassign? |
|-----------|----------------------|-------------------|---------------|
| **Class-Group** | ✅ Yes (infers resources) | ✅ Yes | ❌ No (time only) |
| **Instructor** | ❌ No (needs instructor) | ✅ If has instructor | ✅ Yes (instructor) |
| **Classroom** | ❌ No (needs classroom) | ✅ If has classroom | ✅ Yes (classroom) |

### Cross-Department Resources

- Reassigning to a cross-department resource requires approval
- Department head must approve before session is placed
- Session enters "pending" status until approved
- You'll see a pulsing highlight indicating pending approval

### Conflict Detection

The system prevents:
- **Instructor double-booking** - Same instructor, same time
- **Classroom double-booking** - Same classroom, same time
- **Group double-booking** - Same group, same time
- **Capacity issues** - Too many students for classroom

If you encounter a conflict:
1. Red indicators appear during drag
2. Drop is blocked
3. Error toast explains the conflict
4. Try a different time slot or resource

---

## Troubleshooting

### Problem: "Cannot drop session here"

**Possible causes:**
1. **Wrong view mode**
   - Solution: Switch to Class-Group View
2. **Missing resources for current view**
   - Solution: Assign required resource first or switch views
3. **Conflict detected**
   - Solution: Check for red indicators, choose different slot

### Problem: "Session disappeared after dropping"

**Possible causes:**
1. **Conflict occurred**
   - Check error toast for details
   - Session returns to drawer
2. **Cross-department approval needed**
   - Session enters pending status
   - Check pending approvals section

### Problem: "Can't find incomplete session"

**Possible causes:**
1. **Filter is hiding it**
   - Check timetable filters
   - Ensure "Show incomplete sessions" is enabled
2. **Wrong program selected**
   - Verify you're viewing the correct program
3. **Session was completed**
   - Check if resources were assigned elsewhere

### Problem: "Resource modal not appearing"

**Possible causes:**
1. **Session already has resources**
   - Modal only appears for incomplete sessions
   - Check session details
2. **Not in Class-Group View**
   - Modal only appears in Class-Group View
   - Other views prompt differently

---

## Tips & Best Practices

### 1. Plan Ahead
- Create all sessions at the start of semester planning
- Leave resources unassigned until you review the full schedule
- Assign resources strategically after seeing the big picture

### 2. Use Class-Group View for Initial Placement
- Easiest for incomplete sessions
- System suggests available resources
- See all availability at once

### 3. Use Resource Views for Optimization
- After initial placement, switch to Instructor View
- Balance teaching loads by visualizing instructor schedules
- Reassign sessions to optimize workload distribution

### 4. Filter for Focus
- Use "Show incomplete sessions" filter to focus on unassigned sessions
- Hide completed sessions when doing initial scheduling
- Show all when reviewing the complete schedule

### 5. Batch Similar Sessions
- Create all sessions for one course at once
- Assign resources in batches (e.g., all morning sessions first)
- Review and adjust after each batch

---

## Quick Reference

### Keyboard Shortcuts
- **Esc** - Close resource assignment modal
- **Enter** - Confirm resource assignment (when modal focused)
- **Arrow Keys** - Navigate between time slots (when dragging)

### Visual Legend
- 🚧 **Dashed orange border** - Incomplete session
- 🟢 **Green indicator (80% opacity)** - Pre-assigned resource row
- 🟢 **Green indicator (40% opacity)** - Alternative resource rows
- 🔴 **Red indicator** - Conflict/unavailable slot
- ⚠️ **Warning badge** - Missing resources
- 💜 **Pulsing highlight** - Pending cross-department approval

### Common Actions
- **Create incomplete** - Leave resources empty in form
- **Assign later** - Drag from drawer to timetable
- **Reassign instructor** - Drag between rows in Instructor View
- **Reassign classroom** - Drag between rows in Classroom View
- **Edit resources** - Edit session in Manage Classes

---

## Need More Help?

- Check the troubleshooting section above
- Review the implementation status to see what features are available
- Contact your system administrator for technical issues
- Refer to the API documentation for developer details
