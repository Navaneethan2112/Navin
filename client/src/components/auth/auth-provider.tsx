import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '@/lib/auth0';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Auth0Provider {...auth0Config}>
      {children}
    </Auth0Provider>
  );
}
