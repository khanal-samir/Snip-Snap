"use client";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Star,
  User,
  Compass,
  CircleArrowOutUpRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { CustomSession } from "@/index";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: session }: { data: CustomSession | null } = useSession();
  return (
    <Sidebar collapsible="icon" className="h-screen">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex aspect-square size-10 items-center justify-center rounded-md text-primary-foreground">
              <Image
                src="/logo.svg"
                width={100}
                height={100}
                alt="logo"
                priority
                className="mr-2"
              />
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-lg font-bold">
                {" "}
                <span className="text-primary">Snip</span>
                <span>Snap</span>
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-primary"
          >
            {isCollapsed ? (
              <ChevronRight className="h-8 w-8" />
            ) : (
              <ChevronLeft className="h-8 w-8" />
            )}
            <span className="sr-only">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <TooltipProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard">
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[state=expanded]:hidden"
                >
                  Dashboard
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild tooltip="Starred">
                    <Link href="/star">
                      <Star className="h-5 w-5" />
                      <span>Starred</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[state=expanded]:hidden"
                >
                  Starred
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild tooltip="Explore">
                    <Link href="/search">
                      <Compass className="h-5 w-5" />
                      <span>Explore</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[state=expanded]:hidden"
                >
                  Explore
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild tooltip="Profile">
                    <Link href={`/user/${session?.user?.id}`}>
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[state=expanded]:hidden"
                >
                  Profile
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip="Sign out"
                    onClick={async () => await signOut()}
                  >
                    <div>
                      <CircleArrowOutUpRight className="h-5 w-5" />
                      <span>Sign out</span>
                    </div>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="group-data-[state=expanded]:hidden"
                >
                  Sign out
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </TooltipProvider>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
