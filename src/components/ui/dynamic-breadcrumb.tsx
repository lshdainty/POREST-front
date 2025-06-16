"useLocation client"

import React from "react"
import { useLocation } from "react-router-dom"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BreadcrumbSegment {
  title: string
  href: string
  isActive?: boolean
}

interface DynamicBreadcrumbProps {
  maxItems?: number
  showHome?: boolean
  customSeparator?: React.ReactNode
  className?: string
}

export function DynamicBreadcrumb({
  maxItems = 3,
  showHome = true,
  customSeparator,
  className,
}: DynamicBreadcrumbProps) {
  const { pathname } = useLocation()

  const pathMapping: Record<string, string> = {
    calendar: "Calendar",
    work: "Work Management",
    dues: "Dues & Payroll",
    rule: "Rules & Policies",
    schedule: "Schedule",
    events: "Events",
    meetings: "Meetings",
    attendance: "Attendance",
    "time-tracking": "Time Tracking",
    projects: "Projects",
    performance: "Performance",
    payroll: "Payroll",
    benefits: "Benefits",
    expenses: "Expenses",
    "tax-documents": "Tax Documents",
    policies: "Policies",
    procedures: "Procedures",
    compliance: "Compliance",
    training: "Training",
  }

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const { pathname } = useLocation();
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbSegment[] = []

    if (showHome) {
      breadcrumbs.push({
        title: "Home",
        href: "/dashboard",
        isActive: pathname === "/dashboard",
      })
    }

    let currentPath = ""
    segments.forEach((segment, index) => {
      if (segment === "dashboard" && index === 0) {
        currentPath = "/dashboard"
        return
      }

      currentPath += `/${segment}`
      const title = pathMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        title,
        href: currentPath,
        isActive: index === segments.length - 1,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // 너무 많은 항목이 있을 때 중간 항목들을 드롭다운으로 처리
  const shouldCollapse = breadcrumbs.length > maxItems
  let displayBreadcrumbs = breadcrumbs
  let collapsedItems: BreadcrumbSegment[] = []

  if (shouldCollapse) {
    const firstItem = breadcrumbs[0]
    const lastTwoItems = breadcrumbs.slice(-2)
    collapsedItems = breadcrumbs.slice(1, -2)
    displayBreadcrumbs = [firstItem, ...lastTwoItems]
  }

  const separator = customSeparator || <BreadcrumbSeparator />

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {displayBreadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            {/* 첫 번째 항목 후에 collapsed items가 있다면 드롭다운 표시 */}
            {index === 1 && shouldCollapse && collapsedItems.length > 0 && (
              <>
                {separator}
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Show more</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {collapsedItems.map((item) => (
                        <DropdownMenuItem key={item.href}>
                          <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              </>
            )}

            {/* 일반 breadcrumb 항목 */}
            <BreadcrumbItem className={index === 0 && showHome ? "hidden md:block" : ""}>
              {crumb.isActive ? (
                <BreadcrumbPage className="font-medium text-foreground">{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href} className="transition-colors hover:text-foreground">
                  {index === 0 && showHome ? <Home className="h-4 w-4" /> : crumb.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {/* 마지막 항목이 아니라면 구분자 추가 */}
            {index < displayBreadcrumbs.length - 1 && <React.Fragment>{separator}</React.Fragment>}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
