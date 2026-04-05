# Finance Data Processing & Access Control — Implementation Plan

## Current State Analysis

The project has a basic scaffold but many critical gaps:

| Area | Status | Issues |
|------|--------|--------|
| Authentication | ❌ Hardcoded tokens | `ADMIN_TOKEN`/`VIEWER_TOKEN` string comparison, no JWT |
| Access Control | ❌ Not enforced | `checkAccess()` exists but is **never called** |
| Role Model | ⚠️ String-based | No enum, no ANALYST role, no Spring Security |
| User Management | ⚠️ Partial | No validation, no login by credentials, no status toggle |
| Financial CRUD | ✅ Basic | Works but no access control on endpoints |
| Dashboard APIs | ⚠️ Partial | Missing `/summary` (income/expense/balance), has category + monthly |
| Validation | ⚠️ Partial | FinancialRecord has validation; User has none |
| Error Handling | ✅ Basic | GlobalExceptionHandler exists but needs structured responses |
| Frontend | ❌ Minimal | No routing, no premium UI, no role-based views |
| Junk Files | ❌ Present | 4 stub/duplicate files in wrong packages |

### Junk Files to Delete
- `service/Autowired.java` — empty custom annotation shadowing Spring's
- `service/FinancialRecord.java` — stub class conflicting with model entity
- `service/FinancialRecordRepository.java` — stub class conflicting with repository interface
- `model/Positive.java` — custom annotation shadowing Jakarta's `@Positive`

---

## User Review Required

> [!IMPORTANT]
> **Database**: The project uses MySQL (`finance_db` on localhost:3306, user=root, pass=root). I will keep this configuration. Make sure MySQL is running with this database created before testing.

> [!IMPORTANT]
> **Authentication approach**: I'll implement JWT-based stateless authentication with `spring-boot-starter-security` + `jjwt` library. Login will be email + password (BCrypt hashed). A default admin user will be seeded on startup.

> [!IMPORTANT]
> **Frontend routing**: I'll add `react-router-dom` for multi-page navigation (Login, Dashboard, Records, Users pages) with role-based route guards.

---

## Proposed Changes

### Backend — Cleanup & Dependencies

#### [DELETE] [Autowired.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/service/Autowired.java)
#### [DELETE] [FinancialRecord.java (service)](file:///d:/financeproject/backend/src/main/java/com/example/finance/service/FinancialRecord.java)
#### [DELETE] [FinancialRecordRepository.java (service)](file:///d:/financeproject/backend/src/main/java/com/example/finance/service/FinancialRecordRepository.java)
#### [DELETE] [Positive.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/model/Positive.java)

#### [MODIFY] [pom.xml](file:///d:/financeproject/backend/pom.xml)
Add dependencies:
- `spring-boot-starter-security` — for authentication & authorization
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (0.12.x) — for JWT token generation/validation
- `springdoc-openapi-starter-webmvc-ui` — for Swagger API docs

---

### Backend — Data Model

#### [MODIFY] [User.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/model/User.java)
- Add `password` field (BCrypt hashed)
- Change `role` from `String` to `@Enumerated Role` enum
- Add `@Column(unique=true)` on email
- Add `createdAt`, `updatedAt` timestamps
- Add Jakarta validation annotations (`@NotBlank`, `@Email`)
- Use Lombok `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`

#### [NEW] [Role.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/model/Role.java)
Enum: `VIEWER`, `ANALYST`, `ADMIN`

#### [MODIFY] [FinancialRecord.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/model/FinancialRecord.java)
- Add `@Enumerated TransactionType type` (INCOME/EXPENSE) instead of String
- Add `userId` field (who created it)
- Add `deleted` boolean for soft delete
- Add `createdAt`, `updatedAt` timestamps
- Use Lombok

#### [NEW] [TransactionType.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/model/TransactionType.java)
Enum: `INCOME`, `EXPENSE`

---

### Backend — DTOs

#### [NEW] `dto/` package with:
- `LoginRequest.java` — email, password
- `LoginResponse.java` — token, user details, role
- `RegisterRequest.java` — name, email, password, role
- `UserDTO.java` — response DTO (no password exposed)
- `FinancialRecordDTO.java` — request/response DTO
- `DashboardSummaryDTO.java` — income, expense, balance, recentActivity, categoryTotals, monthlyTrends
- `ApiErrorResponse.java` — structured error response (timestamp, status, message, details)

