import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Home, 
  Users, 
  Wallet,
  User as UserIcon,
  LogOut,
  CreditCard,
  CheckCircle,
  BarChart3,
  Landmark,
  AlertCircle,
  Settings,
  PiggyBank,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import VoiceCommand from "@/components/VoiceCommand";
import NotificationSystem from "@/components/NotificationSystem";
import NotificationBell from "@/components/NotificationBell";

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Pessoal",
    url: createPageUrl("Personal"),
    icon: Wallet,
  },
  {
    title: "Grupos",
    url: createPageUrl("Groups"),
    icon: Users,
  },
  {
    title: "Dívidas",
    url: createPageUrl("Debts"),
    icon: Landmark,
  },
  {
    title: "Relatórios",
    url: createPageUrl("Reports"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("Usuário não autenticado");
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <style>{`
        :root {
          --primary: 134 239 172;
          --primary-foreground: 22 101 52;
          --secondary: 219 234 254;
          --secondary-foreground: 30 64 175;
          --accent: 34 197 94;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link to={createPageUrl("Dashboard")} className="flex items-center">
            <span className="text-xl font-bold tracking-tighter text-gray-800">Finan<span className="text-emerald-600">Share</span></span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to={createPageUrl("Goals")}>
              <Button variant="ghost" size="icon" className="relative">
                <PiggyBank className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>

            <NotificationBell user={user} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profile_picture_url ? (
                      <img src={user.profile_picture_url} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Profile")} className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Insights")} className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Insights IA
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl("Settings")} className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 min-h-[calc(10vh-140px)]">
        {children}
      </main>
      <Toaster />
      <VoiceCommand />
      <NotificationSystem />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-emerald-100 px-2 py-2">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 w-16 ${
                    isActive 
                      ? "text-emerald-600 bg-emerald-50" 
                      : "text-gray-500 hover:text-emerald-600"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}