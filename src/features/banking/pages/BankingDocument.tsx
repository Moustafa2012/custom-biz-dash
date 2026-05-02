import { useMemo, useRef, useState } from "react";
import { useAppConfig } from "@/components/erp/app-config";
import { useBankingStore } from "../stores/banking-store";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignaturePad } from "../components/SignaturePad";
import { TransferLetter } from "../components/TransferLetter";
import { FileText, Printer, Download, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Lazy CDN loader (runtime). Returns globals from window.
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

declare global {
  interface Window {
    html2canvas?: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    jspdf?: { jsPDF: new (opts?: Record<string, unknown>) => {
      addImage: (data: string, fmt: string, x: number, y: number, w: number, h: number) => void;
      addPage: () => void;
      save: (filename: string) => void;
      internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    } };
  }
}

export default function BankingDocument() {
  const { t } = useAppConfig();
  const { toast } = useToast();
  const can = useAuthStore((s) => s.can);
  const canCreate = can("banking.*") || can("banking.transfers.create");

  const accounts = useBankingStore((s) => s.accounts);
  const beneficiaries = useBankingStore((s) => s.beneficiaries);
  const company = useBankingStore((s) => s.company);
  const addDocument = useBankingStore((s) => s.addDocument);

  const [accountId, setAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [reason, setReason] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>();
  const [stampDataUrl, setStampDataUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const reference = useMemo(() => {
    const ts = new Date();
    return `TR-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, "0")}${String(ts.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }, [accountId, amount, currency, reason]);

  const date = useMemo(() => new Date().toLocaleDateString("en-GB"), []);
  const account = accounts.find((a) => a.id === accountId);
  const chosenBeneficiaries = beneficiaries.filter((b) => selected.includes(b.id));
  const letterRef = useRef<HTMLDivElement>(null);

  const ready =
    !!account &&
    Number(amount) > 0 &&
    !!currency &&
    !!reason.trim() &&
    chosenBeneficiaries.length > 0 &&
    !!signatureDataUrl;

  const persistDocument = () => {
    if (!account) return;
    addDocument({
      id: `doc_${Date.now()}`,
      reference, date,
      fromAccountId: account.id,
      amount: Number(amount), currency, reason,
      beneficiaryIds: chosenBeneficiaries.map((b) => b.id),
      signatureDataUrl, stampDataUrl,
    });
  };

  const handlePrint = () => {
    if (!ready) return;
    const node = letterRef.current;
    if (!node) return;
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) {
      toast({ title: t("فشل الطباعة", "Print failed"), description: t("اسمح بالنوافذ المنبثقة.", "Please allow pop-ups."), variant: "destructive" });
      return;
    }
    w.document.write(`<!doctype html><html><head><title>${reference}</title>
      <style>body{margin:0;font-family:Inter,system-ui,sans-serif;}@media print{@page{size:A4;margin:0}}</style>
      </head><body>${node.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); persistDocument(); }, 250);
  };

  const handleDownload = async () => {
    if (!ready || !letterRef.current) return;
    setBusy(true);
    try {
      await Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
      ]);
      if (!window.html2canvas || !window.jspdf) throw new Error("Libraries not available");

      const canvas = await window.html2canvas(letterRef.current, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      // Multi-page support if doc is taller than one A4 page
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`${reference}.pdf`);
      persistDocument();
      toast({ title: t("تم التنزيل", "Downloaded"), description: `${reference}.pdf` });
    } catch (err) {
      toast({
        title: t("فشل التنزيل", "Download failed"),
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (!canCreate) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[300px]">
        <div className="text-center space-y-2">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">{t("ليس لديك صلاحية لإنشاء مستندات التحويل.", "You don't have permission to create transfer documents.")}</p>
        </div>
      </div>
    );
  }

  const setupIncomplete = !company.name || accounts.length === 0 || beneficiaries.length === 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t("منشئ مستندات التحويل", "Transfer Document Generator")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("أنشئ مستند تحويل بنكي جاهز للطباعة وقابل للتنزيل.", "Create a print-ready, downloadable bank-transfer document.")}</p>
      </div>

      {setupIncomplete && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{t("الإعداد غير مكتمل", "Setup incomplete")}</p>
              <ul className="text-xs text-muted-foreground mt-1 list-disc ms-4 space-y-0.5">
                {!company.name        && <li>{t("ملف الشركة فارغ — انتقل إلى \"إعداد الحسابات\".", 'Company profile empty — go to "Account Setup".')}</li>}
                {accounts.length === 0 && <li>{t("لا توجد حسابات بنكية.", "No bank accounts.")}</li>}
                {beneficiaries.length === 0 && <li>{t("لا يوجد مستفيدون — انتقل إلى \"المستفيدون\".", 'No beneficiaries — go to "Beneficiaries".')}</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t("بيانات التحويل", "Transfer details")}</CardTitle>
            <CardDescription>{t("املأ كل الحقول المطلوبة لتوليد المستند.", "Fill all required fields to generate the document.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="d-acct">{t("حساب المُرسِل", "Sender account")} *</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger id="d-acct"><SelectValue placeholder={t("اختر حساباً", "Choose an account")} /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label} — {a.bankName} ({a.currency})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="d-amt">{t("المبلغ", "Amount")} *</Label>
                <Input id="d-amt" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d-cur">{t("العملة", "Currency")} *</Label>
                <Input id="d-cur" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} maxLength={5} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-reason">{t("سبب التحويل", "Transfer reason")} *</Label>
              <Textarea id="d-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>{t("المستفيدون", "Beneficiaries")} *</Label>
              {beneficiaries.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("أضف مستفيدين أولاً.", "Add beneficiaries first.")}</p>
              ) : (
                <div className="rounded-lg border max-h-48 overflow-auto divide-y">
                  {beneficiaries.map((b) => (
                    <label key={b.id} className="flex items-start gap-2 p-2.5 hover:bg-muted/50 cursor-pointer">
                      <Checkbox
                        checked={selected.includes(b.id)}
                        onCheckedChange={(v) =>
                          setSelected(v ? [...selected, b.id] : selected.filter((x) => x !== b.id))
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{b.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.bankName} · {b.accountNumber}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("التوقيع", "Signature")} *</Label>
              <SignaturePad value={signatureDataUrl} onChange={setSignatureDataUrl} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-stamp">{t("صورة الختم (اختياري)", "Stamp image (optional)")}</Label>
              <Input
                id="d-stamp"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) { setStampDataUrl(undefined); return; }
                  const r = new FileReader();
                  r.onload = () => setStampDataUrl(r.result as string);
                  r.readAsDataURL(f);
                }}
              />
              <p className="text-xs text-muted-foreground">{t("إذا تُرك فارغاً سيُستخدم ختم دائري نائب.", "If left empty, a placeholder circular stamp is used.")}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handlePrint} disabled={!ready} className="gap-2">
                <Printer className="h-4 w-4" />{t("طباعة", "Print")}
              </Button>
              <Button type="button" onClick={handleDownload} disabled={!ready || busy} className="gap-2">
                <Download className="h-4 w-4" />{busy ? t("جارٍ التحضير...", "Preparing…") : t("تنزيل PDF", "Download PDF")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PREVIEW */}
        <Card>
          <CardHeader>
            <CardTitle>{t("المعاينة", "Preview")}</CardTitle>
            <CardDescription>{t("هذا ما سيظهر في المستند النهائي.", "This is what the final document will look like.")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/40 rounded-lg p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
              <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "182%" }}>
                {account ? (
                  <TransferLetter
                    ref={letterRef}
                    reference={reference}
                    date={date}
                    account={account}
                    amount={Number(amount) || 0}
                    currency={currency}
                    reason={reason}
                    beneficiaries={chosenBeneficiaries}
                    signatureDataUrl={signatureDataUrl}
                    stampDataUrl={stampDataUrl}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{t("اختر حساباً لرؤية المعاينة.", "Choose an account to see the preview.")}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden full-size render target — used by html2canvas to capture at 1x.
          Off-screen via absolute positioning so it doesn't affect layout. */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }} aria-hidden>
        {account && (
          <TransferLetter
            ref={letterRef}
            reference={reference}
            date={date}
            account={account}
            amount={Number(amount) || 0}
            currency={currency}
            reason={reason}
            beneficiaries={chosenBeneficiaries}
            signatureDataUrl={signatureDataUrl}
            stampDataUrl={stampDataUrl}
          />
        )}
      </div>
    </div>
  );
}
