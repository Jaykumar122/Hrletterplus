import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  FilePlus,
  Settings,
  Search,
  HelpCircle,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const navMain = [
  { title: "Dashboard",  url: "/dashboard",  icon: LayoutDashboard },
  { title: "Templates",  url: "/templates",  icon: FileText },
  { title: "Candidates", url: "/candidates", icon: Users },
  { title: "Offers",     url: "/offers",     icon: FilePlus },
]

const navSecondary = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Get Help", url: "/help",     icon: HelpCircle },
  { title: "Search",   url: "/search",   icon: Search },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeStyle = {
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)',
  }

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
            <span className="text-primary-foreground text-xs font-bold">H+</span>
          </div>
          <span className="font-semibold text-sm">HrLetterPlus</span>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    onClick={() => navigate(item.url)}
                    style={location.pathname === item.url ? activeStyle : {}}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.slice(0, 1).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    onClick={() => navigate(item.url)}
                    style={location.pathname === item.url ? activeStyle : {}}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.slice(1).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    onClick={() => navigate(item.url)}
                    style={location.pathname === item.url ? activeStyle : {}}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}