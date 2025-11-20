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
RERUN  rerun failed

stdout | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should return cross-department result when instructor is from different dept
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should return cross-department result when instructor is from different dept
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should return false when resources are same department
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should return false when resources are same department
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should handle errors gracefully
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should handle errors gracefully
Error checking cross-department resource: Error: Network error
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\tests\hook.integration.test.tsx:63:9
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at runSuite (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > checkResources > should set isChecking state correctly
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > initiateCrossDeptRequest > should set pending request
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > cancelRequest > should clear pending request
An update to TestComponent inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx (6 tests | 2 failed) 442ms
   ✓ useRequestCrossDeptResource > checkResources > should return cross-department result when instructor is from different dept 115ms
   ✓ useRequestCrossDeptResource > checkResources > should return false when resources are same department 20ms
   ✓ useRequestCrossDeptResource > checkResources > should handle errors gracefully 47ms
   ✓ useRequestCrossDeptResource > checkResources > should set isChecking state correctly 201ms
   × useRequestCrossDeptResource > initiateCrossDeptRequest > should set pending request 39ms
     → expected null to deeply equal { classSessionId: 'session-1', …(3) }
   × useRequestCrossDeptResource > cancelRequest > should clear pending request 12ms
     → expected null not to be null
stdout | src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/components/tests/SyncIndicator.integration.test.tsx (13 tests | 11 failed) 534ms
   × SyncIndicator Integration Tests > Visibility States > should show indicator when timetable queries are fetching 177ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   ✓ SyncIndicator Integration Tests > Visibility States > should hide indicator when no queries are fetching 15ms
   × SyncIndicator Integration Tests > Visibility States > should show indicator when multiple queries are fetching 51ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Visual States > should display loading spinner when fetching 50ms
     → Unable to find an element by: [data-testid="sync-spinner"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Visual States > should display sync text 35ms
     → Unable to find an element with the text: Syncing.... This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Query Filter Integration > should only respond to timetable-related queries 32ms
     → expected "spy" to be called with arguments: [ { queryKey: [ 'timetable' ] } ]

Number of calls: 0

   ✓ SyncIndicator Integration Tests > Query Filter Integration > should not show for non-timetable queries 28ms
   × SyncIndicator Integration Tests > Transition Behavior > should transition from hidden to visible 30ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Transition Behavior > should transition from visible to hidden 12ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Multiple Concurrent Fetches > should show single indicator for multiple fetches 17ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Accessibility > should have proper ARIA label 22ms
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
   × SyncIndicator Integration Tests > Performance > should not cause unnecessary re-renders 11ms
     → expected "spy" to be called at least once
stdout | src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx (7 tests | 7 failed) 304ms
   × ViewSelector > should render all three view options 117ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should highlight the active view mode 10ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should call onViewModeChange when a view button is clicked 52ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should not call onViewModeChange when clicking the already active view 29ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should switch between all view modes correctly 25ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should render correct icons for each view 41ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should have proper accessibility attributes 9ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx (6 tests | 6 failed) 346ms
   × ManageClassSessions Component > should render class sessions list 165ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should display loading state 32ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should display error state 42ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should filter sessions by search query 37ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should open add session dialog 20ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should handle session deletion 35ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ src/components/dialogs/tests/ConfirmDialog.test.tsx (18 tests | 1 failed) 4295ms
   ✓ ConfirmDialog Component > Rendering > should render dialog when open is true  1107ms
   ✓ ConfirmDialog Component > Rendering > should not render dialog when open is false 19ms
   ✓ ConfirmDialog Component > Rendering > should render default button text 199ms
   ✓ ConfirmDialog Component > Rendering > should render custom button text 191ms
   ✓ ConfirmDialog Component > User Interactions > should call onConfirm when confirm button is clicked 205ms
   ✓ ConfirmDialog Component > User Interactions > should call onOpenChange with false when cancel button is clicked 167ms
   ✓ ConfirmDialog Component > User Interactions > should disable buttons when isLoading is true 195ms
   ✓ ConfirmDialog Component > User Interactions > should show "Processing..." text when loading 193ms
   ✓ ConfirmDialog Component > Button Variants > should render confirm button with default variant 214ms
   ✓ ConfirmDialog Component > Button Variants > should render confirm button with destructive variant 164ms
   ✓ ConfirmDialog Component > Cross-Department Confirmation Scenarios > should handle move confirmed session scenario 209ms
   ✓ ConfirmDialog Component > Cross-Department Confirmation Scenarios > should handle remove cross-department session scenario 236ms
   ✓ ConfirmDialog Component > Accessibility > should have proper dialog role 182ms
   ✓ ConfirmDialog Component > Accessibility > should have accessible title 168ms
   ✓ ConfirmDialog Component > Accessibility > should have accessible description 172ms
   ✓ ConfirmDialog Component > Edge Cases > should handle rapid clicks when not loading 176ms
   ✓ ConfirmDialog Component > Edge Cases > should prevent clicks when loading 135ms
   × ConfirmDialog Component > Edge Cases > should handle empty strings for custom text 348ms
     → expected [ <button …(1)></button>, …(2) ] to have a length of 2 but got 3
stderr | src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx > CompleteRegistrationPage > should update full_name in profiles table on successful registration
Error completing registration: AuthSessionMissingError: Auth session missing!
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1766:17
    at SupabaseAuthClient._useSession (C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1555:20)
    at SupabaseAuthClient._updateUser (C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1760:14)
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1749:14 {
  __isAuthError: true,
  status: 400,
  code: undefined
}

stderr | src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx > CompleteRegistrationPage > should handle update errors gracefully
Error completing registration: AuthSessionMissingError: Auth session missing!
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1766:17
    at SupabaseAuthClient._useSession (C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1555:20)
    at SupabaseAuthClient._updateUser (C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1760:14)
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\node_modules\@supabase\auth-js\src\GoTrueClient.ts:1749:14 {
  __isAuthError: true,
  status: 400,
  code: undefined
}

 ❯ src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx (4 tests | 2 failed) 13748ms
   ✓ CompleteRegistrationPage > should render the complete registration form  1182ms
   × CompleteRegistrationPage > should update full_name in profiles table on successful registration 3965ms
     → expected "spy" to be called with arguments: [ { …(2) } ]

Number of calls: 0


Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div
        class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div
          class="max-w-md w-full bg-white rounded-lg shadow-md p-8"
        >
          <h2
            class="text-2xl font-bold mb-6 text-center"
          >
            Complete Your Registration
          </h2>
          <p
            class="text-gray-600 mb-6 text-center"
          >
            Set your password to complete your account setup.
          </p>
          <form
            class="space-y-4"
            novalidate=""
          >
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="fullName"
              >
                Full Name
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="fullName"
                name="fullName"
                required=""
                type="text"
                value="John Doe"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="password"
              >
                Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                name="password"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="confirmPassword"
              >
                Confirm Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="confirmPassword"
                name="confirmPassword"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
              role="alert"
            >
              <svg
                aria-hidden="true"
                class="lucide lucide-triangle-alert h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
                />
                <path
                  d="M12 9v4"
                />
                <path
                  d="M12 17h.01"
                />
              </svg>
              <div
                class="text-sm [&_p]:leading-relaxed flex items-center justify-between"
              >
                <span
                  class="flex-1"
                >
                  Auth session missing!
                </span>
                <div
                  class
   ✓ CompleteRegistrationPage > should show error when passwords do not match  3255ms
   × CompleteRegistrationPage > should handle update errors gracefully 5314ms
     → Unable to find an element with the text: /failed to complete registration/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div
        class="max-w-md w-full bg-white rounded-lg shadow-md p-8"
      >
        <h2
          class="text-2xl font-bold mb-6 text-center"
        >
          Complete Your Registration
        </h2>
        <p
          class="text-gray-600 mb-6 text-center"
        >
          Set your password to complete your account setup.
        </p>
        <form
          class="space-y-4"
          novalidate=""
        >
          <div
            class="mb-4"
          >
            <label
              class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
              for="fullName"
            >
              Full Name
              <span
                class="text-destructive ml-1"
              >
                *
              </span>
            </label>
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="fullName"
              name="fullName"
              required=""
              type="text"
              value="John Doe"
            />
          </div>
          <div
            class="mb-4"
          >
            <label
              class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
              for="password"
            >
              Password
              <span
                class="text-destructive ml-1"
              >
                *
              </span>
            </label>
            <input
              autocomplete="new-password"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              name="password"
              required=""
              type="password"
              value="TestPassword123"
            />
          </div>
          <div
            class="mb-4"
          >
            <label
              class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
              for="confirmPassword"
            >
              Confirm Password
              <span
                class="text-destructive ml-1"
              >
                *
              </span>
            </label>
            <input
              autocomplete="new-password"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="confirmPassword"
              name="confirmPassword"
              required=""
              type="password"
              value="TestPassword123"
            />
          </div>
          <div
            class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
            role="alert"
          >
            <svg
              aria-hidden="true"
              class="lucide lucide-triangle-alert h-4 w-4"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
              />
              <path
                d="M12 9v4"
              />
              <path
                d="M12 17h.01"
              />
            </svg>
            <div
              class="text-sm [&_p]:leading-relaxed flex items-center justify-between"
            >
              <span
                class="flex-1"
              >
                Auth session missing!
              </span>
              <div
                class="flex gap-2 ml-4"
              />
            </div>
          </div>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            type="submit"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  </div>
</body>

Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div
        class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div
          class="max-w-md w-full bg-white rounded-lg shadow-md p-8"
        >
          <h2
            class="text-2xl font-bold mb-6 text-center"
          >
            Complete Your Registration
          </h2>
          <p
            class="text-gray-600 mb-6 text-center"
          >
            Set your password to complete your account setup.
          </p>
          <form
            class="space-y-4"
            novalidate=""
          >
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="fullName"
              >
                Full Name
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="fullName"
                name="fullName"
                required=""
                type="text"
                value="John Doe"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="password"
              >
                Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                name="password"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="confirmPassword"
              >
                Confirm Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="confirmPassword"
                name="confirmPassword"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
              role="alert"
            >
              <svg
                aria-hidden="true"
                class="lucide lucide-triangle-alert h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
                />
                <path
                  d="M12 9v4"
                />
                <path
                  d="M12 17h.01"
                />
              </svg>
              <div
                class="text-sm [&_p]:leading-relaxed flex items-center justify-between"
              >
                <span
                  class="flex-1"
                >
                  Auth session missing!
                </span>
                <div
                  class
stdout | src/features/shared/auth/services/tests/authService.integration.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/features/shared/auth/services/tests/authService.integration.test.ts (3 tests | 2 failed) 89ms
   × authService.getStoredUser - profile hydration > should return user with role and program_id from profiles and user_roles tables 41ms
     → expected null to deeply equal ObjectContaining{…}
   × authService.getStoredUser - profile hydration > should return null if profile not found 30ms
     → expected "error" to be called at least once
   ✓ authService.getStoredUser - profile hydration > should return null if no active session 9ms
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx (5 tests | 5 failed) 73ms
   × useManageClassSessions Hook > should fetch class sessions for program 20ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should add a new class session 14ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should update an existing class session 5ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should remove a class session 7ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should handle fetch errors 10ms
     → Cannot read properties of undefined (reading 'mockRejectedValue')
stdout | src/components/tests/PendingRequestsPanel.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx (8 tests | 8 failed) 266ms
   × PendingRequestsPanel Integration Tests > Pending Requests Display > should display count of pending requests 28ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Pending Requests Display > should show zero when no pending requests 16ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Pending Requests Display > should filter only pending status requests 3ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Loading and Error States > should show loading state initially 2ms
     → Cannot read properties of undefined (reading 'mockImplementation')
   × PendingRequestsPanel Integration Tests > Loading and Error States > should handle fetch errors gracefully 4ms
     → Cannot read properties of undefined (reading 'mockRejectedValue')
   × PendingRequestsPanel Integration Tests > Navigation > should link to pending requests page 3ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × PendingRequestsPanel Integration Tests > Real-time Updates > should refetch when query is invalidated 115ms
     → Cannot read properties of undefined (reading 'mockResolvedValueOnce')
   × PendingRequestsPanel Integration Tests > User Context Integration > should fetch requests for the current user program 13ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 10 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx [ src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx ]
Error: Failed to resolve import "../pages/ClassGroupTab" from "src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx:9:0
  3  |  const __vi_import_1__ = await import("@testing-library/react");
  4  |  const __vi_import_2__ = await import("@tanstack/react-query");
  5  |  const __vi_import_3__ = await import("../pages/ClassGroupTab");
     |                                       ^
  6  |  const __vi_import_4__ = await import("@/features/shared/auth/contexts/AuthContext");
  7  |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/54]⎯

 FAIL  src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/hooks/useAuth" from "src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx:153:47
  127|    });
  128|    it("should handle loading state", async () => {
  129|      const mockUseAuth = vi.mocked(await import("../../../auth/hooks/useAuth")).useAuth;
     |                                                 ^
  130|      mockUseAuth.mockReturnValue({
  131|        user: mockUser,
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/54]⎯

 FAIL  src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/hooks/useAuth" from "src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx:156:47
  130|    });
  131|    it("should handle loading state", async () => {
  132|      const mockUseAuth = vi.mocked(await import("../../../auth/hooks/useAuth")).useAuth;
     |                                                 ^
  133|      mockUseAuth.mockReturnValue({
  134|        user: mockUser,
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/54]⎯

 FAIL  src/features/department-head/manage-instructors/tests/component.integration.test.tsx [ src/features/department-head/manage-instructors/tests/component.integration.test.tsx ]
Error: Failed to resolve import "@tantml:query" from "src/features/department-head/manage-instructors/tests/component.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/department-head/manage-instructors/tests/component.integration.test.tsx:9:0
  1  |  vi.mock("../hook");
  2  |  const __vi_import_0__ = await import("@tantml:query");
     |                                       ^
  3  |  import { describe, it, expect, beforeEach, vi } from "vitest";
  4  |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/54]⎯

 FAIL  src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx [ src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/hooks/useAuth" from "src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx:57:45
  42 |  });
  43 |  const setupComponent = async (classSessions = [mockClassSession], isLoading = false, error = null) => {
  44 |    const mockUseAuth = vi.mocked(await import("../../../auth/hooks/useAuth")).useAuth;
     |                                               ^
  45 |    mockUseAuth.mockReturnValue({
  46 |      user: mockUser,
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/service.test.ts [ src/features/program-head/manage-class-sessions/tests/service.test.ts ]
Error: Failed to resolve import "../../infrastructure/services/classSessionsService" from "src/features/program-head/manage-class-sessions/tests/service.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/program-head/manage-class-sessions/tests/service.test.ts:8:0
  1  |  vi.mock("../../infrastructure/services/classSessionsService");
  2  |  const __vi_import_0__ = await import("../service");
  3  |  const __vi_import_1__ = await import("../../infrastructure/services/classSessionsService");
     |                                       ^
  4  |  import { describe, it, expect, vi, beforeEach } from "vitest";
  5  |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/54]⎯

 FAIL  src/features/program-head/schedule-class-session/tests/pending-operations.integration.test.tsx [ src/features/program-head/schedule-class-session/tests/pending-operations.integration.test.tsx ]
Error: Failed to resolve import "../../manage-components/services/classGroupsService" from "src/features/program-head/schedule-class-session/tests/pending-operations.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/program-head/schedule-class-session/tests/pending-operations.integration.test.tsx:11:0
  21 |  const __vi_import_3__ = await import("../hook");
  22 |  const __vi_import_4__ = await import("../service");
  23 |  const __vi_import_5__ = await import("../../manage-components/services/classGroupsService");
     |                                       ^
  24 |  const __vi_import_6__ = await import("@/features/shared/schedule-config/hooks/useScheduleConfig");
  25 |  const __vi_import_7__ = await import("@/features/shared/schedule-config/hooks/useActiveSemester");
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/54]⎯

 FAIL  src/features/shared/auth/hooks/useDepartmentId.test.ts [ src/features/shared/auth/hooks/useDepartmentId.test.ts ]
Error: Failed to resolve import "../../programs/hooks/usePrograms" from "src/features/shared/auth/hooks/useDepartmentId.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/shared/auth/hooks/useDepartmentId.test.ts:5:0
  4  |  const __vi_import_1__ = await import("./useDepartmentId");
  5  |  const __vi_import_2__ = await import("./useAuth");
  6  |  const __vi_import_3__ = await import("../../programs/hooks/usePrograms");
     |                                       ^
  7  |
  8  |  import { describe, it, expect, vi } from "vitest";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/54]⎯

 FAIL  src/features/timetabling/hooks/tests/useTimetable.pending.test.tsx [ src/features/timetabling/hooks/tests/useTimetable.pending.test.tsx ]
Error: Failed to resolve import "../../../auth/hooks/useAuth" from "src/features/timetabling/hooks/tests/useTimetable.pending.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/hooks/tests/useTimetable.pending.test.tsx:14:0
  24 |  const __vi_import_6__ = await import("../../../scheduleConfig/hooks/useScheduleConfig");
  25 |  const __vi_import_7__ = await import("../../../scheduleConfig/hooks/useActiveSemester");
  26 |  const __vi_import_8__ = await import("../../../auth/hooks/useAuth");
     |                                       ^
  27 |
  28 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/54]⎯

 FAIL  src/features/admin/manage-departments/tests/component.integration.test.tsx [ src/features/admin/manage-departments/tests/component.integration.test.tsx ]
ReferenceError: QueryClient is not defined
 ❯ src/features/admin/manage-departments/tests/component.integration.test.tsx:10:21
      8| vi.mock('../hook');
      9|
     10| const queryClient = new QueryClient({
       |                     ^
     11|   defaultOptions: { queries: { retry: false } },
     12| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/54]⎯


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 44 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/components/dialogs/tests/ConfirmDialog.test.tsx > ConfirmDialog Component > Edge Cases > should handle empty strings for custom text
AssertionError: expected [ <button …(1)></button>, …(2) ] to have a length of 2 but got 3

- Expected
+ Received

- 2
+ 3

 ❯ src/components/dialogs/tests/ConfirmDialog.test.tsx:206:23
    204|       // Should still render buttons even with empty text
    205|       const buttons = screen.getAllByRole('button');
    206|       expect(buttons).toHaveLength(2);
       |                       ^
    207|     });
    208|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Visibility States > should show indicator when timetable queries are fetching
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:51:21
     49|       renderWithQuery(<SyncIndicator />);
     50|
     51|       expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
       |                     ^
     52|       expect(screen.getByText(/syncing/i)).toBeInTheDocument();
     53|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Visibility States > should show indicator when multiple queries are fetching
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:68:21
     66|       renderWithQuery(<SyncIndicator />);
     67|
     68|       expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
       |                     ^
     69|     });
     70|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Visual States > should display loading spinner when fetching
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-spinner"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:78:30
     76|       renderWithQuery(<SyncIndicator />);
     77|
     78|       const spinner = screen.getByTestId('sync-spinner');
       |                              ^
     79|       expect(spinner).toBeInTheDocument();
     80|       expect(spinner).toHaveClass('animate-spin');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Visual States > should display sync text
