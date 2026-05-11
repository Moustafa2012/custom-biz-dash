import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { t } from "@/lib/translations"
import { WHATSAPP_URL } from "@/data/constants"

export default function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Contact via WhatsApp", "تواصل عبر واتساب")}
      className="fixed bottom-6 start-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-transform"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  )
}