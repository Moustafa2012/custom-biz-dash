import { useAppConfig } from "../app-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Server, Mail, Send, FileText, ScrollText, ChevronRight } from "lucide-react";

export function SmtpSettingsTab() {
  const { t } = useAppConfig();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            {t("SMTP Server", "SMTP Server")}
          </CardTitle>
          <CardDescription className="text-xs">{t("Configure outgoing mail server", "Configure outgoing mail server")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("Host", "Host")}</label>
            <Input placeholder="smtp.example.com" className="h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">{t("Port", "Port")}</label>
              <Input placeholder="587" className="h-9" />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">{t("Encryption", "Encryption")}</label>
              <Input placeholder="TLS" className="h-9" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("Username", "Username")}</label>
            <Input placeholder="user@example.com" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("Password", "Password")}</label>
            <Input placeholder="..." type="password" className="h-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Send className="h-3.5 w-3.5" />
            {t("Test Connection", "Test Connection")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {t("Sender Identity", "Sender Identity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("From Name", "From Name")}</label>
            <Input placeholder="My Company" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("From Email", "From Email")}</label>
            <Input placeholder="noreply@example.com" className="h-9" />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">{t("Reply-To", "Reply-To")}</label>
            <Input placeholder="support@example.com" className="h-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {t("Templates", "Templates")}
          </CardTitle>
          <CardDescription className="text-xs">{t("Manage email templates", "Manage email templates")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Welcome Email", "Invoice", "Password Reset", "Notification"].map((template) => (
            <div key={template} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2.5">
              <span className="text-sm font-medium">{template}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-muted-foreground" />
            {t("Logs", "Logs")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("Enable Logging", "Enable Logging")}</p>
              <p className="text-xs text-muted-foreground">{t("Log all sent emails", "Log all sent emails")}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>{t("Save SMTP Settings", "Save SMTP Settings")}</Button>
      </div>
    </div>
  );
}
