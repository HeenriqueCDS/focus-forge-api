# FocusForge Backend

AI-powered productivity assistant backend built with Node.js, Express, Prisma, and PostgreSQL with pgvector.

## 🏗 Architecture

This project follows **Domain-Driven Design (DDD)** principles with a clean architecture approach:

```
src/
├── domain/           # Domain entities and business logic
│   ├── entities/     # Core business entities
│   ├── repositories/ # Repository interfaces
│   └── services/     # Domain services
├── application/      # Use cases and application services
│   ├── use-cases/    # Application use cases
│   └── services/     # Application services
├── infrastructure/   # Database, external services, etc.
│   ├── database/     # Database configuration
│   ├── repositories/ # Repository implementations
│   └── services/     # Infrastructure services
├── shared/           # Shared utilities and types
│   ├── config/       # Configuration
│   ├── middleware/   # Express middleware
│   ├── types/        # TypeScript types
│   └── utils/        # Utility functions
└── index.ts          # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL with pgvector extension
- Docker (optional)

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3000`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `MAX_FILE_SIZE` | Max file upload size | `10485760` (10MB) |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | `100` |

## 📚 API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Authentication (Coming Soon)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Tasks (Coming Soon)
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Categories (Coming Soon)
- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### AI Chat (Coming Soon)
- `GET /api/v1/chats` - List chats
- `POST /api/v1/chats` - Create chat
- `GET /api/v1/chats/:id` - Get chat
- `POST /api/v1/chats/:id/messages` - Send message

## 🗄 Database Schema

The application uses the following main entities:

- **User** - User accounts and authentication
- **Task** - Todo tasks with status and categories
- **Category** - Task categories with colors
- **Document** - Knowledge base documents with embeddings
- **Chat** - AI chat sessions
- **Message** - Chat messages

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Zod

## 🚀 Deployment

### Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Set `NODE_ENV=production`
2. Run `npm run build`
3. Start with `npm start`

## 🐳 Docker

### Running with Docker Compose

This project includes two Docker Compose files for different purposes:

#### Database Only
To run only the database (PostgreSQL with pgvector):
```bash
docker compose -f docker-compose.db.yml up -d
```

#### Application Only
To run only the application:
```bash
docker compose -f docker-compose.app.yml up --watch
```

#### Additional Docker Commands

**Run in background (detached mode):**
```bash
docker compose -f docker-compose.app.yml up -d
```

**Stop services:**
```bash
docker compose -f docker-compose.app.yml down
```

**Rebuild images:**
```bash
docker compose -f docker-compose.app.yml up --build
```

**View logs:**
```bash
docker compose -f docker-compose.app.yml logs
```

**Run multiple files simultaneously:**
```bash
docker compose -f docker-compose.db.yml -f docker-compose.app.yml up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License. 