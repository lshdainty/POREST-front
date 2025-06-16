import { useState, useEffect } from "react"
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/view2/sidebar"
import { SidebarToggle } from "@/components/ui/sidebarToggle"
import { ModeToggle } from "@/components/ui/modeToggle"
import { Separator } from "@/components/ui/separator"
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb"

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 모바일에서는 기본적으로 사이드바를 닫아둠
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // 모바일에서 사이드바가 열려있을 때 body 스크롤 방지
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    }
  }, [isMobile, sidebarOpen]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      if (sidebarOpen) {
        setSidebarCollapsed(!sidebarCollapsed);
      } else {
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    }
  }

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }

  return (
    <div className="flex h-screen relative bg-muted/40">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={cn("transition-all duration-300 ease-in-out", sidebarCollapsed ? "w-16" : "w-64")}>
          <AppSidebar className="transition-all duration-300" isCollapsed={sidebarCollapsed} />
        </div>
      )}

      {/* Mobile/Tablet Overlay Sidebar */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
            onClick={handleSidebarClose}
          />

          {/* Sidebar */}
          <div
            className={cn(
              "fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 ease-in-out",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <AppSidebar onItemClick={handleSidebarClose} isCollapsed={false} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <SidebarToggle onToggle={handleSidebarToggle} />
          <Separator orientation="vertical" className="h-4" />
          <DynamicBreadcrumb maxItems={4} showHome={true} className="flex-1" />

          {/* Mode Toggle - 헤더 오른쪽 끝에 배치 */}
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 space-y-6">{<Outlet/>}</main>
      </div>
    </div>
  )
}

export default Layout;