---

### Backend — Security & JWT

#### [NEW] `security/JwtTokenProvider.java`
- Generate JWT with user id, email, role as claims
- Validate and parse tokens
- Configurable expiration (24h default)

#### [NEW] `security/JwtAuthenticationFilter.java`
- OncePerRequestFilter that extracts JWT from `Authorization: Bearer <token>` header
- Sets SecurityContext authentication

#### [NEW] `security/CustomUserDetailsService.java`
- Implements UserDetailsService, loads user from DB by email

#### [NEW] `config/SecurityConfig.java`
- SecurityFilterChain bean
- Permit `/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`
- All other endpoints require authentication
- CORS configuration for React frontend (port 3000)
- Stateless session management

#### [NEW] `config/CorsConfig.java`
- Global CORS configuration (allows localhost:3000)

---

### Backend — Controllers (Rewrite)

#### [NEW] `controller/AuthController.java`
- `POST /api/auth/register` — register user (Admin only after first user)
- `POST /api/auth/login` — authenticate and return JWT + user info

#### [MODIFY] [UserController.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/controller/UserController.java)
- `GET /api/users` — list all users (Admin only)
- `GET /api/users/{id}` — get user by id (Admin only)
- `PUT /api/users/{id}` — update user (Admin only)
- `PUT /api/users/{id}/status` — toggle active/inactive (Admin only)
- `DELETE /api/users/{id}` — deactivate user (Admin only)
- All endpoints enforce role via `@PreAuthorize("hasRole('ADMIN')")`

#### [MODIFY] [FinanceController.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/controller/FinanceController.java)
- `POST /api/finance` — create record (Admin only)
- `GET /api/finance` — list records with pagination + filters (All authenticated)
- `GET /api/finance/{id}` — get single record (All authenticated)
- `PUT /api/finance/{id}` — update record (Admin only)
- `DELETE /api/finance/{id}` — soft delete (Admin only)
- `GET /api/finance/filter` — filter by type, category, date range (All authenticated)
- `GET /api/finance/search` — search by description/category keyword (All authenticated)

#### [NEW] `controller/DashboardController.java`
- `GET /api/dashboard/summary` — total income, expense, net balance (Analyst + Admin)
- `GET /api/dashboard/category-summary` — category-wise totals (Analyst + Admin)
- `GET /api/dashboard/monthly-trends` — monthly income/expense breakdown (Analyst + Admin)
- `GET /api/dashboard/recent` — last 10 transactions (All authenticated)

---

### Backend — Services (Rewrite)

#### [MODIFY] [UserService.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/service/UserService.java)
- Full CRUD with role/status management
- Password encoding with BCryptPasswordEncoder
- Duplicate email check
- find by email

#### [MODIFY] [FinancialService.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/service/FinancialService.java)
- CRUD with soft delete support (filter out deleted=true by default)
- Advanced filtering (type + category + date range combined)
- Search by keyword
- Pagination with sorting

#### [NEW] `service/DashboardService.java`
- `getSummary()` — aggregate income, expense, net balance
- `getCategorySummary()` — group by category with income/expense split
- `getMonthlyTrends()` — 12-month rolling trends with income vs expense
- `getRecentTransactions()` — latest 10 records

---

### Backend — Repository

#### [MODIFY] [UserRepository.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/repository/UserRepository.java)
- Add `findByEmail(String email)` 
- Add `existsByEmail(String email)`

#### [MODIFY] [FinancialRecordRepository.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/repository/FinancialRecordRepository.java)
- Add queries for soft-delete-aware operations
- Add `@Query` for aggregation (sum by type, group by category, group by month)
- Support combined filtering

---

### Backend — Exception Handling

#### [MODIFY] [GlobalExceptionHandler.java](file:///d:/financeproject/backend/src/main/java/com/example/finance/exception/GlobalExceptionHandler.java)
- Return structured `ApiErrorResponse` JSON
- Handle `AccessDeniedException` (403)
- Handle `AuthenticationException` (401)
- Handle `ResourceNotFoundException` (404)
- Handle `DuplicateResourceException` (409)

