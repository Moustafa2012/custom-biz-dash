import { useState } from "react";
import { ChevronLeft, ChevronRight, Leaf, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  productNameAr: string;
  language: string;
}

export function ProductImageCarousel({ images, productName, productNameAr, language }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-lg">
      <img
        src={images[currentIndex]}
        alt={language === 'ar' ? productNameAr : productName}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevImage}
            className={`absolute top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full w-10 h-10 shadow-lg ${
              language === 'ar' ? 'right-3' : 'left-3'
            }`}
          >
            {language === 'ar' ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextImage}
            className={`absolute top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background text-foreground rounded-full w-10 h-10 shadow-lg ${
              language === 'ar' ? 'left-3' : 'right-3'
            }`}
          >
            {language === 'ar' ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
