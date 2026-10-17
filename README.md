# Flower E-commerce Platform

A full-stack e-commerce platform for selling luxury flowers and gifts, with a customer storefront, an admin dashboard, and a REST API backend.

## Tech Stack

**Backend**

- Java, Spring Boot
- PostgreSQL (with pgvector)
- Redis

**Admin Dashboard**

- React
- RTK Query
- i18n (multi-language support)

**Storefront**

- Next.js
- RTK Query
- Prefetching and lazy loading

## Features

- Product management with colors, images, and price ranges
- Categories, occasions, and sections
- Product filtering and search
- Order management and dashboard statistics
- Authentication and role-based access
- Multi-language admin interface

## Project Structure

```
.
├── backend/              # Spring Boot API
├── admin/                # React admin dashboard
├── storefront/           # Next.js customer storefront
└── docker-compose.yml    # PostgreSQL and Redis services
```

## Getting Started

### Prerequisites

- Java 25+ (or the version used in the backend)
- Node.js 18+
- Docker and Docker Compose

### 1. Start the infrastructure

```bash
docker compose up -d
```

This starts:

- PostgreSQL on port `5433`
- Redis on port `6379`

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run`.

### 3. Run the admin dashboard

```bash
cd admin
npm install
npm run dev
```

### 4. Run the storefront

```bash
cd storefront
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the relevant folder. Do not commit it to the repository.

```env
# Example, adjust to your configuration
DB_URL=jdbc:postgresql://localhost:5433/floria_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
```

## License

This project is for personal and educational use. Add a license if you plan to distribute it.
