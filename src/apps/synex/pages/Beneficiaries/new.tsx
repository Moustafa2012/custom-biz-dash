"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconBuildingBank,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconUser,
  IconCircleCheck,
  IconShieldCheck,
  IconHelp,
  IconWorld,
  IconPhone,
  IconBuildingSkyscraper,
  IconUsers,
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
import { useSynex } from "../../store/synex-store";
import { DynamicBankFields } from "../../components/DynamicBankFields";
import { getCountryOptions, getCountryByCode } from "../../data/banks";

// ─── schema ──────────────────────────────────────────────────────────────────
const beneficiarySchema = z.object({
  name: z.string().min(1, t("اسم المستفيد مطلوب", "Beneficiary name is required")),
  companyName: z.string().optional(),
  country: z.string().min(1, t("الدولة مطلوبة", "Country is required")),
  bankName: z.string().min(1, t("اسم البنك مطلوب", "Bank name is required")),
  currency: z.string().min(1, t("العملة مطلوبة", "Currency is required")),
  email: z
    .string()
    .email(t("بريد إلكتروني غير صالح", "Invalid email"))
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  bankingData: z.record(z.string(), z.string()).optional(),
});

type BeneficiaryFormValues = z.infer<typeof beneficiarySchema>;

// ─── steps ───────────────────────────────────────────────────────────────────
const steps = [
  {
    value: "basic",
    title: t("المعلومات الأساسية", "Basic Info"),
    description: t("بيانات المستفيد الرئيسية", "Primary beneficiary details"),
    icon: IconUser,
    fields: ["name", "companyName", "country", "status"] as const,
    tips: [
      {
        icon: IconInfoCircle,
        title: t("اسم المستفيد", "Beneficiary Name"),
        body: t(
          "أدخل الاسم الكامل للمستفيد كما يظهر في الوثائق الرسمية.",
          "Enter the full name of the beneficiary as it appears on official documents.",
        ),
      },
      {
        icon: IconBuildingSkyscraper,
        title: t("اسم الشركة", "Company Name"),
        body: t(
          "إذا كان المستفيد شركة، يرجى إضافة اسمها الرسمي هنا.",
          "If the beneficiary is a company, please add its official name here.",
        ),
      },
      {
        icon: IconWorld,
        title: t("اختيار الدولة", "Select Country"),
        body: t(
          "تحديد الدولة سيساعد في توفير حقول البيانات البنكية الصحيحة.",
          "Selecting the country will help provide the correct banking data fields.",
        ),
      },
    ],
  },
  {
    value: "contact",
    title: t("معلومات الاتصال", "Contact"),
    description: t("بيانات التواصل والعنوان", "Contact info and address"),
    icon: IconMail,
    fields: ["email", "phone", "address"] as const,
    tips: [
      {
        icon: IconPhone,
        title: t("رقم الهاتف", "Phone Number"),
        body: t(
          "يفضل إضافة رقم الهاتف مع مفتاح الدولة لتسهيل التواصل.",
          "It's preferred to add the phone number with the country code for easier contact.",
        ),
      },
      {
        icon: IconMapPin,
        title: t("العنوان", "Address"),
        body: t(
          "أدخل العنوان الفعلي أو المسجل للمستفيد.",
          "Enter the physical or registered address of the beneficiary.",
        ),
      },
    ],
  },
  {
    value: "banking",
    title: t("المعلومات البنكية", "Banking Info"),
    description: t("تفاصيل الحساب والبنك", "Bank and account details"),
    icon: IconBuildingBank,
    fields: ["bankName", "currency", "bankingData"] as const,
    tips: [
      {
        icon: IconShieldCheck,
        title: t("دقة البيانات", "Data Accuracy"),
        body: t(
          "تأكد من صحة البيانات البنكية لتجنب رفض التحويلات المالية.",
          "Ensure banking data is correct to avoid rejected financial transfers.",
        ),
      },
      {
        icon: IconHelp,
        title: t("حقول متغيرة", "Dynamic Fields"),
        body: t(
          "تتغير الحقول المطلوبة بناءً على نظام الدولة المختارة.",
          "Required fields change based on the selected country's system.",
        ),
      },
    ],
  },
  {
    value: "review",
    title: t("مراجعة", "Review"),
    description: t("مراجعة وتأكيد البيانات", "Review & confirm details"),
    icon: IconCircleCheck,
    fields: [] as const,
    tips: [
      {
        icon: IconCircleCheck,
        title: t("مراجعة نهائية", "Final Review"),
        body: t(
          "راجع جميع البيانات بعناية قبل الحفظ.",
          "Review all data carefully before saving.",
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
export default function NewBeneficiaryPage() {
  const navigate = useNavigate();
  const { loadFromStorage, addBeneficiary } = useSynex();
  const [step, setStep] = React.useState("basic");
  const [saving, setSaving] = React.useState(false);

  const form = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiarySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      companyName: "",
      country: "SA",
      bankName: "",
      currency: "SAR",
      email: "",
      phone: "",
      address: "",
      status: "active",
      bankingData: {},
    },
  });

  const selectedCountry = form.watch("country");

  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Update currency when country changes
  React.useEffect(() => {
    const countryInfo = getCountryByCode(selectedCountry);
    if (countryInfo) {
      form.setValue("currency", countryInfo.currency);
    }
  }, [selectedCountry, form]);

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

  const onSubmit = async (values: BeneficiaryFormValues) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      addBeneficiary({
        name: values.name,
        companyName: values.companyName || undefined,
        country: values.country,
        bankName: values.bankName,
        currency: values.currency,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address: values.address || undefined,
        bankingData: values.bankingData as Record<string, string>,
        status: values.status,
      });
      toast.success(t("تم إضافة المستفيد بنجاح", "Beneficiary added successfully"));
      navigate("/synex/beneficiaries");
    } catch {
      toast.error(t("حدث خطأ أثناء الحفظ", "Error occurred while saving"));
    } finally {
      setSaving(false);
    }
  };

  const countryOptions = getCountryOptions();

  return (
    <AppLayout title={t("إضافة مستفيد جديد", "Add New Beneficiary")}>
      <div className="mx-auto max-w-6xl pb-16 px-4 sm:px-6">
        {/* ── Back nav ── */}
        <div className="pt-4 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/synex/beneficiaries")}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 rounded-full"
          >
            <IconArrowLeft className="h-4 w-4" />
            {t("العودة إلى المستفيدين", "Back to Beneficiaries")}
          </Button>
        </div>

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
              <IconUsers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none">
                {t("إضافة مستفيد جديد", "Add New Beneficiary")}
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

        {/* ── Stepper list ── */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stepper value={step} onValueChange={setStep} onValidate={onValidate}>
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

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
                {/* Form card */}
                <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                  <div className="h-0.5 bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

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
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconUser size={13} className="opacity-50" />
                                  {t("اسم المستفيد", "Beneficiary Name")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={t("مثال: محمد أحمد", "e.g. Mohammed Ahmed")} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconBuildingSkyscraper size={13} className="opacity-50" />
                                  {t("اسم الشركة (اختياري)", "Company Name (Optional)")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={t("اسم الشركة إن وجد", "Company name if applicable")} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconWorld size={13} className="opacity-50" />
                                  {t("الدولة", "Country")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {countryOptions.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {t(opt.label.ar, opt.label.en)}
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
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconInfoCircle size={13} className="opacity-50" />
                                  {t("الحالة", "Status")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="active">{t("نشط", "Active")}</SelectItem>
                                    <SelectItem value="inactive">{t("غير نشط", "Inactive")}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </StepperContent>

                    {/* ── STEP: Contact Info ── */}
                    <StepperContent value="contact">
                      <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconMail size={13} className="opacity-50" />
                                  {t("البريد الإلكتروني", "Email")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" placeholder="example@domain.com" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconPhone size={13} className="opacity-50" />
                                  {t("رقم الهاتف", "Phone Number")}
                                </FormLabel>
                                <FormControl>
                                  <PhoneInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    defaultCountry={selectedCountry as any}
                                  >
                                    <PhoneInputCountrySelect />
                                    <PhoneInputField />
                                  </PhoneInput>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm">
                                <IconMapPin size={13} className="opacity-50" />
                                {t("العنوان", "Address")}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder={t("العنوان التفصيلي للمستفيد", "Detailed beneficiary address")}
                                  className="min-h-[100px] resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </StepperContent>

                    {/* ── STEP: Banking Info ── */}
                    <StepperContent value="banking">
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
                                  <Input {...field} placeholder={t("اسم البنك", "Bank name")} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconInfoCircle size={13} className="opacity-50" />
                                  {t("العملة", "Currency")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} readOnly className="bg-muted/50 font-mono" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="rounded-xl border border-dashed border-border/60 p-5 bg-muted/5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 flex items-center gap-2">
                            <IconShieldCheck className="h-3.5 w-3.5" />
                            {t("بيانات التحويل للدولة المختارة", "Transfer details for selected country")}
                          </p>
                          <DynamicBankFields
                            country={selectedCountry}
                            values={form.watch("bankingData") as Record<string, string>}
                            onChange={(key, val) => {
                              const current = form.getValues("bankingData") as Record<string, string>;
                              form.setValue("bankingData", { ...current, [key]: val }, { shouldValidate: true });
                            }}
                          />
                        </div>
                      </div>
                    </StepperContent>

                    {/* ── STEP: Review ── */}
                    <StepperContent value="review">
                      <div className="space-y-6 animate-[fadeSlideUp_.2s_ease]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left: Basic & Contact */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                                <IconUser className="h-4 w-4" />
                                {t("المعلومات الأساسية", "Basic Info")}
                              </h3>
                              <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-1">
                                <ReviewRow label={t("الاسم", "Name")} value={form.getValues("name")} />
                                <ReviewRow label={t("الشركة", "Company")} value={form.getValues("companyName") || ""} />
                                <ReviewRow
                                  label={t("الدولة", "Country")}
                                  value={getCountryByCode(selectedCountry)?.name.ar || selectedCountry}
                                />
                                <ReviewRow
                                  label={t("الحالة", "Status")}
                                  value={form.getValues("status") === "active" ? t("نشط", "Active") : t("غير نشط", "Inactive")}
                                />
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                                <IconMail className="h-4 w-4" />
                                {t("معلومات الاتصال", "Contact")}
                              </h3>
                              <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-1">
                                <ReviewRow label={t("البريد", "Email")} value={form.getValues("email") || ""} />
                                <ReviewRow label={t("الهاتف", "Phone")} value={form.getValues("phone") || ""} />
                                <ReviewRow label={t("العنوان", "Address")} value={form.getValues("address") || ""} />
                              </div>
                            </div>
                          </div>

                          {/* Right: Banking */}
                          <div>
                            <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                              <IconBuildingBank className="h-4 w-4" />
                              {t("المعلومات البنكية", "Banking Info")}
                            </h3>
                            <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-1">
                              <ReviewRow label={t("البنك", "Bank")} value={form.getValues("bankName")} />
                              <ReviewRow label={t("العملة", "Currency")} value={form.getValues("currency")} mono />
                              {Object.entries(form.getValues("bankingData") as Record<string, string>).map(([key, val]) => (
                                <ReviewRow key={key} label={key.toUpperCase()} value={val} mono />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </StepperContent>

                    {/* ── Footer actions ── */}
                    <div className="mt-10 flex items-center justify-between border-t border-border/50 pt-6">
                      <StepperPrev asChild>
                        <Button variant="outline" className="gap-2 rounded-xl">
                          <IconChevronRight className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
                          {t("السابق", "Previous")}
                        </Button>
                      </StepperPrev>

                      {step === "review" ? (
                        <Button
                          type="submit"
                          disabled={saving}
                          className="gap-2 rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                        >
                          {saving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          ) : (
                            <IconDeviceFloppy className="h-4 w-4" />
                          )}
                          {t("حفظ المستفيد", "Save Beneficiary")}
                        </Button>
                      ) : (
                        <StepperNext asChild>
                          <Button className="gap-2 rounded-xl px-8">
                            {t("التالي", "Next")}
                            <IconChevronLeft className="h-4 w-4 rtl:rotate-0 ltr:rotate-180" />
                          </Button>
                        </StepperNext>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar tips */}
                <TipsPanel tips={currentStepData.tips} />
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
