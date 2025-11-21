/**
 * Test data fixtures for Cypress E2E tests.
 * All test data uses TEST_* prefixes to ensure isolation from production data.
 */

const timestamp = () => Date.now();

/**
 * Generates test data for departments.
 *
 * @param suffix - Optional timestamp suffix for unique naming.
 * @returns Test department object with name and code.
 */
export const generateTestDepartment = (suffix = timestamp()) => ({
  name: `TEST_DEPT_CYPRESS_${suffix}`,
  code: `TDEPC${suffix}`.slice(0, 10),
});

/**
 * Generates test data for programs.
 *
 * @param departmentId - The department ID to associate the program with.
 * @param suffix - Optional timestamp suffix for unique naming.
 * @returns Test program object with name, code, and department_id.
 */
export const generateTestProgram = (departmentId: string, suffix = timestamp()) => ({
  name: `TEST_PROG_CYPRESS_${suffix}`,
  code: `TPRGC${suffix}`.slice(0, 10),
  department_id: departmentId,
});

/**
 * Generates test data for users.
 *
 * @param role - The user role ('admin', 'department_head', or 'program_head').
 * @param options - Optional configuration object.
 * @param options.departmentId - The department ID to assign.
 * @param options.programId - The program ID to assign.
 * @param options.suffix - Custom suffix for unique naming.
 * @returns Test user object with credentials and role information.
 */
export const generateTestUser = (role: 'admin' | 'department_head' | 'program_head', options?: {
  departmentId?: string;
  programId?: string;
  suffix?: string | number;
}) => {
  const suffix = options?.suffix || timestamp();
  return {
    email: `test_${role}_${suffix}@cypress.test`,
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords -- Test fixture password
    password: 'TestPassword123!',
    name: `Test ${role} ${suffix}`,
    role,
    department_id: options?.departmentId || null,
    program_id: options?.programId || null,
  };
};

/**
 * Generates test data for courses.
 *
 * @param programId - The program ID to associate the course with.
 * @param suffix - Optional timestamp suffix for unique naming.
 * @returns Test course object with name, code, and program_id.
 */
export const generateTestCourse = (programId: string, suffix = timestamp()) => ({
  name: `TEST_COURSE_${suffix}`,
  code: `TC${suffix}`.slice(0, 10),
  program_id: programId,
});

/**
 * Generates test data for instructors.
 *
 * @param departmentId - Optional department ID to assign the instructor to.
 * @param suffix - Optional timestamp suffix for unique naming.
 * @returns Test instructor object with name, email, and department_id.
 */
export const generateTestInstructor = (departmentId?: string, suffix = timestamp()) => ({
  first_name: `TestInstructor`,
  last_name: `Cypress${suffix}`,
  email: `test_instructor_${suffix}@cypress.test`,
  department_id: departmentId || null,
});

/**
 * Generates test data for classrooms.
 *
 * @param departmentId - Optional department ID to set as preferred department.
 * @param suffix - Optional timestamp suffix for unique naming.
 * @returns Test classroom object with name, capacity, and department preference.
 */
export const generateTestClassroom = (departmentId?: string, suffix = timestamp()) => ({
  name: `TEST_ROOM_${suffix}`,
  capacity: 30,
  building: 'Test Building',
  preferred_department_id: departmentId || null,
});

/**
 * Generates test data for class groups.
 *
 * @param programId - The program ID to associate the class group with.
 * @param suffix - Optional timestamp suffix for unique naming.
 * @returns Test class group object with name, year_level, and program_id.
 */
export const generateTestClassGroup = (programId: string, suffix = timestamp()) => ({
  name: `TEST_GROUP_${suffix}`,
  year_level: 1,
  program_id: programId,
});

/**
 * Predefined test credentials for quick access.
 *
 * These are test-only credentials for Cypress E2E tests.
 */
 
export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@isu.edu.ph',
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    password: 'test123',
  },
  departmentHead: {
    email: 'depthead@isu.edu.ph',
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    password: 'test123',
  },
  programHead: {
    email: 'proghead@isu.edu.ph',
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    password: 'test123',
  },
};
