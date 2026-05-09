import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card/80 backdrop-blur-sm px-2 sm:px-4">
      <SidebarTrigger className="md:hidden -ml-1" />
      {/* Search */}
      <div className="relative min-w-0 flex-1 max-w-xs sm:max-w-sm lg:max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search… (F1)"
          className="pl-8 h-8 text-sm bg-muted border-0"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors outline-none">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground pointer-events-none">
              3
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 font-semibold text-sm border-b">Notifications</div>
            <DropdownMenuItem className="flex flex-col items-start py-3 gap-0.5">
              <span className="text-sm font-medium">Low Stock Alert</span>
              <span className="text-xs text-muted-foreground">Lucky Me Pancit Canton is running low (5 left)</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-3 gap-0.5">
              <span className="text-sm font-medium">Delivery Tomorrow</span>
              <span className="text-xs text-muted-foreground">2 deliveries scheduled for May 8</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start py-3 gap-0.5">
              <span className="text-sm font-medium">Expiring Soon</span>
              <span className="text-xs text-muted-foreground">Palmolive Shampoo expired — remove stock</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary text-sm justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 h-8 rounded-md hover:bg-accent transition-colors outline-none">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://i.pravatar.cc/100?u=clara-tan" />
              <AvatarFallback className="text-xs">CT</AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:inline-block">Clara Tan</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
