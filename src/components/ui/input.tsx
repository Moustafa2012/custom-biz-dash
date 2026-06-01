"use client"

import * as React from "react"
import {
  Eye, EyeOff, X, Search, Upload, CalendarIcon,
  ChevronUp, ChevronDown, Hash, CreditCard, Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Base ────────────────────────────────────────────────────────────────────

type InputProps = React.ComponentProps<"input">

const inputBase = [
  "flex h-11 w-full min-w-0 rounded-xl",
  "border border-border/60",
  "bg-background/80 backdrop-blur-sm dark:bg-muted/30",
  "px-4 py-2 text-sm font-medium",
  "text-foreground placeholder:text-muted-foreground/70",
  "file:mr-3 file:inline-flex file:h-7",
  "file:border-0 file:bg-transparent",
  "file:text-sm file:font-medium file:text-foreground",
  "shadow-sm",
  "transition-[border-color,box-shadow,opacity] duration-200 ease-out",
  "outline-none",
  "focus-visible:border-primary/50",
  "focus-visible:ring-2 focus-visible:ring-primary/15",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive/70",
  "aria-invalid:ring-2 aria-invalid:ring-destructive/15",
  "[&:-webkit-autofill]:bg-background",
].join(" ")

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputBase, className)}
      {...props}
    />
  )
}

// ─── FieldWrapper ─────────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label?: string
  hint?: string
  error?: string
  inputId: string
  children: React.ReactNode
  className?: string
}

function FieldWrapper({ label, hint, error, inputId, children, className }: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground select-none">
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground animate-in fade-in duration-200">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  )
}

function describedBy(inputId: string, error?: string, hint?: string) {
  if (error) return `${inputId}-error`
  if (hint) return `${inputId}-hint`
  return undefined
}

// ─── 1. TextInput ─────────────────────────────────────────────────────────────

interface TextInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function TextInput({ label, hint, error, id, className, ...props }: TextInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <Input type="text" id={inputId} aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)} {...props} />
    </FieldWrapper>
  )
}

// ─── 2. PasswordInput ─────────────────────────────────────────────────────────

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function PasswordInput({ label, hint, error, id, className, ...props }: PasswordInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [show, setShow] = React.useState(false)
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Input type={show ? "text" : "password"} id={inputId} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)} className="pr-11" {...props} />
        <button type="button" tabIndex={-1} onClick={() => setShow(v => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground opacity-60 transition-all duration-150 hover:opacity-100 focus-visible:outline-none focus-visible:opacity-100">
          {show
            ? <EyeOff className="size-4 transition-transform duration-200" />
            : <Eye className="size-4 transition-transform duration-200" />}
        </button>
      </div>
    </FieldWrapper>
  )
}

// ─── 3. SearchInput ───────────────────────────────────────────────────────────

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string; onClear?: () => void
}

function SearchInput({ label, hint, error, onClear, id, className, value, ...props }: SearchInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
        <Input type="search" id={inputId} value={value} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn("pl-10", !!value && onClear ? "pr-10" : "")} {...props} />
        {!!value && onClear && (
          <button type="button" onClick={onClear} aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground opacity-60 transition-all duration-150 hover:opacity-100 focus-visible:outline-none animate-in fade-in zoom-in-75 duration-150">
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </FieldWrapper>
  )
}

// ─── 4. NumberInput ───────────────────────────────────────────────────────────

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
  stepper?: boolean
  step?: number
  min?: number
  max?: number
}

function NumberInput({ label, hint, error, id, className, stepper = false, step = 1, min, max, value, defaultValue, onChange, ...props }: NumberInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [val, setVal] = React.useState<number>(Number(value ?? defaultValue ?? 0))

  const current = value !== undefined ? Number(value) : val

  const update = (next: number) => {
    if (min !== undefined && next < min) next = min
    if (max !== undefined && next > max) next = max
    setVal(next)
    const synth = { target: { value: String(next) } } as React.ChangeEvent<HTMLInputElement>
    onChange?.(synth)
  }

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Input type="number" id={inputId} inputMode="numeric" value={value ?? val} min={min} max={max} step={step}
          aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)}
          onChange={e => { setVal(Number(e.target.value)); onChange?.(e) }}
          className={cn(
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            stepper ? "pr-10" : ""
          )} {...props} />
        {stepper && (
          <div className="absolute inset-y-0 right-0 flex flex-col border-l border-border/40">
            <button type="button" onClick={() => update(current + step)} tabIndex={-1}
              className="flex flex-1 items-center justify-center px-2 text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none">
              <ChevronUp className="size-3" />
            </button>
            <button type="button" onClick={() => update(current - step)} tabIndex={-1}
              className="flex flex-1 items-center justify-center px-2 text-muted-foreground hover:text-foreground border-t border-border/40 transition-colors duration-150 focus-visible:outline-none">
              <ChevronDown className="size-3" />
            </button>
          </div>
        )}
      </div>
    </FieldWrapper>
  )
}

