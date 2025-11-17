import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/store/settings';
import { jellyfinApi } from '@/lib/jellyfin-api';
import { JellyfinUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTvNavigation } from '@/hooks/use-tv-navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
export function LoginPage() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  useTvNavigation(pageRef);
  const { serverUrl, setSession } = useSettingsStore();
  const [users, setUsers] = useState<JellyfinUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<JellyfinUser | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  useEffect(() => {
    if (!serverUrl) {
      navigate('/settings');
      return;
    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const publicUsers = await jellyfinApi.getPublicUsers();
        setUsers(publicUsers);
        setError(null);
      } catch (err) {
        setError('Could not fetch users from the server. Please check your server URL and API key in Settings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [serverUrl, navigate]);
  const handleUserSelect = (user: JellyfinUser) => {
    setSelectedUser(user);
    if (!user.HasPassword) {
      handleLogin(user.Name);
    }
  };
  const handleLogin = async (username: string, pw?: string) => {
    setIsAuthenticating(true);
    try {
      const authResponse: any = await jellyfinApi.authenticate(username, pw);
      setSession(authResponse.User.Id, authResponse.AccessToken);
      toast.success(`Welcome, ${authResponse.User.Name}!`);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      toast.error('Authentication failed. Please check your password.');
      console.error(err);
      setIsAuthenticating(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      handleLogin(selectedUser.Name, password);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white text-center p-8">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Connection Error</h1>
        <p className="text-lg text-gray-400 mb-6">{error}</p>
        <Button onClick={() => navigate('/settings')} className="bg-blue-600 hover:bg-blue-700 tv-focusable">
          Go to Settings
        </Button>
      </div>
    );
  }
  return (
    <div ref={pageRef} className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <Toaster richColors theme="dark" />
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-8">Who's Watching?</h1>
        {!selectedUser ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <button
                key={user.Id}
                onClick={() => handleUserSelect(user)}
                className="flex flex-col items-center gap-4 group tv-focusable rounded-lg p-4"
              >
                <img
                  src={jellyfinApi.getUserImageUrl(user.Id, 'Primary')}
                  alt={user.Name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-transparent group-hover:border-blue-500 group-focus:border-blue-500 transition-all duration-300"
                />
                <span className="text-xl font-medium text-gray-300 group-hover:text-white group-focus:text-white">{user.Name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-sm mx-auto">
            <img
              src={jellyfinApi.getUserImageUrl(selectedUser.Id, 'Primary')}
              alt={selectedUser.Name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-3xl font-bold mb-6">{selectedUser.Name}</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-4 text-lg text-center bg-gray-700 border-gray-600 focus:ring-blue-500 tv-focusable"
              />
              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg p-6 tv-focusable" disabled={isAuthenticating}>
                {isAuthenticating ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Login'}
              </Button>
              <Button variant="link" onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white tv-focusable">
                Not {selectedUser.Name}?
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}