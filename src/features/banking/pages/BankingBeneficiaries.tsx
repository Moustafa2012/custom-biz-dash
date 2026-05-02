import { useState } from "react";
import { useAppConfig } from "@/components/erp/app-config";
import { useBankingStore } from "../stores/banking-store";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RoutingFields } from "../components/RoutingFields";
import { COUNTRY_CONFIGS, getCountryConfig, type CountryCode } from "../lib/countries";
import type { Beneficiary, RoutingFields as RoutingFieldsT } from "../types";
import { Users, Plus, Trash2, Save, Mail, Phone, MapPin, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BankingBeneficiaries() {
  const { t, language } = useAppConfig();
  const { toast } = useToast();
  const can = useAuthStore((s) => s.can);
  const canEdit = can("banking.*") || can("banking.beneficiaries.create") || can("banking.transfers.create");

  const beneficiaries = useBankingStore((s) => s.beneficiaries);
  const addBeneficiary = useBankingStore((s) => s.addBeneficiary);
  const removeBeneficiary = useBankingStore((s) => s.removeBeneficiary);

  const [showForm, setShowForm] = useState(false);
  const [country, setCountry] = useState<CountryCode>("SA");
  const [routing, setRouting] = useState<RoutingFieldsT>({});
  const [form, setForm] = useState({
    fullName: "", relationship: "", bankName: "", accountNumber: "",
    iban: "", phone: "", email: "", address: "",
  });

  const reset = () => {
    setForm({ fullName: "", relationship: "", bankName: "", accountNumber: "", iban: "", phone: "", email: "", address: "" });
    setRouting({});
    setShowForm(false);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cfg = getCountryConfig(country);
    for (const f of cfg.fields) {
      if (f.required && !routing[f.key]?.trim()) {
        toast({ title: t("بيانات ناقصة", "Missing field"), description: language === "ar" ? f.labelAr : f.labelEn, variant: "destructive" });
        return;
      }
    }
    const b: Beneficiary = {
      id: `bn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...form,
      country,
      routing,
      createdAt: new Date().toISOString(),
    };
    addBeneficiary(b);
    toast({ title: t("تمت الإضافة", "Added"), description: t("تم حفظ المستفيد.", "Beneficiary saved.") });
    reset();
  };

  if (!canEdit && beneficiaries.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[300px]">
        <div className="text-center space-y-2">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">{t("ليس لديك صلاحية لإدارة المستفيدين.", "You don't have permission to manage beneficiaries.")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t("المستفيدون", "Beneficiaries")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("إدارة المستفيدين المحفوظين للتحويلات.", "Manage saved beneficiaries for transfers.")}</p>
        </div>
        {canEdit && (
          <Button size="sm" onClick={() => setShowForm((v) => !v)} className="gap-2">
            <Plus className="h-4 w-4" />{showForm ? t("إغلاق", "Cancel") : t("إضافة مستفيد", "Add beneficiary")}
          </Button>
        )}
      </div>

      {showForm && canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("مستفيد جديد", "New beneficiary")}</CardTitle>
            <CardDescription>{t("املأ البيانات أدناه ثم احفظ.", "Fill in the details below and save.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="b-name" label={t("الاسم الكامل", "Full name")} value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
                <Field id="b-rel"  label={t("نوع العلاقة", "Relationship")} value={form.relationship} onChange={(v) => setForm({ ...form, relationship: v })} placeholder={t("مورد، شريك، موظف...", "Supplier, partner, employee…")} />
                <Field id="b-bank" label={t("اسم البنك", "Bank name")} value={form.bankName} onChange={(v) => setForm({ ...form, bankName: v })} required />
                <Field id="b-acct" label={t("رقم الحساب", "Account number")} value={form.accountNumber} onChange={(v) => setForm({ ...form, accountNumber: v })} required />
                <Field id="b-iban" label={t("آيبان", "IBAN")} value={form.iban} onChange={(v) => setForm({ ...form, iban: v })} />
                <Field id="b-phone" label={t("الهاتف", "Phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
                <Field id="b-email" label={t("البريد الإلكتروني", "Email")} value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="b-addr">{t("العنوان", "Address")}</Label>
                  <Textarea id="b-addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">{t("بيانات بنك المستفيد", "Beneficiary's bank routing")}</h4>
                <RoutingFields country={country} onCountryChange={setCountry} values={routing} onChange={setRouting} idPrefix="b-rt" />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={reset}>{t("إلغاء", "Cancel")}</Button>
                <Button type="submit" className="gap-2"><Save className="h-4 w-4" />{t("حفظ", "Save")}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {beneficiaries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{t("لم يتم إضافة مستفيدين بعد.", "No beneficiaries added yet.")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficiaries.map((b) => {
            const cfg = COUNTRY_CONFIGS[b.country];
            return (
              <Card key={b.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{b.fullName}</CardTitle>
                      {b.relationship && <p className="text-xs text-muted-foreground mt-0.5">{b.relationship}</p>}
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{cfg.flag} {cfg.code}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{b.bankName}</p>
                    <p className="font-mono text-muted-foreground">{b.accountNumber}</p>
                    {b.iban && <p className="font-mono text-muted-foreground truncate">IBAN: {b.iban}</p>}
                  </div>
                  <div className="border-t pt-2 space-y-1 text-muted-foreground">
                    {cfg.fields.map((f) => b.routing[f.key] && (
                      <div key={f.key} className="flex justify-between gap-2">
                        <span>{language === "ar" ? f.labelAr : f.labelEn}</span>
                        <span className="font-mono truncate">{b.routing[f.key]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 space-y-1 text-muted-foreground">
                    {b.phone && <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{b.phone}</p>}
                    {b.email && <p className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3" />{b.email}</p>}
                    {b.address && <p className="flex items-start gap-1.5"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /><span className="truncate">{b.address}</span></p>}
                  </div>
                  {canEdit && (
                    <div className="flex justify-end pt-1">
                      <Button size="sm" variant="ghost" onClick={() => removeBeneficiary(b.id)} className="h-7 text-destructive hover:text-destructive gap-1">
                        <Trash2 className="h-3.5 w-3.5" />{t("حذف", "Delete")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ id, label, value, onChange, type = "text", required, placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required ? " *" : ""}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </div>
  );
}
