import { forwardRef } from "react";
import { useAppConfig } from "@/components/erp/app-config";
import { useBankingStore } from "../stores/banking-store";
import { COUNTRY_CONFIGS } from "../lib/countries";
import type { BankAccount, Beneficiary } from "../types";

interface Props {
  reference: string;
  date: string;
  account: BankAccount;
  amount: number;
  currency: string;
  reason: string;
  beneficiaries: Beneficiary[];
  signatureDataUrl?: string;
  stampDataUrl?: string;
}

/** Print-ready letterhead document. ref is forwarded so html2canvas can target the root. */
export const TransferLetter = forwardRef<HTMLDivElement, Props>(function TransferLetter(
  { reference, date, account, amount, currency, reason, beneficiaries, signatureDataUrl, stampDataUrl },
  ref
) {
  const { t, language } = useAppConfig();
  const company = useBankingStore((s) => s.company);
  const accountCfg = COUNTRY_CONFIGS[account.country];

  const initials = (company.name || "Co.")
    .split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "Co.";

  const fmtAmount = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

  return (
    <div
      ref={ref}
      // Force LTR & white background to keep PDF/print rendering deterministic across themes.
      dir="ltr"
      className="bg-white text-black mx-auto"
      style={{ width: "794px", minHeight: "1123px", padding: "48px", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* HEADER */}
      <header className="flex items-start justify-between border-b-2 pb-6" style={{ borderColor: "#0a0a0a" }}>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-lg text-white font-bold"
            style={{ width: 64, height: 64, background: "#0a0a0a", fontSize: 22 }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">{company.name || t("اسم الشركة", "Company Name")}</h1>
            {company.registrationNumber && (
              <p className="text-xs text-gray-600 mt-1">
                {t("السجل التجاري", "Reg. No")}: <span className="font-mono">{company.registrationNumber}</span>
              </p>
            )}
            {company.industry && <p className="text-xs text-gray-600">{company.industry}</p>}
          </div>
        </div>
        <div className="text-right text-xs">
          <p><span className="text-gray-500">{t("المرجع", "Ref")}:</span> <span className="font-mono">{reference}</span></p>
          <p className="mt-1"><span className="text-gray-500">{t("التاريخ", "Date")}:</span> <span className="font-mono">{date}</span></p>
        </div>
      </header>

      {/* SUBJECT */}
      <div className="mt-8">
        <h2 className="text-lg font-bold uppercase tracking-wide" style={{ letterSpacing: "0.08em" }}>
          {t("طلب تحويل بنكي", "Bank Transfer Request")}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {language === "ar"
            ? "نرجو من البنك المعني تنفيذ التحويل الموضح أدناه إلى المستفيدين المذكورين."
            : "We hereby request the bank to execute the transfer detailed below to the listed beneficiaries."}
        </p>
      </div>

      {/* AMOUNT (highlighted) */}
      <div className="mt-6 rounded-xl p-5" style={{ background: "#f4f4f5", border: "1px solid #d4d4d8" }}>
        <p className="text-xs uppercase tracking-wider text-gray-500">{t("مبلغ التحويل", "Transfer Amount")}</p>
        <p className="text-3xl font-bold mt-1" style={{ color: "#0a0a0a" }}>
          {currency} {fmtAmount}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          <span className="text-gray-500">{t("سبب التحويل", "Purpose")}:</span> {reason || "—"}
        </p>
      </div>

      {/* SENDER ACCOUNT */}
      <section className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
          {t("حساب المُرسِل", "Sender Account")}
        </h3>
        <div className="rounded-lg p-4" style={{ border: "1px solid #e4e4e7" }}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Row label={t("اسم البنك", "Bank")} value={account.bankName} />
            <Row label={t("صاحب الحساب", "Holder")} value={account.accountHolder} />
            <Row label={t("رقم الحساب", "Account No")} value={account.accountNumber} mono />
            <Row label={t("العملة", "Currency")} value={account.currency} />
            <Row label={t("الدولة", "Country")} value={`${accountCfg.flag} ${accountCfg.nameEn}`} />
            {accountCfg.fields.map((f) => account.routing[f.key] && (
              <Row key={f.key} label={f.labelEn} value={account.routing[f.key]} mono />
            ))}
            {account.branchAddress && (
              <div className="col-span-2"><Row label={t("عنوان الفرع", "Branch")} value={account.branchAddress} /></div>
            )}
          </div>
        </div>
      </section>

      {/* BENEFICIARIES */}
      <section className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
          {t("المستفيدون", "Beneficiaries")} ({beneficiaries.length})
        </h3>
        <div className="space-y-3">
          {beneficiaries.map((b, i) => {
            const cfg = COUNTRY_CONFIGS[b.country];
            return (
              <div key={b.id} className="rounded-lg p-4" style={{ border: "1px solid #e4e4e7" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm">{i + 1}. {b.fullName}</p>
                    {b.relationship && <p className="text-xs text-gray-500">{b.relationship}</p>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#f4f4f5" }}>
                    {cfg.flag} {cfg.nameEn}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Row label={t("البنك", "Bank")} value={b.bankName} />
                  <Row label={t("رقم الحساب", "Account No")} value={b.accountNumber} mono />
                  {b.iban && <Row label="IBAN" value={b.iban} mono />}
                  {cfg.fields.map((f) => b.routing[f.key] && (
                    <Row key={f.key} label={f.labelEn} value={b.routing[f.key]} mono />
                  ))}
                  {b.phone && <Row label={t("هاتف", "Phone")} value={b.phone} />}
                  {b.email && <Row label="Email" value={b.email} />}
                  {b.address && <div className="col-span-2"><Row label={t("العنوان", "Address")} value={b.address} /></div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SIGNATURE & STAMP */}
      <section className="mt-10 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{t("التوقيع المعتمد", "Authorized Signature")}</p>
          <div
            className="flex items-end justify-center"
            style={{ height: 100, borderBottom: "2px solid #0a0a0a" }}
          >
            {signatureDataUrl
              ? <img src={signatureDataUrl} alt="Signature" style={{ maxHeight: 90, maxWidth: "100%" }} />
              : <span className="text-xs text-gray-400 pb-2">{t("(توقيع)", "(signature)")}</span>}
          </div>
          <p className="text-xs text-gray-500 mt-2">{company.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{t("الختم الرسمي", "Official Stamp")}</p>
          <div className="flex items-center justify-center" style={{ height: 100 }}>
            {stampDataUrl ? (
              <img src={stampDataUrl} alt="Stamp" style={{ maxHeight: 100, maxWidth: "100%" }} />
            ) : (
              <div
                className="flex items-center justify-center text-center text-[10px] font-bold uppercase"
                style={{
                  width: 100, height: 100, borderRadius: "50%",
                  border: "2px solid #0a0a0a", color: "#0a0a0a", padding: 8, lineHeight: 1.2,
                }}
              >
                {company.name || "Company"}<br />· STAMP ·
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 pt-4 border-t text-xs text-gray-600" style={{ borderColor: "#d4d4d8" }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-x-3">
            {company.phone   && <span>📞 {company.phone}</span>}
            {company.email   && <span>✉ {company.email}</span>}
            {company.website && <span>🌐 {company.website}</span>}
          </div>
        </div>
        {company.address && <p className="mt-1">{company.address}</p>}
      </footer>
    </div>
  );
});

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`text-xs ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
