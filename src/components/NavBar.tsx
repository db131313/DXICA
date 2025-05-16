import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavBarProps {
  onReset: () => void;
  showControls?: boolean;
  setShowControls?: (show: boolean) => void;
  isSearching?: boolean;
}

export function NavBar({ onReset, showControls, setShowControls, isSearching }: NavBarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      console.log('NavBar: Starting sign out process');
      const success = await signOut();
      console.log('NavBar: Sign out result:', success);
      
      if (success) {
        console.log('NavBar: Sign out successful, navigating to home');
        setShowDropdown(false);
        // Force a hard navigation to home
        window.location.href = '/';
      }
    } catch (error) {
      console.error('NavBar: Error during sign out:', error);
    }
  }, [signOut]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/5 backdrop-blur-sm z-50 w-screen">
      <div className="w-full px-6 py-4 flex items-center">
        <button 
          onClick={onReset}
          className="text-2xl font-bold text-white hover:text-white/80 transition-colors"
        >
          DXICA
        </button>
        <div className="ml-auto flex items-center gap-4">
          {isSearching && setShowControls && (
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-all border border-white/20"
            >
              <span className="material-icons">settings</span>
            </button>
          )}
          
          {!user ? (
            <>
              <button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Sign Up
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Log In
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
              >
                {user.email?.[0].toUpperCase() || 'U'}
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white/10 backdrop-blur-sm ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <div className="px-4 py-2 text-sm text-white/80 border-b border-white/10">
                      {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 