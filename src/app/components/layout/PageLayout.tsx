import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
  userRole?: 'student' | 'instructor' | 'head' | 'admin';
  userName?: string;
  userAvatar?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageLayout({
  children,
  userRole,
  userName,
  userAvatar,
  title,
  subtitle,
  actions,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
      />

      <div className="flex-1 ml-60">
        {(title || actions) && (
          <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </div>
        )}

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
