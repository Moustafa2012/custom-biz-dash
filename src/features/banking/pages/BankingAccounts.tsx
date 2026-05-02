import { useState } from "react";
import { useAppConfig } from "@/components/erp/app-config";
import { useBankingStore } from "../stores/banking-store";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoutingFields } from "../components/RoutingFields";
import { COUNTRY_CONFIGS, getCountryConfig, type CountryCode } from "../lib/countries";
import type { BankAccount, AccountType, AccountStatus, RoutingFields as RoutingFieldsT } from "../types";
import { Building2, CreditCard, Plus, Trash2, Save, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ACCOUNT_TYPES: AccountType[] = ["checking", "savings", "credit", "loan", "cash"];

export default function BankingAccounts() {
  const { t, language } = useAppConfig();
  const { toast } = useToast();
  const can = useAuthStore((s) => s.can);
  const canEdit = can("banking.*") || can("banking.accounts.create") || can("banking.accounts.edit");

  const company = useBankingStore((s) => s.company);
  const setCompany = useBankingStore((s) => s.setCompany);
  const accounts = useBankingStore((s) => s.accounts);
  const addAccount = useBankingStore((s) => s.addAccount);
  const removeAccount = useBankingStore((s) => s.removeAccount);

  const [companyDraft, setCompanyDraft] = useState(company);
  const [showForm, setShowForm] = useState(false);

  // New account form state
  const [country, setCountry] = useState<CountryCode>("SA");
  const [routing, setRouting] = useState<RoutingFieldsT>({});
  const [form, setForm] = useState({
    label: "", bankName: "", accountHolder: "", accountNumber: "",
    currency: "SAR", branchAddress: "", type: "checking" as AccountType,
  });

  const saveCompany = () => {
    setCompany(companyDraft);
    toast({ title: t("تم الحفظ", "Saved"), description: t("تم تحديث ملف الشركة.", "Company profile updated.") });
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required routing fields for the chosen country
    const cfg = getCountryConfig(country);
    for (const f of cfg.fields) {
      if (f.required && !routing[f.key]?.trim()) {
        toast({ title: t("بيانات ناقصة", "Missing field"), description: language === "ar" ? f.labelAr : f.labelEn, variant: "destructive" });
        return;
      }
    }

    const acct: BankAccount = {
      id: `acc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      label: form.label.trim(),
      bankName: form.bankName.trim(),
      accountHolder: form.accountHolder.trim(),
      accountNumber: form.accountNumber.trim(),
      currency: form.currency.trim().toUpperCase(),
      country,
      routing,
      branchAddress: form.branchAddress.trim() || undefined,
      status: "active" as AccountStatus,
      createdAt: new Date().toISOString(),
    };
    addAccount(acct);
    setForm({ label: "", bankName: "", accountHolder: "", accountNumber: "", currency: "SAR", branchAddress: "", type: "checking" });
    setRouting({});
    setShowForm(false);
    toast({ title: t("تمت الإضافة", "Added"), description: t("تم حفظ الحساب البنكي.", "Bank account saved.") });
  };

  if (!canEdit && accounts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[300px]">
        <div className="text-center space-y-2">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            {t("ليس لديك صلاحية لإدارة الحسابات البنكية.", "You don't have permission to manage bank accounts.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t("إعداد الحسابات", "Account Setup")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("ملف الشركة وحسابات البنوك", "Company profile and bank accounts")}
        </p>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2"><Building2 className="h-5 w-5 text-primary" /></div>
            <div>
              <CardTitle>{t("ملف الشركة", "Company Profile")}</CardTitle>
              <CardDescription>{t("معلومات أساسية تظهر على رأس المستندات.", "Basic info that appears on document letterheads.")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="c-name"  label={t("اسم الشركة", "Company name")}     value={companyDraft.name}              onChange={(v) => setCompanyDraft({ ...companyDraft, name: v })} disabled={!canEdit} required />
          <Field id="c-reg"   label={t("رقم السجل التجاري", "Registration number")} value={companyDraft.registrationNumber} onChange={(v) => setCompanyDraft({ ...companyDraft, registrationNumber: v })} disabled={!canEdit} />
          <Field id="c-ind"   label={t("القطاع", "Industry")}              value={companyDraft.industry}          onChange={(v) => setCompanyDraft({ ...companyDraft, industry: v })} disabled={!canEdit} />
          <Field id="c-phone" label={t("الهاتف", "Phone")}                 value={companyDraft.phone}             onChange={(v) => setCompanyDraft({ ...companyDraft, phone: v })} disabled={!canEdit} type="tel" />
          <Field id="c-email" label={t("البريد الإلكتروني", "Email")}      value={companyDraft.email}             onChange={(v) => setCompanyDraft({ ...companyDraft, email: v })} disabled={!canEdit} type="email" />
          <Field id="c-web"   label={t("الموقع الإلكتروني", "Website")}    value={companyDraft.website}           onChange={(v) => setCompanyDraft({ ...companyDraft, website: v })} disabled={!canEdit} type="url" />
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="c-addr">{t("العنوان", "Address")}</Label>
            <Textarea id="c-addr" value={companyDraft.address} onChange={(e) => setCompanyDraft({ ...companyDraft, address: e.target.value })} disabled={!canEdit} rows={2} />
          </div>
          {canEdit && (
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={saveCompany} className="gap-2"><Save className="h-4 w-4" />{t("حفظ", "Save")}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2"><CreditCard className="h-5 w-5 text-primary" /></div>
              <div>
                <CardTitle>{t("الحسابات البنكية", "Bank Accounts")}</CardTitle>
                <CardDescription>{t("أضف حساباً واحداً أو أكثر — تتغير الحقول حسب الدولة.", "Add one or more — fields adapt per country.")}</CardDescription>
              </div>
            </div>
            {canEdit && (
              <Button size="sm" onClick={() => setShowForm((v) => !v)} className="gap-2">
                <Plus className="h-4 w-4" />
                {showForm ? t("إغلاق", "Cancel") : t("إضافة حساب", "Add account")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && canEdit && (
            <form onSubmit={handleAddAccount} className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="a-label"  label={t("التسمية", "Label")}            value={form.label}         onChange={(v) => setForm({ ...form, label: v })} required />
                <Field id="a-bank"   label={t("اسم البنك", "Bank name")}      value={form.bankName}      onChange={(v) => setForm({ ...form, bankName: v })} required />
                <Field id="a-holder" label={t("اسم صاحب الحساب", "Account holder")} value={form.accountHolder} onChange={(v) => setForm({ ...form, accountHolder: v })} required />
                <Field id="a-num"    label={t("رقم الحساب", "Account number")} value={form.accountNumber} onChange={(v) => setForm({ ...form, accountNumber: v })} required />
                <Field id="a-cur"    label={t("العملة", "Currency")}          value={form.currency}      onChange={(v) => setForm({ ...form, currency: v.toUpperCase() })} required />
                <div className="space-y-2">
                  <Label htmlFor="a-type">{t("نوع الحساب", "Account type")}</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AccountType })}>
                    <SelectTrigger id="a-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((tp) => <SelectItem key={tp} value={tp}>{tp}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="a-branch">{t("عنوان الفرع", "Branch address")}</Label>
                  <Textarea id="a-branch" value={form.branchAddress} onChange={(e) => setForm({ ...form, branchAddress: e.target.value })} rows={2} />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">{t("بيانات التوجيه (حسب الدولة)", "Routing details (country-specific)")}</h4>
                <RoutingFields country={country} onCountryChange={setCountry} values={routing} onChange={setRouting} idPrefix="a-rt" />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t("إلغاء", "Cancel")}</Button>
                <Button type="submit" className="gap-2"><Save className="h-4 w-4" />{t("حفظ الحساب", "Save account")}</Button>
              </div>
            </form>
          )}

          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t("لم تتم إضافة حسابات بعد.", "No accounts added yet.")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((a) => {
                const cfg = COUNTRY_CONFIGS[a.country];
                return (
                  <div key={a.id} className="rounded-lg border bg-card p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">{a.label}</h4>
                        <p className="text-xs text-muted-foreground">{a.bankName} · {a.accountHolder}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{cfg.flag} {a.currency}</Badge>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground">{a.accountNumber}</p>
                    <div className="text-xs space-y-0.5">
                      {cfg.fields.map((f) => a.routing[f.key] && (
                        <div key={f.key} className="flex justify-between gap-2">
                          <span className="text-muted-foreground">{language === "ar" ? f.labelAr : f.labelEn}</span>
                          <span className="font-mono truncate">{a.routing[f.key]}</span>
                        </div>
                      ))}
                    </div>
                    {canEdit && (
                      <div className="flex justify-end pt-1">
                        <Button size="sm" variant="ghost" onClick={() => removeAccount(a.id)} className="h-7 text-destructive hover:text-destructive gap-1">
                          <Trash2 className="h-3.5 w-3.5" />{t("حذف", "Delete")}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ id, label, value, onChange, type = "text", required, disabled }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required ? " *" : ""}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} disabled={disabled} />
    </div>
  );
}
