# Linting testing results

## Lint results

```txt
npm run lint --fix
npm warn Unknown cli config "--fix". This will stop working in the next major version of npm.

> classflow@0.0.0 lint
> eslint .


C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\02-admin-workflows\departments.cy.ts
  44:3  warning  Missing JSDoc @param "dept" declaration       jsdoc/require-param
  44:3  warning  Missing JSDoc @param "dept.name" declaration  jsdoc/require-param
  44:3  warning  Missing JSDoc @param "dept.code" declaration  jsdoc/require-param
  80:3  warning  Missing JSDoc @param "dept" declaration       jsdoc/require-param
  80:3  warning  Missing JSDoc @param "dept.name" declaration  jsdoc/require-param
  80:3  warning  Missing JSDoc @param "dept.code" declaration  jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\04-program-head-workflows\manage-class-groups.cy.ts
  36:5  warning  Unused eslint-disable directive (no problems were reported from 'sonarjs/no-hardcoded-passwords')

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\05-timetabling\cross-dept-confirmation.cy.ts
  9:5  warning  Unused eslint-disable directive (no problems were reported from 'sonarjs/no-hardcoded-passwords')

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\fixtures\testData.ts
  118:1  warning  Unused eslint-disable directive (no problems were reported from 'sonarjs/no-hardcoded-passwords')

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\support\commands.ts
  125:1   warning  Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-namespace')
  127:3   error    ES2015 module syntax is preferred over namespaces                                                   @typescript-eslint/no-namespace
  130:44  error    Unexpected any. Specify a different type                                                            @typescript-eslint/no-explicit-any
  130:60  error    Unexpected any. Specify a different type                                                            @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\support\seedTestData.ts
   18:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
   25:1   warning  Missing JSDoc @param "prefix" declaration                             jsdoc/require-param
   25:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
   29:56  error    Make sure that using this pseudorandom number generator is safe here  sonarjs/pseudo-random
   32:1   warning  Missing JSDoc @param "table" declaration                              jsdoc/require-param
   32:1   warning  Missing JSDoc @param "id" declaration                                 jsdoc/require-param
   41:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
   41:1   warning  Missing JSDoc @param "data.name" declaration                          jsdoc/require-param
   41:1   warning  Missing JSDoc @param "data.code" declaration                          jsdoc/require-param
   41:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
   69:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
   69:1   warning  Missing JSDoc @param "data.departmentId" declaration                  jsdoc/require-param
   69:1   warning  Missing JSDoc @param "data.name" declaration                          jsdoc/require-param
   69:1   warning  Missing JSDoc @param "data.shortCode" declaration                     jsdoc/require-param
   69:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
   99:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
   99:1   warning  Missing JSDoc @param "data.email" declaration                         jsdoc/require-param
   99:1   warning  Missing JSDoc @param "data.password" declaration                      jsdoc/require-param
   99:1   warning  Missing JSDoc @param "data.fullName" declaration                      jsdoc/require-param
   99:1   warning  Missing JSDoc @param "data.role" declaration                          jsdoc/require-param
   99:1   warning  Missing JSDoc @param "data.departmentId" declaration                  jsdoc/require-param
   99:1   warning  Missing JSDoc @param "data.programId" declaration                     jsdoc/require-param
   99:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
  129:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
  129:1   warning  Missing JSDoc @param "data.name" declaration                          jsdoc/require-param
  129:1   warning  Missing JSDoc @param "data.code" declaration                          jsdoc/require-param
  129:1   warning  Missing JSDoc @param "data.capacity" declaration                      jsdoc/require-param
  129:1   warning  Missing JSDoc @param "data.location" declaration                      jsdoc/require-param
  129:1   warning  Missing JSDoc @param "data.preferredDepartmentId" declaration         jsdoc/require-param
  129:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
  163:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
  163:1   warning  Missing JSDoc @param "data.departmentId" declaration                  jsdoc/require-param
  163:1   warning  Missing JSDoc @param "data.firstName" declaration                     jsdoc/require-param
  163:1   warning  Missing JSDoc @param "data.lastName" declaration                      jsdoc/require-param
  163:1   warning  Missing JSDoc @param "data.email" declaration                         jsdoc/require-param
  163:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
  195:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
  195:1   warning  Missing JSDoc @param "data.programId" declaration                     jsdoc/require-param
  195:1   warning  Missing JSDoc @param "data.createdBy" declaration                     jsdoc/require-param
  195:1   warning  Missing JSDoc @param "data.name" declaration                          jsdoc/require-param
  195:1   warning  Missing JSDoc @param "data.code" declaration                          jsdoc/require-param
  195:1   warning  Missing JSDoc @param "data.units" declaration                         jsdoc/require-param
  195:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
  229:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
  229:1   warning  Missing JSDoc @param "data.programId" declaration                     jsdoc/require-param
  229:1   warning  Missing JSDoc @param "data.userId" declaration                        jsdoc/require-param
  229:1   warning  Missing JSDoc @param "data.name" declaration                          jsdoc/require-param
  229:1   warning  Missing JSDoc @param "data.code" declaration                          jsdoc/require-param
  229:1   warning  Missing JSDoc @param "data.studentCount" declaration                  jsdoc/require-param
  229:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
  263:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.programId" declaration                     jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.userId" declaration                        jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.courseId" declaration                      jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.classGroupId" declaration                  jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.instructorId" declaration                  jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.classroomId" declaration                   jsdoc/require-param
  263:1   warning  Missing JSDoc @param "data.periodCount" declaration                   jsdoc/require-param
  263:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns
  301:1   warning  Missing JSDoc @param "data" declaration                               jsdoc/require-param
  301:1   warning  Missing JSDoc @param "data.role" declaration                          jsdoc/require-param
  301:1   warning  Missing JSDoc @param "data.email" declaration                         jsdoc/require-param
  301:1   warning  Missing JSDoc @param "data.password" declaration                      jsdoc/require-param
  301:1   warning  Missing JSDoc @returns declaration                                    jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\support\testDataCleanup.ts
   18:1   warning  Missing JSDoc @returns declaration                                                   jsdoc/require-returns
   30:23  error    Refactor this function to reduce its Cognitive Complexity from 15 to the 10 allowed  sonarjs/cognitive-complexity
  120:1   warning  Sentences must end with a period                                                     jsdoc/require-description-complete-sentence
  130:1   warning  Sentences must end with a period                                                     jsdoc/require-description-complete-sentence
  143:1   warning  Sentences must end with a period                                                     jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\support\testSetup.ts
   23:1   warning  Sentences must end with a period                                                                   jsdoc/require-description-complete-sentence
   54:5   warning  Unused eslint-disable directive (no problems were reported from 'sonarjs/no-hardcoded-passwords')
   94:1   warning  Sentences must end with a period                                                                   jsdoc/require-description-complete-sentence
  118:5   warning  Unused eslint-disable directive (no problems were reported from 'sonarjs/no-hardcoded-passwords')
  167:15  error    Review this potentially hard-coded password                                                        sonarjs/no-hardcoded-passwords
  179:15  error    Review this potentially hard-coded password                                                        sonarjs/no-hardcoded-passwords

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\components\EnvironmentIndicator.tsx
  7:8  warning  Missing JSDoc comment  jsdoc/require-jsdoc

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\components\dialogs\tests\ConfirmDialog.test.tsx
  2:1  warning  Invalid JSDoc tag name "vitest-environment"  jsdoc/check-tag-names

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\components\tests\PendingRequestsPanel.integration.test.tsx
    2:1   warning  Invalid JSDoc tag name "vitest-environment"                       jsdoc/check-tag-names
  110:50  error    Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\components\tests\SyncIndicator.integration.test.tsx
  2:1  warning  Invalid JSDoc tag name "vitest-environment"  jsdoc/check-tag-names

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\components\ui\badge.tsx
  43:17  error  Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components  react-refresh/only-export-components

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-classrooms\component.tsx
   25:1  warning  Missing JSDoc @returns declaration            jsdoc/require-returns
   95:3  warning  Missing JSDoc @param "data" declaration       jsdoc/require-param
  105:3  warning  Missing JSDoc @param "data" declaration       jsdoc/require-param
  123:3  warning  Missing JSDoc @param "classroom" declaration  jsdoc/require-param
  123:3  warning  Missing JSDoc @returns declaration            jsdoc/require-returns
  128:3  warning  Missing JSDoc @param "id" declaration         jsdoc/require-param
  128:3  warning  Missing JSDoc @returns declaration            jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-classrooms\hook.ts
  17:1  warning  Missing JSDoc @returns declaration  jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-classrooms\service.ts
  14:1  warning  Missing JSDoc @returns declaration       jsdoc/require-returns
  21:1  warning  Missing JSDoc @param "data" declaration  jsdoc/require-param
  21:1  warning  Missing JSDoc @returns declaration       jsdoc/require-returns
  28:1  warning  Missing JSDoc @param "id" declaration    jsdoc/require-param
  28:1  warning  Missing JSDoc @param "data" declaration  jsdoc/require-param
  28:1  warning  Missing JSDoc @returns declaration       jsdoc/require-returns
  35:1  warning  Missing JSDoc @param "id" declaration    jsdoc/require-param
  35:1  warning  Missing JSDoc @returns declaration       jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-classrooms\tests\component.integration.test.tsx
  7:10  error  Remove this unused import of 'render'               sonarjs/unused-import
  7:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
  8:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  9:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-departments\hook.ts
  25:1  warning  Missing JSDoc @returns declaration  jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-departments\service.ts
  14:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  21:1  warning  Missing JSDoc @param "data" declaration          jsdoc/require-param
  21:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  28:1  warning  Missing JSDoc @param "departmentId" declaration  jsdoc/require-param
  28:1  warning  Missing JSDoc @param "data" declaration          jsdoc/require-param
  28:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  38:1  warning  Missing JSDoc @param "departmentId" declaration  jsdoc/require-param
  38:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-users\hook.ts
  23:1  warning  Missing JSDoc @returns declaration  jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-users\service.ts
  14:1  warning  Missing JSDoc @returns declaration                    jsdoc/require-returns
  21:1  warning  Missing JSDoc @param "userId" declaration             jsdoc/require-param
  21:1  warning  Missing JSDoc @returns declaration                    jsdoc/require-returns
  28:1  warning  Missing JSDoc @param "userId" declaration             jsdoc/require-param
  28:1  warning  Missing JSDoc @param "data" declaration               jsdoc/require-param
  28:1  warning  Missing JSDoc @param "data.role" declaration          jsdoc/require-param
  28:1  warning  Missing JSDoc @param "data.programId" declaration     jsdoc/require-param
  28:1  warning  Missing JSDoc @param "data.departmentId" declaration  jsdoc/require-param
  28:1  warning  Missing JSDoc @returns declaration                    jsdoc/require-returns
  47:1  warning  Missing JSDoc @param "userId" declaration             jsdoc/require-param
  47:1  warning  Missing JSDoc @param "name" declaration               jsdoc/require-param
  47:1  warning  Missing JSDoc @returns declaration                    jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-users\tests\component.integration.test.tsx
  7:10  error  Remove this unused import of 'render'               sonarjs/unused-import
  7:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
  8:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  9:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\approve-request\hook.ts
  15:1  warning  Missing JSDoc @returns declaration  jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\approve-request\service.ts
  8:1  warning  Missing JSDoc @param "requestId" declaration   jsdoc/require-param
  8:1  warning  Missing JSDoc @param "reviewerId" declaration  jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\approve-request\tests\hook.integration.test.tsx
  8:10  error  Remove this unused import of 'renderHook'  sonarjs/unused-import
  8:22  error  Remove this unused import of 'act'         sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\manage-instructors\component.tsx
   25:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
   91:3  warning  Missing JSDoc @param "data" declaration        jsdoc/require-param
  122:3  warning  Missing JSDoc @param "data" declaration        jsdoc/require-param
  141:3  warning  Missing JSDoc @param "instructor" declaration  jsdoc/require-param
  141:3  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  146:3  warning  Missing JSDoc @param "id" declaration          jsdoc/require-param
  146:3  warning  Missing JSDoc @returns declaration             jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\manage-instructors\hook.ts
   16:1   warning  Missing JSDoc @returns declaration                jsdoc/require-returns
  105:3   warning  Missing JSDoc @param "instructorId" declaration   jsdoc/require-param
  105:3   warning  Missing JSDoc @param "classSessions" declaration  jsdoc/require-param
  105:3   warning  Missing JSDoc @returns declaration                jsdoc/require-returns
  108:69  error    Unexpected any. Specify a different type          @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\manage-instructors\service.ts
  14:1  warning  Missing JSDoc @param "params" declaration               jsdoc/require-param
  14:1  warning  Missing JSDoc @param "params.role" declaration          jsdoc/require-param
  14:1  warning  Missing JSDoc @param "params.departmentId" declaration  jsdoc/require-param
  14:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns
  27:1  warning  Missing JSDoc @param "data" declaration                 jsdoc/require-param
  27:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns
  34:1  warning  Missing JSDoc @param "id" declaration                   jsdoc/require-param
  34:1  warning  Missing JSDoc @param "data" declaration                 jsdoc/require-param
  34:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns
  44:1  warning  Missing JSDoc @param "id" declaration                   jsdoc/require-param
  44:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\manage-instructors\tests\component.integration.test.tsx
   7:10  error  Remove this unused import of 'render'               sonarjs/unused-import
   7:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
   7:26  error  Remove this unused import of 'waitFor'              sonarjs/unused-import
   8:10  error  Remove this unused import of 'userEvent'            sonarjs/unused-import
   9:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  10:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\manage-instructors\tests\hook.integration.test.tsx
   22:1   warning  Missing JSDoc @returns declaration        jsdoc/require-returns
   68:25  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   70:10  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   91:70  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   93:12  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  183:49  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  185:12  error    Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\manage-instructors\tests\service.test.ts
  22:88  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  61:89  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  82:92  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\reject-request\hook.ts
  15:1  warning  Missing JSDoc @returns declaration  jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\reject-request\service.ts
  8:1  warning  Missing JSDoc @param "requestId" declaration         jsdoc/require-param
  8:1  warning  Missing JSDoc @param "reviewerId" declaration        jsdoc/require-param
  8:1  warning  Missing JSDoc @param "rejectionMessage" declaration  jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\reject-request\tests\hook.integration.test.tsx
  8:10  error  Remove this unused import of 'renderHook'  sonarjs/unused-import
  8:22  error  Remove this unused import of 'act'         sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\view-department-requests\hook.ts
  19:1  warning  Missing JSDoc @param "departmentId" declaration                                                                   jsdoc/require-param
  19:1  warning  Missing JSDoc @returns declaration                                                                                jsdoc/require-returns
  52:6  warning  React Hook useEffect has a missing dependency: 'fetchRequests'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\view-department-requests\service.ts
  9:1  warning  Missing JSDoc @param "departmentId" declaration  jsdoc/require-param
  9:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\view-department-requests\tests\hook.integration.test.tsx
  43:82  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\department-head\view-department-requests\tests\service.test.ts
  23:25  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-class-sessions\component.tsx
  30:1  warning  Missing JSDoc @param "resourceType" declaration  jsdoc/require-param
  30:1  warning  Missing JSDoc @param "resourceId" declaration    jsdoc/require-param
  30:1  warning  Missing JSDoc @param "instructors" declaration   jsdoc/require-param
  30:1  warning  Missing JSDoc @param "classrooms" declaration    jsdoc/require-param
  30:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  48:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-class-sessions\hook.ts
  11:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  80:3  warning  Missing JSDoc @param "instructorId" declaration  jsdoc/require-param
  80:3  warning  Missing JSDoc @param "classroomId" declaration   jsdoc/require-param
  80:3  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-class-sessions\service.ts
  10:1  warning  Missing JSDoc @param "userId" declaration        jsdoc/require-param
  10:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  17:1  warning  Missing JSDoc @param "data" declaration          jsdoc/require-param
  17:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  24:1  warning  Missing JSDoc @param "sessionId" declaration     jsdoc/require-param
  24:1  warning  Missing JSDoc @param "data" declaration          jsdoc/require-param
  24:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  34:1  warning  Missing JSDoc @param "sessionId" declaration     jsdoc/require-param
  34:1  warning  Missing JSDoc @param "userId" declaration        jsdoc/require-param
  34:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  41:1  warning  Missing JSDoc @param "instructorId" declaration  jsdoc/require-param
  41:1  warning  Missing JSDoc @param "classroomId" declaration   jsdoc/require-param
  41:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-class-sessions\tests\component.integration.test.tsx
  46:1  warning  Missing JSDoc @param "classSessions" declaration  jsdoc/require-param
  46:1  warning  Missing JSDoc @param "isLoading" declaration      jsdoc/require-param
  46:1  warning  Missing JSDoc @param "error" declaration          jsdoc/require-param
  46:1  warning  Missing JSDoc @returns declaration                jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\component.tsx
  20:1  warning  Missing JSDoc @returns declaration  jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\tests\class-groups-component.integration.test.tsx
  66:32  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\tests\class-groups-hook.integration.test.tsx
  12:27  error  Remove this unused import of 'ClassGroupInsert'  sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\tests\courses-component.integration.test.tsx
   6:10  error  Remove this unused import of 'render'               sonarjs/unused-import
   6:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
   6:26  error  Remove this unused import of 'waitFor'              sonarjs/unused-import
   8:10  error  Remove this unused import of 'userEvent'            sonarjs/unused-import
   9:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  10:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\tests\service.test.ts
   4:1  warning  Sentences must end with a period                     jsdoc/require-description-complete-sentence
  54:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  59:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  64:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  69:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  76:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  81:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  86:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  91:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  96:8  error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\component.tsx
  17:1  warning  Missing JSDoc @param "root0" declaration                 jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.isOpen" declaration          jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.requestPayload" declaration  jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.departmentName" declaration  jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.isLoading" declaration       jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.onConfirm" declaration       jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.onCancel" declaration        jsdoc/require-param
  17:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\hook.ts
  11:8  warning  Missing JSDoc comment                            jsdoc/require-jsdoc
  16:3  warning  Missing JSDoc @param "programId" declaration     jsdoc/require-param
  16:3  warning  Missing JSDoc @param "instructorId" declaration  jsdoc/require-param
  16:3  warning  Missing JSDoc @param "classroomId" declaration   jsdoc/require-param
  16:3  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  42:3  warning  Missing JSDoc @param "payload" declaration       jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\service.ts
   14:1  warning  Missing JSDoc @param "programId" declaration     jsdoc/require-param
   14:1  warning  Missing JSDoc @param "instructorId" declaration  jsdoc/require-param
   14:1  warning  Missing JSDoc @param "classroomId" declaration   jsdoc/require-param
   14:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   91:1  warning  Missing JSDoc @param "payload" declaration       jsdoc/require-param
   91:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  100:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\tests\component.integration.test.tsx
   7:10  error  Remove this unused import of 'render'               sonarjs/unused-import
   7:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
   7:26  error  Remove this unused import of 'waitFor'              sonarjs/unused-import
   8:10  error  Remove this unused import of 'userEvent'            sonarjs/unused-import
   9:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  10:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\tests\hook.integration.test.tsx
  80:20  error  Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\component.tsx
  17:1  warning  Missing JSDoc @param "root0" declaration           jsdoc/require-param
  17:1  warning  Missing JSDoc @param "root0.viewMode" declaration  jsdoc/require-param
  17:1  warning  Missing JSDoc @returns declaration                 jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\hook.ts
   23:1   warning  Missing JSDoc @param "_viewMode" declaration  jsdoc/require-param
   23:1   warning  Missing JSDoc @returns declaration            jsdoc/require-returns
  105:71  error    Unexpected any. Specify a different type      @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\service.ts
  16:1  warning  Missing JSDoc @param "params" declaration      jsdoc/require-param
  16:1  warning  Missing JSDoc @param "userId" declaration      jsdoc/require-param
  16:1  warning  Missing JSDoc @param "semesterId" declaration  jsdoc/require-param
  16:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  35:1  warning  Missing JSDoc @param "params" declaration      jsdoc/require-param
  35:1  warning  Missing JSDoc @param "userId" declaration      jsdoc/require-param
  35:1  warning  Missing JSDoc @param "semesterId" declaration  jsdoc/require-param
  35:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  63:1  warning  Missing JSDoc @param "params" declaration      jsdoc/require-param
  63:1  warning  Missing JSDoc @param "semesterId" declaration  jsdoc/require-param
  63:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  77:1  warning  Missing JSDoc @param "semesterId" declaration  jsdoc/require-param
  77:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\tests\conflict-detection.test.ts
  6:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\tests\service.test.ts
  122:28  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\tests\session-cell-component.integration.test.tsx
    4:1   warning  Sentences must end with a period                     jsdoc/require-description-complete-sentence
   12:32  error    Remove this unused import of 'vi'                    sonarjs/unused-import
   13:10  error    Remove this unused import of 'render'                sonarjs/unused-import
   13:18  error    Remove this unused import of 'screen'                sonarjs/unused-import
   68:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
   73:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
   79:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
   84:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
   90:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
   97:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  103:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  108:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag
  114:8   error    Complete the task associated to this "TODO" comment  sonarjs/todo-tag

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\schedule-class-session\tests\timetable-hook.integration.test.tsx
  8:10  error  Remove this unused import of 'renderHook'  sonarjs/unused-import
  8:22  error  Remove this unused import of 'act'         sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\view-pending-requests\component.tsx
   19:1  warning  Missing JSDoc @param "root0" declaration               jsdoc/require-param
   19:1  warning  Missing JSDoc @param "root0.request" declaration       jsdoc/require-param
   19:1  warning  Missing JSDoc @param "root0.onDismiss" declaration     jsdoc/require-param
   19:1  warning  Missing JSDoc @param "root0.onCancel" declaration      jsdoc/require-param
   19:1  warning  Missing JSDoc @param "root0.isDismissing" declaration  jsdoc/require-param
   19:1  warning  Missing JSDoc @param "root0.isCancelling" declaration  jsdoc/require-param
   19:1  warning  Missing JSDoc @returns declaration                     jsdoc/require-returns
  131:1  warning  Missing JSDoc @param "root0" declaration               jsdoc/require-param
  131:1  warning  Missing JSDoc @param "root0.requests" declaration      jsdoc/require-param
  131:1  warning  Missing JSDoc @param "root0.onDismiss" declaration     jsdoc/require-param
  131:1  warning  Missing JSDoc @param "root0.onCancel" declaration      jsdoc/require-param
  131:1  warning  Missing JSDoc @param "root0.isDismissing" declaration  jsdoc/require-param
  131:1  warning  Missing JSDoc @param "root0.isCancelling" declaration  jsdoc/require-param
  131:1  warning  Missing JSDoc @returns declaration                     jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\view-pending-requests\hook.ts
  10:8  warning  Missing JSDoc comment  jsdoc/require-jsdoc

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\view-pending-requests\service.ts
  13:1  warning  Missing JSDoc @returns declaration              jsdoc/require-returns
  20:1  warning  Missing JSDoc @param "requestId" declaration    jsdoc/require-param
  27:1  warning  Missing JSDoc @param "requestId" declaration    jsdoc/require-param
  27:1  warning  Missing JSDoc @param "requesterId" declaration  jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\view-pending-requests\tests\component.integration.test.tsx
  7:10  error  Remove this unused import of 'render'               sonarjs/unused-import
  7:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
  8:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  9:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\view-pending-requests\tests\service.test.ts
  23:89  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\reports\services\excelExportService.ts
  285:1  warning  Expected 1 lines after block description  jsdoc/tag-lines
  298:1  warning  Expected 1 lines after block description  jsdoc/tag-lines

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\shared\auth\pages\tests\CompleteRegistrationPage.integration.test.tsx
  28:25  error  Review this potentially hard-coded password  sonarjs/no-hardcoded-passwords

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\shared\auth\services\tests\authService.login.test.ts
   45:78  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   59:60  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   60:59  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   61:20  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   81:10  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   92:10  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  110:78  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  121:53  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  143:78  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  160:60  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  161:59  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  162:20  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  183:78  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  197:60  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  198:59  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  199:20  error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\timetabling\hooks\useTimetableDnd.ts
  495:5  warning  React Hook useCallback has an unnecessary dependency: 'user'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\timetabling\pages\components\timetable\index.tsx
  34:1  warning  @param "t.isLoading" does not exist on t  jsdoc/check-param-names

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\integrations\supabase\client.ts
  6:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\authService.ts
    2:1  warning  Sentences must end with a period                jsdoc/require-description-complete-sentence
   14:1  warning  Missing JSDoc @param "email" declaration        jsdoc/require-param
   14:1  warning  Missing JSDoc @param "password" declaration     jsdoc/require-param
   14:1  warning  Missing JSDoc @returns declaration              jsdoc/require-returns
   78:1  warning  Missing JSDoc @returns declaration              jsdoc/require-returns
  136:1  warning  Missing JSDoc @param "update" declaration       jsdoc/require-param
  136:1  warning  Missing JSDoc @param "update.name" declaration  jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\classGroupService.ts
   2:1  warning  Sentences must end with a period               jsdoc/require-description-complete-sentence
  11:1  warning  Missing JSDoc @param "program_id" declaration  jsdoc/require-param
  11:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  24:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  33:1  warning  Missing JSDoc @param "group" declaration       jsdoc/require-param
  33:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  42:1  warning  Missing JSDoc @param "id" declaration          jsdoc/require-param
  42:1  warning  Missing JSDoc @param "group" declaration       jsdoc/require-param
  42:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  51:1  warning  Missing JSDoc @param "id" declaration          jsdoc/require-param
  51:1  warning  Missing JSDoc @param "user_id" declaration     jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\classSessionService.ts
    2:1  warning  Sentences must end with a period                 jsdoc/require-description-complete-sentence
   19:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   28:1  warning  Missing JSDoc @param "user_id" declaration       jsdoc/require-param
   28:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   37:1  warning  Missing JSDoc @param "id" declaration            jsdoc/require-param
   37:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   46:1  warning  Missing JSDoc @param "classSession" declaration  jsdoc/require-param
   46:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   59:1  warning  Missing JSDoc @param "id" declaration            jsdoc/require-param
   59:1  warning  Missing JSDoc @param "classSession" declaration  jsdoc/require-param
   59:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   76:1  warning  Missing JSDoc @param "id" declaration            jsdoc/require-param
   76:1  warning  Missing JSDoc @param "user_id" declaration       jsdoc/require-param
   84:1  warning  Missing JSDoc @param "program_id" declaration    jsdoc/require-param
   84:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
   96:1  warning  Missing JSDoc @param "sessionId" declaration     jsdoc/require-param
   96:1  warning  Missing JSDoc @param "semester_id" declaration   jsdoc/require-param
   96:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns
  112:1  warning  Missing JSDoc @param "program_id" declaration    jsdoc/require-param
  112:1  warning  Missing JSDoc @param "semester_id" declaration   jsdoc/require-param
  112:1  warning  Missing JSDoc @returns declaration               jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\classroomService.ts
   2:1  warning  Sentences must end with a period                         jsdoc/require-description-complete-sentence
  11:1  warning  Missing JSDoc @param "params" declaration                jsdoc/require-param
  11:1  warning  Missing JSDoc @param "params.role" declaration           jsdoc/require-param
  11:1  warning  Missing JSDoc @param "params.department_id" declaration  jsdoc/require-param
  11:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  29:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  54:1  warning  Missing JSDoc @param "classroom" declaration             jsdoc/require-param
  54:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  63:1  warning  Missing JSDoc @param "id" declaration                    jsdoc/require-param
  63:1  warning  Missing JSDoc @param "classroom" declaration             jsdoc/require-param
  63:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  72:1  warning  Missing JSDoc @param "id" declaration                    jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\courseService.ts
   2:1  warning  Sentences must end with a period               jsdoc/require-description-complete-sentence
  11:1  warning  Missing JSDoc @param "program_id" declaration  jsdoc/require-param
  11:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  24:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  51:1  warning  Missing JSDoc @param "course" declaration      jsdoc/require-param
  51:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  60:1  warning  Missing JSDoc @param "id" declaration          jsdoc/require-param
  60:1  warning  Missing JSDoc @param "course" declaration      jsdoc/require-param
  60:1  warning  Missing JSDoc @returns declaration             jsdoc/require-returns
  69:1  warning  Missing JSDoc @param "id" declaration          jsdoc/require-param
  69:1  warning  Missing JSDoc @param "user_id" declaration     jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\departmentService.ts
   2:1  warning  Sentences must end with a period            jsdoc/require-description-complete-sentence
  11:1  warning  Missing JSDoc @returns declaration          jsdoc/require-returns
  20:1  warning  Missing JSDoc @param "payload" declaration  jsdoc/require-param
  20:1  warning  Missing JSDoc @returns declaration          jsdoc/require-returns
  29:1  warning  Missing JSDoc @param "id" declaration       jsdoc/require-param
  29:1  warning  Missing JSDoc @param "update" declaration   jsdoc/require-param
  29:1  warning  Missing JSDoc @returns declaration          jsdoc/require-returns
  38:1  warning  Missing JSDoc @param "id" declaration       jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\instructorService.ts
   2:1  warning  Sentences must end with a period                         jsdoc/require-description-complete-sentence
  11:1  warning  Missing JSDoc @param "params" declaration                jsdoc/require-param
  11:1  warning  Missing JSDoc @param "params.role" declaration           jsdoc/require-param
  11:1  warning  Missing JSDoc @param "params.department_id" declaration  jsdoc/require-param
  11:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  29:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  54:1  warning  Missing JSDoc @param "instructor" declaration            jsdoc/require-param
  54:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  74:1  warning  Missing JSDoc @param "id" declaration                    jsdoc/require-param
  74:1  warning  Missing JSDoc @param "instructor" declaration            jsdoc/require-param
  74:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  91:1  warning  Missing JSDoc @param "id" declaration                    jsdoc/require-param
  99:1  warning  Missing JSDoc @param "departmentId" declaration          jsdoc/require-param
  99:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\notificationService.ts
   2:1  warning  Sentences must end with a period       jsdoc/require-description-complete-sentence
  17:1  warning  Missing JSDoc @returns declaration     jsdoc/require-returns
  33:1  warning  Missing JSDoc @param "id" declaration  jsdoc/require-param
  44:1  warning  Missing JSDoc @param "id" declaration  jsdoc/require-param
  52:1  warning  Missing JSDoc @returns declaration     jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\programService.ts
   2:1  warning  Sentences must end with a period            jsdoc/require-description-complete-sentence
  11:1  warning  Missing JSDoc @returns declaration          jsdoc/require-returns
  20:1  warning  Missing JSDoc @param "payload" declaration  jsdoc/require-param
  20:1  warning  Missing JSDoc @returns declaration          jsdoc/require-returns
  29:1  warning  Missing JSDoc @param "id" declaration       jsdoc/require-param
  29:1  warning  Missing JSDoc @param "update" declaration   jsdoc/require-param
  29:1  warning  Missing JSDoc @returns declaration          jsdoc/require-returns
  38:1  warning  Missing JSDoc @param "id" declaration       jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\resourceRequestService.ts
    2:1  warning  Sentences must end with a period                     jsdoc/require-description-complete-sentence
   28:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns
   40:1  warning  Missing JSDoc @param "departmentId" declaration      jsdoc/require-param
   40:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns
   53:1  warning  Missing JSDoc @param "payload" declaration           jsdoc/require-param
   53:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns
   84:1  warning  Missing JSDoc @param "id" declaration                jsdoc/require-param
   84:1  warning  Missing JSDoc @param "reviewerId" declaration        jsdoc/require-param
   84:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns
  117:1  warning  Missing JSDoc @param "id" declaration                jsdoc/require-param
  117:1  warning  Missing JSDoc @param "reviewerId" declaration        jsdoc/require-param
  117:1  warning  Missing JSDoc @param "rejectionMessage" declaration  jsdoc/require-param
  117:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns
  155:1  warning  Missing JSDoc @param "id" declaration                jsdoc/require-param
  155:1  warning  Missing JSDoc @param "requesterId" declaration       jsdoc/require-param
  179:1  warning  Missing JSDoc @param "id" declaration                jsdoc/require-param
  179:1  warning  Missing JSDoc @param "update" declaration            jsdoc/require-param
  179:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns
  191:1  warning  Missing JSDoc @param "id" declaration                jsdoc/require-param
  199:1  warning  Missing JSDoc @param "sessionId" declaration         jsdoc/require-param
  199:1  warning  Missing JSDoc @returns declaration                   jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\timetableService.ts
    2:1  warning  Sentences must end with a period                        jsdoc/require-description-complete-sentence
   13:1  warning  Missing JSDoc @param "semester_id" declaration          jsdoc/require-param
   13:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns
   46:1  warning  Missing JSDoc @param "assignment" declaration           jsdoc/require-param
   46:1  warning  Missing JSDoc @param "status" declaration               jsdoc/require-param
   46:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns
   65:1  warning  Missing JSDoc @param "class_group_id" declaration       jsdoc/require-param
   65:1  warning  Missing JSDoc @param "period_index" declaration         jsdoc/require-param
   65:1  warning  Missing JSDoc @param "semester_id" declaration          jsdoc/require-param
   82:1  warning  Missing JSDoc @param "from" declaration                 jsdoc/require-param
   82:1  warning  Missing JSDoc @param "from.class_group_id" declaration  jsdoc/require-param
   82:1  warning  Missing JSDoc @param "from.period_index" declaration    jsdoc/require-param
   82:1  warning  Missing JSDoc @param "from.semester_id" declaration     jsdoc/require-param
   82:1  warning  Missing JSDoc @param "to" declaration                   jsdoc/require-param
   82:1  warning  Missing JSDoc @param "to.class_group_id" declaration    jsdoc/require-param
   82:1  warning  Missing JSDoc @param "to.period_index" declaration      jsdoc/require-param
   82:1  warning  Missing JSDoc @param "to.semester_id" declaration       jsdoc/require-param
   82:1  warning  Missing JSDoc @param "class_session_id" declaration     jsdoc/require-param
   82:1  warning  Missing JSDoc @param "user_id" declaration              jsdoc/require-param
   82:1  warning  Missing JSDoc @param "status" declaration               jsdoc/require-param
  108:1  warning  Missing JSDoc @param "class_session_id" declaration     jsdoc/require-param
  108:1  warning  Missing JSDoc @param "old_period_index" declaration     jsdoc/require-param
  108:1  warning  Missing JSDoc @param "old_class_group_id" declaration   jsdoc/require-param
  108:1  warning  Missing JSDoc @param "new_period_index" declaration     jsdoc/require-param
  108:1  warning  Missing JSDoc @param "new_class_group_id" declaration   jsdoc/require-param
  108:1  warning  Missing JSDoc @param "semester_id" declaration          jsdoc/require-param
  108:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns
  139:1  warning  Missing JSDoc @param "class_session_id" declaration     jsdoc/require-param
  139:1  warning  Missing JSDoc @param "semester_id" declaration          jsdoc/require-param
  154:1  warning  Missing JSDoc @param "class_session_id" declaration     jsdoc/require-param
  154:1  warning  Missing JSDoc @param "semester_id" declaration          jsdoc/require-param
  154:1  warning  Missing JSDoc @param "status" declaration               jsdoc/require-param
  170:1  warning  Missing JSDoc @param "class_session_id" declaration     jsdoc/require-param
  170:1  warning  Missing JSDoc @param "semester_id" declaration          jsdoc/require-param
  170:1  warning  Missing JSDoc @returns declaration                      jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\services\userService.ts
   2:1  warning  Sentences must end with a period                         jsdoc/require-description-complete-sentence
   9:1  warning  Missing JSDoc @returns declaration                       jsdoc/require-returns
  43:1  warning  Missing JSDoc @param "userId" declaration                jsdoc/require-param
  43:1  warning  Missing JSDoc @param "updates" declaration               jsdoc/require-param
  57:1  warning  Missing JSDoc @param "invite" declaration                jsdoc/require-param
  57:1  warning  Missing JSDoc @param "invite.email" declaration          jsdoc/require-param
  57:1  warning  Missing JSDoc @param "invite.role" declaration           jsdoc/require-param
  57:1  warning  Missing JSDoc @param "invite.program_id" declaration     jsdoc/require-param
  57:1  warning  Missing JSDoc @param "invite.department_id" declaration  jsdoc/require-param
  85:1  warning  Missing JSDoc @param "userId" declaration                jsdoc/require-param
  95:1  warning  Missing JSDoc @param "userId" declaration                jsdoc/require-param
  95:1  warning  Missing JSDoc @param "name" declaration                  jsdoc/require-param

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\supabase.ts
  4:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\routes\index.tsx
  4:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

✖ 520 problems (101 errors, 419 warnings)
  0 errors and 297 warnings potentially fixable with the `--fix` option.

```

