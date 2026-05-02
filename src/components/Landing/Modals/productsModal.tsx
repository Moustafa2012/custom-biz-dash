import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppConfig } from "@/components/erp/app-config";
import { ProductModalContent } from "./ProductModalContent";
import { X } from "lucide-react";

type ShelfLife = {
  duration: string;
  duration_ar: string;
  note: string;
  note_ar: string;
};

type Storage = {
  temperature: string;
  humidity: string;
  humidity_ar: string;
  instructions: string;
  instructions_ar: string;
};

type Usage = {
  primary: string[];
  primary_ar: string[];
  tip: string;
  tip_ar: string;
};

interface Product {
  name: string;
  name_ar: string;
  category: string;
  category_ar: string;
  rating: number;
  image: string;
  images?: string[];
  tags: string[];
  tags_ar: string[];
  featured: boolean;
  desc: string;
  desc_ar: string;
  origin?: string;
  origin_ar?: string;
  certifications?: string[];
  certifications_ar?: string[];
  benefits?: string[];
  benefits_ar?: string[];
  shelfLife: ShelfLife;
  storage?: Storage;
  usage?: Usage;
}

interface ProductsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductsModal({ product, open, onOpenChange }: ProductsModalProps) {
  const isMobile = useIsMobile();
  const { language, t } = useAppConfig();

  if (!product) return null;

  const content = <ProductModalContent product={product} language={language} t={t} />;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[92vh] max-h-[92vh] p-0 rounded-t-2xl">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>
          <ScrollArea className="h-full">
            <div className="px-5 py-4 pb-10">{content}</div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <ScrollArea className="h-[85vh] w-full">
          <div className="p-8">{content}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}