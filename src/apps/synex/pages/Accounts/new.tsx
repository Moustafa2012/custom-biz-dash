"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconBuildingBank,
  IconChevronLeft,
  IconChevronRight,
  IconCoin,
  IconCreditCard,
  IconDeviceFloppy,
  IconHash,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconNotes,
  IconUser,
  IconX,
  IconAlertCircle,
  IconCircleCheck,
  IconLock,
  IconShieldCheck,
  IconHelp,
} from "@tabler/icons-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputField,
} from "@/components/ui/phone-input";
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
import { MoneyInput } from "../../components/MoneyInput";
import { useSynex } from "../../store/synex-store";
import { currencyConfigs } from "../../data/banks";
import { IbanInput, validateIBAN } from "@/components/ui/IbanInput";
// ─── schema ──────────────────────────────────────────────────────────────────
const accountSchema = z.object({
  bankName: z.string().min(1, t("اسم البنك مطلوب", "Bank name is required")),
  accountType: z.enum(["checking", "savings", "business", "corporate"]),
  accountNumber: z.string().min(1, t("رقم الحساب مطلوب", "Account number is required")),
  iban: z
    .string()
    .min(1, t("رقم الآيبان مطلوب", "IBAN is required"))
    .refine((val) => {
      return validateIBAN(val)
    }),
  currency: z.string().min(1, t("العملة مطلوبة", "Currency is required")),
  currentBalance: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: t("الرصيد يجب أن يكون رقمًا غير سالب", "Balance must be a non-negative number"),
  }),
  bankAddress: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z
    .string()
    .email(t("بريد إلكتروني غير صالح", "Invalid email"))
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

// ─── steps ───────────────────────────────────────────────────────────────────
const steps = [
  {
    value: "basic",
    title: t("المعلومات الأساسية", "Basic Info"),
    description: t("تفاصيل الحساب البنكي", "Account details"),
    icon: IconBuildingBank,
    fields: ["bankName", "accountNumber", "iban", "currency", "currentBalance", "accountType"] as const,
    tips: [
      {
        icon: IconInfoCircle,
        title: t("اسم البنك", "Bank Name"),
        body: t(
          "أدخل الاسم الرسمي للبنك كما يظهر في كشف الحساب.",
          "Enter the official bank name as it appears on your statement.",
        ),
      },
      {
        icon: IconShieldCheck,
        title: t("رقم الآيبان", "IBAN Format"),
        body: t(
          "الآيبان السعودي يبدأ بـ SA ويتكون من 24 خانة. تأكد من إدخاله بدقة.",
          "Saudi IBAN starts with SA and is 24 characters. Double-check it carefully.",
        ),
      },
      {
        icon: IconLock,
        title: t("أمان البيانات", "Data Security"),
        body: t(
          "جميع بياناتك مشفرة ومحفوظة بشكل آمن داخل النظام.",
          "All your data is encrypted and stored securely within the system.",
        ),
      },
    ],
  },
  {
    value: "contact",
    title: t("معلومات الاتصال", "Contact"),
    description: t("بيانات التواصل", "Contact details"),
    icon: IconUser,
    fields: ["bankAddress", "contactPerson", "contactPhone", "contactEmail"] as const,
    tips: [
      {
        icon: IconInfoCircle,
        title: t("مسؤول الحساب", "Account Manager"),
        body: t(
          "أضف اسم موظف البنك المسؤول عن حسابك لتسهيل التواصل.",
          "Add your bank officer's name to make communication easier.",
        ),
      },
      {
        icon: IconHelp,
        title: t("الحقول اختيارية", "Optional Fields"),
        body: t(
          "معلومات الاتصال اختيارية، لكنها مفيدة لاسترداد البيانات لاحقًا.",
          "Contact details are optional but useful for future reference.",
        ),
      },
    ],
  },
  {
    value: "notes",
    title: t("ملاحظات", "Notes"),
    description: t("ملاحظات إضافية", "Additional notes"),
    icon: IconNotes,
    fields: ["notes"] as const,
    tips: [
      {
        icon: IconNotes,
        title: t("استخدام الملاحظات", "Using Notes"),
        body: t(
          "يمكنك إضافة أي معلومات إضافية كالغرض من الحساب أو شروط خاصة.",
          "Add any extra info like the account purpose or special terms.",
        ),
      },
      {
        icon: IconAlertCircle,
        title: t("تنبيه", "Tip"),
        body: t(
          "لا تضع بيانات حساسة ككلمات المرور أو أرقام PIN في الملاحظات.",
          "Don't include sensitive data like passwords or PINs in notes.",
        ),
      },
    ],
  },
  {
    value: "review",
    title: t("مراجعة", "Review"),
    description: t("مراجعة البيانات", "Review & confirm"),
    icon: IconCircleCheck,
    fields: [] as const,
    tips: [
      {
        icon: IconCircleCheck,
        title: t("مراجعة نهائية", "Final Review"),
        body: t(
          "راجع جميع البيانات بعناية قبل الحفظ. يمكنك العودة لأي خطوة للتعديل.",
          "Review all data carefully before saving. You can go back to edit any step.",
        ),
      },
      {
        icon: IconShieldCheck,
        title: t("تأكيد الآيبان", "Confirm IBAN"),
        body: t(
          "تأكد من صحة رقم الآيبان، فأي خطأ قد يؤثر على العمليات المالية.",
          "Make sure the IBAN is correct — errors may affect financial operations.",
        ),
      },
    ],
  },
];

