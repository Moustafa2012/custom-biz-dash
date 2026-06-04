"use client";

import {
  IconArrowLeft,
  IconBuildingBank,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCoin,
  IconDeviceFloppy,
  IconDownload,
  IconFlag,
  IconInfoCircle,
  IconNotes,
  IconPrinter,
  IconSend,
  IconUser,
  IconUserPlus,
  IconX,
  IconAlertCircle,
  IconShieldCheck,
  IconHelp,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrev,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { t } from "@/lib/translations";
import { CurrencyAmount, DynamicBankFields } from "@/apps/synex/components";
import { getCountryOptions, currencyConfigs } from "@/apps/synex/data/banks";
import { downloadTransferPDF, previewTransferPDF } from "@/apps/synex/lib/PDF-Gen";
import { useSynex } from "@/apps/synex/store/synex-store.tsx";

// ─── helpers ─────────────────────────────────────────────────────────────────
const generateRef = () =>
  `TRF${new Date().getFullYear()}${Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")}`;

// ─── steps config ─────────────────────────────────────────────────────────────
const steps = [
  {
    value: "source",
    title: t("الحساب المصدر", "Source Account"),
    description: t("اختر حساب الإرسال", "Choose sending account"),
    icon: IconBuildingBank,
    tips: [
      {
        icon: IconInfoCircle,
        title: t("اختيار الحساب", "Choosing Account"),
        body: t(
          "اختر الحساب الذي سيتم الخصم منه. تأكد أن لديك رصيد كافٍ.",
          "Select the account to debit from. Ensure you have sufficient balance.",
        ),
      },
      {
        icon: IconShieldCheck,
        title: t("التحقق من الرصيد", "Balance Check"),
        body: t(
          "يُعرض لك الرصيد الحالي لمساعدتك في تحديد المبلغ المناسب.",
          "The current balance is shown to help you determine the right amount.",
        ),
      },
    ],
  },
  {
    value: "beneficiary",
    title: t("المستفيد", "Beneficiary"),
    description: t("بيانات المستفيد", "Recipient details"),
    icon: IconUser,
    tips: [
      {
        icon: IconUserPlus,
        title: t("إضافة مستفيد", "Add Beneficiary"),
        body: t(
          "يمكنك اختيار مستفيد موجود أو إضافة مستفيد جديد مباشرة من هنا.",
          "You can pick an existing beneficiary or add a new one right here.",
        ),
      },
      {
        icon: IconHelp,
        title: t("بيانات البنك", "Bank Fields"),
        body: t(
          "تتغير حقول البنك تلقائيًا بحسب الدولة المختارة.",
          "Bank fields change automatically based on the selected country.",
        ),
      },
    ],
  },
  {
    value: "details",
    title: t("تفاصيل التحويل", "Transfer Details"),
    description: t("المبلغ والأولوية", "Amount & priority"),
    icon: IconCoin,
    tips: [
      {
        icon: IconAlertCircle,
        title: t("سبب التحويل", "Transfer Reason"),
        body: t(
          "سبب التحويل مطلوب للامتثال للوائح المالية. كن دقيقًا.",
          "Transfer reason is required for financial compliance. Be accurate.",
        ),
      },
      {
        icon: IconClock,
        title: t("تاريخ التنفيذ", "Execution Date"),
        body: t(
          "يمكنك جدولة التحويل في تاريخ مستقبلي أو تنفيذه فورًا.",
          "You can schedule the transfer for a future date or execute it immediately.",
        ),
      },
    ],
  },
  {
    value: "review",
    title: t("المراجعة", "Review"),
    description: t("مراجعة وتأكيد", "Review & confirm"),
    icon: IconCircleCheck,
    tips: [
      {
        icon: IconCircleCheck,
        title: t("تأكيد نهائي", "Final Confirmation"),
        body: t(
          "راجع كل التفاصيل بعناية. بعد الإرسال لا يمكن التراجع.",
          "Review all details carefully. Transfers cannot be reversed after sending.",
        ),
      },
      {
        icon: IconShieldCheck,
        title: t("خيارات الحفظ", "Save Options"),
        body: t(
          "يمكنك حفظ كمسودة أو تحميل PDF أو إرسال التحويل مباشرة.",
          "You can save as draft, download PDF, or send the transfer directly.",
        ),
      },
    ],
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────
function ReviewRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-medium text-right ${mono ? "font-mono" : ""} ${highlight ? "text-primary" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function TipsPanel({ tips }: { tips: (typeof steps)[0]["tips"] }) {
  return (
    <aside className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
        {t("نصائح وإرشادات", "Tips & Guidance")}
      </p>
      {tips.map((tip, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 bg-muted/30 p-4 flex gap-3"
        >
          <div className="mt-0.5 shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <tip.icon className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">{tip.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.body}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

function DetailCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 px-5 py-1 divide-y divide-border/40">
      {children}
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function NewTransferPage() {
  const navigate = useNavigate();
  const { state, loadFromStorage, addTransfer } = useSynex();

  const [step, setStep] = React.useState("source");
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showNewBeneficiary, setShowNewBeneficiary] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<string>("");

  const [formData, setFormData] = React.useState({
    sourceAccountId: "",
    beneficiaryId: "",
    country: "",
    bankName: "",
    amount: "",
    currency: "",
    transferReason: "",
    notes: "",
    executionDate: new Date().toISOString().split("T")[0],
    transferType: "external" as "external" | "internal" | "salary" | "supplier" | "other",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    bankingData: {} as Record<string, string>,
  });

  const [newBeneficiary, setNewBeneficiary] = React.useState({
    name: "",
    companyName: "",
    country: "",
    bankName: "",
    currency: "",
    email: "",
    phone: "",
    address: "",
    bankingData: {} as Record<string, string>,
  });

  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const selectedAccount = state.accounts.find((a) => a.id === formData.sourceAccountId);
  const selectedBeneficiary = state.beneficiaries.find((b) => b.id === formData.beneficiaryId);

  // Auto-fill from beneficiary
  React.useEffect(() => {
    if (selectedBeneficiary) {
      setFormData((p) => ({
        ...p,
        country: selectedBeneficiary.country,
        bankName: selectedBeneficiary.bankName,
        currency: selectedBeneficiary.currency,
        bankingData: selectedBeneficiary.bankingData,
      }));
    }
  }, [selectedBeneficiary]);

  // Auto-fill currency from account
  React.useEffect(() => {
    if (selectedAccount) {
      setFormData((p) => ({ ...p, currency: selectedAccount.currency }));
    }
  }, [selectedAccount]);

  const update = (key: string, value: string) =>
    setFormData((p) => ({ ...p, [key]: value }));

  const stepIndex = steps.findIndex((s) => s.value === step);
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const currentStepData = steps[stepIndex];

  const validate = (s: string): boolean => {
    const errs: Record<string, string> = {};

    if (s === "source") {
      if (!formData.sourceAccountId)
        errs.sourceAccountId = t("يرجى اختيار الحساب المصدر", "Please select source account");
    }

    if (s === "beneficiary") {
      if (!formData.beneficiaryId && !showNewBeneficiary)
        errs.beneficiaryId = t("يرجى اختيار المستفيد", "Please select beneficiary");
      if (showNewBeneficiary) {
        if (!newBeneficiary.name)
          errs.beneficiaryName = t("اسم المستفيد مطلوب", "Beneficiary name is required");
        if (!newBeneficiary.country)
          errs.beneficiaryCountry = t("دولة المستفيد مطلوبة", "Beneficiary country is required");
        if (!newBeneficiary.bankName)
          errs.beneficiaryBank = t("اسم البنك مطلوب", "Bank name is required");
      }
    }

    if (s === "details") {
      if (!formData.amount || parseFloat(formData.amount) <= 0)
        errs.amount = t("المبلغ يجب أن يكون أكبر من صفر", "Amount must be greater than zero");
      if (!formData.transferReason)
        errs.transferReason = t("سبب التحويل مطلوب", "Transfer reason is required");
      if (!formData.executionDate)
        errs.executionDate = t("تاريخ التنفيذ مطلوب", "Execution date is required");
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onValidate: NonNullable<StepperProps["onValidate"]> = React.useCallback(
    async (_value, direction) => {
      if (direction === "prev") return true;
      const ok = validate(step);
      if (!ok) toast.error(t("يرجى إكمال الحقول المطلوبة", "Please complete required fields"));
      if (ok && step === "details") generatePreview();
      return ok;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, formData, newBeneficiary, showNewBeneficiary],
  );

  const generatePreview = () => {
    if (!selectedAccount || !selectedBeneficiary) return;
    const data = buildTransferData("draft");
    setPreviewData(previewTransferPDF(data));
  };

  const buildTransferData = (status: "draft" | "sent") => ({
    transfer: {
      id: "",
      referenceNumber: generateRef(),
      sourceAccountId: formData.sourceAccountId,
      beneficiaryId: formData.beneficiaryId,
      country: formData.country,
      bankName: formData.bankName,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      status,
      transferReason: formData.transferReason,
      notes: formData.notes,
      executionDate: new Date(formData.executionDate),
      transferType: formData.transferType,
      priority: formData.priority,
      createdBy: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      sentAt: status === "sent" ? new Date() : undefined,
    },
    sourceAccount: selectedAccount!,
    beneficiary: selectedBeneficiary!,
  });

  const handleAction = async (action: "save" | "send" | "download" | "print") => {
    if (!selectedAccount || !selectedBeneficiary) return;
    setSaving(true);

    try {
      await new Promise((r) => setTimeout(r, 600));
      const transferData = buildTransferData(action === "send" ? "sent" : "draft");

      if (action === "download") {
        downloadTransferPDF(transferData);
        toast.success(t("تم تحميل ملف PDF", "PDF downloaded"));
        return;
      }
      if (action === "print") {
        window.print();
        return;
      }

      addTransfer({
        sourceAccountId: formData.sourceAccountId,
        beneficiaryId: formData.beneficiaryId,
        country: formData.country,
        bankName: formData.bankName,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        transferReason: formData.transferReason,
        notes: formData.notes,
        executionDate: new Date(formData.executionDate),
        transferType: formData.transferType,
        priority: formData.priority,
        status: action === "send" ? "sent" : "draft",
        referenceNumber: generateRef(),
        createdBy: "admin",
      });

      toast.success(
        action === "send"
          ? t("تم إرسال التحويل بنجاح", "Transfer sent successfully")
          : t("تم حفظ التحويل كمسودة", "Transfer saved as draft"),
      );
      navigate("/synex/transfers");
    } finally {
      setSaving(false);
    }
  };

  const priorityLabel: Record<string, string> = {
    low: t("منخفضة", "Low"),
    medium: t("متوسطة", "Medium"),
    high: t("عالية", "High"),
    urgent: t("عاجلة", "Urgent"),
  };

  const typeLabel: Record<string, string> = {
    external: t("خارجي", "External"),
    internal: t("داخلي", "Internal"),
    salary: t("راتب", "Salary"),
    supplier: t("مورد", "Supplier"),
    other: t("أخرى", "Other"),
  };

  return (
    <AppLayout title={t("تحويل جديد", "New Transfer")}>
      <div className="mx-auto max-w-6xl pb-16 px-4 sm:px-6">

        {/* ── back ── */}
        <div className="pt-4 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/synex/transfers")}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 rounded-full"
          >
            <IconArrowLeft className="h-4 w-4" />
            {t("العودة إلى التحويلات", "Back to Transfers")}
          </Button>
        </div>

        {/* ── header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
              <IconSend className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none">
                {t("إنشاء تحويل بنكي جديد", "Create New Bank Transfer")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("خطوة", "Step")} {stepIndex + 1} {t("من", "of")} {steps.length} — {currentStepData.title}
              </p>
            </div>
          </div>

          {/* progress */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex h-1.5 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="tabular-nums text-xs font-medium text-muted-foreground">{progress}%</span>
          </div>
        </div>

        {/* ── stepper ── */}
        <Stepper value={step} onValueChange={setStep} onValidate={onValidate}>

          {/* Step indicators */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <StepperList className="min-w-max sm:min-w-0">
              {steps.map((s) => (
                <StepperItem key={s.value} value={s.value}>
                  <StepperTrigger className="gap-2">
                    <StepperIndicator />
                    <div className="hidden sm:flex flex-col gap-px text-left">
                      <StepperTitle>{s.title}</StepperTitle>
                      <StepperDescription>{s.description}</StepperDescription>
                    </div>
                  </StepperTrigger>
                  <StepperSeparator className="mx-3" />
                </StepperItem>
              ))}
            </StepperList>
          </div>

          {/* ── content + tips ── */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">

            {/* Form card */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              {/* top progress */}
              <div className="h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* step strip */}
              <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4 bg-muted/20">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <currentStepData.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{currentStepData.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{currentStepData.description}</p>
                </div>
              </div>

              <div className="p-6 sm:p-8">

                {/* ── STEP 1: Source Account ── */}
                <StepperContent value="source">
                  <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                    <div>
                      <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                        <IconBuildingBank size={13} className="opacity-50" />
                        {t("الحساب المصدر", "Source Account")}
                      </Label>
                      <Select
                        value={formData.sourceAccountId}
                        onValueChange={(v) => update("sourceAccountId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("اختر الحساب المصدر", "Select source account")} />
                        </SelectTrigger>
                        <SelectContent>
                          {state.accounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              <div>
                                <div className="font-medium">{acc.bankName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {acc.iban} —{" "}
                                  <CurrencyAmount amount={acc.currentBalance} currency={acc.currency} />
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError msg={errors.sourceAccountId} />
                    </div>

                    {selectedAccount && (
                      <DetailCard>
                        <ReviewRow label={t("البنك", "Bank")} value={selectedAccount.bankName} />
                        <ReviewRow label={t("الآيبان", "IBAN")} value={selectedAccount.iban} mono />
                        <ReviewRow label={t("العملة", "Currency")} value={selectedAccount.currency} />
                        <ReviewRow
                          label={t("الرصيد الحالي", "Current Balance")}
                          value={`${selectedAccount.currentBalance.toLocaleString()} ${selectedAccount.currency}`}
                          highlight
                        />
                      </DetailCard>
                    )}
                  </div>
                </StepperContent>

                {/* ── STEP 2: Beneficiary ── */}
                <StepperContent value="beneficiary">
                  <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                    {!showNewBeneficiary && (
                      <div>
                        <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                          <IconUser size={13} className="opacity-50" />
                          {t("المستفيد", "Beneficiary")}
                        </Label>
                        <Select
                          value={formData.beneficiaryId}
                          onValueChange={(v) => update("beneficiaryId", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("اختر المستفيد", "Select beneficiary")} />
                          </SelectTrigger>
                          <SelectContent>
                            {state.beneficiaries.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                <div>
                                  <div className="font-medium">{b.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {b.bankName} — {b.country}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError msg={errors.beneficiaryId} />
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        setShowNewBeneficiary((p) => !p);
                        setFormData((p) => ({ ...p, beneficiaryId: "" }));
                      }}
                    >
                      <IconUserPlus className="h-4 w-4" />
                      {showNewBeneficiary
                        ? t("اختيار مستفيد موجود", "Select existing beneficiary")
                        : t("إضافة مستفيد جديد", "Add new beneficiary")}
                    </Button>

                    {showNewBeneficiary && (
                      <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-5">
                        <p className="text-sm font-semibold">{t("مستفيد جديد", "New Beneficiary")}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                              <IconUser size={13} className="opacity-50" />
                              {t("الاسم", "Name")}
                            </Label>
                            <Input
                              value={newBeneficiary.name}
                              onChange={(e) =>
                                setNewBeneficiary((p) => ({ ...p, name: e.target.value }))
                              }
                              placeholder={t("اسم المستفيد", "Beneficiary name")}
                            />
                            <FieldError msg={errors.beneficiaryName} />
                          </div>
                          <div>
                            <Label className="text-sm mb-1.5 block">
                              {t("الشركة (اختياري)", "Company (optional)")}
                            </Label>
                            <Input
                              value={newBeneficiary.companyName}
                              onChange={(e) =>
                                setNewBeneficiary((p) => ({ ...p, companyName: e.target.value }))
                              }
                              placeholder={t("اسم الشركة", "Company name")}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                              <IconFlag size={13} className="opacity-50" />
                              {t("الدولة", "Country")}
                            </Label>
                            <Select
                              value={newBeneficiary.country}
                              onValueChange={(v) =>
                                setNewBeneficiary((p) => ({ ...p, country: v }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t("اختر الدولة", "Select country")} />
                              </SelectTrigger>
                              <SelectContent>
                                {getCountryOptions().map((c) => (
                                  <SelectItem key={c.value} value={c.value}>
                                    {t(c.label.ar, c.label.en)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FieldError msg={errors.beneficiaryCountry} />
                          </div>
                          <div>
                            <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                              <IconBuildingBank size={13} className="opacity-50" />
                              {t("البنك", "Bank")}
                            </Label>
                            <Input
                              value={newBeneficiary.bankName}
                              onChange={(e) =>
                                setNewBeneficiary((p) => ({ ...p, bankName: e.target.value }))
                              }
                              placeholder={t("اسم البنك", "Bank name")}
                            />
                            <FieldError msg={errors.beneficiaryBank} />
                          </div>
                        </div>

                        {newBeneficiary.country && (
                          <DynamicBankFields
                            country={newBeneficiary.country}
                            values={newBeneficiary.bankingData}
                            onChange={(field, value) =>
                              setNewBeneficiary((p) => ({
                                ...p,
                                bankingData: { ...p.bankingData, [field]: value },
                              }))
                            }
                            errors={errors}
                          />
                        )}
                      </div>
                    )}

                    {selectedBeneficiary && !showNewBeneficiary && (
                      <DetailCard>
                        <ReviewRow label={t("الاسم", "Name")} value={selectedBeneficiary.name} />
                        {selectedBeneficiary.companyName && (
                          <ReviewRow label={t("الشركة", "Company")} value={selectedBeneficiary.companyName} />
                        )}
                        <ReviewRow label={t("البنك", "Bank")} value={selectedBeneficiary.bankName} />
                        <ReviewRow label={t("الدولة", "Country")} value={selectedBeneficiary.country} />
                        <ReviewRow label={t("العملة", "Currency")} value={selectedBeneficiary.currency} />
                      </DetailCard>
                    )}
                  </div>
                </StepperContent>

                {/* ── STEP 3: Transfer Details ── */}
                <StepperContent value="details">
                  <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                          <IconCoin size={13} className="opacity-50" />
                          {t("المبلغ", "Amount")}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.amount}
                          onChange={(e) => update("amount", e.target.value)}
                          placeholder="0.00"
                          inputMode="decimal"
                        />
                        <FieldError msg={errors.amount} />
                      </div>

                      <div>
                        <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                          <IconCoin size={13} className="opacity-50" />
                          {t("العملة", "Currency")}
                        </Label>
                        <Select value={formData.currency} onValueChange={(v) => update("currency", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("اختر العملة", "Select currency")} />
                          </SelectTrigger>
                          <SelectContent>
                          {Object.values(currencyConfigs).map((c) => (
                            <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                          ))}
                        </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                        <IconNotes size={13} className="opacity-50" />
                        {t("سبب التحويل", "Transfer Reason")}
                      </Label>
                      <Input
                        value={formData.transferReason}
                        onChange={(e) => update("transferReason", e.target.value)}
                        placeholder={t("سبب التحويل", "Transfer reason")}
                      />
                      <FieldError msg={errors.transferReason} />
                    </div>

                    <div>
                      <Label className="text-sm mb-1.5 block">
                        {t("ملاحظات (اختياري)", "Notes (optional)")}
                      </Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder={t("ملاحظات إضافية", "Additional notes")}
                        className="min-h-[90px] resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                          <IconCalendar className="h-3.5 w-3.5 opacity-50" />
                          {t("تاريخ التنفيذ", "Execution Date")}
                        </Label>
                        <Input
                          type="date"
                          value={formData.executionDate}
                          onChange={(e) => update("executionDate", e.target.value)}
                        />
                        <FieldError msg={errors.executionDate} />
                      </div>

                      <div>
                        <Label className="text-sm mb-1.5 block">
                          {t("نوع التحويل", "Transfer Type")}
                        </Label>
                        <Select
                          value={formData.transferType}
                          onValueChange={(v) => update("transferType", v)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="external">{t("خارجي", "External")}</SelectItem>
                            <SelectItem value="internal">{t("داخلي", "Internal")}</SelectItem>
                            <SelectItem value="salary">{t("راتب", "Salary")}</SelectItem>
                            <SelectItem value="supplier">{t("مورد", "Supplier")}</SelectItem>
                            <SelectItem value="other">{t("أخرى", "Other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="flex items-center gap-1.5 text-sm mb-1.5">
                          <IconFlag size={13} className="opacity-50" />
                          {t("الأولوية", "Priority")}
                        </Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(v) => update("priority", v)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{t("منخفضة", "Low")}</SelectItem>
                            <SelectItem value="medium">{t("متوسطة", "Medium")}</SelectItem>
                            <SelectItem value="high">{t("عالية", "High")}</SelectItem>
                            <SelectItem value="urgent">{t("عاجلة", "Urgent")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </StepperContent>

                {/* ── STEP 4: Review & Actions ── */}
                <StepperContent value="review">
                  <div className="space-y-6 animate-[fadeSlideUp_.2s_ease]">

                    {/* Summary sections */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                        {t("تفاصيل التحويل", "Transfer Details")}
                      </p>
                      <DetailCard>
                        <ReviewRow label={t("الحساب المصدر", "Source Account")} value={selectedAccount?.bankName ?? ""} />
                        <ReviewRow label={t("المستفيد", "Beneficiary")} value={selectedBeneficiary?.name ?? ""} />
                        <ReviewRow
                          label={t("المبلغ", "Amount")}
                          value={`${parseFloat(formData.amount || "0").toLocaleString()} ${formData.currency}`}
                          highlight
                        />
                        <ReviewRow label={t("سبب التحويل", "Reason")} value={formData.transferReason} />
                        <ReviewRow label={t("تاريخ التنفيذ", "Execution Date")} value={formData.executionDate} />
                        <ReviewRow label={t("نوع التحويل", "Type")} value={typeLabel[formData.transferType]} />
                        <ReviewRow label={t("الأولوية", "Priority")} value={priorityLabel[formData.priority]} />
                      </DetailCard>
                    </div>

                    {formData.notes && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                          {t("ملاحظات", "Notes")}
                        </p>
                        <div className="rounded-xl border border-border/50 px-5 py-4">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {formData.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PDF preview */}
                    {previewData && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                          {t("معاينة الوثيقة", "Document Preview")}
                        </p>
                        <div className="rounded-xl border border-border/50 overflow-hidden">
                          <iframe
                            src={previewData}
                            className="w-full h-80"
                            title={t("معاينة التحويل", "Transfer preview")}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                        {t("الإجراءات", "Actions")}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-10"
                          disabled={saving}
                          onClick={() => handleAction("save")}
                        >
                          <IconDeviceFloppy className="h-4 w-4" />
                          <span className="hidden sm:inline">{t("حفظ مسودة", "Save Draft")}</span>
                          <span className="sm:hidden">{t("مسودة", "Draft")}</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-10"
                          onClick={() => handleAction("download")}
                        >
                          <IconDownload className="h-4 w-4" />
                          <span className="hidden sm:inline">{t("تحميل PDF", "Download PDF")}</span>
                          <span className="sm:hidden">PDF</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-10"
                          onClick={() => handleAction("print")}
                        >
                          <IconPrinter className="h-4 w-4" />
                          <span className="hidden sm:inline">{t("طباعة", "Print")}</span>
                          <span className="sm:hidden">{t("طباعة", "Print")}</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1.5 h-10"
                          disabled={saving}
                          onClick={() => handleAction("send")}
                        >
                          {saving ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          ) : (
                            <IconSend className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">{t("إرسال التحويل", "Send Transfer")}</span>
                          <span className="sm:hidden">{t("إرسال", "Send")}</span>
                        </Button>
                      </div>
                    </div>

                  </div>
                </StepperContent>

              </div>
            </div>

            {/* Tips sidebar */}
            <div className="lg:sticky lg:top-4">
              <TipsPanel tips={currentStepData.tips} />
            </div>
          </div>

          {/* ── bottom nav ── */}
          <div className="mt-5 flex items-center justify-between gap-3">
            {stepIndex === 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/synex/transfers")}
                className="gap-2 text-muted-foreground"
              >
                <IconX className="h-4 w-4" />
                <span className="hidden sm:inline">{t("إلغاء", "Cancel")}</span>
              </Button>
            ) : (
              <StepperPrev asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <IconChevronLeft className="h-4 w-4" />
                  {t("السابق", "Previous")}
                </Button>
              </StepperPrev>
            )}

            <span className="text-xs text-muted-foreground tabular-nums">
              {stepIndex + 1} / {steps.length}
            </span>

            {stepIndex < steps.length - 1 && (
              <StepperNext asChild>
                <Button size="sm" className="gap-1.5 min-w-[110px]">
                  {t("التالي", "Next")}
                  <IconChevronRight className="h-4 w-4 cursor-pointer rtl:rotate-180" />
                </Button>
              </StepperNext>
            )}

            {stepIndex === steps.length - 1 && (
              <div className="w-[110px]" /> /* spacer to keep center alignment */
            )}
          </div>

        </Stepper>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AppLayout>
  );
}