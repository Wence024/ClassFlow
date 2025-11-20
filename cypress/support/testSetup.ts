/// <reference types="cypress" />

/**
 * Test Setup Helpers.
 *
 * Reusable functions for setting up common test environments.
 */

import {
  seedTestDepartment,
  seedTestProgram,
  seedTestUser,
  seedTestClassroom,
  seedTestInstructor,
  seedTestCourse,
  seedTestClassGroup,
  seedTestClassSession,
} from './seedTestData';

/**
 * Sets up a complete program head test environment.
 *
 * Creates:
 * - Test department
 * - Test program
 * - Program head user
 * - Test classroom
 * - Test instructor
 * - Test course
 * - Test class group
 *
 * @param options - Optional configuration.
 * @param options.email - Custom email for the program head.
 * @param options.password - Custom password for the program head.
 * @returns Object containing all created entities.
 */
export async function setupProgramHeadEnvironment(options?: {
  email?: string;
  password?: string;
}): Promise<{
  department: { id: string; name: string; code: string };
  program: { id: string; name: string; short_code: string; department_id: string };
  user: { userId: string; email: string };
  classroom: { id: string; name: string; code: string | null };
  instructor: { id: string; first_name: string; last_name: string };
  course: { id: string; name: string; code: string };
  classGroup: { id: string; name: string; code: string | null };
}> {
  const department = await seedTestDepartment();
  const program = await seedTestProgram({ departmentId: department.id });
  
  const user = await seedTestUser({
    email: options?.email || `prog_head_${Date.now()}@cypress.test`,
    password: options?.password || 'TestPassword123!',
    fullName: `Test Program Head ${Date.now()}`,
    role: 'program_head',
    departmentId: department.id,
    programId: program.id,
  });

  const classroom = await seedTestClassroom({
    preferredDepartmentId: department.id,
  });

  const instructor = await seedTestInstructor({
    departmentId: department.id,
  });

  const course = await seedTestCourse({
    programId: program.id,
    createdBy: user.userId,
  });

  const classGroup = await seedTestClassGroup({
    programId: program.id,
    userId: user.userId,
  });

  return {
    department,
    program,
    user,
    classroom,
    instructor,
    course,
    classGroup,
  };
}

/**
 * Sets up a department head test environment.
 *
 * Creates:
 * - Test department
 * - Department head user
 * - Test instructor
 * - Test classroom
 *
 * @param options - Optional configuration.
 * @param options.email - Custom email for the department head.
 * @param options.password - Custom password for the department head.
 * @returns Object containing all created entities.
 */
export async function setupDepartmentHeadEnvironment(options?: {
  email?: string;
  password?: string;
}): Promise<{
  department: { id: string; name: string; code: string };
  user: { userId: string; email: string };
  instructor: { id: string; first_name: string; last_name: string };
  classroom: { id: string; name: string; code: string | null };
}> {
  const department = await seedTestDepartment();
  
  const user = await seedTestUser({
    email: options?.email || `dept_head_${Date.now()}@cypress.test`,
    password: options?.password || 'TestPassword123!',
    fullName: `Test Department Head ${Date.now()}`,
    role: 'department_head',
    departmentId: department.id,
  });

  const instructor = await seedTestInstructor({
    departmentId: department.id,
  });

  const classroom = await seedTestClassroom({
    preferredDepartmentId: department.id,
  });

  return {
    department,
    user,
    instructor,
    classroom,
  };
}

/**
 * Sets up a cross-department request scenario.
 *
 * Creates two departments, two programs, a program head for each,
 * and a class session from program A requesting a resource from department B.
 *
 * @returns Object containing all entities needed for cross-dept testing.
 */
export async function setupCrossDeptRequest(): Promise<{
  deptA: { id: string; name: string; code: string };
  deptB: { id: string; name: string; code: string };
  programA: { id: string; name: string; short_code: string; department_id: string };
  programB: { id: string; name: string; short_code: string; department_id: string };
  userA: { userId: string; email: string };
  userB: { userId: string; email: string };
  instructorB: { id: string; first_name: string; last_name: string };
  classroomB: { id: string; name: string; code: string | null };
  course: { id: string; name: string; code: string };
  classGroup: { id: string; name: string; code: string | null };
  classSession: { id: string };
}> {
  // Department A (requester)
  const deptA = await seedTestDepartment();
  const programA = await seedTestProgram({ departmentId: deptA.id });
  const userA = await seedTestUser({
    email: `prog_head_a_${Date.now()}@cypress.test`,
    password: 'TestPassword123!',
    fullName: `Program Head A ${Date.now()}`,
    role: 'program_head',
    departmentId: deptA.id,
    programId: programA.id,
  });

  // Department B (resource owner)
  const deptB = await seedTestDepartment();
  const programB = await seedTestProgram({ departmentId: deptB.id });
  const userB = await seedTestUser({
    email: `prog_head_b_${Date.now()}@cypress.test`,
    password: 'TestPassword123!',
    fullName: `Program Head B ${Date.now()}`,
    role: 'program_head',
    departmentId: deptB.id,
    programId: programB.id,
  });

  const instructorB = await seedTestInstructor({
    departmentId: deptB.id,
  });

  const classroomB = await seedTestClassroom({
    preferredDepartmentId: deptB.id,
  });

  const course = await seedTestCourse({
    programId: programA.id,
    createdBy: userA.userId,
  });

  const classGroup = await seedTestClassGroup({
    programId: programA.id,
    userId: userA.userId,
  });

  // Create a class session that will request cross-dept resource
  const classSession = await seedTestClassSession({
    programId: programA.id,
    userId: userA.userId,
    courseId: course.id,
    classGroupId: classGroup.id,
    instructorId: instructorB.id, // Cross-dept instructor
    classroomId: classroomB.id, // Cross-dept classroom
  });

  return {
    deptA,
    deptB,
    programA,
    programB,
    userA,
    userB,
    instructorB,
    classroomB,
    course,
    classGroup,
    classSession,
  };
}
