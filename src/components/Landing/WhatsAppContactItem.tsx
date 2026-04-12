import { motion, Variants } from "framer-motion";
import { PhoneCall, Headphones, HelpCircle, Handshake, Zap } from "lucide-react";

interface ContactNumber {
  number: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
}

interface WhatsAppContactItemProps {
  contact: ContactNumber;
  hoveredIndex: string | null;
  setHoveredIndex: (index: string | null) => void;
  openWhatsApp: (phoneNumber: string) => void;
  itemVariants: Variants;
}

export function WhatsAppContactItem({
  contact,
  hoveredIndex,
  setHoveredIndex,
  openWhatsApp,
  itemVariants,
}: WhatsAppContactItemProps) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={() => openWhatsApp(contact.number)}
      onMouseEnter={() => setHoveredIndex(contact.number)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="w-full flex items-center gap-3 px-4 py-3 text-start transition-colors duration-150 border-b border-gray-50 last:border-0 group"
      style={{
        backgroundColor:
          hoveredIndex === contact.number ? "#f8fffe" : "transparent",
      }}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
        style={{
          backgroundColor: `${contact.color}18`,
          color: contact.color,
        }}
      >
        {contact.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm leading-tight">
          {contact.name}
        </p>
        <p className="text-gray-400 text-xs mt-0.5 leading-tight truncate">
          {contact.role}
        </p>
      </div>
    </motion.button>
  );
}
