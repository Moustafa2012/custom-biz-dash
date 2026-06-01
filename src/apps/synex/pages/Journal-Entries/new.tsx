"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconBook,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconInfoCircle,
  IconNotes,
  IconCircleCheck,
  IconShieldCheck,
  IconCoin,
  IconBuildingBank,
  IconCalendar,
  IconHash,
  IconAdjustments,
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

// ─── schema ──────────────────────────────────────────────────────────────────
const journalEntrySchema = z.object({
  entryNumber: z.string().min(1, t("رقم القيد مطلوب", "Entry number is required")),
  transactionType: z.enum(["settlement", "bank_fee", "balance_correction", "deposit", "withdrawal", "internal_transfer"]),
  accountId: z.string().min(1, t("الحساب مطلوب", "Account is required")),
  description: z.string().min(1, t("الوصف مطلوب", "Description is required")),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: t("المبلغ يجب أن يكون أكبر من صفر", "Amount must be greater than zero"),
  }),
  currency: z.string().min(1, t("العملة مطلوبة", "Currency is required")),
  date: z.string().min(1, t("التاريخ مطلوب", "Date is required")),
  referenceId: z.string().optional(),
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

// ─── steps ───────────────────────────────────────────────────────────────────
const steps = [
  {
    value: "basic",
    title: t("المعلومات الأساسية", "Basic Info"),
    description: t("تفاصيل القيد المالية", "Entry financial details"),
    icon: IconAdjustments,
    fields: ["entryNumber", "transactionType", "accountId", "amount", "currency", "date"] as const,
    tips: [
      {
        icon: IconHash,
        title: t("رقم القيد", "Entry Number"),
        body: t(
          "استخدم تسلسلاً منطقياً لتسهيل تتبع القيود لاحقاً.",
          "Use a logical sequence to make it easier to track entries later.",
        ),
      },
      {
        icon: IconBuildingBank,
        title: t("اختيار الحساب", "Select Account"),
        body: t(
          "تأكد من اختيار الحساب الصحيح المتأثر بهذه العملية.",
          "Make sure to select the correct account affected by this operation.",
        ),
      },
      {
        icon: IconCoin,
        title: t("المبلغ والعملة", "Amount & Currency"),
        body: t(
          "أدخل المبلغ بدقة مع اختيار العملة المناسبة للحساب.",
          "Enter the amount accurately and select the appropriate currency for the account.",
        ),
      },
    ],
  },
  {
    value: "details",
    title: t("التفاصيل", "Details"),
    description: t("الوصف والمراجع", "Description & references"),
    icon: IconNotes,
    fields: ["description", "referenceId"] as const,
    tips: [
      {
        icon: IconInfoCircle,
        title: t("وصف العملية", "Transaction Description"),
        body: t(
          "اكتب وصفاً واضحاً وموجزاً لسبب القيد.",
          "Write a clear and concise description of the entry reason.",
        ),
      },
      {
        icon: IconShieldCheck,
        title: t("المعرف المرجعي", "Reference ID"),
        body: t(
          "يمكنك ربط هذا القيد برقم فاتورة أو رقم تحويل لسهولة المراجعة.",
          "You can link this entry to an invoice or transfer number for easy auditing.",
        ),
      },
    ],
  },
  {
    value: "review",
    title: t("مراجعة", "Review"),
    description: t("مراجعة وتأكيد القيد", "Review & confirm entry"),
    icon: IconCircleCheck,
    fields: [] as const,
    tips: [
      {
        icon: IconCircleCheck,
        title: t("مراجعة نهائية", "Final Review"),
        body: t(
          "راجع جميع البيانات قبل الاعتماد. القيود المالية تؤثر مباشرة على الأرصدة.",
          "Review all data before confirmation. Financial entries directly affect balances.",
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
export default function NewJournalEntryPage() {
  const navigate = useNavigate();
  const { state, loadFromStorage, addJournalEntry } = useSynex();
  const [step, setStep] = React.useState("basic");
  const [saving, setSaving] = React.useState(false);

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    mode: "onTouched",
    defaultValues: {
      entryNumber: `JE${new Date().getFullYear()}${(state.journalEntries.length + 1).toString().padStart(5, '0')}`,
      transactionType: "deposit",
      accountId: "",
      description: "",
      amount: "0.00",
      currency: "SAR",
      date: new Date().toISOString().split('T')[0],
      referenceId: "",
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

  const onSubmit = async (values: JournalEntryFormValues) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      addJournalEntry({
        entryNumber: values.entryNumber,
        transactionType: values.transactionType,
        accountId: values.accountId,
        description: values.description,
        amount: parseFloat(values.amount),
        currency: values.currency,
        date: new Date(values.date),
        createdBy: "admin", // Placeholder
        referenceId: values.referenceId || undefined,
      });
      toast.success(t("تم إضافة القيد بنجاح", "Journal entry added successfully"));
      navigate("/synex/journal-entries");
    } catch {
      toast.error(t("حدث خطأ أثناء الحفظ", "Error occurred while saving"));
    } finally {
      setSaving(false);
    }
  };

  const selectedAccount = state.accounts.find(a => a.id === form.watch("accountId"));

  return (
    <AppLayout title={t("إضافة قيد جديد", "Add New Journal Entry")}>
      <div className="mx-auto max-w-6xl pb-16 px-4 sm:px-6">
        {/* ── Back nav ── */}
        <div className="pt-4 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/synex/journal-entries")}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 rounded-full"
          >
            <IconArrowLeft className="h-4 w-4" />
            {t("العودة إلى القيود اليومية", "Back to Journal Entries")}
          </Button>
        </div>

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
              <IconBook className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none">
                {t("إضافة قيد محاسبي جديد", "Add New Journal Entry")}
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
                            name="entryNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconHash size={13} className="opacity-50" />
                                  {t("رقم القيد", "Entry Number")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="JE202400001" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="transactionType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconAdjustments size={13} className="opacity-50" />
                                  {t("نوع العملية", "Transaction Type")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="deposit">{t("إيداع", "Deposit")}</SelectItem>
                                    <SelectItem value="withdrawal">{t("سحب", "Withdrawal")}</SelectItem>
                                    <SelectItem value="bank_fee">{t("رسوم بنكية", "Bank Fee")}</SelectItem>
                                    <SelectItem value="settlement">{t("تسوية", "Settlement")}</SelectItem>
                                    <SelectItem value="balance_correction">{t("تصحيح رصيد", "Balance Correction")}</SelectItem>
                                    <SelectItem value="internal_transfer">{t("تحويل داخلي", "Internal Transfer")}</SelectItem>
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
                            name="accountId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconBuildingBank size={13} className="opacity-50" />
                                  {t("الحساب", "Account")}
                                </FormLabel>
                                <Select 
                                  onValueChange={(val) => {
                                    field.onChange(val);
                                    const acc = state.accounts.find(a => a.id === val);
                                    if (acc) form.setValue("currency", acc.currency);
                                  }} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t("اختر الحساب", "Select account")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {state.accounts.map((acc) => (
                                      <SelectItem key={acc.id} value={acc.id}>
                                        {acc.bankName} ({acc.accountNumber})
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
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1.5 text-sm">
                                  <IconCalendar size={13} className="opacity-50" />
                                  {t("التاريخ", "Date")}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">{t("المبلغ", "Amount")}</FormLabel>
                                <FormControl>
                                  <MoneyInput
                                    value={Math.round((parseFloat(field.value) || 0) * 100)}
                                    onChange={(v) => field.onChange((v / 100).toFixed(2))}
                                    defaultCurrency={form.watch("currency")}
                                  />
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
                                  <IconCoin size={13} className="opacity-50" />
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
                      </div>
                    </StepperContent>

                    {/* ── STEP: Details ── */}
                    <StepperContent value="details">
                      <div className="space-y-5 animate-[fadeSlideUp_.2s_ease]">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm">
                                <IconNotes size={13} className="opacity-50" />
                                {t("وصف العملية", "Description")}
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder={t("اكتب تفاصيل العملية هنا...", "Write transaction details here...")}
                                  className="min-h-[120px] resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="referenceId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm">
                                <IconShieldCheck size={13} className="opacity-50" />
                                {t("المعرف المرجعي (اختياري)", "Reference ID (Optional)")}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={t("رقم الفاتورة أو التحويل", "Invoice or transfer number")} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </StepperContent>

                    {/* ── STEP: Review ── */}
                    <StepperContent value="review">
                      <div className="space-y-6 animate-[fadeSlideUp_.2s_ease]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                                <IconAdjustments className="h-4 w-4" />
                                {t("المعلومات المالية", "Financial Info")}
                              </h3>
                              <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-1">
                                <ReviewRow label={t("رقم القيد", "Entry #")} value={form.getValues("entryNumber")} mono />
                                <ReviewRow 
                                  label={t("النوع", "Type")} 
                                  value={t(form.getValues("transactionType"), form.getValues("transactionType"))} 
                                />
                                <ReviewRow 
                                  label={t("الحساب", "Account")} 
                                  value={selectedAccount?.bankName || form.getValues("accountId")} 
                                />
                                <ReviewRow 
                                  label={t("المبلغ", "Amount")} 
                                  value={`${form.getValues("amount")} ${form.getValues("currency")}`} 
                                  mono 
                                />
                                <ReviewRow label={t("التاريخ", "Date")} value={form.getValues("date")} />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                                <IconNotes className="h-4 w-4" />
                                {t("التفاصيل", "Details")}
                              </h3>
                              <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-1">
                                <ReviewRow label={t("الوصف", "Description")} value={form.getValues("description")} />
                                <ReviewRow label={t("المرجع", "Reference")} value={form.getValues("referenceId") || ""} />
                              </div>
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
                          {t("حفظ القيد", "Save Entry")}
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
