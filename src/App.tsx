import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
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
import AccountDetailsPage from "@/apps/synex/pages/Accounts/details"
import NewAccountPage from "@/apps/synex/pages/Accounts/new"
import BeneficiariesPage from "@/apps/synex/pages/Beneficiaries/beneficiaries"
import NewBeneficiaryPage from "@/apps/synex/pages/Beneficiaries/new"
import JournalEntriesPage from "@/apps/synex/pages/Journal-Entries/entries"
import NewJournalEntryPage from "@/apps/synex/pages/Journal-Entries/new"
import TransfersPage from "@/apps/synex/pages/Transfers/transfers"
import NewTransferPage from "@/apps/synex/pages/Transfers/new"
import TransferDetailPage from "@/apps/synex/pages/Transfers/details"
import ReportsPage from "@/apps/synex/pages/Reports/reports"
import { SynexProvider } from "@/apps/synex/store/synex-store.tsx"


export function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <Routes>
                {/* ... existing routes ... */}
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
                <Route path="/site-manager/faq" element={<PrivateRoute><FAQPage /></PrivateRoute>} />
                <Route path="/site-manager/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
                <Route path="/site-manager/newsletter" element={<PrivateRoute><NewsletterPage /></PrivateRoute>} />

                {/* Synex app routes */}
                <Route path="/synex/*" element={
                  <PrivateRoute>
                    <SynexProvider>
                      <Routes>
                        <Route path="overview" element={<SynexOverviewPage />} />
                        <Route path="accounts" element={<AccountsPage />} />
                        <Route path="accounts/new" element={<NewAccountPage />} />
                        <Route path="accounts/:id" element={<AccountDetailsPage />} />
                        <Route path="beneficiaries" element={<BeneficiariesPage />} />
                        <Route path="beneficiaries/new" element={<NewBeneficiaryPage />} />
                        <Route path="beneficiaries/:id" element={<BeneficiariesPage />} />
                        <Route path="transfers" element={<TransfersPage />} />
                        <Route path="transfers/new" element={<NewTransferPage />} />
                        <Route path="transfers/:id" element={<TransferDetailPage />} />
                        <Route path="journal-entries" element={<JournalEntriesPage />} />
                        <Route path="journal-entries/new" element={<NewJournalEntryPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                      </Routes>
                    </SynexProvider>
                  </PrivateRoute>
                } />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppProvider>
          </AuthProvider>
        </LanguageProvider>
      </NuqsAdapter>
    </BrowserRouter>
  )
}

export default App
