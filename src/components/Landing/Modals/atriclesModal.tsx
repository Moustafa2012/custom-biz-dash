import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar, Bookmark, Share2, FileText, X, Tag } from "lucide-react";
import { useAppConfig } from "@/components/erp/app-config";

interface LocalizedText {
  en: string;
  ar: string;
}

interface Article {
  title: string;
  desc: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  author?: string;
  publisher?: LocalizedText;
  journal?: LocalizedText;
  doi?: string;
  publishDate?: string;
  heroImage?: string;
  authorImage?: string;
  tags?: LocalizedText[];
  fullContent?: string;
}

interface ArticlesModalProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticlesModal({ article, open, onOpenChange }: ArticlesModalProps) {
  const isMobile = useIsMobile();
  const { language, t } = useAppConfig();

  if (!article) return null;

  const isAr = language === "ar";

  const content = (
    <div className="w-full" dir={isAr ? "rtl" : "ltr"}>

      {/* Hero */}
      <div className="relative -mx-6 -mt-6 mb-8 h-72 overflow-hidden rounded-t-lg">
        {article.heroImage ? (
          <img
            src={article.heroImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

        {/* Category chip */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Badge variant="secondary" className="uppercase tracking-widest text-[10px] font-semibold px-3">
            {article.category}
          </Badge>
          {article.featured && (
            <Badge className="uppercase tracking-widest text-[10px] font-semibold px-3">
              {isAr ? "مميز" : "Featured"}
            </Badge>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          <h1 className="text-2xl md:text-3xl font-bold leading-snug tracking-tight text-foreground">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7 pb-5 border-b border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} {isAr ? "للقراءة" : "read"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Bookmark className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Author */}
      {article.author && (
        <div className="flex items-center gap-4 mb-7">
          <a
            href={article.authorImage}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Avatar className="h-11 w-11 ring-1 ring-border">
              <AvatarImage src={article.authorImage} alt={article.author} />
              <AvatarFallback className="text-sm font-semibold bg-muted text-muted-foreground">
                {article.author.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </a>
          <div>
            <p className="text-sm font-semibold leading-none mb-1">{article.author}</p>
            <p className="text-xs text-muted-foreground">{isAr ? "مؤلف" : "Author"}</p>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-base text-muted-foreground leading-relaxed mb-7 border-s-2 border-border ps-4 italic">
        {article.desc}
      </p>

      {/* Full content */}
      {article.fullContent && (
        <div className="mb-8 space-y-4">
          {article.fullContent.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm leading-7 text-foreground">
              {para}
            </p>
          ))}
        </div>
      )}

      {/* Metadata block */}
      {(article.journal || article.publisher || article.doi) && (
        <div className="mb-8 rounded-lg border border-border bg-muted/30 divide-y divide-border overflow-hidden">
          {article.journal && (
            <MetaRow
              icon={<FileText className="h-3.5 w-3.5" />}
              label={isAr ? "المجلة العلمية" : "Journal"}
              value={typeof article.journal === "string" ? article.journal : article.journal[language]}
            />
          )}
          {article.publisher && (
            <MetaRow
              icon={<FileText className="h-3.5 w-3.5" />}
              label={isAr ? "الناشر" : "Publisher"}
              value={typeof article.publisher === "string" ? article.publisher : article.publisher[language]}
            />
          )}
          {article.doi && (
            <MetaRow
              icon={<FileText className="h-3.5 w-3.5" />}
              label="DOI"
              value={<span className="font-mono text-xs break-all">{article.doi}</span>}
            />
          )}
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
            <Tag className="h-3 w-3" />
            {isAr ? "العلامات" : "Tags"}
          </p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs rounded-full px-3">
                #{isAr ? tag.ar : tag.en}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <Separator className="mb-6" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        <p className="text-sm text-muted-foreground">
          {isAr ? "شارك مع أصدقائك أو احفظه للقراءة لاحقاً" : "Share with friends or save for later"}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="h-3.5 w-3.5" />
            {isAr ? "احفظ" : "Save"}
          </Button>
          <Button size="sm" className="gap-2">
            <Share2 className="h-3.5 w-3.5" />
            {isAr ? "شارك" : "Share"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] max-h-[90vh] p-0">
          <ScrollArea className="h-full">
            <div className="p-6">{content}</div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="absolute right-4 top-4 z-50">
          <DialogPrimitive.Close className="rounded-full p-1.5 opacity-60 ring-offset-background transition-all hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <ScrollArea className="h-[85vh] w-full">
          <div className="p-8">{content}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ── Internal helper ──────────────────────────────────────────────────────────

interface MetaRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 text-sm">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0">
        <span className="font-medium text-foreground me-1">{label}:</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}