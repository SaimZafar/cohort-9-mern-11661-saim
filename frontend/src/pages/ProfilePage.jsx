import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="container profile-page">
      <h1>Your profile</h1>

      <div className="card profile-card">
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span>{user?.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span>{user?.email}</span>
        </div>

        <button className="btn btn-danger profile-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}