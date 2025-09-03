'use client';

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';

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
    dashboard: 'Dashboard',
    calendar: 'Calendar',
    work: 'Work',
    culture: 'Culture',
    rule: 'Rule',
    admin: 'Admin',
    user: 'User',
    vacation: 'Vacation',
    overview: 'Overview',
  };

  const parentPathToDefaultChild: Record<string, string> = {
    '/work': '/work/report',
    '/culture': '/culture/dues',
    '/admin': '/admin/users',
  };

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];

    if (showHome) {
      breadcrumbs.push({
        title: 'Home',
        href: '/dashboard',
        isActive: pathname === '/dashboard',
      });
    }

    const pathSegments = segments.filter(s => s !== 'dashboard');
    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    pathSegments.forEach((segment, index) => {
      const currentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const title = pathMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isActive = index === pathSegments.length - 1;

      let href = currentPath;
      if (!isActive && parentPathToDefaultChild[href]) {
        href = parentPathToDefaultChild[href];
      }
      
      breadcrumbs.push({
        title,
        href,
        isActive,
      });
    });

    return breadcrumbs;
  };

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
          <React.Fragment key={`${crumb.title}-${index}`}>
            {/* 첫 번째 항목 후에 collapsed items가 있다면 드롭다운 표시 */}
            {index === 1 && shouldCollapse && collapsedItems.length > 0 && (
              <>
                {separator}
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-1 hover:text-foreground'>
                      <BreadcrumbEllipsis className='h-4 w-4' />
                      <span className='sr-only'>Show more</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                      {collapsedItems.map((item, itemIndex) => (
                        <DropdownMenuItem key={`${item.href}-${itemIndex}`}>
                          <BreadcrumbLink asChild>
                            <Link to={item.href}>{item.title}</Link>
                          </BreadcrumbLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              </>
            )}

            {/* 일반 breadcrumb 항목 */}
            <BreadcrumbItem className={index === 0 && showHome ? 'hidden md:block' : ''}>
              {crumb.isActive ? (
                <BreadcrumbPage className='font-medium text-foreground'>{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className='transition-colors hover:text-foreground'>
                  <Link to={crumb.href}>
                    {index === 0 && showHome ? <Home className='h-4 w-4' /> : crumb.title}
                  </Link>
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
