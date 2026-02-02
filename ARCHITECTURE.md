# 🏗️ TaskFlow Backend Architecture Guide

## 📚 Table of Contents
1. [NestJS Core Concepts](#nestjs-core-concepts)
2. [System Architecture Overview](#system-architecture-overview)
3. [Module-by-Module Breakdown](#module-by-module-breakdown)
4. [Request Flow Examples](#request-flow-examples)
5. [Database Architecture](#database-architecture)
6. [Real-time Communication](#real-time-communication)

---

## 🎯 NestJS Core Concepts

### What is NestJS?
NestJS is a progressive Node.js framework for building efficient, scalable server-side applications. It uses TypeScript and follows the **Modular Architecture** pattern.

### Core Building Blocks

#### 1️⃣ **Module** (`@Module()`)
- **What**: A container for organizing related code
- **Purpose**: Groups Controllers, Services, and other providers
- **Example**: `AuthModule`, `TasksModule`, `UsersModule`
- **Think of it as**: A department in a company

```typescript
@Module({
  imports: [OtherModules],      // Dependencies from other modules
  controllers: [MyController],  // HTTP request handlers
  providers: [MyService],       // Business logic & utilities
  exports: [MyService],         // What this module shares with others
})
export class MyModule {}
```

#### 2️⃣ **Controller** (`@Controller()`)
- **What**: Handles incoming HTTP requests
- **Purpose**: Routes URLs to specific methods
- **Example**: `TasksController` handles `/api/tasks/*` routes
- **Think of it as**: A receptionist who directs requests

```typescript
@Controller('tasks')               // Base route: /api/tasks
export class TasksController {
  @Get()                          // GET /api/tasks
  getAllTasks() { ... }
  
  @Post()                         // POST /api/tasks
  createTask(@Body() data) { ... }
  
  @Get(':id')                     // GET /api/tasks/:id
  getTaskById(@Param('id') id) { ... }
}
```

#### 3️⃣ **Service** (`@Injectable()`)
- **What**: Contains business logic
- **Purpose**: Performs actual work (DB queries, calculations, etc.)
- **Example**: `TasksService` has methods to create/read/update/delete tasks
- **Think of it as**: The actual worker who does the job

```typescript
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}
  
  async create(taskData) {
    return this.tasksRepository.save(taskData);
  }
}
```

#### 4️⃣ **Guard** (`@UseGuards()`)
- **What**: Determines if a request can proceed
- **Purpose**: Authentication, authorization, validation
- **Example**: `JwtAuthGuard` checks if user is logged in
- **Think of it as**: A security guard at the door

```typescript
@UseGuards(JwtAuthGuard)  // Must be logged in
@Get('profile')
getProfile(@Request() req) {
  return req.user;  // User info added by guard
}
```

#### 5️⃣ **Gateway** (`@WebSocketGateway()`)
- **What**: Handles WebSocket connections
- **Purpose**: Real-time bidirectional communication
- **Example**: `TasksGateway` broadcasts task updates
- **Think of it as**: A live announcer who broadcasts updates

#### 6️⃣ **Entity** (`@Entity()`)
- **What**: Defines database table structure
- **Purpose**: Maps TypeScript classes to database tables
- **Example**: `Task` entity defines the tasks table
- **Think of it as**: A blueprint for database records

---

## 🏛️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser/Mobile)                      │
└──────────────────┬─────────────────────────┬────────────────────────┘
                   │                         │
        ┌──────────▼──────────┐   ┌─────────▼──────────┐
        │   HTTP Requests     │   │  WebSocket (Live)  │
        │  (REST APIs)        │   │    Updates         │
        └──────────┬──────────┘   └─────────┬──────────┘
                   │                         │
┌──────────────────▼─────────────────────────▼────────────────────────┐
│                       NESTJS APPLICATION                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      Main.ts (Entry Point)                     │  │
│  │  - Enable CORS                                                 │  │
│  │  - Setup Swagger (API docs at /api/docs)                      │  │
│  │  - Global validation pipe                                      │  │
│  │  - Set prefix: /api                                            │  │
│  └───────────────────┬───────────────────────────────────────────┘  │
│                      │                                               │
│  ┌───────────────────▼───────────────────────────────────────────┐  │
│  │                      AppModule (Root)                          │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ TypeORM Config (PostgreSQL)                             │  │  │
│  │  │ - Host: localhost, Port: 5432                           │  │  │
│  │  │ - Database: taskflow                                    │  │  │
│  │  │ - Entities: User, Task                                  │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Cache Config (Redis)                                    │  │  │
│  │  │ - Host: localhost, Port: 6379                           │  │  │
│  │  │ - TTL: 600 seconds (10 minutes)                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Throttler (Rate Limiting)                               │  │  │
│  │  │ - 10 requests per 60 seconds                            │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────┬───────────────────────────────────────────┘  │
│                      │                                               │
│         ┌────────────┴────────────┬──────────────┬──────────────┐   │
│         │                         │              │              │   │
│  ┌──────▼───────┐  ┌─────────────▼──┐  ┌───────▼──────┐  ┌────▼────┐
│  │ AuthModule   │  │  TasksModule   │  │ UsersModule  │  │Analytics│
│  │              │  │                │  │              │  │ Module  │
│  └──────────────┘  └────────────────┘  └──────────────┘  └─────────┘
└─────────────────────────────────────────────────────────────────────┘
                      │                         │
        ┌─────────────▼──────────┐   ┌─────────▼──────────┐
        │   PostgreSQL           │   │      Redis         │
        │   (Data Storage)       │   │   (Cache Layer)    │
        └────────────────────────┘   └────────────────────┘
```

---

## 📦 Module-by-Module Breakdown

### 1. **AuthModule** - User Authentication

```
AuthModule
├── AuthController                    HTTP Endpoints
│   ├── POST /api/auth/register      → Register new user
│   ├── POST /api/auth/login         → Login & get JWT token
│   └── GET  /api/auth/profile       → Get current user (protected)
│
├── AuthService                       Business Logic
│   ├── register()                   → Hash password, create user
│   ├── login()                      → Validate credentials, sign JWT
│   └── validateUserByCredentials()  → Check email/password
│
├── JwtStrategy                       JWT Validation
│   └── validate()                   → Decode JWT, fetch user from DB
│
├── JwtAuthGuard                      Protection
│   └── Checks if valid JWT token exists
│
└── DTOs (Data Transfer Objects)
    ├── RegisterDto                  → Validation for registration
    └── LoginDto                     → Validation for login
```

**How it works:**
1. User sends email + password to `/api/auth/register`
2. `AuthController.register()` receives request
3. Calls `AuthService.register()`
4. Service hashes password with bcrypt
5. Saves user to database via `UsersService`
6. Returns JWT token
7. Client uses token in `Authorization: Bearer <token>` header for protected routes

---

### 2. **TasksModule** - Task Management

```
TasksModule
├── TasksController                        HTTP Endpoints
│   ├── POST   /api/tasks                 → Create task
│   ├── GET    /api/tasks                 → Get all user's tasks
│   ├── GET    /api/tasks/:id             → Get single task
│   ├── PUT    /api/tasks/:id             → Update task
│   ├── PATCH  /api/tasks/:id/complete    → Toggle completion
│   └── DELETE /api/tasks/:id             → Delete task
│
├── TasksService                           Business Logic
│   ├── create()                          → Save task to DB
│   ├── findAllByUser()                   → Fetch tasks (with cache)
│   ├── findOne()                         → Get single task
│   ├── update()                          → Update task
│   ├── remove()                          → Delete task
│   ├── toggleComplete()                  → Toggle task status
│   ├── getTaskStats()                    → Get statistics
│   └── invalidateCache()                 → Clear Redis cache
│
├── TasksGateway                           WebSocket Server
│   ├── notifyTaskCreated()               → Broadcast to all clients
│   ├── notifyTaskUpdated()               → Broadcast updates
│   └── notifyTaskDeleted()               → Broadcast deletions
│
├── Task Entity                            Database Model
│   ├── id: uuid
│   ├── title: string
│   ├── description: string
│   ├── status: TODO|IN_PROGRESS|DONE
│   ├── completed: boolean
│   ├── priority: LOW|MEDIUM|HIGH
│   ├── createdAt: Date
│   └── user: User (relationship)
│
└── DTOs
    ├── CreateTaskDto                     → Validation for creating
    └── UpdateTaskDto                     → Validation for updating
```

**How it works with Redis Caching:**
1. User requests tasks: `GET /api/tasks`
2. `TasksService.findAllByUser()` checks Redis cache
3. If cached → return immediately (fast!)
4. If not cached → fetch from PostgreSQL
5. Store result in Redis for 10 minutes
6. When user creates/updates/deletes task:
   - Save to database
   - Clear cache (invalidate)
   - Broadcast via WebSocket
7. Next request will fetch fresh data

---

### 3. **UsersModule** - User Management

```
UsersModule
├── UsersService                          Business Logic
│   ├── create()                         → Create new user
│   ├── findByEmail()                    → Find user by email
│   └── findById()                       → Find user by ID
│
└── User Entity                           Database Model
    ├── id: uuid
    ├── email: string (unique)
    ├── password: string (hashed)
    ├── fullName: string
    ├── tasks: Task[] (relationship)
    ├── createdAt: Date
    └── updatedAt: Date
```

**Note:** This module has no controller - it's only used internally by other modules (AuthModule, TasksModule)

---

### 4. **AnalyticsModule** - Statistics

```
AnalyticsModule
├── AnalyticsController                   HTTP Endpoints
│   └── GET /api/analytics/stats         → Get task statistics
│
└── AnalyticsService                      Business Logic
    └── getStats()                       → Calls TasksService.getTaskStats()
```

**Returns:**
```json
{
  "total": 10,
  "completed": 6,
  "pending": 4
}
```

---

## 🔄 Request Flow Examples

### Example 1: User Registration

```
┌─────────┐   1. POST /api/auth/register              ┌──────────────┐
│ Client  │──────────────────────────────────────────▶│ NestJS App   │
└─────────┘   { email, password, fullName }           └──────┬───────┘
                                                              │
                                    2. Route to AuthController.register()
                                                              │
                                    ┌─────────────────────────▼─────────┐
                                    │ AuthController                    │
                                    │   @Post('register')               │
                                    │   register(@Body() dto) {         │
                                    │     return authService.register() │
                                    │   }                               │
                                    └─────────────┬─────────────────────┘
                                                  │
                                    3. Call AuthService
                                                  │
                                    ┌─────────────▼─────────────────────┐
                                    │ AuthService                       │
                                    │   1. Check if email exists        │
                                    │   2. Hash password (bcrypt)       │
                                    │   3. Call usersService.create()   │
                                    └─────────────┬─────────────────────┘
                                                  │
                                    4. Save to DB
                                                  │
                                    ┌─────────────▼─────────────────────┐
                                    │ UsersService                      │
                                    │   usersRepository.save(user)      │
                                    └─────────────┬─────────────────────┘
                                                  │
                                    ┌─────────────▼─────────────────────┐
                                    │ PostgreSQL                        │
                                    │   INSERT INTO users ...           │
                                    └─────────────┬─────────────────────┘
                                                  │
                                    5. Generate JWT token
                                                  │
                                    ┌─────────────▼─────────────────────┐
                                    │ JwtService                        │
                                    │   sign({ email, sub: userId })    │
                                    └─────────────┬─────────────────────┘
                                                  │
                                    6. Return response
                                                  │
┌─────────┐   { access_token, user }              ▼
│ Client  │◀──────────────────────────────────────────
└─────────┘
```

---

### Example 2: Creating a Task (with Real-time Update)

```
┌──────────┐  1. POST /api/tasks                  ┌──────────────┐
│ Client A │─────────────────────────────────────▶│ NestJS       │
└──────────┘  Authorization: Bearer <JWT>         └──────┬───────┘
              { title: "New Task" }                      │
                                                          │
                          2. JwtAuthGuard checks token    │
                                                          │
                          ┌─────────────────────────────▼─┐
                          │ JwtAuthGuard                  │
                          │   - Decode JWT                │
                          │   - Fetch user from DB        │
                          │   - Attach to req.user        │
                          └─────────────┬─────────────────┘
                                        │
                          3. Route to TasksController
                                        │
                          ┌─────────────▼─────────────────┐
                          │ TasksController               │
                          │   create(@Body() dto,         │
                          │          @Request() req) {    │
                          │     return tasksService       │
                          │       .create(dto, req.user.id)
                          │   }                           │
                          └─────────────┬─────────────────┘
                                        │
                          4. Call TasksService
                                        │
                          ┌─────────────▼─────────────────┐
                          │ TasksService                  │
                          │   1. Create task entity       │
                          │   2. Save to PostgreSQL       │
                          │   3. Invalidate Redis cache   │
                          │   4. Notify via WebSocket     │
                          └───────┬───────────────┬───────┘
                                  │               │
                   5. Save        │               │ 6. Broadcast
                                  │               │
              ┌───────────────────▼┐             ┌▼──────────────────┐
              │ PostgreSQL          │             │ TasksGateway      │
              │ INSERT INTO tasks...│             │ server.emit(      │
              └─────────────────────┘             │   'taskCreated',  │
                                                  │   task            │
                                                  │ )                 │
                                                  └┬──────────────────┘
                                                   │
                          7. All connected clients receive update
                                                   │
              ┌────────────┬──────────────────────┴─────────────────┐
              │            │                                         │
    ┌─────────▼──┐  ┌─────▼──────┐                        ┌────────▼──┐
    │ Client A   │  │ Client B   │                        │ Client C  │
    │ (Creator)  │  │ (Viewer)   │    ← WebSocket →      │ (Viewer)  │
    └────────────┘  └────────────┘                        └───────────┘
       Gets new        Sees new                              Sees new
       task in         task appear                          task appear
       response        real-time!                           real-time!
```

---

## 🗄️ Database Architecture

### Entity Relationships

```
┌─────────────────────────────┐
│         User                │
├─────────────────────────────┤
│ 🔑 id: UUID                 │
│    email: string            │
│    password: string (hash)  │
│    fullName: string         │
│    createdAt: Date          │
│    updatedAt: Date          │
└────────────┬────────────────┘
             │
             │ One-to-Many
             │ (One user has many tasks)
             │
             ▼
┌─────────────────────────────┐
│         Task                │
├─────────────────────────────┤
│ 🔑 id: UUID                 │
│    title: string            │
│    description: string?     │
│    status: enum             │
│    completed: boolean       │
│    priority: enum?          │
│    createdAt: Date          │
│ 🔗 user: User               │  ← Foreign Key
└─────────────────────────────┘
```

### TypeORM Queries Examples

```typescript
// Find all tasks for a user
await tasksRepository.find({
  where: { user: { id: userId } },
  order: { createdAt: 'DESC' }
});

// Count completed tasks
await tasksRepository.count({
  where: { 
    user: { id: userId },
    status: 'DONE'
  }
});

// Update a task
const task = await tasksRepository.findOne({ where: { id } });
task.completed = true;
await tasksRepository.save(task);

// Delete a task
await tasksRepository.delete({ id });
```

---

## 🔐 Security & Performance Features

### 1. **JWT Authentication**
```
Login Flow:
User credentials → AuthService → JwtService.sign() → Token
                                    ↓
                            { email: "user@example.com",
                              sub: "user-uuid-123",
                              iat: 1234567890,
                              exp: 1234654290 }

Protected Route:
Request + Token → JwtAuthGuard → JwtStrategy.validate()
                                    ↓
                              Fetch user from DB
                                    ↓
                              Attach to request.user
                                    ↓
                              Allow access
```

### 2. **Redis Caching**
```
Request Cycle:

GET /api/tasks
    ↓
Check Redis: tasks_user_{userId}
    ↓
┌───────────────┬────────────────┐
│ Cache HIT     │  Cache MISS    │
│ (Found in     │  (Not in       │
│  Redis)       │   Redis)       │
├───────────────┼────────────────┤
│ Return cached │ Query DB       │
│ data          │     ↓          │
│ (Fast: ~2ms)  │ Store in Redis │
│               │     ↓          │
│               │ Return data    │
│               │ (Slower: 50ms) │
└───────────────┴────────────────┘

After Create/Update/Delete:
    ↓
Delete cache key
    ↓
Next request fetches fresh data
```

### 3. **Rate Limiting (Throttler)**
```
Client makes requests:
1st request  ✅ (1/10)
2nd request  ✅ (2/10)
...
10th request ✅ (10/10)
11th request ❌ (429 Too Many Requests)

Wait 60 seconds → Counter resets
```

### 4. **Input Validation**
```typescript
// CreateTaskDto
class CreateTaskDto {
  @IsNotEmpty()          // Must not be empty
  title: string;
  
  @IsOptional()          // Can be omitted
  description?: string;
  
  @IsEnum(['TODO', 'IN_PROGRESS', 'DONE'])  // Must be one of these
  status?: string;
}

// If validation fails → 400 Bad Request automatically
```

---

## 🌐 Real-time Communication (WebSocket)

```
┌─────────────────────────────────────────────────────────────┐
│                    TasksGateway                             │
│  @WebSocketGateway({ cors: true })                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Events Server Emits:                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 'taskCreated'  → { id, title, ... }                   │ │
│  │ 'taskUpdated'  → { id, title, completed, ... }        │ │
│  │ 'taskDeleted'  → taskId                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Connection Events:                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ handleConnection(client)  → Log connection            │ │
│  │ handleDisconnect(client)  → Log disconnection         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Broadcasting
                         ▼
    ┌─────────────────────────────────────────────┐
    │          All Connected Clients              │
    ├──────────┬──────────┬──────────┬────────────┤
    │ Browser 1│ Browser 2│ React App│ Mobile App │
    └──────────┴──────────┴──────────┴────────────┘
       All receive the same update in real-time!
```

**Frontend will connect:**
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('taskCreated', (newTask) => {
  // Add to task list
  setTasks(prev => [newTask, ...prev]);
});

socket.on('taskUpdated', (updatedTask) => {
  // Update in list
  setTasks(prev => prev.map(t => 
    t.id === updatedTask.id ? updatedTask : t
  ));
});

socket.on('taskDeleted', (taskId) => {
  // Remove from list
  setTasks(prev => prev.filter(t => t.id !== taskId));
});
```

---

## 📊 Complete Data Flow Example

**Scenario:** User A creates a task, User B sees it instantly

```
Step 1: User A submits form
    ↓
Step 2: POST /api/tasks with JWT token
    ↓
Step 3: JwtAuthGuard validates token
    ↓
Step 4: TasksController.create() receives request
    ↓
Step 5: TasksService.create() is called
    ↓
Step 6: Task saved to PostgreSQL
    ↓
Step 7: Redis cache invalidated
    ↓
Step 8: TasksGateway.notifyTaskCreated() broadcasts
    ↓
Step 9a: User A receives HTTP response with new task
Step 9b: User B receives WebSocket event with new task
    ↓
Step 10: Both users see the task immediately!
```

---

## 🛡️ Key Design Patterns Used

### 1. **Dependency Injection**
```typescript
// Instead of:
class TasksService {
  private repo = new TasksRepository();  // ❌ Tightly coupled
}

// NestJS does:
class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>  // ✅ Injected, testable
  ) {}
}
```

### 2. **Repository Pattern**
```typescript
// Abstract away database operations
tasksRepository.find()
tasksRepository.save()
tasksRepository.delete()

// Can easily switch databases without changing service code
```

### 3. **DTO Pattern**
```typescript
// Separate data structure from entity
CreateTaskDto  → What client sends
Task Entity    → How we store in DB
ResponseDto    → What we send back (optional)
```

### 4. **Guard Pattern**
```typescript
// Reusable authentication logic
@UseGuards(JwtAuthGuard)
// Applied to any route that needs protection
```

---

## 🎓 Summary

**Your TaskFlow backend has:**

1. ✅ **4 Modules**: Auth, Tasks, Users, Analytics
2. ✅ **4 Controllers**: Handle HTTP requests
3. ✅ **5 Services**: Business logic
4. ✅ **2 Entities**: User, Task (database tables)
5. ✅ **1 Gateway**: WebSocket for real-time updates
6. ✅ **1 Guard**: JWT authentication
7. ✅ **1 Strategy**: JWT validation
8. ✅ **Multiple DTOs**: Input validation
9. ✅ **PostgreSQL**: Main database
10. ✅ **Redis**: Caching layer
11. ✅ **Swagger**: Auto-generated API docs

**Request Journey:**
```
Client → Controller → Guard → Service → Repository → Database
                                  ↓
                              Gateway → All Clients (WebSocket)
```

**This architecture gives you:**
- 🔒 Secure authentication
- ⚡ Fast responses (Redis cache)
- 🔄 Real-time updates (WebSocket)
- 📝 Clean, maintainable code (modular design)
- 🛡️ Input validation
- 🚦 Rate limiting
- 📚 Auto-generated API documentation

---

## 📖 Next Steps to Learn More

1. **Try the API**: Open `http://localhost:3000/api/docs` (Swagger UI)
2. **Read a file**: Start with `src/main.ts` to see the entry point
3. **Follow a flow**: Trace `POST /api/auth/register` from controller → service → database
4. **Modify something**: Add a new field to Task entity and see what happens
5. **NestJS Docs**: https://docs.nestjs.com/

**Remember:** Start small, experiment, and don't be afraid to break things in development!
