import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sliders, ChevronRight, Check, Type, Baseline, Box, CornerDownRight, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAppConfig,
  ACCENT_COLORS,
  type StylePreset,
  type BaseColor,
  type FontFamily,
  type IconLibrary,
  type BorderRadius,
  type CollapsibleState,
  type SidebarVariant,
  type ContentDensity,
  type FontScale,
} from "./app-config";

/* ─── Sub-panel for picking an option ─── */
function OptionPicker<T extends string>({
  title, options, value, onChange, onBack,
}: {
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
        <button onClick={onBack} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => { onChange(opt.value); onBack(); }}
              className={cn(
                "flex items-center w-full px-3 py-3 gap-3 rounded-xl transition-colors text-left",
                value === opt.value ? "bg-muted/40" : "hover:bg-muted/20"
              )}
            >
              <span className="flex-1 text-sm font-medium">{opt.label}</span>
              {value === opt.value && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ─── Sub-panel for picking a color ─── */
function ColorPickerPanel({
  title, colors, value, onChange, onBack,
}: {
  title: string;
  colors: Record<string, { hex: string; css: string; label: string }>;
  value: string;
  onChange: (v: any) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
        <button onClick={onBack} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {(Object.entries(colors) as [string, { hex: string; label: string }][]).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => { onChange(key); onBack(); }}
              className={cn(
                "flex items-center w-full px-3 py-3 gap-3 rounded-xl transition-colors",
                value === key ? "bg-muted/40" : "hover:bg-muted/20"
              )}
            >
              <span className="h-5 w-5 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-background" style={{ backgroundColor: meta.hex }} />
              <span className="flex-1 text-sm font-medium">{meta.label}</span>
              {value === key && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ─── Individual setting card (shadcn/ui create style) ─── */
function SettingCard({ label, value, right, onClick }: {
  label: string;
  value: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "flex items-center w-full rounded-xl border border-border/40 bg-card/50 px-4 py-3 text-left transition-all",
        onClick && "hover:bg-muted/30 hover:border-border/60 active:scale-[0.98]",
        !onClick && "cursor-default"
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] leading-tight text-muted-foreground/70 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
      {right && <div className="shrink-0 ml-3">{right}</div>}
    </button>
  );
}

type ActivePanel = null | "style" | "baseColor" | "accentColor" | "chartColor" | "headingFont" | "bodyFont" | "iconLibrary" | "borderRadius" | "sidebarVariant" | "collapsible" | "contentDensity" | "fontScale";

type SlideDirection = "forward" | "back";

export function LayoutSettingsSheet() {
  const cfg = useAppConfig();
  const [panel, setPanel] = useState<ActivePanel>(null);
  const [slideDir, setSlideDir] = useState<SlideDirection>("forward");
  const [isAnimating, setIsAnimating] = useState(false);

  const openPanel = (p: ActivePanel) => {
    setSlideDir("forward");
    setIsAnimating(true);
    setPanel(p);
  };

  const goBack = () => {
    setSlideDir("back");
    setIsAnimating(true);
    setPanel(null);
  };

  const slideClass = isAnimating
    ? slideDir === "forward"
      ? "animate-slide-in-forward"
      : "animate-slide-in-back"
    : "";

  const styleOptions: { value: StylePreset; label: string }[] = [
    { value: "luma", label: "Luma" },
    { value: "classic", label: "Classic" },
    { value: "minimal", label: "Minimal" },
  ];
  const baseColorOptions: { value: BaseColor; label: string }[] = [
    { value: "neutral", label: "Neutral" },
    { value: "stone", label: "Stone" },
    { value: "zinc", label: "Zinc" },
  ];
  const fontOptions: { value: FontFamily; label: string }[] = [
    { value: "geist", label: "Geist" },
    { value: "inter", label: "Inter" },
    { value: "sans", label: "Sans" },
  ];
  const iconLibraryOptions: { value: IconLibrary; label: string }[] = [
    { value: "hugeicons", label: "HugeIcons" },
    { value: "lucide", label: "Lucide" },
    { value: "heroicons", label: "HeroIcons" },
  ];
  const borderRadiusOptions: { value: BorderRadius; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "default", label: "Default" },
    { value: "lg", label: "Large" },
    { value: "full", label: "Full" },
  ];
  const sidebarVariantOptions: { value: SidebarVariant; label: string }[] = [
    { value: "inset", label: "Inset" },
    { value: "sidebar", label: "Sidebar" },
    { value: "floating", label: "Floating" },
  ];
  const collapsibleOptions: { value: CollapsibleState; label: string }[] = [
    { value: "icon", label: "Icon" },
    { value: "offcanvas", label: "Off Canvas" },
    { value: "none", label: "None" },
  ];
  const densityOptions: { value: ContentDensity; label: string }[] = [
    { value: "compact", label: "Compact" },
    { value: "default", label: "Default" },
    { value: "relaxed", label: "Relaxed" },
  ];
  const fontScaleOptions: { value: FontScale; label: string }[] = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ];

  const colorDot = (hex: string) => (
    <span className="h-5 w-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: hex }} />
  );

  const radiusIcon = (
    <CornerDownRight className="h-4 w-4 text-muted-foreground" />
  );

  const renderMainPanel = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <h2 className="text-sm font-bold tracking-tight">{cfg.t("القائمة", "Menu")}</h2>
        <Sliders className="h-4 w-4 text-muted-foreground" />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {/* Appearance Cards */}
          <SettingCard
            label="Style"
            value={cfg.stylePreset.charAt(0).toUpperCase() + cfg.stylePreset.slice(1)}
            right={<div className="h-5 w-5 rounded-md border border-border/50 bg-background" />}
            onClick={() => openPanel("style")}
          />
          <SettingCard
            label="Base Color"
            value={cfg.baseColor.charAt(0).toUpperCase() + cfg.baseColor.slice(1)}
            right={<span className="h-5 w-5 rounded-full bg-muted-foreground/40" />}
            onClick={() => openPanel("baseColor")}
          />
          <SettingCard
            label="Theme"
            value={cfg.getColorLabel(cfg.accentColor)}
            right={colorDot(ACCENT_COLORS[cfg.accentColor].hex)}
            onClick={() => openPanel("accentColor")}
          />
          <SettingCard
            label="Chart Color"
            value={cfg.getColorLabel(cfg.chartColor)}
            right={colorDot(ACCENT_COLORS[cfg.chartColor].hex)}
            onClick={() => openPanel("chartColor")}
          />

          {/* Spacer */}
          <div className="h-1" />

          {/* Typography Cards */}
          <SettingCard
            label="Heading"
            value={cfg.headingFont.charAt(0).toUpperCase() + cfg.headingFont.slice(1)}
            right={<Type className="h-4 w-4 text-muted-foreground" />}
            onClick={() => openPanel("headingFont")}
          />
          <SettingCard
            label="Font"
            value={cfg.bodyFont.charAt(0).toUpperCase() + cfg.bodyFont.slice(1)}
            right={<Baseline className="h-4 w-4 text-muted-foreground" />}
            onClick={() => openPanel("bodyFont")}
          />

          {/* Spacer */}
          <div className="h-1" />

          {/* Interface Cards */}
          <SettingCard
            label="Icon Library"
            value={cfg.iconLibrary === "hugeicons" ? "HugeIcons" : cfg.iconLibrary === "lucide" ? "Lucide" : "HeroIcons"}
            right={<Box className="h-4 w-4 text-muted-foreground" />}
            onClick={() => openPanel("iconLibrary")}
          />
          <SettingCard
            label="Radius"
            value={cfg.borderRadius.charAt(0).toUpperCase() + cfg.borderRadius.slice(1)}
            right={radiusIcon}
            onClick={() => openPanel("borderRadius")}
          />

          {/* Spacer */}
          <div className="h-1" />

          {/* Layout Cards */}
          <SettingCard
            label="Sidebar Style"
            value={cfg.sidebarVariant.charAt(0).toUpperCase() + cfg.sidebarVariant.slice(1)}
            onClick={() => openPanel("sidebarVariant")}
          />
          <SettingCard
            label="Collapsible"
            value={cfg.collapsible === "offcanvas" ? "Off Canvas" : cfg.collapsible.charAt(0).toUpperCase() + cfg.collapsible.slice(1)}
            onClick={() => openPanel("collapsible")}
          />
          <SettingCard
            label="Content Density"
            value={cfg.contentDensity.charAt(0).toUpperCase() + cfg.contentDensity.slice(1)}
            onClick={() => openPanel("contentDensity")}
          />
          <SettingCard
            label="Text Size"
            value={{ sm: "Small", md: "Medium", lg: "Large" }[cfg.fontScale]}
            onClick={() => openPanel("fontScale")}
          />
        </div>

        {/* Bottom Actions */}
        <div className="p-3 pt-1 space-y-2">
          <button
            onClick={() => {
              const presets: StylePreset[] = ["luma", "classic", "minimal"];
              const accents = Object.keys(ACCENT_COLORS) as (keyof typeof ACCENT_COLORS)[];
              cfg.setStylePreset(presets[Math.floor(Math.random() * presets.length)]);
              cfg.setAccentColor(accents[Math.floor(Math.random() * accents.length)]);
              cfg.setChartColor(accents[Math.floor(Math.random() * accents.length)]);
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium border border-border/40 hover:border-border/70 bg-card/50 hover:bg-muted/30 text-foreground transition-all active:scale-[0.98]"
          >
            <Shuffle className="h-3.5 w-3.5" />
            {cfg.t("خلط عشوائي", "Shuffle")}
          </button>

          <button
            onClick={() => {
              cfg.setStylePreset("luma"); cfg.setBaseColor("neutral"); cfg.setAccentColor("blue");
              cfg.setChartColor("emerald"); cfg.setHeadingFont("geist"); cfg.setBodyFont("geist");
              cfg.setFontScale("md"); cfg.setIconLibrary("lucide"); cfg.setBorderRadius("default");
              cfg.setContentDensity("default"); cfg.setSidebarVariant("inset"); cfg.setCollapsible("icon");
            }}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/70 hover:bg-muted/30 transition-all active:scale-[0.98]"
          >
            {cfg.t("إعادة تعيين", "Reset to defaults")}
          </button>
        </div>
      </ScrollArea>
    </div>
  );

  const renderPanel = () => {
    if (panel === "style") return <OptionPicker title="Style" options={styleOptions} value={cfg.stylePreset} onChange={cfg.setStylePreset} onBack={goBack} />;
    if (panel === "baseColor") return <OptionPicker title="Base Color" options={baseColorOptions} value={cfg.baseColor} onChange={cfg.setBaseColor} onBack={goBack} />;
    if (panel === "accentColor") return <ColorPickerPanel title="Theme Color" colors={ACCENT_COLORS} value={cfg.accentColor} onChange={cfg.setAccentColor} onBack={goBack} />;
    if (panel === "chartColor") return <ColorPickerPanel title="Chart Color" colors={ACCENT_COLORS} value={cfg.chartColor} onChange={cfg.setChartColor} onBack={goBack} />;
    if (panel === "headingFont") return <OptionPicker title="Heading Font" options={fontOptions} value={cfg.headingFont} onChange={cfg.setHeadingFont} onBack={goBack} />;
    if (panel === "bodyFont") return <OptionPicker title="Body Font" options={fontOptions} value={cfg.bodyFont} onChange={cfg.setBodyFont} onBack={goBack} />;
    if (panel === "fontScale") return <OptionPicker title="Text Size" options={fontScaleOptions} value={cfg.fontScale} onChange={cfg.setFontScale} onBack={goBack} />;
    if (panel === "iconLibrary") return <OptionPicker title="Icon Library" options={iconLibraryOptions} value={cfg.iconLibrary} onChange={cfg.setIconLibrary} onBack={goBack} />;
    if (panel === "borderRadius") return <OptionPicker title="Border Radius" options={borderRadiusOptions} value={cfg.borderRadius} onChange={cfg.setBorderRadius} onBack={goBack} />;
    if (panel === "sidebarVariant") return <OptionPicker title="Sidebar Style" options={sidebarVariantOptions} value={cfg.sidebarVariant} onChange={cfg.setSidebarVariant} onBack={goBack} />;
    if (panel === "collapsible") return <OptionPicker title="Collapsible" options={collapsibleOptions} value={cfg.collapsible} onChange={cfg.setCollapsible} onBack={goBack} />;
    if (panel === "contentDensity") return <OptionPicker title="Content Density" options={densityOptions} value={cfg.contentDensity} onChange={cfg.setContentDensity} onBack={goBack} />;
    return renderMainPanel();
  };

  return (
    <Sheet onOpenChange={(open) => { if (!open) { setPanel(null); setIsAnimating(false); } }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60" aria-label="Customize layout">
          <Sliders className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0 gap-0 w-[280px] border-l border-border/30 shadow-2xl bg-background/98 backdrop-blur-xl" side="right">
        <div
          className={cn("flex flex-col h-full overflow-hidden", slideClass)}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          {renderPanel()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
