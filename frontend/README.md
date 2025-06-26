# Movie App Frontend

This is the frontend for the Movie App, built with [Next.js](https://nextjs.org/), TypeScript, and TailwindCSS. It communicates with the NestJS backend to display and manage movies, actors, and ratings.

## Features

- List, search, add, edit, and delete movies
- List, search, add, edit, and delete actors
- Add and view ratings for movies
- Responsive design with TailwindCSS
- API authentication using a bearer token

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd movie-app/frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure API Token:**
   - The frontend uses a bearer token to authenticate with the backend.
   - By default, the token is set in `utils/fetchWithAuth.ts`:
     ```ts
     const API_TOKEN = 'your-api-secret';
     ```
   - Make sure this matches the `API_SECRET` in your backend `.env`.

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

### Running Tests

```sh
npm run test
```

## Folder Structure

- `pages/` — Main entry points for the application (Next.js pages)
- `components/` — Reusable UI components (MovieList, MovieForm, Headbar, etc.)
- `styles/` — Global styles and TailwindCSS configuration
- `utils/` — Helper utilities (e.g., fetchWithAuth)
- `public/` — Static assets (if any)
- `jest.config.js`, `babel.config.js` — Testing and build configuration

## Environment Variables

- The backend API URL is hardcoded as `http://localhost:3001` in API calls.  
  Update this in your code if your backend runs elsewhere.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.