import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IconArrowLeft, IconDownload, IconPrinter } from '@tabler/icons-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { t } from '@/lib/translations'
import { useSynex } from '../../store/synex-store'
import { downloadTransferPDF, previewTransferPDF } from '../../lib/PDF-Gen'

export default function TransferDocumentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state } = useSynex()
  const [dataUri, setDataUri] = useState<string>('')

  const transfer = useMemo(() => state.transfers.find((tr) => tr.id === id), [state.transfers, id])
  const account = useMemo(
    () => state.accounts.find((a) => a.id === transfer?.sourceAccountId),
    [state.accounts, transfer?.sourceAccountId],
  )
  const beneficiary = useMemo(
    () => state.beneficiaries.find((b) => b.id === transfer?.beneficiaryId),
    [state.beneficiaries, transfer?.beneficiaryId],
  )

  useEffect(() => {
    if (!transfer || !account || !beneficiary) return
    try {
      const uri = previewTransferPDF({ transfer, sourceAccount: account, beneficiary })
      setDataUri(uri)
    } catch (e) {
      console.error('PDF preview failed', e)
    }
  }, [transfer, account, beneficiary])

  if (!transfer || !account || !beneficiary) {
    return (
      <AppLayout title={t('المستند غير متاح', 'Document not available')}>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground">
            {t('تعذر إنشاء المستند لهذا التحويل', 'Unable to generate document for this transfer.')}
          </p>
          <Link to="/synex/transfers">
            <Button variant="outline" className="gap-2">
              <IconArrowLeft className="h-4 w-4" />
              {t('العودة للقائمة', 'Back to list')}
            </Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const handleDownload = () =>
    downloadTransferPDF({ transfer, sourceAccount: account, beneficiary })

  const handlePrint = () => {
    const w = window.open(dataUri)
    w?.addEventListener('load', () => w.print())
  }

  return (
    <AppLayout title={t('مستند التحويل', 'Transfer Document')}>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(`/synex/transfers/${transfer.id}`)}
              aria-label={t('رجوع', 'Back')}
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold tracking-tight font-mono">
                {transfer.referenceNumber}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('معاينة المستند الرسمي', 'Official document preview')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={handlePrint}>
              <IconPrinter className="h-4 w-4" />
              {t('طباعة', 'Print')}
            </Button>
            <Button className="gap-2 rounded-xl" onClick={handleDownload}>
              <IconDownload className="h-4 w-4" />
              {t('تحميل PDF', 'Download PDF')}
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-border/60 rounded-2xl">
          {dataUri ? (
            <iframe
              src={dataUri}
              title="Transfer document"
              className="w-full h-[calc(100vh-220px)] min-h-[600px] bg-muted"
            />
          ) : (
            <div className="flex items-center justify-center h-[600px] text-sm text-muted-foreground">
              {t('جارٍ إنشاء المستند...', 'Generating document...')}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
