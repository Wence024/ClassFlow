import { describe, it, expect } from 'vitest';
import {
  isAdmin,
  isDepartmentHead,
  isProgramHead,
  canManageInstructors,
  canManageClassrooms,
  canReviewRequestsForDepartment,
  canManageInstructorRow,
  canManageCourses,
  canManageAssignmentsForProgram,
} from '../permissions';

describe('Permission Utils', () => {
  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      expect(isAdmin('admin')).toBe(true);
    });
    it('should return false for other roles', () => {
      expect(isAdmin('department_head')).toBe(false);
      expect(isAdmin('program_head')).toBe(false);
      expect(isAdmin(null)).toBe(false);
      expect(isAdmin(undefined)).toBe(false);
    });
  });

  describe('isDepartmentHead', () => {
    it('should return true for department_head role', () => {
      expect(isDepartmentHead('department_head')).toBe(true);
    });
    it('should return false for other roles', () => {
      expect(isDepartmentHead('admin')).toBe(false);
      expect(isDepartmentHead('program_head')).toBe(false);
    });
  });

  describe('isProgramHead', () => {
    it('should return true for program_head role', () => {
      expect(isProgramHead('program_head')).toBe(true);
    });
    it('should return false for other roles', () => {
      expect(isProgramHead('admin')).toBe(false);
      expect(isProgramHead('department_head')).toBe(false);
    });
  });

  describe('canManageInstructors', () => {
    it('should return true for admin and department_head', () => {
      expect(canManageInstructors('admin')).toBe(true);
      expect(canManageInstructors('department_head')).toBe(true);
    });
    it('should return false for program_head', () => {
      expect(canManageInstructors('program_head')).toBe(false);
    });
  });

  describe('canManageClassrooms', () => {
    it('should return true for admin', () => {
      expect(canManageClassrooms('admin')).toBe(true);
    });
    it('should return false for other roles', () => {
      expect(canManageClassrooms('department_head')).toBe(false);
      expect(canManageClassrooms('program_head')).toBe(false);
    });
  });

  describe('canReviewRequestsForDepartment', () => {
    it('should return true for admin', () => {
      expect(canReviewRequestsForDepartment('admin', 'd1', 'd2')).toBe(true);
    });
    it('should return true for department head of the same department', () => {
      expect(canReviewRequestsForDepartment('department_head', 'd1', 'd1')).toBe(true);
    });
    it('should return false for department head of a different department', () => {
      expect(canReviewRequestsForDepartment('department_head', 'd1', 'd2')).toBe(false);
    });
    it('should return false for program_head', () => {
      expect(canReviewRequestsForDepartment('program_head', 'd1', 'd1')).toBe(false);
    });
  });

  describe('canManageInstructorRow', () => {
    it('should return true for admin', () => {
      expect(canManageInstructorRow('admin', 'd1', 'd2')).toBe(true);
    });
    it('should return true for department head of the same department', () => {
      expect(canManageInstructorRow('department_head', 'd1', 'd1')).toBe(true);
    });
    it('should return false for department head of a different department', () => {
      expect(canManageInstructorRow('department_head', 'd1', 'd2')).toBe(false);
    });
  });

  describe('canManageCourses', () => {
    it('should return true for admin', () => {
      expect(canManageCourses('admin', 'p1', 'p2')).toBe(true);
    });
    it('should return true for program head of the same program', () => {
      expect(canManageCourses('program_head', 'p1', 'p1')).toBe(true);
    });
    it('should return false for program head of a different program', () => {
      expect(canManageCourses('program_head', 'p1', 'p2')).toBe(false);
    });
  });

  describe('canManageAssignmentsForProgram', () => {
    it('should return true for admin', () => {
      expect(canManageAssignmentsForProgram('admin', 'p1', 'p2')).toBe(true);
    });
    it('should return true for program head of the same program', () => {
      expect(canManageAssignmentsForProgram('program_head', 'p1', 'p1')).toBe(true);
    });
    it('should return false for program head of a different program', () => {
      expect(canManageAssignmentsForProgram('program_head', 'p1', 'p2')).toBe(false);
    });
  });
});
