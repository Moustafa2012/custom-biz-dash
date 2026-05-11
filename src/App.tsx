import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LandingPage } from "@/pages/landing-page"
import { AuthProvider } from "@/contexts/auth-context"
import { AppProvider } from "@/contexts/app-context"
import { LanguageProvider } from "@/components/language-provider"
import LoginPage from "@/pages/login-page"
import { PrivateRoute } from "@/components/auth/private-route"
import SettingsPage from "@/pages/settings"
import HelpPage from "@/pages/help"
import SearchPage from "@/pages/search"
import ArticleReader from "@/components/sections/ArticleReader"

// Platform app pages
import PlatformOverviewPage from "@/apps/platform/pages/overview/overview"
import TelefatherPage from "@/apps/platform/pages/telefather/telefather"
import MailerPage from "@/apps/platform/pages/Mailer/mailer"
import PlatformUsersPage from "@/apps/platform/pages/users/users"
import AuditLogsPage from "@/apps/platform/pages/audit-logs/audit-logs"

// Site Manager app pages
import OverviewPage from "@/apps/site-manager/pages/overview"
import ProductsPage from "@/apps/site-manager/pages/products"
import ArticlesPage from "@/apps/site-manager/pages/articles/articles"
import ArticleComposerPage from "@/apps/site-manager/pages/articles/Articlecomposer"
import FAQPage from "@/apps/site-manager/pages/faq"
import MessagesPage from "@/apps/site-manager/pages/messages"
import NewsletterPage from "@/apps/site-manager/pages/newsletter"

// Synex app pages
import SynexOverviewPage from "@/apps/synex/pages/Overview/overview"
import AccountsPage from "@/apps/synex/pages/Accounts/accounts"
import BeneficiariesPage from "@/apps/synex/pages/Beneficiaries/beneficiaries"
import JournalEntriesPage from "@/apps/synex/pages/Journal-Entries/entries"
import TransactionsPage from "@/apps/synex/pages/Transactions/transactions"
import ReportsPage from "@/apps/synex/pages/Reports/reports"

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Platform app routes */}
              <Route path="/platform/overview" element={<PrivateRoute><PlatformOverviewPage /></PrivateRoute>} />
              <Route path="/platform/telefather" element={<PrivateRoute><TelefatherPage /></PrivateRoute>} />
              <Route path="/platform/mailer" element={<PrivateRoute><MailerPage /></PrivateRoute>} />
              <Route path="/platform/users" element={<PrivateRoute><PlatformUsersPage /></PrivateRoute>} />
              <Route path="/platform/audit-logs" element={<PrivateRoute><AuditLogsPage /></PrivateRoute>} />

              {/* General routes */}
              <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/articles/read" element={<ArticleReader />} />

              {/* Site Manager app routes */}
              <Route path="/site-manager/overview" element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
              <Route path="/site-manager/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
              <Route path="/site-manager/articles" element={<PrivateRoute><ArticlesPage /></PrivateRoute>} />
              <Route path="/site-manager/articles/create" element={<PrivateRoute><ArticleComposerPage /></PrivateRoute>} />
              <Route path="/site-manager/articles/edit" element={<PrivateRoute><ArticleComposerPage /></PrivateRoute>} />
              <Route path="/site-manager/faq" element={<PrivateRoute><FAQPage /></PrivateRoute>} />
              <Route path="/site-manager/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
              <Route path="/site-manager/newsletter" element={<PrivateRoute><NewsletterPage /></PrivateRoute>} />

              {/* Synex app routes */}
              <Route path="/synex/overview" element={<PrivateRoute><SynexOverviewPage /></PrivateRoute>} />
              <Route path="/synex/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
              <Route path="/synex/beneficiaries" element={<PrivateRoute><BeneficiariesPage /></PrivateRoute>} />
              <Route path="/synex/journal-entries" element={<PrivateRoute><JournalEntriesPage /></PrivateRoute>} />
              <Route path="/synex/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
              <Route path="/synex/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App