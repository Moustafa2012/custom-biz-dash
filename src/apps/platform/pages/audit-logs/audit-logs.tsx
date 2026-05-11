import { AppLayout } from "@/components/layout/app-layout"
import { t } from "@/lib/translations"
import { IconEye, IconTrash, IconDownload, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

// Import AuditLogger from nav-secondary
import { AuditLogger } from "@/components/navigation/nav-secondary"

interface AuditLog {
  timestamp: string
  userId?: string
  action: string
  app: string
  url: string
  userAgent: string
  sessionId: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadLogs = () => {
    setIsLoading(true)
    const auditLogs = AuditLogger.getAuditLogs()
    setLogs(auditLogs.reverse()) // Show newest first
    setIsLoading(false)
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const handleClearLogs = () => {
    if (confirm(t("هل أنت متأكد من مسح جميع سجلات التدقيق؟", "Are you sure you want to clear all audit logs?"))) {
      AuditLogger.clearAuditLogs()
      setLogs([])
    }
  }

  const handleDownloadLogs = () => {
    const dataStr = JSON.stringify(logs.reverse(), null, 2) // Reverse back for proper order
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `audit-logs-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getAppColor = (app: string) => {
    const colors: Record<string, string> = {
      'platform': 'bg-blue-500',
      'site-manager': 'bg-green-500', 
      'synex': 'bg-purple-500',
      'settings': 'bg-orange-500',
      'help': 'bg-pink-500',
      'search': 'bg-indigo-500'
    }
    return colors[app] || 'bg-gray-500'
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <AppLayout title={t("سجلات التدقيق", "Audit Logs")}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
              <IconEye className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("سجلات التدقيق", "Audit Logs")}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t("مراقبة جميع الأنشطة والتنقلات في النظام", "Monitor all activities and navigation in the system")}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              disabled={isLoading}
            >
              <IconRefresh className="h-4 w-4 mr-2" />
              {t("تحديث", "Refresh")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadLogs}
              disabled={logs.length === 0}
            >
              <IconDownload className="h-4 w-4 mr-2" />
              {t("تحميل", "Download")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearLogs}
              disabled={logs.length === 0}
            >
              <IconTrash className="h-4 w-4 mr-2" />
              {t("مسح الكل", "Clear All")}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("إجمالي السجلات", "Total Logs")}
              </CardTitle>
              <IconEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("التطبيقات", "Apps")}
              </CardTitle>
              <IconEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(logs.map(log => log.app)).size}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("الجلسات", "Sessions")}
              </CardTitle>
              <IconEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(logs.map(log => log.sessionId)).size}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("المستخدمون", "Users")}
              </CardTitle>
              <IconEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(logs.map(log => log.userId || 'anonymous')).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("سجل الأنشطة", "Activity Log")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("جاري التحميل...", "Loading...")}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("لا توجد سجلات تدقيق حالياً", "No audit logs available")}
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 space-y-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getAppColor(log.app)} text-white`}>
                          {log.app.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{log.action}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">
                          {t("المستخدم:", "User:")} 
                        </span>
                        <span className="ml-2">{log.userId || 'anonymous'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">
                          {t("الجلسة:", "Session:")} 
                        </span>
                        <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">
                          {log.sessionId.slice(0, 12)}...
                        </code>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-muted-foreground">
                          {t("الرابط:", "URL:")} 
                        </span>
                        <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">
                          {log.url}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
