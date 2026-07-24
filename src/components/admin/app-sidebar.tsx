import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, Image as ImageIcon, Users, HandHeart, Calendar,
  MessageSquare, Handshake, HelpCircle, Building2, UserCog, Settings, Sparkles, Heart,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";

const GROUPS = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { title: "Hero Slider", url: "/admin/hero", icon: Sparkles },
      { title: "Programs", url: "/admin/programs", icon: HandHeart },
      { title: "News", url: "/admin/news", icon: FileText },
      { title: "Events", url: "/admin/events", icon: Calendar },
      { title: "Gallery", url: "/admin/gallery", icon: ImageIcon },
      { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
      { title: "Partners", url: "/admin/partners", icon: Handshake },
      { title: "Team", url: "/admin/team", icon: Users },
      { title: "FAQ", url: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Donations", url: "/admin/donations", icon: Heart },
      { title: "Volunteers", url: "/admin/volunteers", icon: Users },
      { title: "Contact", url: "/admin/contact", icon: Building2 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Users", url: "/admin/users", icon: UserCog },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
] as const;

export function AdminSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/admin" ? pathname === "/admin" : pathname.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/admin" className="flex items-center gap-2 px-2 py-2">
          <div className="grid place-items-center h-8 w-8 rounded-lg bg-brand text-brand-foreground shrink-0">
            <Heart className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm">KBSBB</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {GROUPS.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
