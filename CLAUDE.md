# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aggie Events is a full-stack crowdsourced database for events and organizations at Texas A&M University. The application uses a **strict frontend/backend separation** with Next.js and Express.js, communicating via REST APIs.

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm install           # Install dependencies
npm run dev           # Start development server on port 3000
npm run build         # Build for production
npm run start         # Start production build
```

### Backend (Express.js)
```bash
cd backend
npm install           # Install dependencies
npm run clean         # Remove dist/ folder
npm run build         # Compile TypeScript to dist/
npm run watch:build   # Watch and recompile on changes
npm run watch:server  # Watch and restart server on changes
npm run start         # Run both watch:build and watch:server
```

### Docker Development Environment
```bash
./run_dev.sh          # Start PostgreSQL + PgAdmin containers
./run_prod.sh         # Deploy production containers (requires deps)
./stop.sh             # Stop all containers
```

Access PgAdmin at http://localhost:5050 when running dev environment.

### Database Management
```bash
# Regenerate database types after schema changes
cd backend
npm run gen:types     # Runs kysely-codegen to update src/database.types.ts
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, TanStack Query
- **Backend**: Express.js, TypeScript, Kysely (type-safe SQL), Passport.js (Google OAuth)
- **Database**: PostgreSQL 17
- **Infrastructure**: Docker, Traefik (reverse proxy), Cloudinary (image hosting)

### Project Structure
```
aggie-events/
├── frontend/              # Next.js application
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── api/              # API client utilities
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── database.ts   # Kysely DB instance
│   │   └── database.types.ts  # Auto-generated DB types
│   └── dist/             # Compiled JavaScript (gitignored)
├── table_create.sql      # PostgreSQL schema definition
└── compose.*.yml         # Docker configurations
```

### Frontend Path Aliases
The frontend uses TypeScript path aliases (configured in `tsconfig.json`):
- `@/app/*` → `app/*`
- `@/components/*` → `components/*`
- `@/api/*` → `api/*`
- `@/config/*` → `config/*`
- `@/utils/*` → `utils/*`

### Authentication Flow
1. Frontend opens popup to `/auth/google` endpoint on backend
2. User completes Google OAuth
3. Backend stores session using `express-session` (session-based, NOT JWT)
4. Backend redirects to `/auth-callback` page
5. Frontend receives `auth_complete` message via `postMessage` API
6. All subsequent API requests include credentials: `credentials: 'include'`
7. Backend authenticates via `req.user` (populated by Passport)

**Important**: This app uses **session-based authentication**, not JWT tokens. Sessions are managed server-side with cookies.

### Database Access Pattern
- **Kysely** provides compile-time type-safe SQL queries
- Database types are auto-generated from schema: `npm run gen:types` in backend
- Centralized `db` instance exported from `backend/src/database.ts`
- Schema defined in `table_create.sql` with triggers and enums

### API Communication
- Frontend uses custom `fetchUtil` wrapper (in `frontend/api/`)
- All requests sent with `Content-Type: application/json` and `credentials: 'include'`
- Backend exposes routes under `/api/` prefix
- TanStack Query manages caching (1-minute default stale time)

### Key API Endpoints
- `/auth/*` - Authentication (Google OAuth)
- `/api/users/*` - User management
- `/api/orgs/*` - Organization CRUD
- `/api/events/*` - Event operations
- `/api/search/*` - Search functionality
- `/api/tags/*` - Tag management
- `/api/upload/*` - File uploads (Cloudinary)

### Database Schema Highlights
**Core Tables**: `Users`, `Orgs`, `Events`, `Tags`

**Relationship Tables**: `UserOrgs` (memberships), `UserFollows`, `EventOrgs`, `EventTags`, `SavedEvents`, `UserAttendance`, `Friendships`, `Blocks`, `Reports`

**Important Enums**:
- `event_status`: draft, published, cancelled
- `membership_type`: owner, editor
- `friendship_status`: pending, accepted, rejected, blocked
- `report_status`: pending, reviewed, resolved, rejected

**Auto-triggers**:
- `update_event_modified_time()` - Updates `date_modified` on event changes
- `update_event_saves()` - Updates `event_saves` count when users save/unsave

### Environment Variables
**Backend** (`.env` in `backend/`):
- Database: `DATABASE_HOST`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_PORT`
- OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Session: `SESSION_SECRET`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- URLs: `BACKEND_URL`, `FRONTEND_URL`

**Frontend** (`.env.local` in `frontend/`):
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., http://localhost:5000/api)
- `NEXT_PUBLIC_AUTH_URL` - Auth endpoint URL
- Google OAuth credentials for client-side

### Deployment Architecture
**Production URLs**:
- Frontend: https://aggieevents.tech (port 3000 container)
- Backend API: https://api.aggieevents.tech (port 5000 container)

**Infrastructure**:
- Traefik reverse proxy handles SSL (Let's Encrypt) and routing
- PostgreSQL runs in separate container with daily backups (7-day retention)
- Images built via GitHub Actions and pushed to Docker Hub
- `compose.deps.yml` - Infrastructure (Traefik, DB, backups)
- `compose.prod.yml` - Application containers (frontend, backend)

### Docker Build Process
Both frontend and backend use **multi-stage builds**:
1. Base stage (Node 20)
2. Dependencies stage (`npm ci`)
3. Builder stage (compile TypeScript / build Next.js)
4. Runner stage (minimal production image)

Frontend uses Next.js **standalone output mode** for self-contained deployment.

## Development Workflow

### Making Database Changes
1. Modify `table_create.sql` schema
2. Apply changes to database (manually or recreate container)
3. Run `npm run gen:types` in `backend/` to regenerate TypeScript types
4. Update backend queries/routes to use new schema
5. Update frontend API calls if needed

### Adding New API Endpoints
1. Create route handler in `backend/src/routes/`
2. Import and mount route in `backend/src/index.ts`
3. Use `req.user` for authenticated endpoints (set by Passport middleware)
4. Query database using Kysely `db` instance
5. Create corresponding fetch function in `frontend/api/`
6. Use TanStack Query for data fetching in components

### Image Uploads
- Images uploaded via Cloudinary (not stored locally)
- Backend handles uploads using Multer + Cloudinary SDK
- Frontend can use `react-dropzone` and `react-image-crop` for UI
- Image URLs returned from Cloudinary for database storage

### Testing Locally
1. Start dev database: `./run_dev.sh` (root directory)
2. Start backend: `cd backend && npm run start`
3. Start frontend: `cd frontend && npm run dev`
4. Frontend runs on http://localhost:3000
5. Backend API runs on http://localhost:5000

Database accessible via PgAdmin at http://localhost:5050 (credentials in root `.env`)

## Important Notes

- **Never commit `.env` files** - they contain secrets
- **Session-based auth**: Don't implement JWT unless migrating auth system
- **Type safety**: Always regenerate database types after schema changes
- **Path aliases**: Use `@/` imports in frontend, not relative paths
- **Kysely queries**: Prefer Kysely's type-safe query builder over raw SQL
- **Production builds**: Frontend build requires `API_URL` and `AUTH_URL` build args
- **CORS**: Backend CORS configured for specific frontend origin (check `backend/src/index.ts`)