TestingLibraryElementError: Unable to find an element with the text: Syncing.... This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:88:21
     86|       renderWithQuery(<SyncIndicator />);
     87|
     88|       expect(screen.getByText('Syncing...')).toBeInTheDocument();
       |                     ^
     89|     });
     90|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Query Filter Integration > should only respond to timetable-related queries
AssertionError: expected "spy" to be called with arguments: [ { queryKey: [ 'timetable' ] } ]

Number of calls: 0

 ❯ src/components/tests/SyncIndicator.integration.test.tsx:100:33
     98|       renderWithQuery(<SyncIndicator />);
     99|
    100|       expect(mockUseIsFetching).toHaveBeenCalledWith({
       |                                 ^
    101|         queryKey: ['timetable'],
    102|       });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Transition Behavior > should transition from hidden to visible
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:131:21
    129|       );
    130|
    131|       expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
       |                     ^
    132|     });
    133|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Transition Behavior > should transition from visible to hidden
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:140:21
    138|       const { rerender } = renderWithQuery(<SyncIndicator />);
    139|
    140|       expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
       |                     ^
    141|
    142|       // Simulate query finishing

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Multiple Concurrent Fetches > should show single indicator for multiple fetches
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:109:15
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:161:33
    159|
    160|       // Should only show one indicator, not 5
    161|       const indicators = screen.getAllByTestId('sync-indicator');
       |                                 ^
    162|       expect(indicators).toHaveLength(1);
    163|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Accessibility > should have proper ARIA label
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:172:32
    170|       renderWithQuery(<SyncIndicator />);
    171|
    172|       const indicator = screen.getByTestId('sync-indicator');
       |                                ^
    173|       expect(indicator).toHaveAttribute('aria-label', 'Syncing timetable data');
    174|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Accessibility > should have proper role for screen readers
