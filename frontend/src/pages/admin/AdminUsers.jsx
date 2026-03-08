import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import Loader from '../../components/Loader';
import { FaUsers, FaBan, FaTrash, FaCheck } from 'react-icons/fa';
import './Admin.css';

const AdminUsers = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers(user.token);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
    setIsLoading(false);
  };

  const handleToggleBan = async (userId, userName, isBanned) => {
    const action = isBanned ? 'unban' : 'ban';
    if (window.confirm(`Are you sure you want to ${action} "${userName}"?`)) {
      try {
        await adminService.toggleBanUser(userId, user.token);
        toast.success(`User ${action}ned successfully`);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || `Failed to ${action} user`);
      }
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(userId, user.token);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <Loader size={80} />;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><FaUsers /> Manage Users</h1>
        <p>View and manage user accounts</p>
      </div>

      <div className="admin-toolbar">
        <p>{users.length} user(s) registered</p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <FaUsers className="empty-icon" />
          <h2>No users found</h2>
        </div>
      ) : (
        <div className="movies-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData._id}>
                  <td>{userData.name}</td>
                  <td>{userData.email}</td>
                  <td>
                    <span className={`user-badge ${userData.role}`}>
                      {userData.role}
                    </span>
                  </td>
                  <td>
                    <span className={`user-badge ${userData.isBanned ? 'banned' : 'user'}`}>
                      {userData.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>{formatDate(userData.createdAt)}</td>
                  <td>
                    {userData.role !== 'admin' && (
                      <div className="table-actions">
                        <button
                          className={`action-btn-small ${userData.isBanned ? 'edit' : 'delete'}`}
                          onClick={() => handleToggleBan(userData._id, userData.name, userData.isBanned)}
                          title={userData.isBanned ? 'Unban User' : 'Ban User'}
                        >
                          {userData.isBanned ? <FaCheck /> : <FaBan />}
                        </button>
                        <button
                          className="action-btn-small delete"
                          onClick={() => handleDelete(userData._id, userData.name)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    {userData.role === 'admin' && (
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
