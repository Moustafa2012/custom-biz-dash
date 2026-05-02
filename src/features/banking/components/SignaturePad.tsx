import { useEffect, useRef, useState } from "react";
import { useAppConfig } from "@/components/erp/app-config";
import { Button } from "@/components/ui/button";
import { Eraser, Upload } from "lucide-react";

interface Props {
  value?: string; // data URL
  onChange: (dataUrl: string | undefined) => void;
  height?: number;
}

/**
 * Canvas-based signature pad. Supports mouse + touch, plus image upload fallback.
 * Outputs a PNG data URL via onChange.
 */
export function SignaturePad({ value, onChange, height = 160 }: Props) {
  const { t } = useAppConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Set up DPR-aware canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0a0a0a";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Restore from value
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value;
      setIsEmpty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t0 = e.touches[0];
      return { x: t0.clientX - rect.left, y: t0.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    last.current = getPoint(e);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const p = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    setIsEmpty(false);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    const data = canvasRef.current?.toDataURL("image/png");
    if (data) onChange(data);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setIsEmpty(true);
    onChange(undefined);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const rect = canvas.getBoundingClientRect();
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, rect.width, rect.height);
        // Fit while preserving aspect
        const r = Math.min(rect.width / img.width, rect.height / img.height);
        const w = img.width * r, h = img.height * r;
        ctx.drawImage(img, (rect.width - w) / 2, (rect.height - h) / 2, w, h);
        onChange(canvas.toDataURL("image/png"));
        setIsEmpty(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg border bg-white overflow-hidden" style={{ height }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          style={{ height }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {isEmpty ? t("ارسم توقيعك أعلاه أو ارفع صورة.", "Draw your signature above or upload an image.") : t("✓ تم التوقيع", "✓ Signed")}
        </span>
        <div className="flex gap-2">
          <label className="inline-flex">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
            <Button type="button" variant="outline" size="sm" className="gap-1" asChild>
              <span><Upload className="h-3.5 w-3.5" />{t("رفع", "Upload")}</span>
            </Button>
          </label>
          <Button type="button" variant="outline" size="sm" onClick={clear} className="gap-1">
            <Eraser className="h-3.5 w-3.5" />{t("مسح", "Clear")}
          </Button>
        </div>
      </div>
    </div>
  );
}
