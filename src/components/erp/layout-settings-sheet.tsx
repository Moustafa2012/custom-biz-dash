import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sliders, ChevronRight, Check } from "lucide-react";
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
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
        <button onClick={onBack} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => { onChange(opt.value); onBack(); }}
              className={cn(
                "flex items-center w-full px-5 py-3.5 gap-4 transition-colors hover:bg-muted/30 text-left",
                value === opt.value && "bg-muted/20"
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
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40">
        <button onClick={onBack} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {(Object.entries(colors) as [string, { hex: string; label: string }][]).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => { onChange(key); onBack(); }}
              className={cn(
                "flex items-center w-full px-5 py-3.5 gap-4 transition-colors hover:bg-muted/30",
                value === key && "bg-muted/20"
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

function SettingRow({ label, sublabel, right, onClick }: {
  label: string; sublabel?: string; right?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "flex items-center w-full px-5 py-3.5 gap-3 transition-colors text-left",
        onClick && "hover:bg-muted/30 active:bg-muted/50",
        !onClick && "cursor-default"
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[11px] leading-tight mb-0.5 text-muted-foreground/80">{label}</p>
        {sublabel && <p className="text-sm font-semibold text-foreground truncate">{sublabel}</p>}
      </div>
      {right && <div className="shrink-0 flex items-center gap-1.5">{right}</div>}
    </button>
  );
}

function SettingGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 my-2 rounded-2xl border border-border/30 bg-card/60 overflow-hidden divide-y divide-border/20">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-5 pt-5 pb-1 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50">
      {children}
    </p>
  );
}

type ActivePanel = null | "style" | "baseColor" | "accentColor" | "chartColor" | "headingFont" | "bodyFont" | "iconLibrary" | "borderRadius" | "sidebarVariant" | "collapsible" | "contentDensity" | "fontScale";

export function LayoutSettingsSheet() {
  const cfg = useAppConfig();
  const [panel, setPanel] = useState<ActivePanel>(null);

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
    <span className="h-5 w-5 rounded-full" style={{ backgroundColor: hex }} />
  );

  const renderMainPanel = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <h2 className="text-sm font-bold tracking-tight">{cfg.t("القائمة", "Menu")}</h2>
      </div>
      <ScrollArea className="flex-1">
        <SectionLabel>{cfg.t("المظهر", "Appearance")}</SectionLabel>
        <SettingGroup>
          <SettingRow label="Style" sublabel={cfg.stylePreset} onClick={() => setPanel("style")} />
          <SettingRow label="Base Color" sublabel={cfg.baseColor} onClick={() => setPanel("baseColor")} />
          <SettingRow label="Accent" sublabel={cfg.getColorLabel(cfg.accentColor)} right={colorDot(ACCENT_COLORS[cfg.accentColor].hex)} onClick={() => setPanel("accentColor")} />
          <SettingRow label="Chart Color" sublabel={cfg.getColorLabel(cfg.chartColor)} right={colorDot(ACCENT_COLORS[cfg.chartColor].hex)} onClick={() => setPanel("chartColor")} />
        </SettingGroup>

        <SectionLabel>{cfg.t("الطباعة", "Typography")}</SectionLabel>
        <SettingGroup>
          <SettingRow label="Heading" sublabel={cfg.headingFont} onClick={() => setPanel("headingFont")} />
          <SettingRow label="Body" sublabel={cfg.bodyFont} onClick={() => setPanel("bodyFont")} />
          <SettingRow label="Text Size" sublabel={{ sm: "Small", md: "Medium", lg: "Large" }[cfg.fontScale]} onClick={() => setPanel("fontScale")} />
        </SettingGroup>

        <SectionLabel>{cfg.t("الواجهة", "Interface")}</SectionLabel>
        <SettingGroup>
          <SettingRow label="Icon Library" sublabel={cfg.iconLibrary} onClick={() => setPanel("iconLibrary")} />
          <SettingRow label="Radius" sublabel={cfg.borderRadius} onClick={() => setPanel("borderRadius")} />
          <SettingRow label="Content Density" sublabel={cfg.contentDensity} onClick={() => setPanel("contentDensity")} />
        </SettingGroup>

        <SectionLabel>{cfg.t("التخطيط", "Layout")}</SectionLabel>
        <SettingGroup>
          <SettingRow label="Sidebar Style" sublabel={cfg.sidebarVariant} onClick={() => setPanel("sidebarVariant")} />
          <SettingRow label="Collapsible" sublabel={cfg.collapsible} onClick={() => setPanel("collapsible")} />
        </SettingGroup>

        <div className="px-4 py-3 pb-6">
          <button
            onClick={() => {
              cfg.setStylePreset("luma"); cfg.setBaseColor("neutral"); cfg.setAccentColor("blue");
              cfg.setChartColor("emerald"); cfg.setHeadingFont("geist"); cfg.setBodyFont("geist");
              cfg.setFontScale("md"); cfg.setIconLibrary("lucide"); cfg.setBorderRadius("default");
              cfg.setContentDensity("default"); cfg.setSidebarVariant("inset"); cfg.setCollapsible("icon");
            }}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/80 hover:bg-muted/30 transition-all"
          >
            {cfg.t("إعادة تعيين إلى الافتراضيات", "Reset to defaults")}
          </button>
        </div>
      </ScrollArea>
    </div>
  );

  const renderPanel = () => {
    if (panel === "style") return <OptionPicker title="Style" options={styleOptions} value={cfg.stylePreset} onChange={cfg.setStylePreset} onBack={() => setPanel(null)} />;
    if (panel === "baseColor") return <OptionPicker title="Base Color" options={baseColorOptions} value={cfg.baseColor} onChange={cfg.setBaseColor} onBack={() => setPanel(null)} />;
    if (panel === "accentColor") return <ColorPickerPanel title="Accent Color" colors={ACCENT_COLORS} value={cfg.accentColor} onChange={cfg.setAccentColor} onBack={() => setPanel(null)} />;
    if (panel === "chartColor") return <ColorPickerPanel title="Chart Color" colors={ACCENT_COLORS} value={cfg.chartColor} onChange={cfg.setChartColor} onBack={() => setPanel(null)} />;
    if (panel === "headingFont") return <OptionPicker title="Heading Font" options={fontOptions} value={cfg.headingFont} onChange={cfg.setHeadingFont} onBack={() => setPanel(null)} />;
    if (panel === "bodyFont") return <OptionPicker title="Body Font" options={fontOptions} value={cfg.bodyFont} onChange={cfg.setBodyFont} onBack={() => setPanel(null)} />;
    if (panel === "fontScale") return <OptionPicker title="Text Size" options={fontScaleOptions} value={cfg.fontScale} onChange={cfg.setFontScale} onBack={() => setPanel(null)} />;
    if (panel === "iconLibrary") return <OptionPicker title="Icon Library" options={iconLibraryOptions} value={cfg.iconLibrary} onChange={cfg.setIconLibrary} onBack={() => setPanel(null)} />;
    if (panel === "borderRadius") return <OptionPicker title="Border Radius" options={borderRadiusOptions} value={cfg.borderRadius} onChange={cfg.setBorderRadius} onBack={() => setPanel(null)} />;
    if (panel === "sidebarVariant") return <OptionPicker title="Sidebar Style" options={sidebarVariantOptions} value={cfg.sidebarVariant} onChange={cfg.setSidebarVariant} onBack={() => setPanel(null)} />;
    if (panel === "collapsible") return <OptionPicker title="Collapsible" options={collapsibleOptions} value={cfg.collapsible} onChange={cfg.setCollapsible} onBack={() => setPanel(null)} />;
    if (panel === "contentDensity") return <OptionPicker title="Content Density" options={densityOptions} value={cfg.contentDensity} onChange={cfg.setContentDensity} onBack={() => setPanel(null)} />;
    return renderMainPanel();
  };

  return (
    <Sheet onOpenChange={(open) => { if (!open) setPanel(null); }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60" aria-label="Customize layout">
          <Sliders className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0 gap-0 w-72 border-l border-border/40 shadow-2xl bg-background/95 backdrop-blur" side="right">
        <div className="flex flex-col h-full overflow-hidden">
          {renderPanel()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