// ─── 5. EmailInput ────────────────────────────────────────────────────────────

interface EmailInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function EmailInput({ label, hint, error, id, className, ...props }: EmailInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <Input type="email" id={inputId} inputMode="email" autoComplete="email"
        aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)} {...props} />
    </FieldWrapper>
  )
}

// ─── 6. TelInput ─────────────────────────────────────────────────────────────

interface TelInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function TelInput({ label, hint, error, id, className, ...props }: TelInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <Input type="tel" id={inputId} inputMode="tel" autoComplete="tel"
        aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)} {...props} />
    </FieldWrapper>
  )
}

// ─── 7. UrlInput ──────────────────────────────────────────────────────────────

interface UrlInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function UrlInput({ label, hint, error, id, className, ...props }: UrlInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
        <Input type="url" id={inputId} inputMode="url" autoComplete="url"
          aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)}
          className="pl-10" {...props} />
      </div>
    </FieldWrapper>
  )
}

// ─── 8. DateInput ─────────────────────────────────────────────────────────────

interface DateInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function DateInput({ label, hint, error, id, className, ...props }: DateInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Input type="date" id={inputId} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn("pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer")}
          {...props} />
        <CalendarIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
      </div>
    </FieldWrapper>
  )
}

// ─── 9. TimeInput ─────────────────────────────────────────────────────────────

interface TimeInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function TimeInput({ label, hint, error, id, className, ...props }: TimeInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <Input type="time" id={inputId} aria-invalid={!!error}
        aria-describedby={describedBy(inputId, error, hint)} {...props} />
    </FieldWrapper>
  )
}

// ─── 10. DateTimeInput ────────────────────────────────────────────────────────

interface DateTimeInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function DateTimeInput({ label, hint, error, id, className, ...props }: DateTimeInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Input type="datetime-local" id={inputId} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          {...props} />
        <CalendarIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
      </div>
    </FieldWrapper>
  )
}

// ─── 11. MonthInput ───────────────────────────────────────────────────────────

interface MonthInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function MonthInput({ label, hint, error, id, className, ...props }: MonthInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Input type="month" id={inputId} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          {...props} />
        <CalendarIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
      </div>
    </FieldWrapper>
  )
}

// ─── 12. WeekInput ────────────────────────────────────────────────────────────

interface WeekInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function WeekInput({ label, hint, error, id, className, ...props }: WeekInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <Input type="week" id={inputId} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          {...props} />
        <CalendarIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
      </div>
    </FieldWrapper>
  )
}

// ─── 13. DateRangeInput ───────────────────────────────────────────────────────

interface DateRangeInputProps {
  label?: string; hint?: string; error?: string
  id?: string; className?: string
  startProps?: Omit<React.ComponentProps<"input">, "type">
  endProps?: Omit<React.ComponentProps<"input">, "type">
  startLabel?: string
  endLabel?: string
}

