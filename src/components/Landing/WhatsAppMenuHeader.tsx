import { MessageCircle } from "lucide-react";
import { useAppConfig } from "@/components/erp/app-config";

interface WhatsAppMenuHeaderProps {
  WHATSAPP_GREEN: string;
  WHATSAPP_DARK: string;
}

export function WhatsAppMenuHeader({ WHATSAPP_GREEN, WHATSAPP_DARK }: WhatsAppMenuHeaderProps) {
  const { t } = useAppConfig();

  return (
    <div
      className="px-4 py-3 flex items-center gap-3"
      style={{
        background: `linear-gradient(135deg, ${WHATSAPP_DARK} 0%, ${WHATSAPP_GREEN} 100%)`,
      }}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm">
        <MessageCircle className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm leading-tight">
          {t("Chat with us", "talk with us")}
        </p>
        <p className="text-white/75 text-xs leading-tight">
          {t("Typically replies instantly", "replies instantly")}
        </p>
      </div>
      <div className="ms-auto flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-white/90 animate-pulse" />
        <span className="text-white/90 text-xs font-medium">
          {t("Online", "Available")}
        </span>
      </div>
    </div>
  );
}
