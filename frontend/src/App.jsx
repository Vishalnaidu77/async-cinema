import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store/store';
import ThemeContext from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import People from './pages/People';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import PersonDetails from './pages/PersonDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import History from './pages/History';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminUsers from './pages/admin/AdminUsers';

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
        {currentPath !== "/login" && currentPath !== "/register" && <Navbar />}
              <main className="main-content">
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