// ─── Review row ───────────────────────────────────────────────────────────────
function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Tips panel ───────────────────────────────────────────────────────────────
function TipsPanel({ tips }: { tips: typeof steps[0]["tips"] }) {
  return (
    <aside className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
        {t("نصائح وإرشادات", "Tips & Guidance")}
      </p>
      {tips.map((tip, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/50 bg-muted/30 p-4 flex gap-3 transition-all duration-300"
          style={{ animationDelay: `${i * 60}ms` }}
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function NewAccountPage() {
  const navigate = useNavigate();
  const { loadFromStorage, addAccount } = useSynex();
  const [step, setStep] = React.useState("basic");
  const [saving, setSaving] = React.useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
    defaultValues: {
      bankName: "",
      accountType: "checking",
      accountNumber: "",
      iban: "",
      currency: "SAR",
      currentBalance: "0.00",
      bankAddress: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const currentStepData = steps.find((s) => s.value === step)!;
  const stepIndex = steps.findIndex((s) => s.value === step);
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const onValidate: NonNullable<StepperProps["onValidate"]> = React.useCallback(
    async (_value, direction) => {
      if (direction === "prev") return true;
      const fields = currentStepData?.fields ?? [];
      if (!fields.length) return true;
      const isValid = await form.trigger(fields as any);
      if (!isValid) toast.error(t("يرجى إكمال الحقول المطلوبة", "Please complete required fields"));
      return isValid;
    },
    [form, currentStepData],
  );

  const onSubmit = async (values: AccountFormValues) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      addAccount({
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        iban: values.iban,
        currency: values.currency,
        currentBalance: parseFloat(values.currentBalance),
        projectedBalance: parseFloat(values.currentBalance),
        status: "active" as const,
        accountType: values.accountType,
        bankAddress: values.bankAddress || undefined,
        contactPerson: values.contactPerson || undefined,
        contactPhone: values.contactPhone || undefined,
        contactEmail: values.contactEmail || undefined,
        notes: values.notes || undefined,
      });
      toast.success(t("تم إضافة الحساب بنجاح", "Account added successfully"));
      navigate("/synex/accounts");
    } catch {
      toast.error(t("حدث خطأ أثناء الحفظ", "Error occurred while saving"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title={t("إضافة حساب جديد", "Add New Account")}>
      <div className="mx-auto max-w-6xl pb-16 px-4 sm:px-6">
        {/* ── Back nav ── */}
        <div className="pt-4 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/synex/accounts")}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 rounded-full"
          >
            <IconArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("العودة إلى الحسابات", "Back to Accounts")}
          </Button>
        </div>

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
              <IconBuildingBank className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none">
                {t("إضافة حساب بنكي جديد", "Add New Bank Account")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("خطوة", "Step")} {stepIndex + 1} {t("من", "of")} {steps.length} — {currentStepData.title}
              </p>
            </div>
          </div>

          {/* Progress pill */}
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

        {/* ── Stepper list (horizontal on md+, scrollable on sm) ── */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

              {/* ── Main layout: form card + tips sidebar ── */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">

                {/* Form card */}
                <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                  {/* Top progress bar */}
                  <div className="h-0.5 bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Step label strip */}
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

                    {/* ── STEP: Basic Info ── */}
                    <StepperContent value="basic">
                      <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconBuildingBank size={13} className="opacity-50" />
                                  {t("اسم البنك", "Bank Name")}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder={t("مثال: الراجحي", "e.g. Al Rajhi")}
                                    autoComplete="organization"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconCreditCard size={13} className="opacity-50" />
                                  {t("نوع الحساب", "Account Type")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="checking">{t("حساب جاري", "Checking")}</SelectItem>
                                    <SelectItem value="savings">{t("حساب توفير", "Savings")}</SelectItem>
                                    <SelectItem value="business">{t("حساب تجاري", "Business")}</SelectItem>
                                    <SelectItem value="corporate">{t("حساب شركات", "Corporate")}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconHash size={13} className="opacity-50" />
                                  {t("رقم الحساب", "Account Number")}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder={t("رقم الحساب البنكي", "Bank account number")}
                                    inputMode="numeric"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="iban"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconCreditCard size={13} className="opacity-50" />
                                  {t("رقم الآيبان", "IBAN")}
                                </FormLabel>
                                <FormControl>
                                  <IbanInput
                                    {...field}
                                    showBadge={true}
                                    containerClassName="max-w-md"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconCoin size={13} className="opacity-50" />
                                  {t("العملة", "Currency")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t("اختر العملة", "Select currency")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.values(currencyConfigs).map((c) => (
                                      <SelectItem key={c.code} value={c.code}>
                                        {c.code} — {t(c.ar, c.en)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currentBalance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">{t("الرصيد الحالي", "Current Balance")}</FormLabel>
                                <FormControl>
                                  <MoneyInput
                                    value={Math.round((parseFloat(field.value) || 0) * 100)}
                                    onChange={(v) => field.onChange((v / 100).toFixed(2))}
                                    defaultCurrency={form.watch("currency") || "SAR"}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </StepperContent>

                    {/* ── STEP: Contact ── */}
                    <StepperContent value="contact">
                      <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                        <FormField
                          control={form.control}
                          name="bankAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm">
                                <IconMapPin size={13} className="opacity-50" />
                                {t("عنوان البنك", "Bank Address")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={t("عنوان الفرع البنكي", "Bank branch address")}
                                  autoComplete="street-address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <FormField
                            control={form.control}
                            name="contactPerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconUser size={13} className="opacity-50" />
                                  {t("الشخص المسؤول", "Contact Person")}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder={t("اسم مدير الحساب", "Account manager")}
                                    autoComplete="name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  {t("رقم الهاتف", "Phone Number")}
                                </FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultCountry="SA"
                                  >
                                    <PhoneInputCountrySelect />
                                    <PhoneInputField />
                                  </PhoneInput>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconMail size={13} className="opacity-50" />
                                  {t("البريد الإلكتروني", "Email")}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder={t("بريد البنك الإلكتروني", "Bank email")}
                                    autoComplete="email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </StepperContent>

                    {/* ── STEP: Notes ── */}
                    <StepperContent value="notes">
                      <div className="animate-[fadeSlideUp_.2s_ease]">
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm">
                                <IconNotes size={13} className="opacity-50" />
                                {t("ملاحظات إضافية", "Additional Notes")}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder={t(
                                    "ملاحظات إضافية عن الحساب (اختياري)",
                                    "Additional notes about the account (optional)",
                                  )}
                                  className="min-h-[200px] resize-none leading-relaxed"
                                />
                              </FormControl>
                              <div className="flex items-center justify-between mt-1.5">
                                <FormMessage />
                                <span className="ms-auto text-[11px] text-muted-foreground/50 tabular-nums">
                                  {(field.value || "").length} {t("حرف", "chars")}
                                </span>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </StepperContent>

                    {/* ── STEP: Review ── */}
                    <StepperContent value="review">
                      <div className="animate-[fadeSlideUp_.2s_ease] space-y-6">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                            {t("معلومات الحساب", "Account Information")}
                          </p>
                          <div className="rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-5 py-1 divide-y divide-border/40">
                              <ReviewRow label={t("اسم البنك", "Bank Name")} value={form.watch("bankName")} />
                              <ReviewRow label={t("نوع الحساب", "Account Type")} value={form.watch("accountType")} />
                              <ReviewRow label={t("رقم الحساب", "Account No.")} value={form.watch("accountNumber")} mono />
                              <ReviewRow label={t("رقم الآيبان", "IBAN")} value={form.watch("iban")} mono />
                              <ReviewRow label={t("العملة", "Currency")} value={form.watch("currency")} />
                              <ReviewRow
                                label={t("الرصيد الحالي", "Balance")}
                                value={`${form.watch("currentBalance")} ${form.watch("currency")}`}
                              />
                            </div>
                          </div>
                        </div>

                        {(form.watch("contactPerson") || form.watch("contactPhone") || form.watch("contactEmail") || form.watch("bankAddress")) && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                              {t("معلومات الاتصال", "Contact Information")}
                            </p>
                            <div className="rounded-xl border border-border/50 overflow-hidden">
                              <div className="px-5 py-1 divide-y divide-border/40">
                                {form.watch("contactPerson") && (
                                  <ReviewRow label={t("الشخص المسؤول", "Contact")} value={form.watch("contactPerson")!} />
                                )}
                                {form.watch("contactPhone") && (
                                  <ReviewRow label={t("الهاتف", "Phone")} value={form.watch("contactPhone")!} />
                                )}
                                {form.watch("contactEmail") && (
                                  <ReviewRow label={t("البريد", "Email")} value={form.watch("contactEmail")!} />
                                )}
                                {form.watch("bankAddress") && (
                                  <ReviewRow label={t("العنوان", "Address")} value={form.watch("bankAddress")!} />
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {form.watch("notes") && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                              {t("ملاحظات", "Notes")}
                            </p>
                            <div className="rounded-xl border border-border/50 px-5 py-4">
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {form.watch("notes")}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </StepperContent>

                  </div>
                </div>

                {/* Tips sidebar — stacks below on mobile */}
                <div className="lg:sticky lg:top-4">
                  <TipsPanel tips={currentStepData.tips} />
                </div>
              </div>

              {/* ── Bottom actions ── */}
              <div className="mt-5 flex items-center justify-between gap-3">
                {stepIndex === 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/synex/accounts")}
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

                {stepIndex === steps.length - 1 ? (
                  <Button type="submit" disabled={saving} className="gap-2 min-w-[130px]">
                    {saving ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        {t("جارٍ الحفظ…", "Saving…")}
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="h-4 w-4" />
                        {t("حفظ الحساب", "Save Account")}
                      </>
                    )}
                  </Button>
                ) : (
                  <StepperNext asChild>
                    <Button size="sm" className="gap-1.5 min-w-[110px]">
                      {t("التالي", "Next")}
                      <IconChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </StepperNext>
                )}
              </div>

            </Stepper>
          </form>
        </Form>
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