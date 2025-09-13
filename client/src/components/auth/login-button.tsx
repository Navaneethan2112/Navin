import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';

interface LoginButtonProps {
  variant?: "default" | "outline";
  children: React.ReactNode;
  className?: string;
}

export function LoginButton({ variant = "default", children, className, ...props }: LoginButtonProps) {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      variant={variant}
      className={className}
      data-testid="button-login"
      {...props}
    >
      {children}
    </Button>
  );
}
