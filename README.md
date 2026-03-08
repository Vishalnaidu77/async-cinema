# MovieFlix - Full Stack Movie Platform

A full-stack movie discovery platform built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Features

### Core Features
- 🎬 **Movie & TV Show Discovery** - Browse trending, popular, and now playing content
- 🔍 **Real-Time Search** - Search movies, TV shows, and people with debouncing
- 🎥 **Trailer Playback** - Watch trailers in a modal player
- ♾️ **Infinite Scroll** - Seamless loading of content
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### User Features
- 🔐 **Authentication** - Sign up, login, and logout with JWT
- ❤️ **Favorites** - Add movies to your favorites list
- 📺 **Watch History** - Track recently viewed content
- 👤 **User Profile** - Personalized experience

### Admin Features
- 🎬 **Manage Movies** - Add, edit, and delete custom movies
- 👥 **User Management** - View, ban, and delete users
- 📊 **Dashboard** - Admin overview panel

## Tech Stack

### Frontend
- React.js 18
- Redux Toolkit
- React Router DOM
- Axios
- React Infinite Scroll Component
- React Toastify
- React Icons
- React Loader Spinner

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

```
movie-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Favorite.js
│   │   └── WatchHistory.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── movies.js
│   │   ├── favorites.js
│   │   └── watchHistory.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── MovieCard.jsx
    │   │   ├── PersonCard.jsx
    │   │   ├── Loader.jsx
    │   │   ├── Skeleton.jsx
    │   │   ├── TrailerModal.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminMovies.jsx
    │   │   │   └── AdminUsers.jsx
    │   │   ├── Home.jsx
    │   │   ├── Movies.jsx
    │   │   ├── TVShows.jsx
    │   │   ├── People.jsx
    │   │   ├── Search.jsx
    │   │   ├── MovieDetails.jsx
    │   │   ├── PersonDetails.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Favorites.jsx
    │   │   └── History.jsx
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── tmdbService.js
    │   │   ├── favoriteService.js
    │   │   ├── historyService.js
    │   │   └── adminService.js
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js
    │   │   │   ├── movieSlice.js
    │   │   │   ├── favoriteSlice.js
    │   │   │   └── historySlice.js
    │   │   └── store.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- TMDB API Key (free at https://www.themoviedb.org/settings/api)

### 1. Get TMDB API Key
1. Go to https://www.themoviedb.org/
2. Create an account and sign in
3. Go to Settings > API
4. Request an API key (select "Developer")
5. Copy your API Key (v3 auth)

### 2. Backend Setup

```bash
cd backend

# Update .env file
# Edit .env and add your values:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/movieapp
# JWT_SECRET=your_super_secret_key_here
# TMDB_API_KEY=your_tmdb_api_key

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Update .env file
# Edit .env and add your TMDB API key:
# VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Start the development server
npm run dev
```

### 4. Create Admin User

To create an admin user, you can either:

**Option A: Use MongoDB Compass/Shell**
1. Register a new user through the app
2. Open MongoDB and find the user in the `users` collection
3. Change the `role` field from `"user"` to `"admin"`

**Option B: Create via API (using Postman/curl)**
1. Register a user
2. Update the role in the database

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movieapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
TMDB_API_KEY=your_tmdb_api_key_here
```

### Frontend (.env)
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/ban` - Ban/Unban user
- `DELETE /api/users/:id` - Delete user

### Movies
- `GET /api/movies` - Get custom movies
- `POST /api/movies` - Add movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:movieId` - Remove from favorites

### Watch History
- `GET /api/history` - Get watch history
- `POST /api/history` - Add to history
- `DELETE /api/history` - Clear history

## 2-Day Development Timeline

### Day 1 (8-10 hours)
- [x] Project setup (frontend + backend)
- [x] TMDB API integration
- [x] Core pages (Home, Movies, TV Shows, Search)
- [x] Movie details page with trailer
- [x] Authentication (Register, Login, Logout)
- [x] Basic responsive design

### Day 2 (8-10 hours)
- [x] Favorites feature
- [x] Watch history
- [x] Admin panel
- [x] User management
- [x] Infinite scroll
- [x] Polish UI & testing

## Running the Project

1. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Tips for 2-Day Deadline

1. **Use the existing code** - All components and features are ready
2. **Get your TMDB API key first** - It's required for movie data
3. **Test features incrementally** - Don't wait until the end
4. **Focus on core features** - Extras can be added later
5. **Keep MongoDB running** - Required for auth and user features

## License

MIT License
