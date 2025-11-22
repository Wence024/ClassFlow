/// <reference types="cypress" />

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types';

/**
 * Test Data Seeding System.
 *
 * Creates isolated test data with consistent prefixes and tracks for cleanup.
 * All test data uses 'CYPRESS_TEST_' prefix to identify it for cleanup.
 */

export const TEST_DATA_PREFIX = 'CYPRESS_TEST_';

const supabaseUrl = 'https://wkfgcroybuuefaulqsru.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZmdjcm95YnV1ZWZhdWxxc3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjgxNzEsImV4cCI6MjA3OTAwNDE3MX0.OmmXnxzeGspJJgPr8r0yiYXXbwEtaIBmkT-KIZdE4Mg';

/**
 * Creates a Supabase client for test data operations.
 *
 * @returns A Supabase client instance.
 */
function getSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

/**
 * Generates a unique test identifier with timestamp.
 *
 * @param prefix - The prefix to use for the unique ID.
 * @returns A unique identifier string.
 */
function getUniqueId(prefix: string): string {
  // Use a predictable but unique ID for tests to avoid pseudo-random warning
  return `${TEST_DATA_PREFIX}${prefix}_${Date.now()}_${performance.now().toString().replace('.', '')}`;
}

/**
 * Tracks a created test record for cleanup.
 *
 * @param table - The table name where the record was created.
 * @param id - The ID of the created record.
 */
function trackCreatedRecord(table: string, id: string) {
  const records = Cypress.env('testDataRecords') || [];
  records.push({ table, id });
  Cypress.env('testDataRecords', records);
}

/**
 * Seeds a test department.
 *
 * @param data - Optional department data to use for creation.
 * @param data.name - Optional name for the department.
 * @param data.code - Optional code for the department.
 * @returns The created department object with id, name, and code.
 */
export async function seedTestDepartment(data?: {
  name?: string;
  code?: string;
}): Promise<{ id: string; name: string; code: string }> {
  const supabase = getSupabaseClient();
  
  const department = {
    name: data?.name || getUniqueId('Department'),
    code: data?.code || getUniqueId('DEPT').slice(0, 10),
  };

  const { data: created, error } = await supabase
    .from('departments')
    .insert(department)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed department: ${error.message}`);
  }

  trackCreatedRecord('departments', created.id);
  return created;
}

/**
 * Seeds a test program.
 *
 * @param data - Program data to use for creation.
 * @param data.departmentId - Department ID to associate the program with.
 * @param data.name - Optional name for the program.
 * @param data.shortCode - Optional short code for the program.
 * @returns The created program object.
 */
export async function seedTestProgram(data: {
  departmentId: string;
  name?: string;
  shortCode?: string;
}): Promise<{ id: string; name: string; short_code: string; department_id: string }> {
  const supabase = getSupabaseClient();
  
  const program = {
    department_id: data.departmentId,
    name: data.name || getUniqueId('Program'),
    short_code: data.shortCode || getUniqueId('PROG').slice(0, 10),
  };

  const { data: created, error } = await supabase
    .from('programs')
    .insert(program)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed program: ${error.message}`);
  }

  trackCreatedRecord('programs', created.id);
  return created;
}

/**
 * Seeds a test user using the create_test_user database function.
 *
 * @param data - User data to use for creation.
 * @param data.email - Email address for the user.
 * @param data.password - Password for the user.
 * @param data.fullName - Full name of the user.
 * @param data.role - Role of the user (admin, department_head, or program_head).
 * @param data.departmentId - Optional department ID to associate with the user.
 * @param data.programId - Optional program ID to associate with the user.
 * @returns The created user object.
 */
export async function seedTestUser(data: {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'department_head' | 'program_head';
  departmentId?: string;
  programId?: string;
}): Promise<{ userId: string; email: string }> {
  const supabase = getSupabaseClient();

  const { data: userId, error } = await supabase.rpc('create_test_user', {
    email: data.email,
    password: data.password,
    full_name: data.fullName,
    role: data.role,
    department_id: data.departmentId || null,
    program_id: data.programId || null,
  });

  if (error) {
    throw new Error(`Failed to seed user: ${error.message}`);
  }

  trackCreatedRecord('auth.users', userId);
  return { userId, email: data.email };
}

/**
 * Seeds a test classroom.
 *
 * @param data - Optional classroom data to use for creation.
 * @param data.name - Optional name for the classroom.
 * @param data.code - Optional code for the classroom.
 * @param data.capacity - Optional capacity for the classroom.
 * @param data.location - Optional location for the classroom.
 * @param data.preferredDepartmentId - Optional preferred department ID for the classroom.
 * @returns The created classroom object.
 */
