import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useAppConfig } from "./app-config";
import { ROLE_LABELS } from "@/types/auth";
import type { User } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Search, Shield, Mail, Phone, MapPin, Calendar, ChevronLeft, ChevronRight,
} from "lucide-react";

export function UsersPage() {
  const { t, language } = useAppConfig();
  const users = useAuthStore((s) => s.users);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // RTL-aware back icon
  const BackIcon = language === "ar" ? ChevronRight : ChevronLeft;

  if (selectedUser) {
    const age = selectedUser.dateOfBirth
      ? Math.floor((Date.now() - new Date(selectedUser.dateOfBirth).getTime()) / 31557600000)
      : null;
    const roleLabel = ROLE_LABELS[selectedUser.role];

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
            <BackIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-heading font-bold">{t("تفاصيل المستخدم", "User Details")}</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback className="text-xl bg-primary/20 text-primary">
                  {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-heading font-bold">{selectedUser.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <Badge variant={selectedUser.isActive ? "default" : "destructive"} className="text-xs">
                    {selectedUser.isActive ? t("نشط", "Active") : t("معطّل", "Disabled")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {language === "ar" ? roleLabel.ar : roleLabel.en}
                  </Badge>
                  {selectedUser.twoFactorEnabled && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Shield className="h-3 w-3" /> 2FA
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("معلومات الاتصال", "Contact Info")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" /> {selectedUser.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" /> {selectedUser.phone}
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{[selectedUser.address, selectedUser.city, selectedUser.country].filter(Boolean).join(", ")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("معلومات شخصية", "Personal Info")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedUser.dateOfBirth && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {selectedUser.dateOfBirth}
                  {age !== null && <span className="text-muted-foreground">({age} {t("سنة", "yrs")})</span>}
                </div>
              )}
              {selectedUser.gender && (
                <div className="text-sm">
                  <Label className="text-xs text-muted-foreground">{t("الجنس", "Gender")}</Label>
                  <p>{selectedUser.gender === "male" ? t("ذكر", "Male") : t("أنثى", "Female")}</p>
                </div>
              )}
              <Separator />
              <div className="text-sm">
                <Label className="text-xs text-muted-foreground">{t("تاريخ الإنشاء", "Created")}</Label>
                <p>{selectedUser.createdAt}</p>
              </div>
              <div className="text-sm">
                <Label className="text-xs text-muted-foreground">{t("آخر دخول", "Last Login")}</Label>
                <p>{selectedUser.lastLogin || t("لم يسجل دخول بعد", "Never logged in")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Permissions card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {t("الصلاحيات", "Permissions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-0.5 text-[11px] font-mono text-primary border border-primary/20"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          {t("المستخدمون", "Users")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} {t("مستخدم", "users")}
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("بحث بالاسم أو البريد...", "Search by name or email...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("المستخدم", "User")}</TableHead>
                <TableHead>{t("الدور", "Role")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("الهاتف", "Phone")}</TableHead>
                <TableHead>{t("الحالة", "Status")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("المصادقة الثنائية", "2FA")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("آخر دخول", "Last Login")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t("لا توجد نتائج", "No results found")}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => {
                  const rl = ROLE_LABELS[user.role];
                  return (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {language === "ar" ? rl.ar : rl.en}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "destructive"} className="text-xs">
                          {user.isActive ? t("نشط", "Active") : t("معطّل", "Disabled")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {user.twoFactorEnabled ? (
                          <Badge variant="secondary" className="text-xs gap-1"><Shield className="h-3 w-3" /> {t("مفعّلة", "On")}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t("معطّلة", "Off")}</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{user.lastLogin || "—"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
