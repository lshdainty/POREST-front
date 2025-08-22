
import { Toaster as Sonner } from "@/components/shadcn/sonner";
import { toast as sonnerToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

const toast = {
  success: (message: string) => {
    sonnerToast.success("성공", {
      description: message,
    });
  },
  error: (message: string) => {
    sonnerToast.error("오류", {
      description: message,
    });
  },
  info: (message: string) => {
    sonnerToast.info("정보", {
        description: message,
    });
  },
  message: (title: string, message: string) => {
    sonnerToast.message(title, {
        description: message,
    })
  }
};

export { Toaster, toast };
