# ERP System - Full Stack Application

A complete ERP system with React frontend and Node.js/Express backend with MySQL database.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation
- TanStack Query for data fetching

### Backend
- Node.js with TypeScript
- Express.js framework
- Prisma ORM
- MySQL database
- JWT authentication
- Zod for validation
- Helmet, CORS, rate limiting for security

## Project Structure

```
ERP/
  src/                    # Frontend source code
  server/                 # Backend source code
    src/
      controllers/        # Request handlers
      services/           # Business logic
      routes/             # API routes
      middleware/         # Express middleware
      utils/              # Utility functions
      db/                 # Database client
      index.ts            # Backend entry point
    prisma/
      schema.prisma       # Database schema
    .env                  # Backend environment variables
  public/                 # Static assets
  vite.config.ts         # Vite configuration
  package.json           # Root package.json (combined scripts)
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Configure database:**
   
   The backend `.env` file is already configured with your database credentials:
   ```
   DATABASE_URL="mysql://u998106817_root:Optimum2026@193.203.184.199:3306/u998106817_Thouraya"
   ```

4. **Run Prisma migrations:**
   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   cd ..
   ```

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

The Vite dev server automatically proxies `/api` requests to the backend.

### Production Mode

Build and start both frontend and backend:
```bash
npm run build
npm start
```

### Individual Scripts

You can also run frontend and backend separately:

**Frontend only:**
```bash
npm run dev:frontend      # Development
npm run build:frontend    # Build
npm run start:frontend    # Preview production build
```

**Backend only:**
```bash
cd server
npm run dev               # Development
npm run build             # Build
npm start                 # Start production
```

## API Endpoints

All API endpoints are prefixed with `/api` and are proxied through Vite in development.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users` - List users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Roles & Permissions

The system includes 5 roles with hierarchical permissions:

1. **super_admin** - Full access to all modules
2. **admin** - Most access except user deletion
3. **accountant** - Accounting and read access
4. **seller** - Sales and read access
5. **store_keeper** - Inventory and read access

## Database Schema

### Users Table
- UUID primary key
- Email (unique)
- Password (hashed with bcrypt)
- Role (enum)
- Soft delete support
- Timestamps

### Permission Assignments
- Role-based permissions per module
- CRUD operations (create, read, update, delete)

### Audit Logs
- Track important actions
- User ID, action, module, details
- IP address logging

## Development Notes

### API Proxy Configuration

The Vite config is set up to proxy `/api` requests to the backend:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  },
}
```

### Environment Variables

**Backend (server/.env):**
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `PORT` - Backend server port (default: 3001)
- `CORS_ORIGIN` - Frontend URL for CORS
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Making API Calls from Frontend

Use relative paths for API calls - they will be proxied automatically:
```typescript
// Correct - will be proxied to backend
fetch('/api/users')

// Incorrect - direct backend URL
fetch('http://localhost:3001/api/users')
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT authentication with configurable expiration
- CORS protection
- Rate limiting (prevents brute force attacks)
- Helmet security headers
- Input validation with Zod
- SQL injection protection via Prisma ORM
- Role-based access control (RBAC)

## Testing

```bash
npm test           # Run tests
npm run test:watch # Watch mode
```

## Building for Production

The build process creates optimized production builds:

```bash
npm run build
```

This will:
1. Build the frontend (React app)
2. Build the backend (TypeScript to JavaScript)
3. Output to `dist/` directories

Then start with:
```bash
npm start
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:
1. Verify MySQL is running
2. Check credentials in `server/.env`
3. Ensure the database exists
4. Test connection: `cd server && npm run prisma:studio`

### Port Already in Use

If port 8080 or 3001 is already in use:
- Change the port in `vite.config.ts` (frontend)
- Change the port in `server/.env` (backend)
- Update the proxy target in `vite.config.ts` accordingly

### Prisma Issues

If Prisma generates errors:
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## License

MIT
