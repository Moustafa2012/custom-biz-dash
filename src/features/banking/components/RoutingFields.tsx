import { useAppConfig } from "@/components/erp/app-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  COUNTRY_LIST, getCountryConfig, type CountryCode,
} from "../lib/countries";
import type { RoutingFields as RoutingFieldsT } from "../types";

interface Props {
  country: CountryCode;
  onCountryChange: (c: CountryCode) => void;
  values: RoutingFieldsT;
  onChange: (next: RoutingFieldsT) => void;
  idPrefix?: string;
}

/**
 * Renders a country selector + the country-specific routing inputs.
 * Single source of truth for both the company-bank-account and beneficiary forms.
 */
export function RoutingFields({ country, onCountryChange, values, onChange, idPrefix = "rf" }: Props) {
  const { t, language } = useAppConfig();
  const config = getCountryConfig(country);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${idPrefix}-country`}>{t("الدولة", "Country")} *</Label>
        <Select value={country} onValueChange={(v) => { onCountryChange(v as CountryCode); onChange({}); }}>
          <SelectTrigger id={`${idPrefix}-country`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_LIST.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="mr-2">{c.flag}</span>
                {language === "ar" ? c.nameAr : c.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {config.fields.map((f) => (
        <div key={f.key} className="space-y-2">
          <Label htmlFor={`${idPrefix}-${f.key}`}>
            {language === "ar" ? f.labelAr : f.labelEn}
            {f.required ? " *" : ""}
          </Label>
          <Input
            id={`${idPrefix}-${f.key}`}
            value={values[f.key] || ""}
            onChange={(e) => onChange({ ...values, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            pattern={f.pattern}
            required={f.required}
          />
        </div>
      ))}
    </div>
  );
}
