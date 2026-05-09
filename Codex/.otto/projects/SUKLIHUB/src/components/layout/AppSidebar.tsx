import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home, ShoppingCart, ClipboardList, BarChart2, Package,
  Users, UserCheck, QrCode, Settings, Moon, Sun, LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

type NavItem = {
  label: string;
  icon: typeof Home;
  path: string;
};

const navStore: NavItem[] = [
  { label: "Home",      icon: Home,          path: "/" },
  { label: "Products",  icon: ShoppingCart,  path: "/products" },
  { label: "Orders",    icon: ClipboardList, path: "/orders" },
  { label: "Reports",   icon: BarChart2,     path: "/reports" },
  { label: "Inventory", icon: Package,       path: "/inventory" },
];

const navTeam: NavItem[] = [
  { label: "Customers", icon: Users,         path: "/customers" },
  { label: "Employees", icon: UserCheck,     path: "/employees" },
  { label: "Mobile QR", icon: QrCode,        path: "/mobile-qr" },
  { label: "Settings",  icon: Settings,      path: "/settings" },
];

function NavButton({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => onNavigate(item.path)}
            aria-current={isActive ? "page" : undefined}
            className={`sidebar-btn${isActive ? " active" : ""}`}
          >
            <item.icon className="size-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.65} />
          </button>
        }
      />
      <TooltipContent side="right" sideOffset={12} className="font-medium">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isPathActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-white/10 px-3 pb-4 pt-5">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Suklihub home"
            className="sidebar-brand-btn"
          >
            <span className="text-[15px] font-black tracking-tight select-none">S</span>
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4 pb-2">
        <TooltipProvider delay={250}>
          <nav className="flex flex-col gap-3" aria-label="Main">
            <div className="flex flex-col gap-1.5">
              {navStore.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={isPathActive(item.path)}
                  onNavigate={navigate}
                />
              ))}
            </div>
            <div className="mx-auto h-px w-9 bg-white/20" aria-hidden />
            <div className="flex flex-col gap-1.5">
              {navTeam.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  isActive={isPathActive(item.path)}
                  onNavigate={navigate}
                />
              ))}
            </div>
          </nav>
        </TooltipProvider>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-white/10 px-2 pb-5 pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="sidebar-btn sidebar-btn-ghost mx-auto outline-none"
            aria-label="Account and sign out"
          >
            <LogOut className="size-5 shrink-0" strokeWidth={1.65} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "dark"
                ? <><Sun className="mr-2 h-4 w-4" /> Light mode</>
                : <><Moon className="mr-2 h-4 w-4" /> Dark mode</>}
            </DropdownMenuItem>
            <DropdownMenuItem>Profile settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
