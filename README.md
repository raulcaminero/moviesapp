# Movie App

This project is a full-stack application for managing movies and actors, featuring a NestJS backend and a Next.js frontend, both written in TypeScript. The backend uses TypeORM for database interactions, while the frontend utilizes TailwindCSS for styling and provides a modern, responsive UI.

---

## Project Structure

```
movie-app
├── backend          # NestJS backend (API, DB, Auth)
│   ├── src
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
└── frontend         # Next.js frontend (UI)
    ├── pages
    ├── components
    ├── styles
    ├── tailwind.config.js
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

---

## Features

- **Backend**: 
  - RESTful API for movies, actors, and ratings
  - CRUD operations for movies and actors
  - Ratings system for movies
  - Search functionality
  - API key authentication for protected routes
  - TypeORM + PostgreSQL integration
  - Docker support

- **Frontend**: 
  - List, search, add, edit, and delete movies and actors
  - Add and view ratings for movies
  - Responsive design with TailwindCSS
  - API authentication using a bearer token

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm
- PostgreSQL

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and API secret values.

4. **Run the backend:**
   ```sh
   npm run build
   npm start
   ```
   The backend API will be available at `http://localhost:3001`.

5. **(Optional) Seed the database:**
   ```sh
   npm run seed
   ```

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure API Token:**
   - Set the API token in `utils/fetchWithAuth.ts` to match your backend's `API_SECRET`.

4. **Run the frontend:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

- Access the frontend at [http://localhost:3000](http://localhost:3000).
- The backend API will be available at [http://localhost:3001](http://localhost:3001).

---

## Testing

- **Backend:**  
  ```sh
  cd backend
  npm run test
  ```
- **Frontend:**  
  ```sh
  cd frontend
  npm run test
  ```

---

## Docker

You can run the backend and database with Docker:

```sh
cd backend
docker-compose up --build
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

---

## License

This project is licensed under the