export async function seedTestClassroom(data?: {
  name?: string;
  code?: string;
  capacity?: number;
  location?: string;
  preferredDepartmentId?: string;
}): Promise<{ id: string; name: string; code: string | null }> {
  const supabase = getSupabaseClient();
  
  const classroom = {
    name: data?.name || getUniqueId('Classroom'),
    code: data?.code || getUniqueId('CL').slice(0, 10),
    capacity: data?.capacity || 30,
    location: data?.location || 'Test Building',
    preferred_department_id: data?.preferredDepartmentId || null,
  };

  const { data: created, error } = await supabase
    .from('classrooms')
    .insert(classroom)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed classroom: ${error.message}`);
  }

  trackCreatedRecord('classrooms', created.id);
  return created;
}

/**
 * Seeds a test instructor.
 *
 * @param data - Instructor data to use for creation.
 * @param data.departmentId - Department ID to associate the instructor with.
 * @param data.firstName - Optional first name for the instructor.
 * @param data.lastName - Optional last name for the instructor.
 * @param data.email - Optional email for the instructor.
 * @returns The created instructor object.
 */
export async function seedTestInstructor(data: {
  departmentId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<{ id: string; first_name: string; last_name: string }> {
  const supabase = getSupabaseClient();
  
  const instructor = {
    department_id: data.departmentId,
    first_name: data.firstName || getUniqueId('FirstName'),
    last_name: data.lastName || getUniqueId('LastName'),
    email: data.email || `${getUniqueId('instructor')}@test.com`,
  };

  const { data: created, error } = await supabase
    .from('instructors')
    .insert(instructor)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed instructor: ${error.message}`);
  }

  trackCreatedRecord('instructors', created.id);
  return created;
}

/**
 * Seeds a test course.
 *
 * @param data - Course data to use for creation.
 * @param data.programId - Program ID to associate the course with.
 * @param data.createdBy - ID of the user creating the course.
 * @param data.name - Optional name for the course.
 * @param data.code - Optional code for the course.
 * @param data.units - Optional unit count for the course.
 * @returns The created course object.
 */
export async function seedTestCourse(data: {
  programId: string;
  createdBy: string;
  name?: string;
  code?: string;
  units?: number;
}): Promise<{ id: string; name: string; code: string }> {
  const supabase = getSupabaseClient();
  
  const course = {
    program_id: data.programId,
    created_by: data.createdBy,
    name: data.name || getUniqueId('Course'),
    code: data.code || getUniqueId('CRS').slice(0, 10),
    units: data.units || 3,
  };

  const { data: created, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed course: ${error.message}`);
  }

  trackCreatedRecord('courses', created.id);
  return created;
}

/**
 * Seeds a test class group.
 *
 * @param data - Class group data to use for creation.
 * @param data.programId - Program ID to associate the class group with.
 * @param data.userId - User ID to associate the class group with.
 * @param data.name - Optional name for the class group.
 * @param data.code - Optional code for the class group.
 * @param data.studentCount - Optional student count for the class group.
 * @returns The created class group object.
 */
export async function seedTestClassGroup(data: {
  programId: string;
  userId: string;
  name?: string;
  code?: string;
  studentCount?: number;
}): Promise<{ id: string; name: string; code: string | null }> {
  const supabase = getSupabaseClient();
  
  const classGroup = {
    program_id: data.programId,
    user_id: data.userId,
    name: data.name || getUniqueId('ClassGroup'),
    code: data.code || getUniqueId('CG').slice(0, 10),
    student_count: data.studentCount || 25,
  };

  const { data: created, error } = await supabase
    .from('class_groups')
    .insert(classGroup)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed class group: ${error.message}`);
  }

  trackCreatedRecord('class_groups', created.id);
  return created;
}

/**
 * Seeds a test class session.
 *
 * @param data - Class session data to use for creation.
 * @param data.programId - Program ID to associate the class session with.
 * @param data.userId - User ID to associate the class session with.
 * @param data.courseId - Course ID for the session.
 * @param data.classGroupId - Class group ID for the session.
 * @param data.instructorId - Instructor ID for the session.
 * @param data.classroomId - Optional classroom ID for the session.
 * @param data.periodCount - Optional period count for the session.
 * @returns The created class session object.
 */
export async function seedTestClassSession(data: {
  programId: string;
  userId: string;
  courseId: string;
  classGroupId: string;
  instructorId: string;
  classroomId?: string;
  periodCount?: number;
}): Promise<{ id: string }> {
  const supabase = getSupabaseClient();
  
  const classSession = {
    program_id: data.programId,
    user_id: data.userId,
    course_id: data.courseId,
    class_group_id: data.classGroupId,
    instructor_id: data.instructorId,
    classroom_id: data.classroomId || null,
    period_count: data.periodCount || 1,
  };

  const { data: created, error } = await supabase
    .from('class_sessions')
    .insert(classSession)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to seed class session: ${error.message}`);
  }

  trackCreatedRecord('class_sessions', created.id);
  return created;
}

/**
 * Seeds a complete test environment with department, program, and user.
 *
 * @param data - Environment data to use for creation.
 * @param data.role - Role for the test user.
 * @param data.email - Optional email for the test user.
 * @param data.password - Optional password for the test user.
 * @returns The created department, program, and user objects.
 */
export async function seedTestEnvironment(data: {
  role: 'admin' | 'department_head' | 'program_head';
  email?: string;
  password?: string;
}): Promise<{
  department: { id: string; name: string; code: string };
  program: { id: string; name: string; short_code: string; department_id: string };
  user: { userId: string; email: string };
}> {
  const department = await seedTestDepartment();
  const program = await seedTestProgram({ departmentId: department.id });
  
  const user = await seedTestUser({
    email: data.email || `${getUniqueId('user')}@test.com`,
    password: data.password || 'TestPassword123!',
    fullName: getUniqueId('TestUser'),
    role: data.role,
    departmentId: department.id,
    programId: data.role === 'program_head' ? program.id : undefined,
  });

  return { department, program, user };
}
