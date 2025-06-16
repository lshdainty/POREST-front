import type React from "react"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  ChevronRight,
  Home,
  Calendar,
  Briefcase,
  DollarSign,
  BookOpen,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react" //icon
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
  onItemClick?: () => void
  isCollapsed?: boolean
}

const navigationData = [
  {
    title: "Dashboard",
    href: "/test",
    icon: Home,
    items: [
      { title: "Overview", href: "/dashboard/overview" },
      { title: "Analytics", href: "/dashboard/analytics" },
      { title: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    title: "Calendar",
    href: "/test/calendar",
    icon: Calendar,
    items: [
      // { title: "Schedule", href: "/dashboard/calendar/schedule" },
      // { title: "Events", href: "/dashboard/calendar/events" },
      // { title: "Meetings", href: "/dashboard/calendar/meetings" },
    ],
  },
  {
    title: "Work",
    href: "/test/work",
    icon: Briefcase,
    items: [
      // { title: "Attendance", href: "/dashboard/work/attendance" },
      // { title: "Time Tracking", href: "/dashboard/work/time-tracking" },
      // { title: "Projects", href: "/dashboard/work/projects" },
      // { title: "Performance", href: "/dashboard/work/performance" },
    ],
  },
  {
    title: "Culture",
    href: "/test/culture",
    icon: DollarSign,
    items: [
      // { title: "Payroll", href: "/dashboard/dues/payroll" },
      // { title: "Benefits", href: "/dashboard/dues/benefits" },
      // { title: "Expenses", href: "/dashboard/dues/expenses" },
      // { title: "Tax Documents", href: "/dashboard/dues/tax-documents" },
    ],
  },
  {
    title: "Rule",
    href: "/test/rule",
    icon: BookOpen,
    items: [
      // { title: "Policies", href: "/dashboard/rule/policies" },
      // { title: "Procedures", href: "/dashboard/rule/procedures" },
      // { title: "Compliance", href: "/dashboard/rule/compliance" },
      // { title: "Training", href: "/dashboard/rule/training" },
    ],
  },
]

export function Sidebar({ className, onItemClick, isCollapsed = false }: SidebarProps) {
  const { pathname } = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const isExpanded = (title: string) => {
    return (
      expandedItems.includes(title) ||
      navigationData.some((item) => item.title === title && item.items?.some((subItem) => isActive(subItem.href)))
    )
  }

  const handleLinkClick = () => {
    onItemClick?.()
  }

  const MenuButton = ({ item, children }: { item: any; children: React.ReactNode }) => {
    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side="right" align="center">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      )
    }
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-full flex-col bg-background transition-all duration-200 ease-linear",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-4 bg-background">
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-4 w-4" />
            </div>
            <div
              className={cn(
                "flex flex-col items-start transition-all duration-200 ease-linear",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
              )}
            >
              <span className="text-sm font-semibold whitespace-nowrap">HR Department</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">Enterprise</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto px-4 pb-4">
          <div className="space-y-1">
            <div
              className={cn(
                "mb-2 transition-all duration-200 ease-linear",
                isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto",
              )}
            >
              <h4 className="mb-1 text-sm font-semibold text-muted-foreground">myHR</h4>
            </div>
            {navigationData.map((item) => (
              <div key={item.title}>
                <MenuButton item={item}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full transition-all duration-200 ease-linear",
                      isActive(item.href) && "bg-accent text-accent-foreground",
                      isCollapsed ? "justify-center px-2" : "justify-start",
                    )}
                    onClick={() => {
                      if (item.items && !isCollapsed) {
                        toggleExpanded(item.title)
                      } else if (!isCollapsed) {
                        handleLinkClick()
                      }
                    }}
                    asChild={!(item.items && !isCollapsed)}
                  >
                    {item.items && !isCollapsed ? (
                      <div className="flex w-full items-center">
                        {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
                        <span className="flex-1 text-left truncate transition-all duration-200 ease-linear">
                          {item.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-all duration-200 ease-linear",
                            isExpanded(item.title) && "rotate-90",
                          )}
                        />
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex w-full items-center transition-all duration-200 ease-linear",
                          isCollapsed && "justify-center",
                        )}
                        onClick={handleLinkClick}
                      >
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-all duration-200 ease-linear",
                              !isCollapsed && "mr-2",
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "transition-all duration-200 ease-linear truncate",
                            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </Button>
                </MenuButton>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200 ease-linear",
                    item.items && isExpanded(item.title) && !isCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {item.items && (
                    <div className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                      {item.items.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start transition-all duration-200 ease-linear h-7 text-sm",
                            isActive(subItem.href) && "bg-accent text-accent-foreground",
                          )}
                          asChild
                        >
                          <Link to={subItem.href} onClick={handleLinkClick}>
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-center p-2 transition-all duration-200 ease-linear">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>HM</AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>HR Manager</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start transition-all duration-200 ease-linear">
                  <Avatar className="mr-2 h-8 w-8 shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>HM</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex flex-col items-start transition-all duration-200 ease-linear",
                      isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
                    )}
                  >
                    <span className="text-sm font-medium whitespace-nowrap">HR Manager</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">hr@company.com</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