TestingLibraryElementError: Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:181:32
    179|       renderWithQuery(<SyncIndicator />);
    180|
    181|       const indicator = screen.getByTestId('sync-indicator');
       |                                ^
    182|       expect(indicator).toHaveAttribute('role', 'status');
    183|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/54]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Performance > should not cause unnecessary re-renders
AssertionError: expected "spy" to be called at least once
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:201:33
    199|
    200|       expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    201|       expect(mockUseIsFetching).toHaveBeenCalled();
       |                                 ^
    202|     });
    203|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/54]⎯

 FAIL  src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > initiateCrossDeptRequest > should set pending request
AssertionError: expected null to deeply equal { classSessionId: 'session-1', …(3) }

- Expected:
{
  "classSessionId": "session-1",
  "departmentId": "dept-2",
  "resourceId": "inst-1",
  "resourceType": "instructor",
}

+ Received:
null

 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx:117:45
    115|       result.current.initiateCrossDeptRequest(payload);
    116|
    117|       expect(result.current.pendingRequest).toEqual(payload);
       |                                             ^
    118|     });
    119|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/54]⎯

 FAIL  src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > cancelRequest > should clear pending request
AssertionError: expected null not to be null
 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx:133:49
    131|
    132|       result.current.initiateCrossDeptRequest(payload);
    133|       expect(result.current.pendingRequest).not.toBeNull();
       |                                                 ^
    134|
    135|       result.current.cancelRequest();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx > ManageClassSessions Component > should render class sessions list
 FAIL  src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx > ManageClassSessions Component > should display loading state
 FAIL  src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx > ManageClassSessions Component > should display error state
 FAIL  src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx > ManageClassSessions Component > should filter sessions by search query
 FAIL  src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx > ManageClassSessions Component > should open add session dialog
 FAIL  src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx > ManageClassSessions Component > should handle session deletion
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ createFiberFromTypeAndProps node_modules/react-dom/cjs/react-dom-client.development.js:4259:28
 ❯ createFiberFromElement node_modules/react-dom/cjs/react-dom-client.development.js:4273:14
 ❯ reconcileChildFibersImpl node_modules/react-dom/cjs/react-dom-client.development.js:7879:31
 ❯ node_modules/react-dom/cjs/react-dom-client.development.js:8057:33
 ❯ reconcileChildren node_modules/react-dom/cjs/react-dom-client.development.js:8621:13
 ❯ beginWork node_modules/react-dom/cjs/react-dom-client.development.js:10915:13
 ❯ runWithFiberInDEV node_modules/react-dom/cjs/react-dom-client.development.js:1522:13
 ❯ performUnitOfWork node_modules/react-dom/cjs/react-dom-client.development.js:15140:22
 ❯ workLoopSync node_modules/react-dom/cjs/react-dom-client.development.js:14956:41
 ❯ renderRootSync node_modules/react-dom/cjs/react-dom-client.development.js:14936:11

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/54]⎯

 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should render all three view options
 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should highlight the active view mode
 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should call onViewModeChange when a view button is clicked
 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should not call onViewModeChange when clicking the already active view
 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should switch between all view modes correctly
 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should render correct icons for each view
 FAIL  src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx > ViewSelector > should have proper accessibility attributes
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ createFiberFromTypeAndProps node_modules/react-dom/cjs/react-dom-client.development.js:4259:28
 ❯ createFiberFromElement node_modules/react-dom/cjs/react-dom-client.development.js:4273:14
 ❯ reconcileChildFibersImpl node_modules/react-dom/cjs/react-dom-client.development.js:7879:31
 ❯ node_modules/react-dom/cjs/react-dom-client.development.js:8057:33
 ❯ reconcileChildren node_modules/react-dom/cjs/react-dom-client.development.js:8622:13
 ❯ beginWork node_modules/react-dom/cjs/react-dom-client.development.js:10643:15
 ❯ runWithFiberInDEV node_modules/react-dom/cjs/react-dom-client.development.js:1522:13
 ❯ performUnitOfWork node_modules/react-dom/cjs/react-dom-client.development.js:15140:22
 ❯ workLoopSync node_modules/react-dom/cjs/react-dom-client.development.js:14956:41
 ❯ renderRootSync node_modules/react-dom/cjs/react-dom-client.development.js:14936:11

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should fetch class sessions for program
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:82:46
     80|
     81|   it('should fetch class sessions for program', async () => {
     82|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
     83|
     84|     const { result } = renderHook(() => useManageClassSessions(), {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should add a new class session
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:105:46
    103|     };
    104|
    105|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
    106|     mockedService.createClassSession.mockResolvedValue({ id: 'session2', ...newSession }…
    107|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should update an existing class session
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:128:46
    126|     };
    127|
    128|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
    129|     mockedService.updateClassSession.mockResolvedValue({ ...mockClassSessions[0], ...upd…
    130|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should remove a class session
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:147:46
    145|
    146|   it('should remove a class session', async () => {
    147|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
    148|     mockedService.deleteClassSession.mockResolvedValue(undefined);
    149|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/54]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should handle fetch errors
TypeError: Cannot read properties of undefined (reading 'mockRejectedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:167:46
    165|   it('should handle fetch errors', async () => {
    166|     const error = new Error('Failed to fetch sessions');
    167|     mockedService.getClassSessionsForProgram.mockRejectedValue(error);
       |                                              ^
    168|
    169|     const { result } = renderHook(() => useManageClassSessions(), {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Pending Requests Display > should display count of pending requests
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:66:70
     64|       ];
     65|
     66|       vi.mocked(resourceRequestService.fetchResourceRequestsByProgram)
       |                                                                      ^
     67|         .mockResolvedValue(mockRequests);
     68|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Pending Requests Display > should show zero when no pending requests
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:77:70
     75|
     76|     it('should show zero when no pending requests', async () => {
     77|       vi.mocked(resourceRequestService.fetchResourceRequestsByProgram)
       |                                                                      ^
     78|         .mockResolvedValue([]);
     79|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Pending Requests Display > should filter only pending status requests
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:95:70
     93|       ];
     94|
     95|       vi.mocked(resourceRequestService.fetchResourceRequestsByProgram)
       |                                                                      ^
     96|         .mockResolvedValue(mockRequests);
     97|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Loading and Error States > should show loading state initially
TypeError: Cannot read properties of undefined (reading 'mockImplementation')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:109:70
    107|   describe('Loading and Error States', () => {
    108|     it('should show loading state initially', () => {
    109|       vi.mocked(resourceRequestService.fetchResourceRequestsByProgram)
       |                                                                      ^
    110|         .mockImplementation(() => new Promise(() => {})); // Never resolves
    111|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Loading and Error States > should handle fetch errors gracefully
TypeError: Cannot read properties of undefined (reading 'mockRejectedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:118:70
    116|
    117|     it('should handle fetch errors gracefully', async () => {
    118|       vi.mocked(resourceRequestService.fetchResourceRequestsByProgram)
       |                                                                      ^
    119|         .mockRejectedValue(new Error('Failed to fetch requests'));
    120|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Navigation > should link to pending requests page
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:136:70
    134|       ];
    135|
    136|       vi.mocked(resourceRequestService.fetchResourceRequestsByProgram)
       |                                                                      ^
    137|         .mockResolvedValue(mockRequests);
    138|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > Real-time Updates > should refetch when query is invalidated
TypeError: Cannot read properties of undefined (reading 'mockResolvedValueOnce')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:159:17
    157|
    158|       const fetchMock = vi.mocked(resourceRequestService.fetchResourceRequestsByProgram);
    159|       fetchMock.mockResolvedValueOnce(mockRequests1);
       |                 ^
    160|
    161|       renderWithQuery(<PendingRequestsPanel />);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/54]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx > PendingRequestsPanel Integration Tests > User Context Integration > should fetch requests for the current user program
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx:180:17
    178|     it('should fetch requests for the current user program', async () => {
    179|       const fetchMock = vi.mocked(resourceRequestService.fetchResourceRequestsByProgram);
    180|       fetchMock.mockResolvedValue([]);
       |                 ^
    181|
    182|       renderWithQuery(<PendingRequestsPanel />);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/54]⎯

 FAIL  src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx > CompleteRegistrationPage > should update full_name in profiles table on successful registration
AssertionError: expected "spy" to be called with arguments: [ { …(2) } ]

Number of calls: 0


Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div
        class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div
          class="max-w-md w-full bg-white rounded-lg shadow-md p-8"
        >
          <h2
            class="text-2xl font-bold mb-6 text-center"
          >
            Complete Your Registration
          </h2>
          <p
            class="text-gray-600 mb-6 text-center"
          >
            Set your password to complete your account setup.
          </p>
          <form
            class="space-y-4"
            novalidate=""
          >
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="fullName"
              >
                Full Name
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="fullName"
                name="fullName"
                required=""
                type="text"
                value="John Doe"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="password"
              >
                Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                name="password"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="confirmPassword"
              >
                Confirm Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="confirmPassword"
                name="confirmPassword"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
              role="alert"
            >
              <svg
                aria-hidden="true"
                class="lucide lucide-triangle-alert h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
                />
                <path
                  d="M12 9v4"
                />
                <path
                  d="M12 17h.01"
                />
              </svg>
              <div
                class="text-sm [&_p]:leading-relaxed flex items-center justify-between"
              >
                <span
                  class="flex-1"
                >
                  Auth session missing!
                </span>
                <div
                  class
 ❯ src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx:76:30
     74|
     75|     await waitFor(() => {
     76|       expect(mockUpdateUser).toHaveBeenCalledWith({
       |                              ^
     77|         data: {
     78|           full_name: 'John Doe',
 ❯ runWithExpensiveErrorDiagnosticsDisabled node_modules/@testing-library/dom/dist/config.js:47:12
 ❯ checkCallback node_modules/@testing-library/dom/dist/wait-for.js:124:77
 ❯ Timeout.checkRealTimersCallback node_modules/@testing-library/dom/dist/wait-for.js:118:16

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/54]⎯

 FAIL  src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx > CompleteRegistrationPage > should handle update errors gracefully
TestingLibraryElementError: Unable to find an element with the text: /failed to complete registration/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div
        class="max-w-md w-full bg-white rounded-lg shadow-md p-8"
      >
        <h2
          class="text-2xl font-bold mb-6 text-center"
        >
          Complete Your Registration
        </h2>
        <p
          class="text-gray-600 mb-6 text-center"
        >
          Set your password to complete your account setup.
        </p>
        <form
          class="space-y-4"
          novalidate=""
        >
          <div
            class="mb-4"
          >
            <label
              class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
              for="fullName"
            >
              Full Name
              <span
                class="text-destructive ml-1"
              >
                *
              </span>
            </label>
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="fullName"
              name="fullName"
              required=""
              type="text"
              value="John Doe"
            />
          </div>
          <div
            class="mb-4"
          >
            <label
              class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
              for="password"
            >
              Password
              <span
                class="text-destructive ml-1"
              >
                *
              </span>
            </label>
            <input
              autocomplete="new-password"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              name="password"
              required=""
              type="password"
              value="TestPassword123"
            />
          </div>
          <div
            class="mb-4"
          >
            <label
              class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
              for="confirmPassword"
            >
              Confirm Password
              <span
                class="text-destructive ml-1"
              >
                *
              </span>
            </label>
            <input
              autocomplete="new-password"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="confirmPassword"
              name="confirmPassword"
              required=""
              type="password"
              value="TestPassword123"
            />
          </div>
          <div
            class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
            role="alert"
          >
            <svg
              aria-hidden="true"
              class="lucide lucide-triangle-alert h-4 w-4"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
              />
              <path
                d="M12 9v4"
              />
              <path
                d="M12 17h.01"
              />
            </svg>
            <div
              class="text-sm [&_p]:leading-relaxed flex items-center justify-between"
            >
              <span
                class="flex-1"
              >
                Auth session missing!
              </span>
              <div
                class="flex gap-2 ml-4"
              />
            </div>
          </div>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            type="submit"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  </div>
</body>

Ignored nodes: comments, script, style
<html>
  <head />
  <body>
    <div>
      <div
        class="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div
          class="max-w-md w-full bg-white rounded-lg shadow-md p-8"
        >
          <h2
            class="text-2xl font-bold mb-6 text-center"
          >
            Complete Your Registration
          </h2>
          <p
            class="text-gray-600 mb-6 text-center"
          >
            Set your password to complete your account setup.
          </p>
          <form
            class="space-y-4"
            novalidate=""
          >
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="fullName"
              >
                Full Name
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="fullName"
                name="fullName"
                required=""
                type="text"
                value="John Doe"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="password"
              >
                Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                name="password"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="mb-4"
            >
              <label
                class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block font-semibold mb-1"
                for="confirmPassword"
              >
                Confirm Password
                <span
                  class="text-destructive ml-1"
                >
                  *
                </span>
              </label>
              <input
                autocomplete="new-password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="confirmPassword"
                name="confirmPassword"
                required=""
                type="password"
                value="TestPassword123"
              />
            </div>
            <div
              class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
              role="alert"
            >
              <svg
                aria-hidden="true"
                class="lucide lucide-triangle-alert h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
                />
                <path
                  d="M12 9v4"
                />
                <path
                  d="M12 17h.01"
                />
              </svg>
              <div
                class="text-sm [&_p]:leading-relaxed flex items-center justify-between"
              >
                <span
                  class="flex-1"
                >
                  Auth session missing!
                </span>
                <div
                  class
 ❯ Proxy.waitForWrapper node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx:133:11
    131|     await user.click(submitButton);
    132|
    133|     await waitFor(() => {
       |           ^
    134|       expect(screen.getByText(/failed to complete registration/i)).toBeInTheDocument();
    135|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/54]⎯

 FAIL  src/features/shared/auth/services/tests/authService.integration.test.ts > authService.getStoredUser - profile hydration > should return user with role and program_id from profiles and user_roles tables
AssertionError: expected null to deeply equal ObjectContaining{…}

- Expected:
ObjectContaining {
  "department_id": "d1",
  "email": "test@example.com",
  "id": "u1",
  "name": "Test User",
  "program_id": "p1",
  "role": "admin",
}

+ Received:
null

 ❯ src/features/shared/auth/services/tests/authService.integration.test.ts:75:18
     73|     const user = await getStoredUser();
     74|
     75|     expect(user).toEqual(
       |                  ^
     76|       expect.objectContaining({
     77|         id: 'u1',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/54]⎯

 FAIL  src/features/shared/auth/services/tests/authService.integration.test.ts > authService.getStoredUser - profile hydration > should return null if profile not found
AssertionError: expected "error" to be called at least once
 ❯ src/features/shared/auth/services/tests/authService.integration.test.ts:108:29
    106|
    107|     expect(user).toBeNull();
    108|     expect(consoleErrorSpy).toHaveBeenCalled();
       |                             ^
    109|     consoleErrorSpy.mockRestore();
    110|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/54]⎯


 Test Files  19 failed (19)
      Tests  44 failed | 26 passed (70)
   Start at  14:42:43
   Duration  95.64s

 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
```
