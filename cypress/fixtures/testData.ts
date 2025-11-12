/**
 * Test data fixtures for Cypress E2E tests.
 * All test data uses TEST_* prefixes to ensure isolation from production data.
 */

const timestamp = () => Date.now();

/**
 * Generates test data for departments.
 */
export const generateTestDepartment = (suffix = timestamp()) => ({
  name: `TEST_DEPT_CYPRESS_${suffix}`,
  code: `TDEPC${suffix}`.slice(0, 10),
});

/**
 * Generates test data for programs.
 */
export const generateTestProgram = (departmentId: string, suffix = timestamp()) => ({
  name: `TEST_PROG_CYPRESS_${suffix}`,
  code: `TPRGC${suffix}`.slice(0, 10),
  department_id: departmentId,
});

/**
 * Generates test data for users.
 */
export const generateTestUser = (role: 'admin' | 'department_head' | 'program_head', options?: {
  departmentId?: string;
  programId?: string;
  suffix?: string | number;
}) => {
  const suffix = options?.suffix || timestamp();
  return {
    email: `test_${role}_${suffix}@cypress.test`,
    password: 'TestPassword123!',
    name: `Test ${role} ${suffix}`,
    role,
    department_id: options?.departmentId || null,
    program_id: options?.programId || null,
  };
};

/**
 * Generates test data for courses.
 */
export const generateTestCourse = (programId: string, suffix = timestamp()) => ({
  name: `TEST_COURSE_${suffix}`,
  code: `TC${suffix}`.slice(0, 10),
  program_id: programId,
});

/**
 * Generates test data for instructors.
 */
export const generateTestInstructor = (departmentId?: string, suffix = timestamp()) => ({
  first_name: `TestInstructor`,
  last_name: `Cypress${suffix}`,
  email: `test_instructor_${suffix}@cypress.test`,
  department_id: departmentId || null,
});

/**
 * Generates test data for classrooms.
 */
export const generateTestClassroom = (departmentId?: string, suffix = timestamp()) => ({
  name: `TEST_ROOM_${suffix}`,
  capacity: 30,
  building: 'Test Building',
  preferred_department_id: departmentId || null,
});

/**
 * Generates test data for class groups.
 */
export const generateTestClassGroup = (programId: string, suffix = timestamp()) => ({
  name: `TEST_GROUP_${suffix}`,
  year_level: 1,
  program_id: programId,
});

/**
 * Predefined test credentials for quick access.
 */
export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@isu.edu.ph',
    password: 'test123',
  },
  departmentHead: {
    email: 'depthead@isu.edu.ph',
    password: 'test123',
  },
  programHead: {
    email: 'proghead@isu.edu.ph',
    password: 'test123',
  },
};
