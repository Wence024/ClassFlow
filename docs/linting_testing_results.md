# Linting testing results

## Lint results

```txt
npm run lint

> classflow@0.0.0 lint
> eslint .


C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\02-admin-workflows\classrooms.cy.ts
   9:1   warning  Sentences must end with a period             jsdoc/require-description-complete-sentence
  24:17  error    Review this potentially hard-coded password  sonarjs/no-hardcoded-passwords
  31:17  error    Review this potentially hard-coded password  sonarjs/no-hardcoded-passwords

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\02-admin-workflows\departments.cy.ts
  34:53  error  Unexpected any. Specify a different type                          @typescript-eslint/no-explicit-any
  35:9   error  Remove this useless assignment to variable "testDepartmentId"     sonarjs/no-dead-store
  50:53  error  Unexpected any. Specify a different type                          @typescript-eslint/no-explicit-any
  54:79  error  Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions
  61:34  error  Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions
  79:53  error  Unexpected any. Specify a different type                          @typescript-eslint/no-explicit-any
  84:79  error  Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions
  89:67  error  Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\03-department-head-workflows\view-department-requests.cy.ts
  9:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\04-program-head-workflows\manage-class-groups.cy.ts 
   9:1   warning  Sentences must end with a period             jsdoc/require-description-complete-sentence
  23:17  error    Review this potentially hard-coded password  sonarjs/no-hardcoded-passwords

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\04-program-head-workflows\view-pending-requests.cy.ts
  9:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\e2e\05-timetabling\cross-dept-confirmation.cy.ts        
  58:15  error  Remove this useless assignment to variable "originalPosition"  sonarjs/no-dead-store

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\fixtures\testData.ts
  118:1   warning  Unused eslint-disable directive (no problems were reported from 'sonarjs/no-hardcoded-passwords')
  122:15  error    Review this potentially hard-coded password                                                        sonarjs/no-hardcoded-passwords
  126:15  error    Review this potentially hard-coded password                                                        sonarjs/no-hardcoded-passwords
  130:15  error    Review this potentially hard-coded password                                                        sonarjs/no-hardcoded-passwords

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
   58:33  error    Unexpected any. Specify a different type                                             @typescript-eslint/no-explicit-any       
  100:24  error    Unexpected any. Specify a different type                                             @typescript-eslint/no-explicit-any       
  106:24  error    Unexpected any. Specify a different type                                             @typescript-eslint/no-explicit-any       
  120:1   warning  Sentences must end with a period                                                     jsdoc/require-description-complete-sentence
  130:1   warning  Sentences must end with a period                                                     jsdoc/require-description-complete-sentence
  143:1   warning  Sentences must end with a period                                                     jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\cypress\support\testSetup.ts
   23:1   warning  Sentences must end with a period             jsdoc/require-description-complete-sentence
   93:1   warning  Sentences must end with a period             jsdoc/require-description-complete-sentence
  165:15  error    Review this potentially hard-coded password  sonarjs/no-hardcoded-passwords
  177:15  error    Review this potentially hard-coded password  sonarjs/no-hardcoded-passwords

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
  29:1   warning  Missing JSDoc comment                                                                                                          
 jsdoc/require-jsdoc
  35:17  error    Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components 
 react-refresh/only-export-components

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-classrooms\component.tsx
   25:1  warning  Missing JSDoc @returns declaration            jsdoc/require-returns
   95:3  warning  Missing JSDoc @param "data" declaration       jsdoc/require-param
  105:3  warning  Missing JSDoc @param "data" declaration       jsdoc/require-param
  123:3  warning  Missing JSDoc @param "classroom" declaration  jsdoc/require-param
  123:3  warning  Missing JSDoc @returns declaration            jsdoc/require-returns
  128:3  warning  Missing JSDoc @param "id" declaration         jsdoc/require-param
  128:3  warning  Missing JSDoc @returns declaration            jsdoc/require-returns

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-classrooms\hook.ts
   17:1   warning  Missing JSDoc @returns declaration                jsdoc/require-returns
  103:3   warning  Missing JSDoc @param "classroomId" declaration    jsdoc/require-param
  103:3   warning  Missing JSDoc @param "classSessions" declaration  jsdoc/require-param
  103:3   warning  Missing JSDoc @returns declaration                jsdoc/require-returns
  106:67  error    Unexpected any. Specify a different type          @typescript-eslint/no-explicit-any
  110:3   warning  Missing JSDoc @param "classrooms" declaration     jsdoc/require-param
  110:3   warning  Missing JSDoc @returns declaration                jsdoc/require-returns

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

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\admin\manage-departments\tests\component.integration.test.tsx
  7:10  error  Remove this unused import of 'render'               sonarjs/unused-import
  7:18  error  Remove this unused import of 'screen'               sonarjs/unused-import
  8:23  error  Remove this unused import of 'QueryClientProvider'  sonarjs/unused-import
  9:10  error  Remove this unused import of 'AuthContext'          sonarjs/unused-import

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
   4:1   warning  Sentences must end with a period                                  jsdoc/require-description-complete-sentence
  27:28  error    Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions
  41:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  46:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  51:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  56:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  63:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  68:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  73:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  78:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag
  83:8   error    Complete the task associated to this "TODO" comment               sonarjs/todo-tag

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
  75:37  error  Refactor this code to not nest functions more than 4 levels deep  sonarjs/no-nested-functions

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

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\timetabling\pages\components\timetable\TimetableHeader.tsx
  14:1  warning  Missing JSDoc @param "th.viewMode" declaration  jsdoc/require-param
  17:1  warning  Missing @param "th.viewMode"                    jsdoc/check-param-names

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\timetabling\pages\components\timetable\TimetableRow.tsx
  10:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\timetabling\pages\components\timetable\index.tsx   
  34:1  warning  @param "t.isLoading" does not exist on t  jsdoc/check-param-names

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\integrations\supabase\client.ts
  6:1  warning  Sentences must end with a period  jsdoc/require-description-complete-sentence

C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\lib\runtimeConfig.ts
   4:1  warning  Sentences must end with a period           jsdoc/require-description-complete-sentence
  31:1  warning  Missing JSDoc @returns declaration         jsdoc/require-returns
  32:1  warning  Sentences must end with a period           jsdoc/require-description-complete-sentence
  58:1  warning  Missing JSDoc @param "config" declaration  jsdoc/require-param
  59:1  warning  Sentences must end with a period           jsdoc/require-description-complete-sentence

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

✖ 551 problems (124 errors, 427 warnings)
  0 errors and 301 warnings potentially fixable with the `--fix` option.

  

```

## Test outputs

