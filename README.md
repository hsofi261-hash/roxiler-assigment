# Roxiler Assignment

A full-stack web application with a **Node.js backend**, a **Next.js frontend**, and a **MySQL 8** database. The whole stack is containerised with Docker Compose, so you can run it with a single command.

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | Next.js (React)                         |
| Backend   | Node.js (REST API, JWT authentication)  |
| Database  | MySQL 8.0                               |
| DevOps    | Docker, Docker Compose                  |

## Project Structure

```
roxiler-assigment/
├── backend/             # Node.js API (includes the admin seeder script)
├── frontend/            # Next.js client app
├── .dockerignore
├── .env                 # Environment configuration (see below)
└── docker-compose.yml   # Runs MySQL, backend and the admin seeder
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- (Only for running without Docker) Node.js 18+ and npm, and a local MySQL 8 server

## Environment Variables (`.env`)

The `.env` file is **intentionally committed** to this repository so the project runs immediately after cloning, with no manual setup. It contains **only dummy/demo values, not real secrets**. No production keys, tokens or personal credentials are stored here.

> ⚠️ If you ever deploy this project beyond a local demo, replace every value below (especially `JWT_SECRET` and the passwords) and stop committing `.env`.

| Variable                | Purpose                                                                 | Default / Demo value        |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------- |
| `MYSQL_HOST`            | Database host. Docker Compose overrides this to `db` for the containers. Use `localhost` when running outside Docker. | `mysql` |
| `MYSQL_PORT`            | Port MySQL is exposed on your machine                                   | `3306`                      |
| `MYSQL_DATABASE`        | Name of the database that is created automatically                      | `app_db`                    |
| `MYSQL_USER`            | Application database user                                               | `app_user`                  |
| `MYSQL_PASSWORD`        | Password for the application database user                             | `userpassword`              |
| `MYSQL_ROOT_PASSWORD`   | Root password for the MySQL container (required by `docker-compose.yml`) | *add your own, e.g. `rootpassword`* |
| `BACKEND_PORT`          | Port the backend API is exposed on                                      | `5000`                      |
| `FRONTEND_PORT`         | Port the frontend is exposed on                                         | `3000`                      |
| `NEXT_PUBLIC_API_URL`   | URL the frontend uses to reach the backend                              | `http://localhost:5000`     |
| `JWT_SECRET`            | Secret used to sign login tokens (demo value only)                      | `your_super_secret_key`     |
| `ADMIN_NAME`            | Name of the default admin created by the seeder                         | `Super Admin`               |
| `ADMIN_EMAIL`           | Email of the default admin account                                      | `admin@example.com`         |
| `ADMIN_PASSWORD`        | Password of the default admin account                                   | `YourSecurePassword123`     |
| `ADMIN_ADDRESS`         | Address of the default admin account                                    | `123 Admin Street, City`    |

Example `.env`:

```env
# Database
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=userpassword
MYSQL_ROOT_PASSWORD=rootpassword

# Backend
BACKEND_PORT=5000
JWT_SECRET=your_super_secret_key

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Default admin (created by the seeder)
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_ADDRESS=123 Admin Street, City
```

## How to Run

### Option 1: Docker Compose (recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/hsofi261-hash/roxiler-assigment.git
   cd roxiler-assigment
   ```

2. **Check the `.env` file**. It is already included. Make sure `MYSQL_ROOT_PASSWORD` is set (see the table above).

3. **Build and start the services**

   ```bash
   docker compose up --build
   ```

   This will:
   - start a **MySQL 8** container (`roxiler_mysql_db`) and wait until its healthcheck passes,
   - start the **backend** container (`roxiler_backend`) on port `5000`,
   - run the **seeder** container (`roxiler_seeder`) once, which executes `npm run seed:admin` to create the default admin user, then exits.

4. **Open the app**
   - Backend API: http://localhost:5000
   - Frontend: see the note below.

5. **Stop everything**

   ```bash
   docker compose down        # stop containers
   docker compose down -v     # stop containers AND delete the database volume
   ```

> **Note:** In `docker-compose.yml` the `frontend` service is currently **commented out**. To run it in Docker, uncomment that block. Otherwise run the frontend locally as shown below.

### Option 2: Run locally without Docker

**1. Database**: start a local MySQL 8 server and create the database/user from your `.env` values (set `MYSQL_HOST=localhost`).

**2. Backend**

```bash
cd backend
npm install
npm run seed:admin    # creates the default admin account
npm start             # or: npm run dev
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000.

## Default Admin Login

After the seeder has run, sign in with the values from your `.env`:

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@example.com`     |
| Password | `YourSecurePassword123` |

## Useful Commands

```bash
docker compose logs -f backend     # follow backend logs
docker compose logs seeder         # confirm the admin was seeded
docker compose ps                  # list running containers
docker compose up -d --build       # rebuild and run in the background
```

## Troubleshooting

- **Backend can't connect to MySQL**: the compose file waits for the database healthcheck, so give it a few seconds on first start. Inside Docker the host must be `db`; this is set automatically by `docker-compose.yml`.
- **Port already in use**: change `MYSQL_PORT`, `BACKEND_PORT` or `FRONTEND_PORT` in `.env`.
- **Admin not created**: run `docker compose logs seeder`. To re-run it: `docker compose run --rm seeder`.
- **Reset the database**: `docker compose down -v` and start again.

## Security Note

All credentials in this repository are placeholders for local development and evaluation only. Do not reuse them in any real environment.
