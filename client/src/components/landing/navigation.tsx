import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'wouter';
import { LoginButton } from '@/components/auth/login-button';
import { LogoutButton } from '@/components/auth/logout-button';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu, X, Globe, DollarSign } from 'lucide-react';
import logoImage from '@assets/logo(1)_1757082606279.png';
import { useLanguage } from '@/contexts/language-context';
import { useCurrency } from '@/contexts/currency-context';

export function Navigation() {
  const { isAuthenticated, user } = useAuth0();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <img 
                src={logoImage} 
                alt="Aara Connect Logo" 
                className="h-16 w-auto max-w-none"
              />
            </Link>
            <div className="hidden lg:flex space-x-6">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                data-testid="button-features"
              >
                {t('features')}
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                data-testid="button-pricing"
              >
                {t('pricing')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                data-testid="button-contact"
              >
                {t('contact')}
              </button>
              <Link href="/policies" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                {t('policies')}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-20 h-8 border-0 bg-transparent hover:bg-muted/50">
                <Globe className="h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Currency Selector */}
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-20 h-8 border-0 bg-transparent hover:bg-muted/50">
                <DollarSign className="h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
            
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-3">
                <Link href="/dashboard" data-testid="link-dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <div className="flex items-center space-x-2">
                  {user?.picture && (
                    <img 
                      src={user.picture} 
                      alt="User avatar" 
                      className="w-7 h-7 rounded-full"
                      data-testid="img-user-avatar"
                    />
                  )}
                  <span className="text-sm hidden md:block text-foreground" data-testid="text-username">{user?.name}</span>
                </div>
                <LogoutButton variant="outline">Logout</LogoutButton>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <LoginButton variant="outline" size="sm">
                  Login
                </LoginButton>
                <LoginButton className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  Request Demo
                </LoginButton>
              </div>
            )}
            
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4 text-foreground" /> : <Menu className="h-4 w-4 text-foreground" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-md font-medium"
              >
                {t('features')}
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-md font-medium"
              >
                {t('pricing')}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-md font-medium"
              >
                {t('contact')}
              </button>
              <Link href="/policies" className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-md font-medium">
                {t('policies')}
              </Link>
              
              
              {/* Language & Currency selectors for mobile */}
              <div className="flex justify-between items-center gap-4 px-3 py-2 mt-4 mb-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Language</p>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full h-8 text-sm">
                      <Globe className="h-3 w-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Currency</p>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full h-8 text-sm">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-border/40 pt-3 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link href="/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start text-left py-3">{t('dashboard')}</Button>
                    </Link>
                    <LogoutButton variant="outline" className="w-full py-3">{t('logout')}</LogoutButton>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <LoginButton variant="outline" className="w-full py-3 text-left justify-start">Login</LoginButton>
                    <LoginButton className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                      Request Demo
                    </LoginButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
