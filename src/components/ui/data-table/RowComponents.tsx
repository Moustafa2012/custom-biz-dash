"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  Copy,
  GripVertical,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import type { ReactNode } from "react";

import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AvatarConfig, EditConfig } from "../../../types/data-table";
import { cn } from "../../../utils/data-table";

// ─── CopyButton ───────────────────────────────────────────────

interface CopyButtonProps {
  value: string;
  type?: "cell" | "row";
  size?: "sm" | "default" | "icon";
  variant?: "ghost" | "outline" | "default";
  showToast?: boolean;
  className?: string;
  onCopy?: (value: string, type: "cell" | "row") => void;
}

export function CopyButton({
  value,
  type = "cell",
  size = "icon",
  variant = "ghost",
  className = "",
  onCopy,
}: CopyButtonProps) {
  const { direction } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value, type);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard error
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            className={cn(
              "h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
              className,
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{copied ? t("تم النسخ!", "Copied!") : type === "row" ? t("نسخ الصف", "Copy row") : t("نسخ", "Copy")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── CopyableCell ─────────────────────────────────────────────

interface CopyableCellProps {
  value: string;
  children: ReactNode;
  enableCopy?: boolean;
  onCopy?: (value: string, type: "cell" | "row") => void;
}

export function CopyableCell({
  value,
  children,
  enableCopy = true,
  onCopy,
}: CopyableCellProps) {
  if (!enableCopy) return <>{children}</>;

  return (
    <div className="group flex items-center gap-2">
      <div className="flex-1">{children}</div>
      <CopyButton value={value} type="cell" onCopy={onCopy} />
    </div>
  );
}

// ─── CopyableRow ──────────────────────────────────────────────

interface CopyableRowProps<TData> {
  data: TData;
  children: ReactNode;
  enableCopy?: boolean;
  className?: string;
  onCopy?: (value: string, type: "cell" | "row") => void;
  formatRowData?: (data: TData) => string;
}

export function CopyableRow<TData>({
  data,
  children,
  enableCopy = true,
  className = "",
  onCopy,
  formatRowData,
}: CopyableRowProps<TData>) {
  const rowDataString = formatRowData
    ? formatRowData(data)
    : JSON.stringify(data, null, 2);

  return (
    <TableRow className={`group relative ${className}`}>
      {children}
      {enableCopy && (
        <td className="p-2">
          <CopyButton
            value={rowDataString}
            type="row"
            onCopy={onCopy}
            className="opacity-0 group-hover:opacity-100"
          />
        </td>
      )}
    </TableRow>
  );
}

// ─── DraggableRow ─────────────────────────────────────────────

interface DraggableRowProps {
  id: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isRTL?: boolean;
}

export const DraggableRow = React.forwardRef<
  HTMLTableRowElement,
  DraggableRowProps
>(({ id, children, className, disabled, isRTL: isRTLProp = false }, ref) => {
  const { direction } = useLanguage();
  const isRTL = isRTLProp || direction === "rtl";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRef = (node: HTMLTableRowElement | null) => {
    setNodeRef(node);
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <TableRow
      ref={handleRef}
      style={style}
      className={cn(
        "relative",
        isDragging && "opacity-50 bg-accent/20 z-50",
        !disabled && "hover:bg-muted/50",
        className,
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {!disabled && (
        <td className="w-[40px] p-0">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center h-full cursor-grab active:cursor-grabbing p-2"
            aria-label={t("سحب الصف", "Drag row")}
          >
            <GripVertical
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </td>
      )}
      {children}
    </TableRow>
  );
});

DraggableRow.displayName = "DraggableRow";

// ─── CellWithIcon ─────────────────────────────────────────────

const sizeMap = {
  "6": "h-6 w-6",
  "8": "h-8 w-8",
  "10": "h-10 w-10",
  "12": "h-12 w-12",
  "16": "h-16 w-16",
} as const;

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
} as const;

interface CellWithIconProps {
  icon?: LucideIcon;
  iconClassName?: string;
  avatar?: AvatarConfig;
  children: ReactNode;
  className?: string;
  tooltip?: string;
  loading?: boolean;
  status?: "online" | "offline" | "busy" | "away";
  clickable?: boolean;
  onClick?: () => void;
  /** Show icon overlaid on avatar */
  showIconWithAvatar?: boolean;
}

export function CellWithIcon({
  icon: Icon,
  iconClassName,
  avatar,
  children,
  className,
  tooltip,
  loading = false,
  status,
  clickable = false,
  onClick,
  showIconWithAvatar = false,
}: CellWithIconProps) {
  const [imageError, setImageError] = React.useState(false);
  const avatarSize = avatar?.size || "8";
  const sizeClass = sizeMap[avatarSize];

  const handleClick = () => {
    if (clickable && onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const renderAvatar = () => (
    <div className="relative flex-shrink-0" title={tooltip}>
      <Avatar className={cn(sizeClass, imageError && "bg-gray-200")}>
        {!imageError && avatar?.src ? (
          <AvatarImage
            src={avatar.src}
            alt={avatar.fallback}
            onError={() => setImageError(true)}
          />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {avatar?.fallback}
          </AvatarFallback>
        )}
      </Avatar>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            statusColors[status],
            avatarSize === "6" ? "h-2 w-2" : "h-3 w-3",
          )}
          aria-label={status}
        />
      )}
      {showIconWithAvatar && Icon && (
        <div
          className={cn(
            "absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-sm",
            iconClassName,
          )}
        >
          <Icon className="h-3 w-3" />
        </div>
      )}
    </div>
  );

  const renderIcon = () => {
    if (!Icon || (avatar && !showIconWithAvatar)) return null;
    return (
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center",
          iconClassName,
        )}
        title={tooltip}
      >
        <Icon className="h-4 w-4" />
        {status && (
          <span
            className={cn("ml-1 block h-2 w-2 rounded-full", statusColors[status])}
            aria-label={status}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        clickable &&
          "cursor-pointer hover:bg-gray-50 rounded-md transition-colors p-1 -m-1",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={tooltip}
    >
      {loading ? (
        <div className={cn("flex-shrink-0 flex items-center justify-center", sizeClass)}>
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {avatar && renderAvatar()}
          {!avatar && renderIcon()}
        </>
      )}
      <div className="flex-1 min-w-0 truncate">{children}</div>
    </div>
  );
}

// ─── InlineEditCell ───────────────────────────────────────────

interface InlineEditCellProps {
  value: unknown;
  onChange: (newValue: unknown) => void;
  editConfig?: EditConfig;
  editable?: boolean;
  children: ReactNode;
  className?: string;
}

export function InlineEditCell({
  value,
  onChange,
  editConfig = { type: "text" },
  editable = true,
  children,
  className,
}: InlineEditCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleStartEdit = React.useCallback(() => {
    if (!editable) return;
    setIsEditing(true);
    setEditValue(value);
    setError(null);
  }, [editable, value]);

  const handleSave = React.useCallback(() => {
    if (editConfig.validation) {
      const validationError = editConfig.validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    onChange(editValue);
    setIsEditing(false);
    setError(null);
  }, [editValue, editConfig, onChange]);

  const handleCancel = React.useCallback(() => {
    setIsEditing(false);
    setEditValue(value);
    setError(null);
  }, [value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); handleSave(); }
      else if (e.key === "Escape") { e.preventDefault(); handleCancel(); }
    },
    [handleSave, handleCancel],
  );

  if (!editable) return <>{children}</>;

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[150px]">
        {editConfig.type === "select" && editConfig.options ? (
          <Select value={editValue as string} onValueChange={setEditValue}>
            <SelectTrigger className="h-8 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {editConfig.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            ref={inputRef}
            type={
              editConfig.type === "number"
                ? "number"
                : editConfig.type === "date"
                  ? "date"
                  : "text"
            }
            value={editValue as string}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={editConfig.placeholder}
            className={cn("h-8 w-full", error && "border-destructive")}
          />
        )}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-600"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {error && (
          <span className="text-xs text-destructive absolute -bottom-5 left-0">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 cursor-pointer rounded px-1 -mx-1 hover:bg-accent/50 transition-colors",
        className,
      )}
      onDoubleClick={handleStartEdit}
    >
      <div className="flex-1">{children}</div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleStartEdit}
      >
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  );
}
