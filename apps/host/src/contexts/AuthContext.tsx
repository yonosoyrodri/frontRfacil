import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
  avatar?: string;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Mock API for authentication
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@rfacil.com',
    role: 'admin',
    permissions: ['autofactura', 'gastos', 'proveedores'],
    avatar: '/avatars/admin.jpg',
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@rfacil.com',
    role: 'manager',
    permissions: ['autofactura', 'gastos'],
    avatar: '/avatars/manager.jpg',
    lastLogin: new Date(),
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@rfacil.com',
    role: 'user',
    permissions: ['gastos'],
    avatar: '/avatars/user.jpg',
    lastLogin: new Date(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('rfacil-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        localStorage.removeItem('rfacil-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email (in real app, this would be an API call)
      const foundUser = mockUsers.find(u => u.email === credentials.email);

      if (!foundUser) {
        throw new Error('Usuario no encontrado');
      }

      // In a real app, you would validate the password here
      if (credentials.password !== 'password123') {
        throw new Error('Contraseña incorrecta');
      }

      // Update last login
      const userWithLogin = {
        ...foundUser,
        lastLogin: new Date(),
      };

      setUser(userWithLogin);
      localStorage.setItem('rfacil-user', JSON.stringify(userWithLogin));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rfacil-user');

    // Clear any module federation shared state
    if (window.__FEDERATION_SHARED__) {
      delete window.__FEDERATION_SHARED__.user;
    }

    // Dispatch logout event to all modules
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('rfacil-user', JSON.stringify(updatedUser));

    // Update shared state
    if (window.__FEDERATION_SHARED__) {
      window.__FEDERATION_SHARED__.user = updatedUser;
    }

    // Dispatch user update event
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
  };

  // Update shared state when user changes
  useEffect(() => {
    if (window.__FEDERATION_SHARED__) {
      window.__FEDERATION_SHARED__.user = user;
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
