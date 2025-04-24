'use client';

import { LayoutDashboard, FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
  ];

  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="h-full py-6 pr-6 lg:py-8">
        <div className="flex flex-col h-full space-y-4">
          <div className="space-y-1">
            {routes.map(route => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start')}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
          <div className="space-y-1">
            <Link href="/dashboard/projects/new">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
