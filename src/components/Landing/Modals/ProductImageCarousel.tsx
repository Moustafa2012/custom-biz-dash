import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  productNameAr: string;
  language: string;
}

export function ProductImageCarousel({ images, productName, productNameAr, language }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
        <img
          src={images[currentIndex]}
          alt={language === "ar" ? productNameAr : productName}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevImage}
              className={`absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background border border-border rounded-full w-9 h-9 shadow-sm ${
                language === "ar" ? "right-3" : "left-3"
              }`}
            >
              {language === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextImage}
              className={`absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background border border-border rounded-full w-9 h-9 shadow-sm ${
                language === "ar" ? "left-3" : "right-3"
              }`}
            >
              {language === "ar" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-foreground"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}