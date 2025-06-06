
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Simulação de dados de usuários para diferentes perfis
const mockUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@gestaopos.com',
    password: 'admin123',
    role: 'admin' as const
  },
  {
    id: '2',
    name: 'Cliente Premium',
    email: 'cliente@exemplo.com',
    password: '123456',
    role: 'client' as const
  },
  {
    id: '3',
    name: 'João Silva',
    email: 'joao@email.com',
    password: 'cliente123',
    role: 'client' as const
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const maxLoginAttempts = 5;
  const lockoutTime = 15 * 60 * 1000; // 15 minutos

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Reset login attempts after lockout time
  useEffect(() => {
    if (loginAttempts >= maxLoginAttempts) {
      const timer = setTimeout(() => {
        setLoginAttempts(0);
        toast({
          title: "Tentativas resetadas",
          description: "Você pode tentar fazer login novamente.",
        });
      }, lockoutTime);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts, toast]);

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const sessionExpiry = localStorage.getItem('session_expiry');
      
      if (storedUser && sessionExpiry) {
        const now = new Date().getTime();
        if (now < parseInt(sessionExpiry)) {
          setUser(JSON.parse(storedUser));
        } else {
          // Sessão expirada
          localStorage.removeItem('auth_user');
          localStorage.removeItem('session_expiry');
          localStorage.removeItem('rememberMe');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('session_expiry');
      localStorage.removeItem('rememberMe');
    } finally {
      setIsLoading(false);
    }
  };

  const validateCredentials = (email: string, password: string): User | null => {
    // Simular hash de senha (em produção, use bcrypt)
    const mockUser = mockUsers.find(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );

    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser;
      return userWithoutPassword;
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    if (loginAttempts >= maxLoginAttempts) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde 15 minutos antes de tentar novamente.",
        variant: "destructive",
      });
      throw new Error('Muitas tentativas de login');
    }

    setIsLoading(true);
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar credenciais
      const authenticatedUser = validateCredentials(email, password);
      
      if (!authenticatedUser) {
        setLoginAttempts(prev => prev + 1);
        const remainingAttempts = maxLoginAttempts - loginAttempts - 1;
        
        throw new Error(
          remainingAttempts > 0 
            ? `Credenciais inválidas. ${remainingAttempts} tentativas restantes.`
            : 'Credenciais inválidas. Conta temporariamente bloqueada.'
        );
      }
      
      // Reset attempts on successful login
      setLoginAttempts(0);
      setUser(authenticatedUser);
      
      // Store user data with session expiry
      const sessionDuration = 8 * 60 * 60 * 1000; // 8 horas
      const expiryTime = new Date().getTime() + sessionDuration;
      
      localStorage.setItem('auth_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('session_expiry', expiryTime.toString());
      
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      toast({
        title: "✅ Login realizado com sucesso",
        description: `Bem-vindo, ${authenticatedUser.name}!`,
      });
      
      // Redirect based on user role
      const redirectPath = getRedirectPath(authenticatedUser.role);
      navigate(redirectPath);
      
    } catch (error) {
      toast({
        title: "❌ Erro ao fazer login",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRedirectPath = (role: User['role']): string => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'client':
        return '/client';
      default:
        return '/';
    }
  };

  const logout = () => {
    setUser(null);
    setLoginAttempts(0);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('rememberMe');
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    
    navigate('/');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