#### [NEW] `exception/ResourceNotFoundException.java`
#### [NEW] `exception/DuplicateResourceException.java`
#### [NEW] `exception/UnauthorizedException.java`

---

### Backend — Data Seeder

#### [NEW] `config/DataSeeder.java`
- `CommandLineRunner` that creates a default Admin user on first startup:
  - Email: `admin@finance.com`, Password: `admin123`, Role: `ADMIN`
- Creates sample ANALYST and VIEWER users
- Seeds 15-20 sample financial records across different categories and months

---

### Backend — Application Config

#### [MODIFY] [application.properties](file:///d:/financeproject/backend/src/main/resources/application.properties)
- Add JWT secret key and expiration config
- Add Swagger/OpenAPI config
- Add logging configuration

---

### Frontend — Dependencies

#### [MODIFY] [package.json](file:///d:/financeproject/frontend/package.json)
Add:
- `react-router-dom` — routing
- `lucide-react` — modern icons
- `react-toastify` — toast notifications

---

### Frontend — Complete UI Redesign

The frontend will be completely redesigned with a **premium dark theme** featuring:
- Glassmorphism cards with subtle backdrop blur
- Smooth gradient accents (violet → cyan palette)
- Micro-animations on hover/transitions
- Responsive sidebar navigation
- Google Fonts (Inter)

#### [MODIFY] [index.css](file:///d:/financeproject/frontend/src/index.css)
Complete design system with CSS variables, global styles, dark theme

#### [MODIFY] [App.js](file:///d:/financeproject/frontend/src/App.js)
- React Router setup with protected routes
- Auth context provider
- Role-based route guards

#### [NEW] `context/AuthContext.js`
- Auth state management (user, token, role)
- Login/logout functions
- Token persistence in localStorage

#### [NEW] `components/ProtectedRoute.js`
- Route guard checking authentication and role

#### [NEW] `components/Sidebar.js`
- Navigation sidebar with role-based menu items
- Active route highlighting

#### [NEW] `components/Layout.js`
- Main layout wrapper with sidebar + content area

#### [MODIFY] `components/Login.js` → [NEW] `pages/LoginPage.js`
- Premium login page with gradient background
- Email + password form with validation
- Error handling with toasts

#### [NEW] `pages/DashboardPage.js`
- Summary cards (income, expense, balance) with animated counters
- Category breakdown pie/donut chart (recharts)
- Monthly trends bar chart (recharts)
- Recent transactions list

#### [NEW] `pages/RecordsPage.js`
- Filterable/searchable records table
- Add/edit record modal
- Delete with confirmation
- Pagination controls
- Role-based action buttons (hidden for viewers)

#### [NEW] `pages/UsersPage.js` (Admin only)
- User management table
- Add user modal
- Toggle active/inactive status
- Role assignment

#### [MODIFY] `services/api.js`
- Complete API service with axios interceptors
- Auto-attach JWT token
- Handle 401 responses (auto-logout)
- All endpoint functions

---

## Access Control Matrix

| Action | VIEWER | ANALYST | ADMIN |
|--------|--------|---------|-------|
| View dashboard summary | ✅ | ✅ | ✅ |
| View records list | ✅ | ✅ | ✅ |
| View analytics/insights | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Open Questions

> [!IMPORTANT]
> 1. **Do you have MySQL running** with the `finance_db` database created? The app is configured for `localhost:3306` with `root/root` credentials.
> 2. **Java 17**: Do you have JDK 17 installed and configured? The project targets Java 17.
> 3. **Should I keep the port at 8083** for the backend, or change to standard 8080?

---

## Verification Plan

### Automated Tests
1. Build the Spring Boot backend: `./mvnw clean compile` — ensures no compilation errors
2. Start the backend and verify Swagger UI at `http://localhost:8083/swagger-ui.html`
3. Test API endpoints via the browser subagent:
   - Register/Login flow
   - CRUD operations with different roles
   - Access denied scenarios
4. Start the React frontend: `npm start` and verify the UI renders

### Manual Verification
- Test complete login → dashboard → records → users flow in the browser
- Verify role-based access control (login as viewer, analyst, admin separately)
- Verify charts render with seeded data
