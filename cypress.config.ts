import { defineConfig } from "cypress";
import * as dbHelpers from './cypress/support/dbHelpers';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    setupNodeEvents(on, config) {
      // Register database helper tasks
      on('task', {
        'db:createTestDepartment': async (data: { name: string; code: string }) => {
          return await dbHelpers.createTestDepartment(data);
        },
        'db:createTestProgram': async (data: { name: string; code: string; department_id: string }) => {
          return await dbHelpers.createTestProgram(data);
        },
        'db:cleanupTestData': async () => {
          await dbHelpers.cleanupTestData();
          return null;
        },
        'db:getResourceById': async ({ table, id }: { table: string; id: string }) => {
          return await dbHelpers.getResourceById(table, id);
        },
        'db:resourceExists': async ({ table, id }: { table: string; id: string }) => {
          return await dbHelpers.resourceExists(table, id);
        },
      });
      
      return config;
    },
  },
});
