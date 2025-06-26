# Movie App Backend

This is the backend for the Movie App, built with [NestJS](https://nestjs.com/) and TypeScript. It provides a RESTful API for managing movies, actors, and ratings.

## Features

- CRUD operations for movies and actors
- Ratings for movies
- Search functionality
- TypeORM integration with PostgreSQL
- API key authentication for protected routes
- Docker support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- PostgreSQL

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd movie-app/backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the backend directory:
     ```
     TYPEORM_HOST=localhost
     TYPEORM_PORT=5432
     TYPEORM_USERNAME=your_username
     TYPEORM_PASSWORD=your_password
     TYPEORM_DATABASE=your_database_name
     TYPEORM_SYNCHRONIZE=true
     API_SECRET=your-very-secure-random-string
     ```
   - The `API_SECRET` is used for API key authentication.

4. **Set up your PostgreSQL database:**
   - Create the database and user, and grant privileges as needed.

### Running the Application

- **Development mode:**
  ```sh
  npm run build
  npm start
  ```
  The server will start on `http://localhost:3001`.

- **Development with hot reload:**
  ```sh
  npm run start:dev
  ```

### Seeding the Database

To seed the database with sample data:
```sh
npm run seed
```

### Running Tests

```sh
npm run test
```

## Docker

You can run the backend and database with Docker:

```sh
docker-compose up --build
```

- The backend API will be available at `http://localhost:3001`.
- The database will be available at `localhost:5432`.

To seed the database inside the container:
```sh
docker-compose exec backend npm run seed
```

## API Endpoints

- `GET /movies` - Retrieve all movies
- `GET /movies/:id` - Retrieve a movie by ID
- `GET /movies/search?query=...` - Search for movies
- `POST /movies` - Create a movie (API key required)
- `PUT /movies/:id` - Update a movie (API key required)
- `DELETE /movies/:id` - Delete a movie (API key required)
- `GET /movies/:id/ratings` - Get ratings for a movie
- `POST /movies/:id/ratings` - Add a rating (API key required)
- `DELETE /movies/ratings/:ratingId` - Delete a rating (API key required)
- `GET /actors` - Retrieve all actors
- `GET /actors/:id` - Retrieve an actor by ID
- `GET /actors/search?query=...` - Search for actors
- `POST /actors` - Create an actor (API key required)
- `PUT /actors/:id` - Update an actor (API key required)
- `DELETE /actors/:id` - Delete an actor (API key required)
- `GET /actors/:id/movies` - Get movies for an actor

## Authentication

Protected routes require an `Authorization` header:
```
Authorization: Bearer <API_SECRET>
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.