function DateRangeInput({ label, hint, error, id, className, startProps, endProps, startLabel = "From", endLabel = "To" }: DateRangeInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={`${inputId}-start`} className={className}>
      <div className="grid grid-cols-2 gap-2 w-full">
        {[{ lbl: startLabel, extra: startProps, sfx: "start" }, { lbl: endLabel, extra: endProps, sfx: "end" }].map(({ lbl, extra, sfx }) => (
          <div key={sfx} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{lbl}</span>
            <div className="relative">
              <Input type="date" id={`${inputId}-${sfx}`} aria-invalid={!!error}
                className="pr-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer text-xs sm:text-sm"
                {...extra} />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </FieldWrapper>
  )
}

// ─── 14. TextareaInput ────────────────────────────────────────────────────────

interface TextareaInputProps extends React.ComponentProps<"textarea"> {
  label?: string; hint?: string; error?: string
  maxLength?: number
  showCount?: boolean
}

function TextareaInput({ label, hint, error, id, className, maxLength, showCount = false, value, defaultValue, onChange, ...props }: TextareaInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [len, setLen] = React.useState(String(value ?? defaultValue ?? "").length)

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <textarea id={inputId} data-slot="input" aria-invalid={!!error}
        aria-describedby={describedBy(inputId, error, hint)}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={e => { setLen(e.target.value.length); onChange?.(e) }}
        className={cn(inputBase, "h-auto min-h-[88px] resize-y py-3 leading-relaxed")}
        {...props} />
      {showCount && maxLength && (
        <p className="text-xs text-muted-foreground text-right tabular-nums transition-opacity duration-200">
          {len} / {maxLength}
        </p>
      )}
    </FieldWrapper>
  )
}

// ─── 15. FileInput ────────────────────────────────────────────────────────────

interface FileInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function FileInput({ label, hint, error, id, className, ...props }: FileInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [fileName, setFileName] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <button type="button" onClick={() => inputRef.current?.click()}
        className={cn(inputBase, "cursor-pointer justify-start gap-3 text-left hover:border-border",
          !!error && "border-destructive/70 ring-2 ring-destructive/15")}
        aria-invalid={!!error}>
        <Upload className="size-4 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-hover:scale-110" />
        <span className={cn("truncate text-sm", fileName ? "text-foreground" : "text-muted-foreground/70")}>
          {fileName || "Choose file…"}
        </span>
      </button>
      <input ref={inputRef} type="file" id={inputId} className="sr-only"
        aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)}
        onChange={e => {
          const f = e.target.files
          setFileName(f ? (f.length === 1 ? (f[0]?.name ?? "") : `${f.length} files selected`) : "")
          props.onChange?.(e)
        }}
        {...props} />
    </FieldWrapper>
  )
}

// ─── 16. RangeInput ───────────────────────────────────────────────────────────

interface RangeInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
  showValue?: boolean
}

function RangeInput({ label, hint, error, showValue = true, id, className, value, defaultValue, onChange, ...props }: RangeInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [val, setVal] = React.useState(value ?? defaultValue ?? 50)

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="flex items-center gap-3 w-full">
        <input type="range" id={inputId} value={value ?? val}
          onChange={e => { setVal(e.target.value); onChange?.(e) }}
          aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border/60 accent-primary transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-110"
          {...props} />
        {showValue && (
          <span className="text-sm font-medium tabular-nums text-foreground min-w-[2.5rem] text-right transition-all duration-150">
            {value ?? val}
          </span>
        )}
      </div>
    </FieldWrapper>
  )
}

// ─── 17. CheckboxInput ────────────────────────────────────────────────────────

interface CheckboxInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function CheckboxInput({ label, hint, error, id, className, ...props }: CheckboxInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div className="flex items-center gap-2.5">
        <input type="checkbox" id={inputId} aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(
            "size-5 shrink-0 rounded-md border border-border/60 appearance-none",
            "bg-background/80 dark:bg-muted/30 shadow-sm cursor-pointer",
            "transition-[border-color,box-shadow,background-color] duration-200",
            "checked:bg-primary checked:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:border-primary/50",
            "disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive/70",
            "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22><path d=%22M3 8l3.5 3.5L13 5%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] checked:bg-center checked:bg-no-repeat checked:bg-contain",
          )} {...props} />
        {label && <label htmlFor={inputId} className="text-sm font-medium text-foreground cursor-pointer select-none">{label}</label>}
      </div>
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-muted-foreground pl-7 animate-in fade-in duration-200">{hint}</p>}
      {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive pl-7 animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
    </div>
  )
}

// ─── 18. RadioInput ───────────────────────────────────────────────────────────

interface RadioOption { label: string; value: string; hint?: string; disabled?: boolean }

interface RadioInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
  options: RadioOption[]
  orientation?: "horizontal" | "vertical"
}

