# OpenMusic Backend API

A production-grade RESTful API for a music streaming platform, built with **Express.js** and **PostgreSQL**. This project was developed as part of the **IDCamp 2025 Backend Development** learning path.

---

## Project Description

OpenMusic Backend API provides a complete server-side solution for a music management application. It enables users to manage albums and songs, create and share playlists, collaborate with other users, like albums, upload cover images, and export playlists via email — all through a secure, token-authenticated REST API.

The API is designed around real-world backend concerns: asynchronous task processing with a message queue, in-memory caching for high-read endpoints, file storage for media uploads, and a clean layered architecture that separates routing, validation, business logic, and data access.

---

## Features

- **Album & Song Management** — Full CRUD for albums and songs, including song search by title or performer
- **User Registration & Authentication** — Secure user registration with bcrypt-hashed passwords; JWT-based login with access and refresh token support
- **Playlist Management** — Create, retrieve, and delete playlists; add and remove songs
- **Collaborative Playlists** — Add or remove collaborators on a playlist, granting them read/write access
- **Playlist Activity Log** — Track every add/remove action on a playlist with timestamps
- **Album Likes** — Users can like or unlike albums; like counts are cached in Redis for performance
- **Album Cover Upload** — Upload album cover images (JPEG/PNG, max 512 KB) stored on the server filesystem
- **Playlist Export via Email** — Asynchronously export playlist contents as a JSON file delivered to the user's email, powered by RabbitMQ and Nodemailer

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js 4 |
| Database | PostgreSQL |
| ORM / Query | `pg` (raw SQL) |
| Migrations | `node-pg-migrate` |
| Caching | Redis |
| Message Queue | RabbitMQ (`amqplib`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcrypt` |
| Validation | `joi` |
| File Uploads | `multer` |
| Email | `nodemailer` |
| ID Generation | `nanoid` |
| Linting | ESLint (Airbnb base) |
| Dev Reload | `nodemon` |

---

## Project Architecture / Folder Structure

```
IDCAMP_BACKEND_2025/
├── .env.example                    # Environment variable template
├── .eslintrc.json                  # ESLint configuration
├── package.json
├── migrations/                     # Database migration files (10 migrations)
│   ├── 1706300000000_create-table-albums.js
│   ├── 1706300000001_create-table-songs.js
│   ├── 1769523940818_create-table-users.js
│   ├── 1769523940819_create-table-playlist.js
│   ├── 1769523989652_create-table-playlist-songs.js
│   ├── 1769524020093_create-table-collaborations.js
│   ├── 1769524020094_create-table-playlist-song-activities.js
│   ├── 1769524020095_create-table-authentications.js
│   ├── 1769524020096_add-cover-url-to-albums.cjs
│   └── 1769524020097_create-user-album-likes-table.cjs
└── src/
    ├── server.js                   # Application entry point; registers all routes & services
    ├── consumer.js                 # Standalone RabbitMQ consumer (playlist export worker)
    ├── test-smtp.js                # SMTP connectivity test utility
    ├── api/                        # Route & handler modules (one sub-folder per feature)
    │   ├── albums/
    │   ├── songs/
    │   ├── users/
    │   ├── authentications/
    │   ├── playlists/
    │   ├── collaborations/
    │   ├── likes/
    │   ├── exports/
    │   └── uploads/
    ├── services/
    │   ├── postgres/               # PostgreSQL service classes (data access layer)
    │   ├── redis/                  # Redis cache service
    │   ├── rabbitmq/               # RabbitMQ producer service
    │   └── storage/                # Local filesystem storage service
    ├── middleware/
    │   └── authMiddleware.js       # Bearer token extraction & JWT verification
    ├── validator/                  # Joi schema validators for every request payload
    ├── exceptions/                 # Custom error classes with HTTP status codes
    ├── tokenize/
    │   └── TokenManager.js         # JWT signing & verification (access + refresh tokens)
    ├── customize/
    │   ├── MailSender.js           # Nodemailer email sender
    │   └── Listener.js             # RabbitMQ consumer message handler
    └── utils/
        └── index.js                # Database row → domain model mappers
```

The application follows a **Layered Architecture** pattern:

```
Request → Router → Handler → Validator → Service → Database / Cache / Queue
```

---

## Installation

### Prerequisites

- Node.js ≥ 18
- PostgreSQL
- Redis
- RabbitMQ
- An SMTP server or service (e.g. Mailtrap for development)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/VindSkiee/IDCAMP_BACKEND_2025.git
   cd IDCAMP_BACKEND_2025
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Run database migrations**

   ```bash
   npm run migrate:up
   ```

5. **Start the API server**

   ```bash
   # Production
   npm start

   # Development (with auto-reload)
   npm run start:dev
   ```

6. **Start the export consumer** (required for playlist export feature)

   ```bash
   npm run start:consumer
   ```

---

## Usage

Once the server is running, the API is available at:

```
http://localhost:5000
```

You can interact with the API using any HTTP client such as [Postman](https://www.postman.com/) or `curl`.

**Example — Create an album:**

```bash
curl -X POST http://localhost:5000/albums \
  -H "Content-Type: application/json" \
  -d '{"name": "Thriller", "year": 1982}'
```

**Example — Register a user:**

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "secret123", "fullname": "John Doe"}'
```

**Example — Login:**

```bash
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "password": "secret123"}'
```

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `HOST` | Server host | `localhost` |
| `PORT` | Server port | `5000` |
| `PGHOST` | PostgreSQL host | `localhost` |
| `PGPORT` | PostgreSQL port | `5432` |
| `PGUSER` | PostgreSQL username | `postgres` |
| `PGPASSWORD` | PostgreSQL password | `password` |
| `PGDATABASE` | PostgreSQL database name | `openmusic` |
| `ACCESS_TOKEN_KEY` | Secret key for signing access tokens | *(long random string)* |
| `REFRESH_TOKEN_KEY` | Secret key for signing refresh tokens | *(long random string)* |
| `ACCESS_TOKEN_AGE` | Access token lifetime in seconds | `1800` |
| `RABBITMQ_SERVER` | RabbitMQ connection URI | `amqp://localhost` |
| `REDIS_SERVER` | Redis host | `localhost` |
| `SMTP_HOST` | SMTP server host | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | *(from your SMTP provider)* |
| `SMTP_PASSWORD` | SMTP password | *(from your SMTP provider)* |

---

## API Endpoints

### Albums

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/albums` | No | Create a new album |
| `GET` | `/albums/:id` | No | Get album details and its songs |
| `PUT` | `/albums/:id` | No | Update an album |
| `DELETE` | `/albums/:id` | No | Delete an album |
| `POST` | `/albums/:id/covers` | No | Upload an album cover image |
| `POST` | `/albums/:id/likes` | Yes | Like an album |
| `DELETE` | `/albums/:id/likes` | Yes | Unlike an album |
| `GET` | `/albums/:id/likes` | No | Get album like count |

### Songs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/songs` | No | Create a new song |
| `GET` | `/songs` | No | List all songs (filter by `title` / `performer`) |
| `GET` | `/songs/:id` | No | Get song details |
| `PUT` | `/songs/:id` | No | Update a song |
| `DELETE` | `/songs/:id` | No | Delete a song |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/users` | No | Register a new user |

### Authentications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/authentications` | No | Login — returns access & refresh tokens |
| `PUT` | `/authentications` | No | Refresh the access token |
| `DELETE` | `/authentications` | No | Logout — invalidate the refresh token |

### Playlists

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/playlists` | Yes | Create a playlist |
| `GET` | `/playlists` | Yes | List the authenticated user's playlists |
| `DELETE` | `/playlists/:id` | Yes | Delete a playlist |
| `POST` | `/playlists/:id/songs` | Yes | Add a song to a playlist |
| `GET` | `/playlists/:id/songs` | Yes | Get songs in a playlist |
| `DELETE` | `/playlists/:id/songs` | Yes | Remove a song from a playlist |
| `GET` | `/playlists/:id/activities` | Yes | Get playlist activity log |

### Collaborations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/collaborations` | Yes | Add a collaborator to a playlist |
| `DELETE` | `/collaborations` | Yes | Remove a collaborator from a playlist |

### Exports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/export/playlists/:playlistId` | Yes | Export playlist as JSON to the user's email |

---

## Future Improvements

- **Pagination** — Add limit/offset or cursor-based pagination to list endpoints (songs, playlists)
- **Search Enhancements** — Full-text search and filtering for albums and songs
- **Unit & Integration Tests** — Add automated tests using Jest or Mocha
- **Docker Support** — Provide a `Dockerfile` and `docker-compose.yml` for one-command setup
- **API Documentation** — Generate interactive API docs using Swagger / OpenAPI
- **Rate Limiting** — Protect public endpoints from abuse
- **CI/CD Pipeline** — Automated linting, testing, and deployment via GitHub Actions
- **Cloud Storage** — Replace local file storage with an object storage service (e.g. AWS S3)
- **Streaming Support** — Add audio file upload and streaming capabilities
- **Role-Based Access Control** — Differentiate admin and regular user permissions

---

## Author

**VindSkiee**
GitHub: [@VindSkiee](https://github.com/VindSkiee)

Built as part of the **IDCamp 2025 Backend Development** learning path.
