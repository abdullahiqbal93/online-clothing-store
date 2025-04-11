import { User, Package, MapPin, Heart, Lock, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/lib/store/features/user/userSlice';
import { toast } from 'sonner';

function ProfileSidebar({ activeTab, setActiveTab, user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('You have successfully logged out');
    navigate('/login');
  };

  const navItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'security', icon: Lock, label: 'Security' },
  ];

  return (
    <div className="md:w-1/4">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-4 mb-6 p-4 border-b">
          <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="font-medium">{user?.name || 'User'}</h2>
            <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <nav className="flex flex-col justify-between" style={{ minHeight: '300px' }}>
          <div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full p-3 text-left rounded-md mb-2 ${
                  activeTab === item.id ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-left rounded-md mb-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default ProfileSidebar;