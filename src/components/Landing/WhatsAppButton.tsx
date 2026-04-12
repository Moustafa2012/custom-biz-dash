import { motion, AnimatePresence, Variants } from "framer-motion";
import { PhoneCall, Headphones, Handshake } from "lucide-react";
import { useAppConfig } from "@/components/erp/app-config";
import { useState } from "react";
import { WhatsAppContactItem } from "./WhatsAppContactItem";
import { WhatsAppMenuHeader } from "./WhatsAppMenuHeader";
import { WhatsAppMenuFooter } from "./WhatsAppMenuFooter";
import { WhatsAppFabButton } from "./WhatsAppFabButton";

interface ContactNumber {
  number: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
}

const WHATSAPP_GREEN = "#25D366";
const WHATSAPP_DARK = "#128C7E";

export default function WhatsAppButton() {
  const { t, language } = useAppConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNumber, setHoveredNumber] = useState<string | null>(null);

  const contacts: ContactNumber[] = [
    {
      number: "+966550168553",
      name: t("General Manager", "المدير العام"),
      role: t("General Manager", "المدير العام"),
      icon: <Handshake className="h-4 w-4" />,
      color: "#10b981",
    },
    {
      number: "+966541624620",
      name: t("Head Office", "المكتب الرئيسي"),
      role: t("Head Office", "المكتب الرئيسي"),
      icon: <Headphones className="h-4 w-4" />,
      color: "#3b82f6",
    },
    {
      number: "+966533643860",
      name: t("Sales 1", "مبيعات ١"),
      role: t("Sales Representative", "مندوب مبيعات"),
      icon: <PhoneCall className="h-4 w-4" />,
      color: "#8b5cf6",
    },
    {
      number: "+966537144334",
      name: t("Sales 2", "مبيعات ٢"),
      role: t("Sales Representative", "مندوب مبيعات"),
      icon: <PhoneCall className="h-4 w-4" />,
      color: "#f59e0b",
    }
  ];

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const openWhatsApp = (phoneNumber: string) => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 30 } },
  };

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 20
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <div className="fixed bottom-6 start-6 z-50 flex flex-col items-start" dir={language === "ar" ? "rtl" : "ltr"}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-3 w-72 rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(37,211,102,0.12)",
            }}
          >
            <WhatsAppMenuHeader WHATSAPP_GREEN={WHATSAPP_GREEN} WHATSAPP_DARK={WHATSAPP_DARK} />
            
            <div className="bg-white" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {contacts.map((contact) => (
                <WhatsAppContactItem
                  key={contact.number}
                  contact={contact}
                  hoveredIndex={hoveredNumber}
                  setHoveredIndex={setHoveredNumber}
                  openWhatsApp={openWhatsApp}
                  itemVariants={itemVariants}
                />
              ))}
            </div>

            <WhatsAppMenuFooter WHATSAPP_GREEN={WHATSAPP_GREEN} />
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppFabButton
        isOpen={isOpen}
        onClick={toggleMenu}
        WHATSAPP_GREEN={WHATSAPP_GREEN}
        WHATSAPP_DARK={WHATSAPP_DARK}
      />
    </div>
  );
}