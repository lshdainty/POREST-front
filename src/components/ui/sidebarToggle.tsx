import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"

interface SidebarToggleProps {
  onToggle: () => void
}

export function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle}>
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
