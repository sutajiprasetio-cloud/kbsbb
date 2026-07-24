import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, KeyRound, Home, Sun, Moon, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminShell,
});

function AdminShell() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      setEmail(userRes.user?.email ?? "");
      if (!uid) return navigate({ to: "/auth" });
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      setAllowed((data?.length ?? 0) > 0);
      setChecking(false);
    })();
  }, [navigate]);

  if (checking) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Loading admin…</div>;
  }
  if (!allowed) return <ForbiddenScreen email={email} />;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <TopBar email={email} />
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function TopBar({ email }: { email: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);
  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }
  async function changePassword() {
    if (!email) return;
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    toast.success("Password reset link sent to your email");
  }

  const crumb = pathname.replace(/^\/admin\/?/, "") || "Dashboard";
  const label = crumb.charAt(0).toUpperCase() + crumb.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="text-sm text-muted-foreground">Admin</div>
      <div className="text-sm">/</div>
      <div className="text-sm font-medium">{label}</div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild title="View site">
          <Link to="/"><Home className="h-4 w-4" /></Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDark} title="Toggle theme">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-9">
              <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{email.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
              <span className="hidden sm:inline text-sm">{email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={changePassword}><KeyRound className="mr-2 h-4 w-4" />Change password</DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function ForbiddenScreen({ email }: { email: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account ({email}) doesn't have admin access. Ask a super admin to grant you a role.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" asChild><Link to="/">Go home</Link></Button>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>Sign out</Button>
        </div>
      </div>
    </div>
  );
}
