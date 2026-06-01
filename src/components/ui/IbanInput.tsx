"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations";

// IBAN country lengths map
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
};

function mod97(str: string): number {
  let remainder = 0;
  for (let i = 0; i < str.length; i++) {
    remainder = (remainder * 10 + parseInt(str[i], 10)) % 97;
  }
  return remainder;
}

function validateIBAN(iban: string): boolean {
  const raw = iban.replace(/\s/g, "").toUpperCase();
  if (raw.length < 4) return false;

  const country = raw.slice(0, 2);
  const expectedLength = IBAN_LENGTHS[country];
  if (!expectedLength || raw.length !== expectedLength) return false;

  // Move first 4 chars to end, convert letters to numbers
  const rearranged = raw.slice(4) + raw.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) =>
    String(c.charCodeAt(0) - 55)
  );

  return mod97(numeric) === 1;
}

function formatIBAN(value: string): string {
  const raw = value.replace(/\s/g, "").toUpperCase();
  return raw.match(/.{1,4}/g)?.join(" ") ?? raw;
}

type ValidationState = "idle" | "valid" | "invalid";

export interface IbanInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (raw: string, formatted: string, isValid: boolean) => void;
  showBadge?: boolean;
  containerClassName?: string;
}

const IbanInput = React.forwardRef<HTMLInputElement, IbanInputProps>(
  (
    {
      value,
      onChange,
      showBadge = true,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? "iban-input";
    const [internalValue, setInternalValue] = React.useState("");

    const controlled = value !== undefined;
    const displayValue = controlled ? formatIBAN(value ?? "") : internalValue;

    const rawValue = displayValue.replace(/\s/g, "");
    const country = rawValue.slice(0, 2);
    const expectedLength = IBAN_LENGTHS[country] ?? null;

    const validationState: ValidationState = React.useMemo(() => {
      if (rawValue.length === 0) return "idle";
      if (expectedLength && rawValue.length === expectedLength) {
        return validateIBAN(rawValue) ? "valid" : "invalid";
      }
      return "idle";
    }, [rawValue, expectedLength]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      const formatted = formatIBAN(input);

      if (!controlled) setInternalValue(formatted);
      onChange?.(input, formatted, validateIBAN(input));
    };

    return (
      <div className={cn("flex flex-col ", containerClassName)}>
        <div className="flex items-center justify-between">

          {showBadge && validationState !== "idle" && (
            <Badge
              variant={validationState === "valid" ? "default" : "destructive"}
              className="text-xs px-2 py-0.5 h-5"
              >
              {validationState === "valid" ? t(" صالح", "Valid") : t("غير صالح", "Invalid")}
            </Badge>
          )}
        </div>

        <Input
          {...props}
          id={inputId}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          placeholder={t("SA00 0000 0000 0000 0000 0000", "SA00 0000 0000 0000 0000 0000")}
          maxLength={(expectedLength ?? 34) + Math.floor((expectedLength ?? 34) / 4)}
          spellCheck={false}
          autoComplete="off"
          inputMode="text"
          aria-invalid={validationState === "invalid"}
          aria-describedby={`${inputId}-hint`}
          className={cn(
            "font-mono tracking-wider transition-colors",
            validationState === "valid" &&
              "border-green-500 focus-visible:ring-green-500",
            validationState === "invalid" &&
              "border-destructive focus-visible:ring-destructive",
            className
          )}
        />

        <p
          id={`${inputId}-hint`}
          className="text-xs text-muted-foreground"
          aria-live="polite"
        >
          {rawValue.length === 0
            ? t("أدخل رقم أيبان الخاص بك", "Enter your IBAN number")
            : expectedLength
            ? `${rawValue.length} / ${expectedLength} characters`
            : t("غير معرفة كود المدولة", "Unrecognized country code")}
        </p>
      </div>
    );
  }
);

IbanInput.displayName = "IbanInput";

export { IbanInput, validateIBAN, formatIBAN };