function RadioInput({ label, hint, error, options, orientation = "vertical", id, className, ...props }: RadioInputProps) {
  const uid = React.useId()
  const groupId = id ?? uid
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <div className={cn("flex gap-3", orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col")}>
        {options.map(opt => {
          const optId = `${groupId}-${opt.value}`
          return (
            <label key={opt.value} htmlFor={optId}
              className={cn("flex items-center gap-2.5 cursor-pointer select-none", opt.disabled && "opacity-50 cursor-not-allowed")}>
              <input type="radio" id={optId} value={opt.value} disabled={opt.disabled}
                aria-describedby={opt.hint ? `${optId}-hint` : undefined}
                className="size-5 shrink-0 rounded-full border border-border/60 appearance-none bg-background/80 dark:bg-muted/30 shadow-sm cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 checked:border-[5px] checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:border-primary/50 disabled:pointer-events-none"
                {...props} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
                {opt.hint && <span id={`${optId}-hint`} className="text-xs text-muted-foreground">{opt.hint}</span>}
              </div>
            </label>
          )
        })}
      </div>
      {hint && !error && <p id={`${groupId}-hint`} className="text-xs text-muted-foreground animate-in fade-in duration-200">{hint}</p>}
      {error && <p id={`${groupId}-error`} role="alert" className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
    </div>
  )
}

// ─── 19. SwitchInput ─────────────────────────────────────────────────────────

interface SwitchInputProps extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  label?: string; hint?: string; error?: string
  size?: "sm" | "md" | "lg"
}

function SwitchInput({ label, hint, error, id, className, size = "md", checked, defaultChecked, onChange, ...props }: SwitchInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [on, setOn] = React.useState(checked ?? defaultChecked ?? false)
  const isOn = checked !== undefined ? checked : on

  const trackSize = { sm: "w-8 h-4", md: "w-11 h-6", lg: "w-14 h-7" }[size]
  const thumbSize = { sm: "size-3", md: "size-4", lg: "size-5" }[size]
  const thumbTranslate = isOn ? ({ sm: "translate-x-4", md: "translate-x-5", lg: "translate-x-7" }[size]) : "translate-x-1"

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div className="flex items-center gap-3">
        <button type="button" role="switch" aria-checked={isOn} id={inputId}
          aria-describedby={describedBy(inputId, error, hint)}
          onClick={() => { const next = !isOn; setOn(next); const synth = { target: { checked: next } } as React.ChangeEvent<HTMLInputElement>; onChange?.(synth) }}
          className={cn(
            "relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent",
            "transition-[background-color,box-shadow] duration-200 ease-out cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            trackSize,
            isOn ? "bg-primary" : "bg-border",
          )}>
          <span className={cn("pointer-events-none block rounded-full bg-white shadow-md transition-transform duration-200 ease-out", thumbSize, thumbTranslate)} />
        </button>
        <input type="checkbox" id={`${inputId}-hidden`} checked={isOn} onChange={() => {}} className="sr-only" tabIndex={-1} {...props} />
        {label && <label htmlFor={inputId} className="text-sm font-medium text-foreground cursor-pointer select-none">{label}</label>}
      </div>
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-muted-foreground animate-in fade-in duration-200">{hint}</p>}
      {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
    </div>
  )
}

// ─── 20. ColorInput ───────────────────────────────────────────────────────────

interface ColorInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function ColorInput({ label, hint, error, id, className, value, defaultValue, onChange, ...props }: ColorInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [val, setVal] = React.useState(value ?? defaultValue ?? "#000000")
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <button type="button" onClick={() => inputRef.current?.click()}
        className={cn(inputBase, "cursor-pointer justify-start gap-3 text-left hover:border-border",
          !!error && "border-destructive/70 ring-2 ring-destructive/15")}>
        <span className="size-5 rounded-md shrink-0 border border-border/40 transition-transform duration-200 hover:scale-105"
          style={{ backgroundColor: String(value ?? val) }} />
        <span className="text-sm font-mono text-foreground">{String(value ?? val).toUpperCase()}</span>
      </button>
      <input ref={inputRef} type="color" id={inputId} className="sr-only"
        value={value ?? val} onChange={e => { setVal(e.target.value); onChange?.(e) }}
        aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)} {...props} />
    </FieldWrapper>
  )
}

