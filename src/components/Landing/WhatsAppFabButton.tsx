import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useAppConfig } from "@/components/erp/app-config";

interface WhatsAppFabButtonProps {
  isOpen: boolean;
  onClick: () => void;
  WHATSAPP_GREEN: string;
  WHATSAPP_DARK: string;
}

export function WhatsAppFabButton({ isOpen, onClick, WHATSAPP_GREEN, WHATSAPP_DARK }: WhatsAppFabButtonProps) {
  const { t } = useAppConfig();

  return (
    <motion.button
      onClick={onClick}
      aria-label={t("Contact via WhatsApp", "WhatsApp")}
      aria-expanded={isOpen}
      className="relative flex items-center justify-center w-14 h-14 rounded-full text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: isOpen
          ? `linear-gradient(135deg, #1a9e52 0%, #128C7E 100%)`
          : `linear-gradient(135deg, ${WHATSAPP_GREEN} 0%, ${WHATSAPP_DARK} 100%)`,
        boxShadow: isOpen
          ? "0 4px 20px rgba(37,211,102,0.35)"
          : "0 6px 24px rgba(37,211,102,0.5)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        transition: { 
          delay: 0.8, 
          type: "spring" as const, 
          stiffness: 260, 
          damping: 20 
        } 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      {!isOpen && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: WHATSAPP_GREEN }}
          animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <X className="h-6 w-6" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
