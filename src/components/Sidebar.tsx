import { Home, Tv, Film, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settings';
import { Button } from './ui/button';
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/shows', label: 'TV Shows', icon: Tv },
];
export function Sidebar() {
  const navigate = useNavigate();
  const clearSession = useSettingsStore((state) => state.clearSession);
  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };
  return (
    <nav className="w-60 bg-gray-950/50 flex flex-col justify-between items-center py-8 border-r border-gray-800">
      <div>
        <div className="text-3xl font-bold text-blue-500 mb-12 text-center transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer" onClick={() => navigate('/')}>
          Cineverse
        </div>
        <div className="flex flex-col space-y-4 w-full px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-4 p-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out focus:outline-none tv-focusable',
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4 w-full px-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-4 p-3 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out focus:outline-none tv-focusable',
              isActive
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )
          }
        >
          <Settings className="h-6 w-6" />
          <span>Settings</span>
        </NavLink>
        <Button
          onClick={handleLogout}
          className="flex items-center justify-start space-x-4 p-3 h-auto rounded-lg text-lg font-medium transition-all duration-300 ease-in-out focus:outline-none tv-focusable bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-6 w-6" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
}