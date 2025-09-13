import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  variant?: "default" | "outline";
  children: React.ReactNode;
  className?: string;
}

export function LogoutButton({ variant = "outline", children, className }: LogoutButtonProps) {
  const { logout, isLoading } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      className={className}
      data-testid="button-logout"
    >
      {children}
    </Button>
  );
}
