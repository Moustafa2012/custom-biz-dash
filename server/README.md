# ERP Backend API

A production-ready backend API built with Node.js, TypeScript, Express, Prisma ORM, and MySQL.

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **RBAC**: Role-Based Access Control with 5 roles (super_admin, admin, accountant, seller, store_keeper)
- **User Management**: Full CRUD operations with pagination and filtering
- **Security**: CORS, rate limiting, helmet security headers, input validation
- **Logging**: Request/response logging with colored console output
- **Validation**: Zod schema validation for all API inputs
- **Database**: MySQL with Prisma ORM, UUID primary keys, soft delete support

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: MySQL
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit, bcrypt, jsonwebtoken

## Project Structure

```
server/
  src/
    controllers/       # Request handlers
    services/          # Business logic
    routes/            # API routes
    middleware/        # Express middleware
    utils/             # Utility functions
    db/                # Database client
    index.ts           # Application entry point
  prisma/
    schema.prisma      # Database schema
  package.json
  tsconfig.json
  .env.example
```

## Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/erp_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN="http://localhost:5173"
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Setup MySQL database:**
   - Create a MySQL database named `erp_db`
   - Update the `DATABASE_URL` in `.env` with your credentials

4. **Run Prisma migrations:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)

### Users
- `GET /api/users` - Get all users (paginated, filtered)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Soft delete user

## Roles & Permissions

### Role Hierarchy
1. **super_admin** (100) - Full access
2. **admin** (80) - Most access
3. **accountant** (60) - Accounting & read access
4. **seller** (40) - Sales & read access
5. **store_keeper** (20) - Inventory & read access

### Default Permissions

#### super_admin
- All modules: create, read, update, delete

#### admin
- users: create, read, update
- products: create, read, update, delete
- orders: create, read, update
- inventory: create, read, update, delete
- accounting: read
- reports: read

#### accountant
- users: read
- products: read
- orders: read
- inventory: read
- accounting: create, read, update
- reports: read

#### seller
- users: read
- products: read
- orders: create, read
- inventory: read
- accounting: none
- reports: read

#### store_keeper
- users: read
- products: read
- orders: read
- inventory: create, read, update
- accounting: none
- reports: read

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "seller",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Users (with authentication)
```bash
curl -X GET "http://localhost:3001/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **CORS**: Configured for frontend origin
4. **Rate Limiting**: Prevents brute force attacks
5. **Helmet**: Security headers for Express
6. **Input Validation**: Zod schema validation
7. **SQL Injection Protection**: Prisma ORM (parameterized queries)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: super_admin, admin, accountant, seller, store_keeper)
- `phone` (String, Optional)
- `avatar` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional - Soft Delete)

### Permission Assignments Table
- `id` (UUID, Primary Key)
- `role` (Enum)
- `module` (String)
- `permission` (Enum: create, read, update, delete)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Audit Logs Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `action` (String)
- `module` (String)
- `details` (String, Optional)
- `ipAddress` (String, Optional)
- `createdAt` (DateTime)

## Development Notes

- The server runs on port 3001 by default
- All API endpoints are prefixed with `/api`
- The frontend should proxy `/api` requests to `http://localhost:3001`
- Use `npm run dev` for development with hot reload
- Use `npm run build && npm start` for production

## Integration with Frontend

To integrate with the React + Vite frontend, configure the Vite proxy in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

Then in your frontend code, make requests to `/api/...` and they will be proxied to the backend.

## License

MIT