## Test outputs

```
 RERUN  src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx x2

 ❯ src/components/dialogs/tests/ConfirmDialog.test.tsx (18 tests | 1 failed) 4956ms
   ✓ ConfirmDialog Component > Rendering > should render dialog when open is true  1153ms
   ✓ ConfirmDialog Component > Rendering > should not render dialog when open is false 28ms
   ✓ ConfirmDialog Component > Rendering > should render default button text  309ms
   ✓ ConfirmDialog Component > Rendering > should render custom button text 166ms
   ✓ ConfirmDialog Component > User Interactions > should call onConfirm when confirm button is clicked  335ms
   ✓ ConfirmDialog Component > User Interactions > should call onOpenChange with false when cancel button is clicked 297ms
   ✓ ConfirmDialog Component > User Interactions > should disable buttons when isLoading is true 209ms
   ✓ ConfirmDialog Component > User Interactions > should show "Processing..." text when loading 216ms
   ✓ ConfirmDialog Component > Button Variants > should render confirm button with default variant 128ms
   ✓ ConfirmDialog Component > Button Variants > should render confirm button with destructive variant 171ms
   ✓ ConfirmDialog Component > Cross-Department Confirmation Scenarios > should handle move confirmed session scenario 195ms
   ✓ ConfirmDialog Component > Cross-Department Confirmation Scenarios > should handle remove cross-department session scenario 183ms
   ✓ ConfirmDialog Component > Accessibility > should have proper dialog role  347ms
   ✓ ConfirmDialog Component > Accessibility > should have accessible title 107ms
   ✓ ConfirmDialog Component > Accessibility > should have accessible description 112ms
   ✓ ConfirmDialog Component > Edge Cases > should handle rapid clicks when not loading 116ms
   ✓ ConfirmDialog Component > Edge Cases > should prevent clicks when loading 89ms
   × ConfirmDialog Component > Edge Cases > should handle empty strings for custom text 779ms
     → expected [ <button …(1)></button>, …(2) ] to have a length of 2 but got 3
 ❯ src/components/tests/SyncIndicator.integration.test.tsx (13 tests | 11 failed) 827ms
   × SyncIndicator Integration Tests > Visibility States > should show indicator when timetable queries are fetching 453ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   ✓ SyncIndicator Integration Tests > Visibility States > should hide indicator when no queries are fetching 23ms
   × SyncIndicator Integration Tests > Visibility States > should show indicator when multiple queries are fetching 33ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Visual States > should display loading spinner when fetching 31ms
     → Unable to find an element by: [data-testid="sync-spinner"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Visual States > should display sync text 46ms
     → Unable to find an element with the text: Syncing.... This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Query Filter Integration > should only respond to timetable-related queries 42ms
     → expected "spy" to be called with arguments: [ { queryKey: [ 'timetable' ] } ]

Number of calls: 0

   ✓ SyncIndicator Integration Tests > Query Filter Integration > should not show for non-timetable queries 12ms
   × SyncIndicator Integration Tests > Transition Behavior > should transition from hidden to visible 40ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Transition Behavior > should transition from visible to hidden 33ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Multiple Concurrent Fetches > should show single indicator for multiple fetches 18ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Accessibility > should have proper ARIA label 25ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Accessibility > should have proper role for screen readers 40ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Performance > should not cause unnecessary re-renders 14ms
     → expected "spy" to be called at least once
 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx (6 tests | 2 failed) 417ms
   ✓ useRequestCrossDeptResource > checkResources > should return cross-department result when instructor is from different dept 84ms
   ✓ useRequestCrossDeptResource > checkResources > should return false when resources are same department 39ms
   ✓ useRequestCrossDeptResource > checkResources > should handle errors gracefully 81ms
   ✓ useRequestCrossDeptResource > checkResources > should set isChecking state correctly 164ms
   × useRequestCrossDeptResource > initiateCrossDeptRequest > should set pending request 25ms
     → expected null to deeply equal { classSessionId: 'session-1', …(3) }
   × useRequestCrossDeptResource > cancelRequest > should clear pending request 11ms
     → expected null not to be null
 ❯ src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx (6 tests | 6 failed) 286ms
   × ManageClassSessions Component > should render class sessions list 113ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should display loading state 27ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should display error state 22ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should filter sessions by search query 65ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should open add session dialog 34ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should handle session deletion 17ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx (7 tests | 7 failed) 262ms
   × ViewSelector > should render all three view options 116ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should highlight the active view mode 17ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should call onViewModeChange when a view button is clicked 32ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should not call onViewModeChange when clicking the already active view 15ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should switch between all view modes correctly 18ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should render correct icons for each view 21ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should have proper accessibility attributes 28ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx (0 test)
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx (5 tests | 5 failed) 77ms
   × useManageClassSessions Hook > should fetch class sessions for program 22ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should add a new class session 4ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should update an existing class session 3ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should remove a class session 35ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should handle fetch errors 8ms
     → Cannot read properties of undefined (reading 'mockRejectedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx (8 tests | 8 failed) 129ms
   × PendingRequestsPanel Integration Tests > Pending Requests Display > should display count of pending requests 59ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Pending Requests Display > should show zero when no pending requests 5ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Pending Requests Display > should filter only pending status requests 9ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Loading and Error States > should show loading state initially 4ms
     → Cannot read properties of undefined (reading 'mockImplementation')
   × PendingRequestsPanel Integration Tests > Loading and Error States > should handle fetch errors gracefully 13ms
     → Cannot read properties of undefined (reading 'mockRejectedValue')
   × PendingRequestsPanel Integration Tests > Navigation > should link to pending requests page 2ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Real-time Updates > should refetch when query is invalidated 12ms
     → Cannot read properties of undefined (reading 'mockResolvedValueOnce')
   × PendingRequestsPanel Integration Tests > User Context Integration > should fetch requests for the current user program 4ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx (0 test)
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx (0 test)
 ❯ src/features/department-head/manage-instructors/tests/component.integration.test.tsx (0 test)
 ❯ src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx (0 test)
 ❯ src/features/program-head/manage-class-sessions/tests/service.test.ts (0 test)
 ❯ src/features/program-head/schedule-class-session/tests/pending-operations.integration.test.tsx (0 test)
 ❯ src/features/shared/auth/hooks/useDepartmentId.test.ts (0 test)
 ❯ src/features/timetabling/hooks/tests/useTimetable.pending.test.tsx (0 test)
 ❯ src/features/shared/auth/components/tests/PrivateRoute.integration.test.tsx (0 test)
 ❯ src/features/shared/auth/services/tests/authService.integration.test.ts (0 test)
 ❯ src/features/timetabling/pages/components/timetable/tests/SessionCell.pending.test.tsx (0 test)
 ❯ src/features/admin/manage-departments/tests/component.integration.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx [ src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx ]
Error: Failed to resolve import "../../../../integrations/supabase/client" from "src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx:7:0
  19 |  const __vi_import_3__ = await import("react-router-dom");
  20 |  const __vi_import_4__ = await import("../CompleteRegistrationPage");
  21 |  const __vi_import_5__ = await import("../../../../integrations/supabase/client");
     |                                       ^
  22 |
  23 |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  21 failed (21)
      Tests  40 failed | 23 passed (63)
   Start at  14:33:41
   Duration  1.23s

 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
```