// ─── 21. CurrencyInput ────────────────────────────────────────────────────────

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> {
  label?: string; hint?: string; error?: string
  currency?: string
  locale?: string
  value?: number | string
  defaultValue?: number | string
  onValueChange?: (raw: number | null, formatted: string) => void
}

function CurrencyInput({
  label, hint, error, id, className,
  currency = "USD", locale = "en-US",
  value, defaultValue, onValueChange, ...props
}: CurrencyInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid

  const symbolParts = React.useMemo(() => {
    try {
      const parts = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(0)
      return {
        symbol: parts.find(p => p.type === "currency")?.value ?? "$",
        atEnd: /\d\s*[^\d\s]+$/.test(new Intl.NumberFormat(locale, { style: "currency", currency }).format(1)),
      }
    } catch { return { symbol: "$", atEnd: false } }
  }, [locale, currency])

  const toDisplay = (raw: string) => {
    const digits = raw.replace(/[^0-9.]/g, "")
    if (!digits) return ""
    const parts = digits.split(".")
    const int = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? ""
    return parts.length > 1 ? `${int}.${(parts[1] ?? "").slice(0, 2)}` : int
  }

  const initDisplay = value !== undefined || defaultValue !== undefined
    ? toDisplay(String(value ?? defaultValue ?? ""))
    : ""

  const [display, setDisplay] = React.useState(initDisplay)

  React.useEffect(() => {
    if (value !== undefined) setDisplay(toDisplay(String(value)))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "")
    const parts = raw.split(".")
    const sanitized = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}` : parts[0] ?? ""
    const formatted = toDisplay(sanitized)
    setDisplay(formatted)
    const num = sanitized ? parseFloat(sanitized) : null
    onValueChange?.(num, formatted)
  }

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        {!symbolParts.atEnd && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none select-none">
            {symbolParts.symbol}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          id={inputId}
          value={display}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(inputBase, !symbolParts.atEnd ? "pl-8" : "pr-8")}
          {...props}
        />
        {symbolParts.atEnd && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none select-none">
            {symbolParts.symbol}
          </span>
        )}
      </div>
    </FieldWrapper>
  )
}

// ─── 22. PercentageInput ──────────────────────────────────────────────────────

interface PercentageInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> {
  label?: string; hint?: string; error?: string
  value?: number | string
  defaultValue?: number | string
  onValueChange?: (raw: number | null) => void
  min?: number
  max?: number
}

function PercentageInput({ label, hint, error, id, className, value, defaultValue, onValueChange, min = 0, max = 100, ...props }: PercentageInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [display, setDisplay] = React.useState(String(value ?? defaultValue ?? ""))

  React.useEffect(() => { if (value !== undefined) setDisplay(String(value)) }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "")
    const parts = raw.split(".")
    const sanitized = parts.length > 1 ? `${parts[0]}.${parts[1]?.slice(0, 2) ?? ""}` : parts[0] ?? ""
    setDisplay(sanitized)
    const num = sanitized ? Math.min(max, Math.max(min, parseFloat(sanitized))) : null
    onValueChange?.(num)
  }

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <input type="text" inputMode="decimal" id={inputId} value={display} onChange={handleChange}
          aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)}
          className={cn(inputBase, "pr-8")} {...props} />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none select-none">%</span>
      </div>
    </FieldWrapper>
  )
}

// ─── 23. CreditCardInput ──────────────────────────────────────────────────────

const CARD_PATTERNS: Record<string, RegExp> = {
  visa: /^4/,
  mastercard: /^5[1-5]|^2[2-7]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
  dinersclub: /^3(?:0[0-5]|[68])/,
}

function detectCardType(num: string): string | null {
  for (const [type, re] of Object.entries(CARD_PATTERNS)) {
    if (re.test(num)) return type
  }
  return null
}

function formatCard(raw: string, isAmex: boolean): string {
  const digits = raw.replace(/\D/g, "").slice(0, isAmex ? 15 : 16)
  if (isAmex) {
    return digits.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))
  }
  return digits.replace(/(\d{4})/g, "$1 ").trim()
}

interface CreditCardInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string; hint?: string; error?: string
}

function CreditCardInput({ label, hint, error, id, className, value, onChange, ...props }: CreditCardInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [raw, setRaw] = React.useState(String(value ?? "").replace(/\D/g, ""))
  const cardType = detectCardType(raw)
  const isAmex = cardType === "amex"
  const display = value !== undefined ? formatCard(String(value), isAmex) : formatCard(raw, isAmex)

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
        <input type="text" inputMode="numeric" id={inputId}
          value={display}
          onChange={e => {
            const digits = e.target.value.replace(/\D/g, "")
            setRaw(digits)
            const synth = { ...e, target: { ...e.target, value: digits } }
            onChange?.(synth as React.ChangeEvent<HTMLInputElement>)
          }}
          maxLength={isAmex ? 17 : 19}
          autoComplete="cc-number"
          aria-invalid={!!error} aria-describedby={describedBy(inputId, error, hint)}
          className={cn(inputBase, "pl-10 font-mono tracking-widest")} {...props} />
        {cardType && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground uppercase animate-in fade-in zoom-in-75 duration-200">
            {cardType}
          </span>
        )}
      </div>
    </FieldWrapper>
  )
}

// ─── 24. OtpInput ─────────────────────────────────────────────────────────────

interface OtpInputProps {
  label?: string; hint?: string; error?: string
  id?: string; className?: string
  length?: number
  value?: string
  onValueChange?: (value: string, complete: boolean) => void
  inputMode?: "numeric" | "text"
  mask?: boolean
}

function OtpInput({ label, hint, error, id, className, length = 6, value, onValueChange, inputMode = "numeric", mask = false }: OtpInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [slots, setSlots] = React.useState<string[]>(Array.from({ length }, (_, i) => value?.[i] ?? ""))
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  React.useEffect(() => {
    if (value !== undefined) setSlots(Array.from({ length }, (_, i) => value[i] ?? ""))
  }, [value, length])

  const update = (idx: number, char: string) => {
    const next = [...slots]
    next[idx] = char
    setSlots(next)
    const joined = next.join("")
    onValueChange?.(joined, joined.length === length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (slots[idx]) { update(idx, "") }
      else if (idx > 0) { refs.current[idx - 1]?.focus(); update(idx - 1, "") }
    } else if (e.key === "ArrowLeft" && idx > 0) { refs.current[idx - 1]?.focus() }
    else if (e.key === "ArrowRight" && idx < length - 1) { refs.current[idx + 1]?.focus() }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const chars = e.target.value.replace(inputMode === "numeric" ? /\D/g : /[^a-zA-Z0-9]/g, "")
    if (!chars) return
    const pasted = chars.slice(0, length - idx)
    const next = [...slots]
    for (let i = 0; i < pasted.length; i++) { next[idx + i] = pasted[i] ?? "" }
    setSlots(next)
    const joined = next.join("")
    onValueChange?.(joined, joined.length === length)
    const focusIdx = Math.min(idx + pasted.length, length - 1)
    refs.current[focusIdx]?.focus()
  }

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="flex gap-2 w-full" role="group" aria-labelledby={label ? `${inputId}-label` : undefined}>
        {slots.map((slot, idx) => (
          <input
            key={idx}
            ref={el => { refs.current[idx] = el }}
            type={mask ? "password" : "text"}
            inputMode={inputMode}
            maxLength={1}
            value={slot}
            id={idx === 0 ? inputId : undefined}
            aria-label={`Digit ${idx + 1} of ${length}`}
            aria-invalid={!!error}
            onChange={e => handleChange(e, idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
            onFocus={e => e.target.select()}
            className={cn(
              "flex-1 min-w-0 h-11 text-center text-sm font-mono font-semibold",
              "rounded-xl border border-border/60",
              "bg-background/80 dark:bg-muted/30 shadow-sm",
              "transition-[border-color,box-shadow] duration-200 ease-out",
              "outline-none",
              "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/15",
              slot && "border-border",
              !!error && "border-destructive/70 ring-2 ring-destructive/15",
            )}
          />
        ))}
      </div>
    </FieldWrapper>
  )
}

// ─── 25. PinInput ─────────────────────────────────────────────────────────────

interface PinInputProps {
  label?: string; hint?: string; error?: string
  id?: string; className?: string
  length?: number
  value?: string
  onValueChange?: (value: string, complete: boolean) => void
  mask?: boolean
}

function PinInput({ label, hint, error, id, className, length = 4, value, onValueChange, mask = true }: PinInputProps) {
  return (
    <OtpInput
      label={label} hint={hint} error={error} id={id} className={className}
      length={length} value={value} onValueChange={onValueChange}
      inputMode="numeric" mask={mask}
    />
  )
}

// ─── 26. TagsInput ────────────────────────────────────────────────────────────

interface TagsInputProps {
  label?: string; hint?: string; error?: string
  id?: string; className?: string
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
}

function TagsInput({ label, hint, error, id, className, value, defaultValue, onValueChange, placeholder = "Add tag…", maxTags, disabled }: TagsInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [tags, setTags] = React.useState<string[]>(value ?? defaultValue ?? [])
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const current = value ?? tags
  const atMax = maxTags !== undefined && current.length >= maxTags

  const addTag = (val: string) => {
    const trimmed = val.trim()
    if (!trimmed || current.includes(trimmed) || atMax) return
    const next = [...current, trimmed]
    setTags(next)
    onValueChange?.(next)
    setInput("")
  }

  const removeTag = (idx: number) => {
    const next = current.filter((_, i) => i !== idx)
    setTags(next)
    onValueChange?.(next)
  }

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          inputBase, "h-auto min-h-[44px] flex-wrap gap-1.5 py-2 px-3 cursor-text",
          "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15",
          !!error && "border-destructive/70 ring-2 ring-destructive/15",
          disabled && "opacity-50 pointer-events-none",
        )}>
        {current.map((tag, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-0.5 text-xs font-medium text-foreground animate-in fade-in zoom-in-90 duration-150">
            <Hash className="size-2.5 text-muted-foreground/70" />
            {tag}
            <button type="button" onClick={() => removeTag(idx)} aria-label={`Remove ${tag}`}
              className="ml-0.5 rounded-sm opacity-50 hover:opacity-100 transition-opacity duration-150 focus-visible:outline-none">
              <X className="size-2.5" />
            </button>
          </span>
        ))}
        {!atMax && (
          <input
            ref={inputRef} id={inputId} value={input} disabled={disabled}
            placeholder={current.length === 0 ? placeholder : ""}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input) }
              if (e.key === "Backspace" && !input && current.length > 0) removeTag(current.length - 1)
            }}
            aria-invalid={!!error}
            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground/70"
          />
        )}
      </div>
    </FieldWrapper>
  )
}

// ─── 27. IbanInput ────────────────────────────────────────────────────────────

const IBAN_LENGTHS: Record<string, number> = {
  AL: 28, AD: 24, AT: 20, AZ: 28, BH: 22, BY: 28, BE: 16, BA: 20, BR: 29,
  BG: 22, CR: 22, HR: 21, CY: 28, CZ: 24, DK: 18, DO: 28, EG: 29, SV: 28,
  EE: 20, FO: 18, FI: 18, FR: 27, GE: 22, DE: 22, GI: 23, GL: 18, GT: 28,
  HU: 28, IS: 26, IQ: 23, IE: 22, IL: 23, IT: 27, JO: 30, KZ: 20, XK: 20,
  KW: 30, LV: 21, LB: 28, LY: 25, LI: 21, LT: 20, LU: 20, MK: 19, MT: 31,
  MR: 27, MU: 30, MC: 27, MD: 24, ME: 22, NL: 18, NO: 15, PK: 24, PS: 29,
  PL: 28, PT: 25, QA: 29, RO: 24, LC: 32, SM: 27, ST: 25, SA: 24, RS: 22,
  SC: 31, SK: 24, SI: 19, ES: 24, SE: 24, CH: 21, TL: 23, TN: 24, TR: 26,
  UA: 29, AE: 23, GB: 22, VA: 22, VG: 24,
}

function mod97(str: string): number {
  let r = 0
  for (let i = 0; i < str.length; i++) r = (r * 10 + parseInt(str[i]!, 10)) % 97
  return r
}

function validateIBAN(iban: string): boolean {
  const raw = iban.replace(/\s/g, "").toUpperCase()
  if (raw.length < 4) return false
  const country = raw.slice(0, 2)
  const expectedLength = IBAN_LENGTHS[country]
  if (!expectedLength || raw.length !== expectedLength) return false
  const rearranged = raw.slice(4) + raw.slice(0, 4)
  const numeric = rearranged.replace(/[A-Z]/g, c => String(c.charCodeAt(0) - 55))
  return mod97(numeric) === 1
}

function formatIBAN(value: string): string {
  const raw = value.replace(/\s/g, "").toUpperCase()
  return raw.match(/.{1,4}/g)?.join(" ") ?? raw
}

interface IbanInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  label?: string; hint?: string; error?: string
  value?: string
  onValueChange?: (raw: string, formatted: string, isValid: boolean) => void
}

function IbanInput({ label, hint, error, id, className, value, onValueChange, ...props }: IbanInputProps) {
  const uid = React.useId()
  const inputId = id ?? uid
  const [internal, setInternal] = React.useState("")
  const isControlled = value !== undefined
  const display = formatIBAN(isControlled ? (value ?? "") : internal)
  const raw = display.replace(/\s/g, "")
  const country = raw.slice(0, 2)
  const expectedLength = IBAN_LENGTHS[country] ?? null
  const isComplete = !!expectedLength && raw.length === expectedLength
  const isValid = isComplete ? validateIBAN(raw) : null

  return (
    <FieldWrapper label={label} hint={hint} error={error} inputId={inputId} className={className}>
      <div className="relative w-full">
        <input
          type="text" id={inputId} value={display} spellCheck={false} autoComplete="off" inputMode="text"
          placeholder="SA00 0000 0000 0000 0000 0000"
          maxLength={(expectedLength ?? 34) + Math.floor((expectedLength ?? 34) / 4)}
          aria-invalid={!!error || isValid === false}
          aria-describedby={describedBy(inputId, error, hint)}
          onChange={e => {
            const cleaned = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
            const formatted = formatIBAN(cleaned)
            if (!isControlled) setInternal(formatted)
            onValueChange?.(cleaned, formatted, validateIBAN(cleaned))
          }}
          className={cn(
            inputBase, "font-mono tracking-wider pr-20",
            isValid === true && "border-border focus-visible:border-primary/50",
            isValid === false && !error && "border-destructive/70 ring-2 ring-destructive/15",
          )} {...props} />
        {isComplete && isValid !== null && (
          <span className={cn(
            "absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold animate-in fade-in zoom-in-75 duration-200",
            isValid ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
          )}>
            {isValid ? "Valid" : "Invalid"}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {raw.length === 0
          ? "Enter your IBAN number"
          : expectedLength
          ? `${raw.length} / ${expectedLength} characters`
          : "Unrecognized country code"}
      </p>
    </FieldWrapper>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  // base
  Input,
  // typed
  TextInput,
  PasswordInput,
  SearchInput,
  NumberInput,
  EmailInput,
  TelInput,
  UrlInput,
  DateInput,
  TimeInput,
  DateTimeInput,
  MonthInput,
  WeekInput,
  DateRangeInput,
  TextareaInput,
  FileInput,
  RangeInput,
  CheckboxInput,
  RadioInput,
  SwitchInput,
  ColorInput,
  // formatted
  CurrencyInput,
  PercentageInput,
  CreditCardInput,
  OtpInput,
  PinInput,
  TagsInput,
  IbanInput,
  // helpers
  validateIBAN,
  formatIBAN,
  detectCardType,
}

export type {
  InputProps,
  TextInputProps,
  PasswordInputProps,
  SearchInputProps,
  NumberInputProps,
  EmailInputProps,
  TelInputProps,
  UrlInputProps,
  DateInputProps,
  TimeInputProps,
  DateTimeInputProps,
  MonthInputProps,
  WeekInputProps,
  DateRangeInputProps,
  TextareaInputProps,
  FileInputProps,
  RangeInputProps,
  CheckboxInputProps,
  RadioOption,
  RadioInputProps,
  SwitchInputProps,
  ColorInputProps,
  CurrencyInputProps,
  PercentageInputProps,
  CreditCardInputProps,
  OtpInputProps,
  PinInputProps,
  TagsInputProps,
  IbanInputProps,
}