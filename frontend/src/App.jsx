import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { lazy, Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import store from './store/store';
import ThemeContext from './context/ThemeContext';

// Layout
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Loader from './components/Loader';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShows'));
const People = lazy(() => import('./pages/People'));
const Search = lazy(() => import('./pages/Search'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const PersonDetails = lazy(() => import('./pages/PersonDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Favorites = lazy(() => import('./pages/Favorites'));
const History = lazy(() => import('./pages/History'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMovies = lazy(() => import('./pages/admin/AdminMovies'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import './App.css';

function AppContent() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="app">
      <Sidebar />
      <div className="app-main">
              <main className="main-content">
                <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/tv" element={<TVShows />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/tv/:id" element={<MovieDetails />} />
                  <Route path="/person/:id" element={<PersonDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/movies" element={
                  <AdminRoute>
                    <AdminMovies />
                  </AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                } />
                </Routes>
                </Suspense>
              </main>
              {currentPath !== "/login" && currentPath !== "/register" && <Footer />}
            </div>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
  );
}

function App() {
  return (
    <ThemeContext>
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
      </Provider>
    </ThemeContext>
  );
}

export default App;