```
C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad>npm run test

> classflow@0.0.0 test
> vitest run


 RUN  v3.2.4 C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad

stdout | src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/components/tests/SyncIndicator.integration.test.tsx (13 tests | 11 failed) 446ms
   × SyncIndicator Integration Tests > Visibility States > should show indicator when timetable queries are fetching 145ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   ✓ SyncIndicator Integration Tests > Visibility States > should hide indicator when no queries are fetching 15ms
   × SyncIndicator Integration Tests > Visibility States > should show indicator when multiple queries are fetching 24ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Visual States > should display loading spinner when fetching 26ms
     → Unable to find an element by: [data-testid="sync-spinner"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Visual States > should display sync text 58ms
     → Unable to find an element with the text: Syncing.... This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Query Filter Integration > should only respond to timetable-related queries 34ms
     → expected "spy" to be called with arguments: [ { queryKey: [ 'timetable' ] } ]

Number of calls: 0

   ✓ SyncIndicator Integration Tests > Query Filter Integration > should not show for non-timetable queries 9ms
   × SyncIndicator Integration Tests > Transition Behavior > should transition from hidden to visible 29ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Transition Behavior > should transition from visible to hidden 16ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Multiple Concurrent Fetches > should show single indicator for multiple fetches 16ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Accessibility > should have proper ARIA label 32ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Accessibility > should have proper role for screen readers 17ms
     → Unable to find an element by: [data-testid="sync-indicator"]

Ignored nodes: comments, script, style
<body>
  <div />
</body>
   × SyncIndicator Integration Tests > Performance > should not cause unnecessary re-renders 13ms
     → expected "spy" to be called at least once
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

 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx (6 tests | 2 failed) 355ms
   ✓ useRequestCrossDeptResource > checkResources > should return cross-department result when instructor is from different dept 83ms
   ✓ useRequestCrossDeptResource > checkResources > should return false when resources are same department 16ms
   ✓ useRequestCrossDeptResource > checkResources > should handle errors gracefully 45ms
   ✓ useRequestCrossDeptResource > checkResources > should set isChecking state correctly 136ms
   × useRequestCrossDeptResource > initiateCrossDeptRequest > should set pending request 48ms
     → expected null to deeply equal { classSessionId: 'session-1', …(3) }
   × useRequestCrossDeptResource > cancelRequest > should clear pending request 18ms
     → expected null not to be null
stdout | src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx (5 tests | 5 failed) 49ms
   × useManageClassSessions Hook > should fetch class sessions for program 23ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should add a new class session 4ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should update an existing class session 5ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should remove a class session 3ms
     → Cannot read properties of undefined (reading 'mockResolvedValue')
   × useManageClassSessions Hook > should handle fetch errors 2ms
     → Cannot read properties of undefined (reading 'mockRejectedValue')
stdout | src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/components/dialogs/tests/ConfirmDialog.test.tsx (18 tests | 1 failed) 3007ms
   ✓ ConfirmDialog Component > Rendering > should render dialog when open is true  798ms
   ✓ ConfirmDialog Component > Rendering > should not render dialog when open is false 17ms
   ✓ ConfirmDialog Component > Rendering > should render default button text 168ms
   ✓ ConfirmDialog Component > Rendering > should render custom button text 150ms
   ✓ ConfirmDialog Component > User Interactions > should call onConfirm when confirm button is clicked 164ms
   ✓ ConfirmDialog Component > User Interactions > should call onOpenChange with false when cancel button is clicked 148ms
   ✓ ConfirmDialog Component > User Interactions > should disable buttons when isLoading is true 115ms
   ✓ ConfirmDialog Component > User Interactions > should show "Processing..." text when loading 90ms
   ✓ ConfirmDialog Component > Button Variants > should render confirm button with default variant 97ms
   ✓ ConfirmDialog Component > Button Variants > should render confirm button with destructive variant 87ms
   ✓ ConfirmDialog Component > Cross-Department Confirmation Scenarios > should handle move confirmed session scenario 141ms
   ✓ ConfirmDialog Component > Cross-Department Confirmation Scenarios > should handle remove cross-department session scenario 121ms
   ✓ ConfirmDialog Component > Accessibility > should have proper dialog role 117ms
   ✓ ConfirmDialog Component > Accessibility > should have accessible title 118ms
   ✓ ConfirmDialog Component > Accessibility > should have accessible description 114ms
   ✓ ConfirmDialog Component > Edge Cases > should handle rapid clicks when not loading 144ms
   ✓ ConfirmDialog Component > Edge Cases > should prevent clicks when loading 87ms
   × ConfirmDialog Component > Edge Cases > should handle empty strings for custom text 322ms
     → expected [ <button …(1)></button>, …(2) ] to have a length of 2 but got 3
 ❯ src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx (1 test | 1 failed) 135ms
   × ClassGroupManagement Component > should render the component 129ms
     → Cannot find module '@/features/classSessionComponents/hooks/useClassGroups'
Require stack:
- C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\tests\class-groups-component.integration.test.tsx
stdout | src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ❯ src/features/program-head/manage-class-sessions/tests/component.integration.test.tsx (6 tests | 6 failed) 302ms
   × ManageClassSessions Component > should render class sessions list 159ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should display loading state 17ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should display error state 26ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should filter sessions by search query 26ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should open add session dialog 19ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ManageClassSessions Component > should handle session deletion 35ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
 ❯ src/features/program-head/schedule-class-session/tests/view-selector-component.integration.test.tsx (7 tests | 7 failed) 280ms
   × ViewSelector > should render all three view options 166ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should highlight the active view mode 16ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should call onViewModeChange when a view button is clicked 22ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should not call onViewModeChange when clicking the already active view 29ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should switch between all view modes correctly 16ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should render correct icons for each view 9ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
   × ViewSelector > should have proper accessibility attributes 14ms
     → Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx [queued]
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 0/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 0/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 0/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 0/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 0/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 0/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 0/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 0/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Department Grouping > should show "From Your Department" section when priority items exist
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Department Grouping > should show "From Other Departments" section when both priority and non-priority items exist
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Department Grouping > should prioritize items by department correctly
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Fallback UI > should show fallback info message when no priority items exist and showAllItemsWhenNoPriority is true
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Fallback UI > should show ungrouped list when showAllItemsWhenNoPriority is true and no priority items
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 0/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 4/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 1/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should render with resource name
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 0/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 4/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 1/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Search Filtering > should filter items based on search query
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Search Filtering > should show empty state when search returns no results
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Item Selection > should call onSelectItem when an item is clicked
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Item Selection > should reset search when an item is selected
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Loading State > should show loading spinner when isLoading is true
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should require rejection message (disabled submit when empty)
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should enable submit button when message is entered
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should call onConfirm with message on submit
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx > ResourceSelectorModal > Empty State > should show empty message when items array is empty
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 3/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 11/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 2/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx (11 tests) 2628ms
   ✓ ResourceSelectorModal > Department Grouping > should show "From Your Department" section when priority items exist  903ms
stdout | src/features/admin/manage-classrooms/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/resourceRequests/workflows/tests/moveConfirmedSession.integration.test.tsx > Move Confirmed Cross-Department Session Workflow > should move session on confirm
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/admin/manage-users/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 3/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 11/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 2/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/resourceRequests/workflows/tests/moveConfirmedSession.integration.test.tsx (8 tests) 1516ms
   ✓ Move Confirmed Cross-Department Session Workflow > should move session on confirm  1466ms

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 4/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 11/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 2/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 0/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 0/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should not call onConfirm with whitespace-only message
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 4/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/custom/tests/resource-selector-modal.integration.test.tsx 11/11
 ❯ src/components/ui/tests/ColorPicker.test.tsx 2/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 0/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 0/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should clear message on close
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should clear message on close
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.

stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should disable form during loading state
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 7/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx 4/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 5/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 5/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/timetabling/components/tests/ViewSelector.test.tsx (7 tests) 1747ms
   ✓ ViewSelector > should render all three view options  348ms
   ✓ ViewSelector > should highlight the active view mode  393ms
   ✓ ViewSelector > should call onViewModeChange when a view button is clicked  368ms

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 7/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx 4/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 5/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 5/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stderr | src/components/dialogs/tests/RejectionDialog.test.tsx > RejectionDialog > should show loading text on submit button during loading
Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.


 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 7/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx 4/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 5/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 5/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/components/dialogs/tests/RejectionDialog.test.tsx (8 tests) 3439ms
   ✓ RejectionDialog > should render with resource name  1345ms
   ✓ RejectionDialog > should call onConfirm with message on submit  440ms
   ✓ RejectionDialog > should clear message on close  532ms
 ✓ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx (9 tests) 1006ms

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 8/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx 5/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 9/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 8/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/admin/manage-users/tests/hook.integration.test.tsx (10 tests) 1088ms

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 8/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx 6/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 9/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 10/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/components/ui/tests/ColorPicker.test.tsx (7 tests) 4663ms
   ✓ ColorPicker > should render the trigger button with the color name  581ms
   ✓ ColorPicker > should open the popover when the trigger is clicked  2114ms
   ✓ ColorPicker > should call onChange and close the popover when a preset color is clicked  707ms
   ✓ ColorPicker > should close the popover when clicking outside  409ms
   ✓ ColorPicker > should close the popover when Escape key is pressed  362ms
   ✓ ColorPicker > should allow custom color selection without closing popover immediately  368ms

 ❯ src/components/dialogs/tests/RejectionDialog.test.tsx 8/8
 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/ColorPicker.test.tsx 7/7
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/hook.integration.test.tsx 9/9
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/hook.integration.test.tsx 10/10
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]





 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/admin/manage-departments/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru



 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx 1/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx 5/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/admin/manage-departments/tests/hook.integration.test.tsx (8 tests) 731ms
stdout | src/features/programs/hooks/tests/usePrograms.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/department-head/view-department-requests/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx 8/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/program-head/manage-components/tests/courses-hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx 8/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/programs/hooks/tests/usePrograms.integration.test.tsx (5 tests) 619ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx 8/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/hook.integration.test.tsx 8/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/department-head/view-department-requests/tests/hook.integration.test.tsx (11 tests) 913ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/program-head/manage-components/tests/courses-hook.integration.test.tsx (8 tests) 975ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
stdout | src/features/departments/hooks/tests/useDepartments.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/program-head/manage-components/tests/class-groups-hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stdout | src/features/department-head/manage-instructors/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/departments/hooks/tests/useDepartments.integration.test.tsx (5 tests) 486ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/program-head/manage-components/tests/class-groups-hook.integration.test.tsx (8 tests) 620ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/department-head/manage-instructors/tests/hook.integration.test.tsx (9 tests) 790ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 0/5
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 0/5
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 0/5
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > should handle auth initialization errors gracefully
Failed to initialize auth: Error: Network error
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\shared\auth\contexts\tests\AuthProvider.integration.test.tsx:124:60
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at runSuite (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runFiles (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1787:3)


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 3/5
 ❯ src/contexts/tests/LayoutContext.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/components/ui/tests/sonner.test.tsx (5 tests) 776ms
   ✓ Toaster > renders and displays a toast message  482ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 5/5
 ❯ src/contexts/tests/LayoutContext.test.tsx 0/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > should update user after updateMyProfile is called
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > should update user after updateMyProfile is called
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 5/5
 ❯ src/contexts/tests/LayoutContext.test.tsx 0/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > Role-based navigation on login > should redirect admin users to /departments
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > Role-based navigation on login > should redirect admin users to /departments
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > Role-based navigation on login > should redirect department_head users to /department-head
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > Role-based navigation on login > should redirect department_head users to /department-head
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/components/ui/tests/sonner.test.tsx 5/5
 ❯ src/contexts/tests/LayoutContext.test.tsx 0/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/program-head/view-pending-requests/tests/hook.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx 1/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > Role-based navigation on login > should redirect program_head users to /scheduler
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act

stderr | src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx > AuthProvider Integration Tests > Role-based navigation on login > should redirect program_head users to /scheduler
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
An update to AuthProvider inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx 1/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/shared/auth/contexts/tests/AuthProvider.integration.test.tsx (8 tests) 853ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx 1/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/contexts/tests/LayoutContext.test.tsx (3 tests) 663ms
   ✓ LayoutContext > should toggle sidebar state when toggleSidebar is called  500ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx 3/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stderr | src/features/program-head/view-pending-requests/tests/hook.integration.test.tsx > useViewPendingRequests > handleDismiss > should handle dismiss errors
Error dismissing request: Error: Dismiss failed
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\view-pending-requests\tests\hook.integration.test.tsx:114:59
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at runNextTicks (node:internal/process/task_queues:60:5)
    at listOnTimeout (node:internal/timers:545:9)
    at processTimers (node:internal/timers:519:7)


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx 3/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/program-head/view-pending-requests/tests/hook.integration.test.tsx (6 tests) 525ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/LayoutContext.test.tsx 3/3
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
stdout | src/features/users/hooks/tests/useUsers.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/users/hooks/tests/useUsers.integration.test.tsx (2 tests) 391ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/shared/auth/hooks/tests/useAuth.integration.test.tsx (8 tests) 190ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > approve_resource_request > should successfully approve pending request and update timetable status
Request approved successfully: {
  requestId: 'request-1',
  updatedAssignments: 1,
  classSessionId: 'session-1',
  semesterId: 'semester-1'
}


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stderr | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > approve_resource_request > should return error when request does not exist
Approval function returned failure: Request not found

stderr | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > approve_resource_request > should return error when request is not pending
Approval function returned failure: Request is not pending

stderr | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > approve_resource_request > should validate reviewer_id is provided
Approval function returned failure: Reviewer ID is required

stderr | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > approve_resource_request > should return error when no active semester exists
Approval function returned failure: No active semester found

stderr | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > approve_resource_request > should return error when timetable assignment does not exist
Approval function returned failure: Timetable assignment not found


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > reject_resource_request > should reject pending request and delete session/assignment
Request rejected successfully: {
  success: true,
  action: 'removed_from_timetable',
  class_session_id: 'session-1'
}

stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > reject_resource_request > should reject approved request and restore to original position
Request rejected successfully: {
  success: true,
  action: 'restored',
  class_session_id: 'session-1',
  restored_to_period: 5
}

stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > reject_resource_request > should store rejection message in database
Request rejected successfully: { success: true, action: 'removed_from_timetable' }

stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > reject_resource_request > should return correct action taken (removed vs restored)
Request rejected successfully: { success: true, action: 'removed_from_timetable' }

stdout | src/features/resourceRequests/services/tests/databaseFunctions.test.ts > Database Functions (RPC) > reject_resource_request > should return correct action taken (removed vs restored)
Request rejected successfully: { success: true, action: 'restored', restored_to_period: 10 }


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/resourceRequests/services/tests/databaseFunctions.test.ts (19 tests) 228ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx [queuedstdout | src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx [queuedstdout | src/features/resourceRequests/tests/permissions.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx > Rejection Workflow > should require rejection message (validation)
Request rejected successfully: { success: true, action: 'removed_from_timetable' }

stdout | src/features/resourceRequests/tests/permissions.test.ts > Resource Request Permissions and Security > should allow department heads to approve requests for their department
Request approved successfully: {
  requestId: 'request-1',
  updatedAssignments: 1,
  classSessionId: undefined,
  semesterId: undefined
}


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx [queued]
stderr | src/features/resourceRequests/tests/permissions.test.ts > Resource Request Permissions and Security > should prevent department heads from approving requests for other departments
Failed to approve request (RPC error): { code: '42501', message: 'Permission denied' }


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx [queued]
stdout | src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx > Rejection Workflow > should delete session and assignment for pending request
Request rejected successfully: {
  success: true,
  action: 'removed_from_timetable',
  class_session_id: 'session-1'
}

stdout | src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx > Rejection Workflow > should restore to original position for approved request
Request rejected successfully: {
  success: true,
  action: 'restored',
  class_session_id: 'session-1',
  restored_to_period: 5
}

stdout | src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx > Rejection Workflow > should store rejection_message in database
Request rejected successfully: { success: true, action: 'removed_from_timetable' }


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx [queued]
stderr | src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx > Rejection Workflow > should handle rejection with detailed error messages
Rejection function returned failure: Request is not pending or approved (current status: cancelled)

stderr | src/features/resourceRequests/tests/permissions.test.ts > Resource Request Permissions and Security > should validate reviewer_id is provided for approval
Approval function returned failure: Reviewer ID is required


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx [queued]
 ✓ src/features/resourceRequests/tests/permissions.test.ts (10 tests) 101ms
 ✓ src/features/timetabling/hooks/tests/useTimetableViewMode.test.tsx (6 tests) 220ms
stdout | src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ✓ src/features/resourceRequests/workflows/tests/rejectionWorkflow.integration.test.tsx (7 tests) 105ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ❯ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx 0/2
 ✓ src/features/classSessions/pages/components/tests/ClassSessionCard.integration.test.tsx (2 tests) 586ms
   ✓ ClassSessionCard > should render correctly without a conflict badge when there are no soft conflicts  436ms


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stderr | src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts > resourceRequestService - Edge Cases > createRequest - Duplicate Prevention > should return existing request instead of creating duplicate
Request already exists for this class session: {
  id: 'existing-request-id',
  class_session_id: 'session-123',
  status: 'pending'
}


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stdout | src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts > resourceRequestService - Edge Cases > cancelRequest > should cancel pending request and remove from timetable
Request cancelled successfully: {
  success: true,
  action: 'removed_from_timetable',
  class_session_id: 'session-1'
}

stdout | src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts > resourceRequestService - Edge Cases > cancelRequest > should cancel approved request and restore to original position
Request cancelled successfully: {
  success: true,
  action: 'restored',
  class_session_id: 'session-1',
  restored_to_period: 5
}


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stderr | src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts > resourceRequestService - Edge Cases > cancelRequest > should throw error if requester lacks permission
Cancellation function returned failure: Permission denied: You can only cancel your own requests


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stderr | src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts > resourceRequestService - Edge Cases > cancelRequest > should throw error if request not found
Cancellation function returned failure: Resource request not found

stderr | src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts > resourceRequestService - Edge Cases > cancelRequest > should throw error if RPC call fails
Failed to cancel request (RPC error): { message: 'Database error', code: 'DB_ERROR' }


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/program-head/schedule-class-session/tests/view-mode-hook.integration.test.tsx (6 tests) 206ms
 ✓ src/features/resourceRequests/services/tests/resourceRequestService.edgeCases.test.ts (10 tests) 119ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/timetabling/utils/tests/timetableLogic.instructor.test.ts (5 tests) 33ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stdout | src/features/resourceRequests/workflows/tests/removeToDrawer.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stdout | src/features/resourceRequests/workflows/tests/removeToDrawer.integration.test.tsx > Remove to Drawer Workflow > should call cancelRequest service for pending request
Request cancelled successfully: {
  success: true,
  action: 'removed_from_timetable',
  class_session_id: 'session-1'
}

stdout | src/features/resourceRequests/workflows/tests/removeToDrawer.integration.test.tsx > Remove to Drawer Workflow > should call cancelRequest service for approved request
Request cancelled successfully: {
  success: true,
  action: 'restored',
  class_session_id: 'session-1',
  restored_to_period: 5
}

 ✓ src/features/resourceRequests/workflows/tests/removeToDrawer.integration.test.tsx (9 tests) 88ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/timetabling/services/timetableService.test.ts (10 tests) 58ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/classSessionComponents/types/tests/validation.test.ts (11 tests) 51ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]



 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
stdout | src/features/department-head/approve-request/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ✓ src/features/department-head/approve-request/tests/service.test.ts (3 tests) 27ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stderr | src/features/program-head/request-cross-dept-resource/tests/service.test.ts > Request Cross-Dept Resource Service > checkCrossDepartmentResource > should handle RPC errors gracefully
Error checking cross-department resource: Error: RPC error
    at C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\request-cross-dept-resource\tests\service.test.ts:92:16
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at runSuite (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///C:/Users/User/Documents/Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ✓ src/features/program-head/request-cross-dept-resource/tests/service.test.ts (4 tests) 57ms
 ✓ src/features/timetabling/utils/tests/timetableLogic.test.ts (7 tests) 45ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ✓ src/lib/tests/colorUtils.test.ts (16 tests) 30ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/timetabling/utils/tests/checkConflicts.test.ts (24 tests) 58ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/resourceRequests/workflows/tests/approvalWorkflow.integration.test.tsx
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/admin/manage-departments/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ✓ src/features/admin/manage-departments/tests/service.test.ts (8 tests) 47ms
stdout | src/features/department-head/manage-instructors/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

stdout | src/features/resourceRequests/workflows/tests/approvalWorkflow.integration.test.tsx > Approval Workflow > should call approve_resource_request atomically
Request approved successfully: {
  requestId: 'request-1',
  updatedAssignments: 1,
  classSessionId: 'session-1',
  semesterId: 'semester-1'
}

stdout | src/features/resourceRequests/workflows/tests/approvalWorkflow.integration.test.tsx > Approval Workflow > should update request status to approved
Request approved successfully: {
  requestId: 'request-1',
  updatedAssignments: 1,
  classSessionId: undefined,
  semesterId: undefined
}


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-departments/tests/service.test.ts 8/8
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/resourceRequests/workflows/tests/approvalWorkflow.integration.test.tsx > Approval Workflow > should trigger delete notifications via database trigger
Request approved successfully: {
  requestId: 'request-1',
  updatedAssignments: 1,
  classSessionId: undefined,
  semesterId: undefined
}

stdout | src/features/resourceRequests/workflows/tests/approvalWorkflow.integration.test.tsx > Approval Workflow > should allow real-time updates to propagate to timetable
Request approved successfully: {
  requestId: 'request-1',
  updatedAssignments: 1,
  classSessionId: undefined,
  semesterId: undefined
}

 ✓ src/features/resourceRequests/workflows/tests/approvalWorkflow.integration.test.tsx (6 tests) 60ms
 ✓ src/features/department-head/manage-instructors/tests/service.test.ts (6 tests) 33ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/shared/auth/services/tests/authService.login.test.ts (6 tests) 35ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
stdout | src/features/admin/manage-users/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts 1/11
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/admin/manage-users/tests/service.test.ts (11 tests) 47ms


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/service.test.ts 11/11
 ✓ src/features/program-head/request-cross-dept-resource/tests/component.integration.test.tsx (3 tests) 14ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
stdout | src/features/program-head/schedule-class-session/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ✓ src/features/program-head/schedule-class-session/tests/service.test.ts (5 tests) 47ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/program-head/view-pending-requests/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/program-head/view-pending-requests/tests/service.test.ts (5 tests) 36ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/users/services/tests/usersService.integration.test.ts (5 tests) 41ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/service.test.ts [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/admin/manage-classrooms/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/service.test.ts 0/8
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
stdout | src/features/department-head/view-department-requests/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ✓ src/features/admin/manage-classrooms/tests/service.test.ts (8 tests) 39ms
 ✓ src/features/department-head/view-department-requests/tests/service.test.ts (4 tests) 31ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
stdout | src/features/reports/services/tests/instructorReportService.unit.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/reports/services/tests/instructorReportService.unit.test.ts (3 tests) 24ms
stdout | src/features/department-head/reject-request/tests/service.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/department-head/reject-request/tests/service.test.ts (4 tests) 39ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/admin/manage-classrooms/tests/component.integration.test.tsx (5 tests) 17ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx 5/5
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/timetabling/utils/tests/timetableLogic.classroom.test.ts (5 tests) 34ms
 ✓ src/features/timetabling/hooks/tests/useTimetableDnd.confirmation.test.tsx (6 tests) 29ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx 5/5
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-classrooms/tests/component.integration.test.tsx 5/5
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]





 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]





 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
stdout | src/features/reports/services/tests/loadCalculationService.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru

 ✓ src/features/reports/services/tests/loadCalculationService.test.ts (5 tests) 15ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/program-head/schedule-class-session/tests/confirmation-dialog.integration.test.tsx (6 tests) 30ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ✓ src/features/shared/auth/utils/tests/permissions.test.ts (23 tests) 33ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ✓ src/features/program-head/schedule-class-session/tests/conflict-detection.test.ts (9 tests) 26ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/timetabling/utils/tests/timetableLogic.factory.test.ts (4 tests) 39ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ✓ src/features/department-head/approve-request/tests/hook.integration.test.tsx (3 tests) 18ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ✓ src/features/program-head/manage-components/tests/service.test.ts (9 tests) 20ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [queued]
 ❯ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [queued]
 ✓ src/features/program-head/manage-components/tests/courses-component.integration.test.tsx (5 tests) 24ms


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [queued]
 ✓ src/features/program-head/schedule-class-session/tests/session-cell-component.integration.test.tsx (10 tests) 21ms



 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ✓ src/features/classSessions/types/tests/validation.test.ts (3 tests) 25ms
 ✓ src/features/department-head/reject-request/tests/hook.integration.test.tsx (3 tests) 17ms



 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ✓ src/features/admin/manage-departments/tests/component.integration.test.tsx (4 tests) 17ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [queued]
 ✓ src/features/program-head/view-pending-requests/tests/component.integration.test.tsx (3 tests) 15ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ✓ src/features/program-head/schedule-class-session/tests/timetable-hook.integration.test.tsx (3 tests) 12ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/component.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/component.integration.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/admin/manage-users/tests/component.integration.test.tsx 0/5
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ✓ src/features/admin/manage-users/tests/component.integration.test.tsx (5 tests) 16ms

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]

 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
stdout | src/features/reports/services/tests/pdfExportService.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ❯ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [queued]
 ✓ src/features/reports/services/tests/pdfExportService.test.ts (1 test) 10ms
stdout | src/features/reports/services/tests/excelExportService.test.ts
[Config] Using hardcoded development config
[Supabase Client] Environment: development
[Supabase Client] Project URL: https://wkfgcroybuuefaulqsru.supabase.co
[Supabase Client] Project ID: wkfgcroybuuefaulqsru


 ❯ src/components/layout/tests/AppLayout.integration.test.tsx [queued]
 ❯ src/components/layout/tests/Sidebar.integration.test.tsx [queued]
 ❯ src/components/tests/Header.integration.test.tsx [queued]
 ❯ src/components/tests/PendingRequestsPanel.integration.test.tsx [queued]
 ❯ src/components/tests/RequestNotifications.integration.test.tsx [queued]
 ❯ src/contexts/tests/RealtimeProvider.test.tsx [queued]
 ✓ src/features/reports/services/tests/excelExportService.test.ts (1 test) 10ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 35 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/components/tests/Header.integration.test.tsx [ src/components/tests/Header.integration.test.tsx ]
Error: Failed to resolve import "../../features/auth/contexts/AuthContext" from "src/components/tests/Header.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/components/tests/Header.integration.test.tsx:7:28
  6  |  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  7  |  import Header from "../Header";
  8  |  import { AuthContext } from "../../features/auth/contexts/AuthContext";
     |                               ^
  9  |  import { LayoutProvider } from "../../contexts/LayoutContext";
  10 |  const renderHeader = (authContextValue = {}) => {
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/68]⎯

 FAIL  src/components/tests/PendingRequestsPanel.integration.test.tsx [ src/components/tests/PendingRequestsPanel.integration.test.tsx ]
Error: Failed to resolve import "@/lib/services/resourceRequestsService" from "src/components/tests/PendingRequestsPanel.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/components/tests/PendingRequestsPanel.integration.test.tsx:8:0
  13 |  const __vi_import_2__ = await import("@tanstack/react-query");
  14 |  const __vi_import_3__ = await import("../PendingRequestsPanel");
  15 |  const __vi_import_4__ = await import("@/lib/services/resourceRequestsService");
     |                                       ^
  16 |
  17 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/68]⎯

 FAIL  src/components/tests/RequestNotifications.integration.test.tsx [ src/components/tests/RequestNotifications.integration.test.tsx ]
Error: Failed to resolve import "../../features/auth/contexts/AuthContext" from "src/components/tests/RequestNotifications.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/components/tests/RequestNotifications.integration.test.tsx:7:0
  16 |  const __vi_import_4__ = await import("@testing-library/user-event");
  17 |  const __vi_import_5__ = await import("../RequestNotifications");
  18 |  const __vi_import_6__ = await import("../../features/auth/contexts/AuthContext");
     |                                       ^
  19 |  const __vi_import_7__ = await import("../../features/auth/hooks/useDepartmentId");
  20 |  const __vi_import_8__ = await import("../../features/resourceRequests/hooks/useResourceRequests");
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/68]⎯

 FAIL  src/contexts/tests/RealtimeProvider.test.tsx [ src/contexts/tests/RealtimeProvider.test.tsx ]
Error: Failed to resolve import "../../features/auth/contexts/AuthContext" from "src/contexts/tests/RealtimeProvider.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/contexts/tests/RealtimeProvider.test.tsx:24:0
  9  |  const __vi_import_2__ = await import("@tanstack/react-query");
  10 |  const __vi_import_3__ = await import("react");
  11 |  const __vi_import_4__ = await import("../../features/auth/contexts/AuthContext");
     |                                       ^
  12 |
  13 |  const mockSubscribe = vi.fn();
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/68]⎯

 FAIL  src/components/layout/tests/AppLayout.integration.test.tsx [ src/components/layout/tests/AppLayout.integration.test.tsx ]
Error: Failed to resolve import "../../../features/auth/contexts/AuthContext" from "src/components/layout/tests/AppLayout.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/components/layout/tests/AppLayout.integration.test.tsx:7:28
  6  |  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  7  |  import AppLayout from "../AppLayout";
  8  |  import { AuthContext } from "../../../features/auth/contexts/AuthContext";
     |                               ^
  9  |  const renderAppLayout = (authContextValue = {}) => {
  10 |    const queryClient = new QueryClient({
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/68]⎯

 FAIL  src/components/layout/tests/Sidebar.integration.test.tsx [ src/components/layout/tests/Sidebar.integration.test.tsx ]
Error: Failed to resolve import "../../../features/auth/contexts/AuthContext" from "src/components/layout/tests/Sidebar.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/components/layout/tests/Sidebar.integration.test.tsx:5:28
  4  |  import { MemoryRouter } from "react-router-dom";
  5  |  import Sidebar from "../../Sidebar";
  6  |  import { AuthContext } from "../../../features/auth/contexts/AuthContext";
     |                               ^
  7  |  import { LayoutProvider } from "../../../contexts/LayoutContext";
  8  |  const renderSidebar = (authContextValue) => {
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/68]⎯

 FAIL  src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx [ src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/pages/tests/ClassroomTab.integration.test.tsx:7:0
  6  |  const __vi_import_3__ = await import("@testing-library/user-event");
  7  |  const __vi_import_4__ = await import("../ClassroomTab");
  8  |  const __vi_import_5__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  9  |  const __vi_import_6__ = await import("../../hooks/useClassroomsUnified");
  10 |  const __vi_import_7__ = await import("../../../departments/hooks/useDepartments");
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/68]⎯

 FAIL  src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx [ src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/pages/tests/CourseTab.integration.test.tsx:6:28
  5  |  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  6  |  import CourseManagement from "../CourseTab";
  7  |  import { AuthContext } from "../../../auth/contexts/AuthContext";
     |                               ^
  8  |  import * as courseHooks from "../../hooks/useCourses";
  9  |  import * as sessionHooks from "../../../classSessions/hooks/useClassSessions";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/68]⎯

 FAIL  src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx [ src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/pages/tests/InstructorTab.integration.test.tsx:7:0
  6  |  const __vi_import_3__ = await import("@testing-library/user-event");
  7  |  const __vi_import_4__ = await import("../InstructorTab");
  8  |  const __vi_import_5__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  9  |  const __vi_import_6__ = await import("../../services/instructorsService");
  10 |  const __vi_import_7__ = await import("../../../classSessions/hooks/useClassSessions");
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/68]⎯

 FAIL  src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx [ src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/hooks/useAuth" from "src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/hooks/tests/useAllClassrooms.integration.test.tsx:81:47
  65 |    });
  66 |    it("should fetch all classrooms regardless of user department", async () => {
  67 |      const mockUseAuth = vi.mocked(await import("../../../auth/hooks/useAuth")).useAuth;
     |                                                 ^
  68 |      mockUseAuth.mockReturnValue({
  69 |        user: mockUser,
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/68]⎯

 FAIL  src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx [ src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/hooks/tests/useAllCourses.integration.test.tsx:7:0
  5  |  const __vi_import_3__ = await import("../useAllCourses");
  6  |  const __vi_import_4__ = await import("../../services/coursesService");
  7  |  const __vi_import_5__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  8  |
  9  |  import { describe, it, expect, beforeEach, vi } from "vitest";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/68]⎯

 FAIL  src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx [ src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/hooks/useAuth" from "src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessionComponents/hooks/tests/useAllInstructors.integration.test.tsx:84:47
  68 |    });
  69 |    it("should fetch all instructors regardless of user department", async () => {
  70 |      const mockUseAuth = vi.mocked(await import("../../../auth/hooks/useAuth")).useAuth;
     |                                                 ^
  71 |      mockUseAuth.mockReturnValue({
  72 |        user: mockUser,
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/68]⎯

 FAIL  src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx [ src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessions/pages/tests/ClassSessionsPage.integration.test.tsx:7:0
  9  |  const __vi_import_4__ = await import("react-router-dom");
  10 |  const __vi_import_5__ = await import("../ClassSessionsPage");
  11 |  const __vi_import_6__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  12 |
  13 |  import { describe, it, expect, beforeEach, vi } from "vitest";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/68]⎯

 FAIL  src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx [ src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessions/hooks/tests/useClassSessions.integration.test.tsx:6:28
  5  |  import { useClassSessions } from "../useClassSessions";
  6  |  import * as classSessionsService from "../../services/classSessionsService";
  7  |  import { AuthContext } from "../../../auth/contexts/AuthContext";
     |                               ^
  8  |  const queryClient = new QueryClient();
  9  |  const wrapper = ({ children }) => /* @__PURE__ */ jsxDEV(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxDEV(
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/68]⎯

 FAIL  src/features/departments/pages/tests/DepartmentHeadDashboard.integration.test.tsx [ src/features/departments/pages/tests/DepartmentHeadDashboard.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/departments/pages/tests/DepartmentHeadDashboard.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/departments/pages/tests/DepartmentHeadDashboard.integration.test.tsx:7:28
  5  |  import { BrowserRouter } from "react-router-dom";
  6  |  import DepartmentHeadDashboard from "../DepartmentHeadDashboard";
  7  |  import { AuthContext } from "../../../auth/contexts/AuthContext";
     |                               ^
  8  |  describe("DepartmentHeadDashboard Integration Tests", () => {
  9  |    let queryClient;
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/68]⎯

 FAIL  src/features/programs/pages/tests/ProgramManagementPage.integration.test.tsx [ src/features/programs/pages/tests/ProgramManagementPage.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/programs/pages/tests/ProgramManagementPage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/programs/pages/tests/ProgramManagementPage.integration.test.tsx:8:0
  98 |  const __vi_import_3__ = await import("@tanstack/react-query");
  99 |  const __vi_import_4__ = await import("react-router-dom");
  100|  const __vi_import_5__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  101|  const __vi_import_6__ = await import("../../hooks/usePrograms");
  102|  const __vi_import_7__ = await import("../../../departments/hooks/useDepartments");
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/68]⎯

 FAIL  src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx [ src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx:5:28
  4  |  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  5  |  import ScheduleConfigPage from "../ScheduleConfigPage";
  6  |  import { AuthContext } from "../../../auth/contexts/AuthContext";
     |                               ^
  7  |  import * as useScheduleConfigHook from "../../hooks/useScheduleConfig";
  8  |  const queryClient = new QueryClient();
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/68]⎯

 FAIL  src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx [ src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/pages/tests/TimetablePage.integration.test.tsx:9:28
  8  |  import * as classSessionsService from "../../../classSessions/services/classSessionsService";
  9  |  import * as useScheduleConfigHook from "../../../scheduleConfig/hooks/useScheduleConfig";
  10 |  import { AuthContext } from "../../../auth/contexts/AuthContext";
     |                               ^
  11 |  import { MemoryRouter } from "react-router-dom";
  12 |  const queryClient = new QueryClient();
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/68]⎯

 FAIL  src/features/timetabling/hooks/tests/useTimetable.integration.test.tsx [ src/features/timetabling/hooks/tests/useTimetable.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/timetabling/hooks/tests/useTimetable.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/hooks/tests/useTimetable.integration.test.tsx:9:0
  9  |  const __vi_import_6__ = await import("../../../scheduleConfig/hooks/useActiveSemester");
  10 |  const __vi_import_7__ = await import("../../../scheduleConfig/hooks/useScheduleConfig");
  11 |  const __vi_import_8__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  12 |
  13 |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/68]⎯

 FAIL  src/features/timetabling/hooks/tests/useTimetableDnd.integration.test.tsx [ src/features/timetabling/hooks/tests/useTimetableDnd.integration.test.tsx ]
Error: Failed to resolve import "../../../auth/contexts/AuthContext" from "src/features/timetabling/hooks/tests/useTimetableDnd.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/hooks/tests/useTimetableDnd.integration.test.tsx:8:0
  7  |  const __vi_import_5__ = await import("../../../scheduleConfig/hooks/useScheduleConfig");
  8  |  const __vi_import_6__ = await import("../../../programs/hooks/usePrograms");
  9  |  const __vi_import_7__ = await import("../../../auth/contexts/AuthContext");
     |                                       ^
  10 |
  11 |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/68]⎯

 FAIL  src/features/classSessions/pages/components/tests/ClassSessionForm.integration.test.tsx [ src/features/classSessions/pages/components/tests/ClassSessionForm.integration.test.tsx ]
Error: Failed to resolve import "../../../../auth/contexts/AuthProvider" from "src/features/classSessions/pages/components/tests/ClassSessionForm.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/classSessions/pages/components/tests/ClassSessionForm.integration.test.tsx:10:29
  7  |  import { MemoryRouter } from "react-router-dom";
  8  |  import ClassSessionForm from "../classSession/ClassSessionForm";
  9  |  import { AuthProvider } from "../../../../auth/contexts/AuthProvider";
     |                                ^
  10 |  import { classSessionSchema } from "../../../../classSessions/types/validation";
  11 |  import { zodResolver } from "@hookform/resolvers/zod";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/68]⎯

 FAIL  src/features/shared/auth/components/tests/PrivateRoute.integration.test.tsx [ src/features/shared/auth/components/tests/PrivateRoute.integration.test.tsx ]
Error: Failed to resolve import "../../../../components/layout/AppLayout" from "src/features/shared/auth/components/tests/PrivateRoute.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/shared/auth/components/tests/PrivateRoute.integration.test.tsx:7:0
  30 |  const __vi_import_4__ = await import("../PrivateRoute");
  31 |  const __vi_import_5__ = await import("../../contexts/AuthContext");
  32 |  const __vi_import_6__ = await import("../../../../components/layout/AppLayout");
     |                                       ^
  33 |
  34 |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/68]⎯

 FAIL  src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx [ src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx ]
Error: Failed to resolve import "../../../../lib/supabase" from "src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/shared/auth/pages/tests/CompleteRegistrationPage.integration.test.tsx:7:0
  19 |  const __vi_import_3__ = await import("react-router-dom");
  20 |  const __vi_import_4__ = await import("../CompleteRegistrationPage");
  21 |  const __vi_import_5__ = await import("../../../../lib/supabase");
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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/68]⎯

 FAIL  src/features/shared/auth/pages/tests/UserProfilePage.integration.test.tsx [ src/features/shared/auth/pages/tests/UserProfilePage.integration.test.tsx ]
Error: Failed to resolve import "../../../programs/hooks/usePrograms" from "src/features/shared/auth/pages/tests/UserProfilePage.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/shared/auth/pages/tests/UserProfilePage.integration.test.tsx:13:30
  9  |  import UserProfilePage from "../UserProfilePage";
  10 |  import { AuthContext } from "../../contexts/AuthContext";
  11 |  import * as programHooks from "../../../programs/hooks/usePrograms";
     |                                 ^
  12 |  import * as departmentHooks from "../../../departments/hooks/useDepartments";
  13 |  const mockPrograms = [
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/68]⎯

 FAIL  src/features/shared/auth/services/tests/authService.integration.test.ts [ src/features/shared/auth/services/tests/authService.integration.test.ts ]
Error: Failed to resolve import "../../../../lib/supabase" from "src/features/shared/auth/services/tests/authService.integration.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/shared/auth/services/tests/authService.integration.test.ts:3:0
  8  |  }));
  9  |  const __vi_import_0__ = await import("../authService");
  10 |  const __vi_import_1__ = await import("../../../../lib/supabase");
     |                                       ^
  11 |  import { vi, describe, it, expect, beforeEach } from "vitest";
  12 |
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/68]⎯

 FAIL  src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx [ src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx ]
Error: Failed to resolve import "../../../../../auth/contexts/AuthContext" from "src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx:7:28
  6  |  import { HTML5Backend } from "react-dnd-html5-backend";
  7  |  import SessionCell from "../SessionCell";
  8  |  import { AuthContext } from "../../../../../auth/contexts/AuthContext";
     |                               ^
  9  |  import TimetableContext from "../TimetableContext";
  10 |  const queryClient = new QueryClient();
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/68]⎯

 FAIL  src/features/timetabling/pages/components/timetable/tests/SessionCell.pending.test.tsx [ src/features/timetabling/pages/components/timetable/tests/SessionCell.pending.test.tsx ]
Error: Failed to resolve import "../../../../../auth/contexts/AuthContext" from "src/features/timetabling/pages/components/timetable/tests/SessionCell.pending.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/pages/components/timetable/tests/SessionCell.pending.test.tsx:11:0
  7  |  const __vi_import_2__ = await import("../SessionCell");
  8  |  const __vi_import_3__ = await import("../TimetableContext");
  9  |  const __vi_import_4__ = await import("../../../../../auth/contexts/AuthContext");
     |                                       ^
  10 |
  11 |  import { describe, it, expect, vi } from "vitest";
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/68]⎯

 FAIL  src/features/timetabling/pages/components/timetable/tests/SessionCell.test.tsx [ src/features/timetabling/pages/components/timetable/tests/SessionCell.test.tsx ]
Error: Failed to resolve import "../../../../../../features/auth/contexts/AuthContext" from "src/features/timetabling/pages/components/timetable/tests/SessionCell.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/pages/components/timetable/tests/SessionCell.test.tsx:5:28
  4  |  import SessionCell from "../SessionCell";
  5  |  import TimetableContext from "../TimetableContext";
  6  |  import { AuthContext } from "../../../../../../features/auth/contexts/AuthContext";
     |                               ^
  7  |  import {
  8  |    getSessionCellBgColor,
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/68]⎯

 FAIL  src/features/timetabling/pages/components/timetable/tests/Timetable.integration.test.tsx [ src/features/timetabling/pages/components/timetable/tests/Timetable.integration.test.tsx ]
Error: Failed to resolve import "../../../../../auth/contexts/AuthContext" from "src/features/timetabling/pages/components/timetable/tests/Timetable.integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/pages/components/timetable/tests/Timetable.integration.test.tsx:7:0
  7  |  const __vi_import_4__ = await import("react-dnd-html5-backend");
  8  |  const __vi_import_5__ = await import("../index");
  9  |  const __vi_import_6__ = await import("../../../../../auth/contexts/AuthContext");
     |                                       ^
  10 |  const __vi_import_7__ = await import("../TimetableContext");
  11 |  const __vi_import_8__ = await import("../../../../../scheduleConfig/hooks/useScheduleConfig");
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/68]⎯

 FAIL  src/features/timetabling/pages/components/timetable/tests/TimetableRow.test.tsx [ src/features/timetabling/pages/components/timetable/tests/TimetableRow.test.tsx ]
Error: Failed to resolve import "../../../../../auth/contexts/AuthProvider" from "src/features/timetabling/pages/components/timetable/tests/TimetableRow.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Users/User/Documents/Personal Documents/Code Base/React (Web)/ClassFlow-nomad/src/features/timetabling/pages/components/timetable/tests/TimetableRow.test.tsx:7:29
  6  |  import TimetableRow from "../TimetableRow";
  7  |  import TimetableContext from "../TimetableContext";
  8  |  import { AuthProvider } from "../../../../../auth/contexts/AuthProvider";
     |                                ^
  9  |  const MOCK_USER_ID = "user1";
  10 |  const MOCK_CREATED_AT = (/* @__PURE__ */ new Date()).toISOString();
 ❯ TransformPluginContext._formatLog ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42528:41
 ❯ TransformPluginContext.error ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42525:16
 ❯ normalizeUrl ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40504:23
 ❯ ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40623:37
 ❯ TransformPluginContext.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:40550:7
 ❯ EnvironmentPluginContainer.transform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:42323:18
 ❯ loadAndTransform ../../../../Personal%20Documents/Code%20Base/React%20(Web)/ClassFlow-nomad/node_modules/vite/dist/node/chunks/dep-D4NMHUTW.js:35739:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/68]⎯


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 33 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/68]⎯

 FAIL  src/components/tests/SyncIndicator.integration.test.tsx > SyncIndicator Integration Tests > Performance > should not cause unnecessary re-renders
AssertionError: expected "spy" to be called at least once
 ❯ src/components/tests/SyncIndicator.integration.test.tsx:201:33
    199|
    200|       expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
    201|       expect(mockUseIsFetching).toHaveBeenCalled();
       |                                 ^
    202|     });
    203|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/68]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should fetch class sessions for program
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:82:46
     80|
     81|   it('should fetch class sessions for program', async () => {
     82|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
     83|
     84|     const { result } = renderHook(() => useManageClassSessions(), {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/68]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should add a new class session
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:105:46
    103|     };
    104|
    105|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
    106|     mockedService.createClassSession.mockResolvedValue({ id: 'session2', ...newSession }…
    107|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/68]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should update an existing class session
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:128:46
    126|     };
    127|
    128|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
    129|     mockedService.updateClassSession.mockResolvedValue({ ...mockClassSessions[0], ...upd…
    130|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/68]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should remove a class session
TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:147:46
    145|
    146|   it('should remove a class session', async () => {
    147|     mockedService.getClassSessionsForProgram.mockResolvedValue(mockClassSessions);
       |                                              ^
    148|     mockedService.deleteClassSession.mockResolvedValue(undefined);
    149|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/68]⎯

 FAIL  src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx > useManageClassSessions Hook > should handle fetch errors
TypeError: Cannot read properties of undefined (reading 'mockRejectedValue')
 ❯ src/features/program-head/manage-class-sessions/tests/hook.integration.test.tsx:167:46
    165|   it('should handle fetch errors', async () => {
    166|     const error = new Error('Failed to fetch sessions');
    167|     mockedService.getClassSessionsForProgram.mockRejectedValue(error);
       |                                              ^
    168|
    169|     const { result } = renderHook(() => useManageClassSessions(), {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/68]⎯

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

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/68]⎯

 FAIL  src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx > ClassGroupManagement Component > should render the component
Error: Cannot find module '@/features/classSessionComponents/hooks/useClassGroups'
Require stack:
- C:\Users\User\Documents\Personal Documents\Code Base\React (Web)\ClassFlow-nomad\src\features\program-head\manage-components\tests\class-groups-component.integration.test.tsx
 ❯ src/features/program-head/manage-components/tests/class-groups-component.integration.test.tsx:66:32
     64| describe('ClassGroupManagement Component', () => {
     65|   it('should render the component', () => {
     66|     const { useClassGroups } = require('@/features/classSessionComponents/hooks/useClass…
       |                                ^
     67|     useClassGroups.mockReturnValue({
     68|       classGroups: mockClassGroups,

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/68]⎯

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

 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx:107:45
    105|       result.current.initiateCrossDeptRequest(payload);
    106|
    107|       expect(result.current.pendingRequest).toEqual(payload);
       |                                             ^
    108|     });
    109|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/68]⎯

 FAIL  src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx > useRequestCrossDeptResource > cancelRequest > should clear pending request
AssertionError: expected null not to be null
 ❯ src/features/program-head/request-cross-dept-resource/tests/hook.integration.test.tsx:123:49
    121|
    122|       result.current.initiateCrossDeptRequest(payload);
    123|       expect(result.current.pendingRequest).not.toBeNull();
       |                                                 ^
    124|
    125|       result.current.cancelRequest();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/68]⎯


 Test Files  42 failed | 69 passed (111)
      Tests  33 failed | 505 passed (538)
   Start at  12:20:12
   Duration  131.82s (transform 42.77s, setup 189.79s, collect 173.51s, tests 32.13s, environment 642.38s, prepare 125.68s)
```
