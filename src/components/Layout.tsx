import { Home, Dumbbell, TrendingUp, Camera, Users, Crown, Shield, LogOut, Trophy, UserCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Outlet } from "react-router-dom";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import fitfocoLogo from '@/assets/fitfoco-logo.png';
import AISupport from "@/components/AISupport";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Treinos", url: "/treinos", icon: Dumbbell },
  { title: "Progresso", url: "/progresso", icon: TrendingUp },
  { title: "Scanner", url: "/scanner", icon: Camera },
  { title: "Comunidade", url: "/comunidade", icon: Users },
  { title: "Desafios", url: "/desafios", icon: Trophy },
];

export function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={fitfocoLogo} alt="FitFoco" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">FitFoco</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    end
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                    activeClassName="bg-primary/10 text-primary"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </NavLink>
                ))}
              </nav>
              
              <div className="flex items-center gap-2">
                <div className="scale-75">
                  <CinematicThemeSwitcher />
                </div>
                {user && (
                  <>
                    <NavLink to="/perfil">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Perfil"
                        className="h-9 w-9"
                      >
                        <UserCircle className="h-4 w-4" />
                      </Button>
                    </NavLink>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={signOut}
                      title="Sair"
                      className="h-9 w-9"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* AI Support Chat */}
      {user && <AISupport />}

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground"
              activeClassName="text-primary"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.title}</span>
            </NavLink>
          ))}
          <NavLink
            to="/perfil"
            end
            className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground"
            activeClassName="text-primary"
          >
            <UserCircle className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
