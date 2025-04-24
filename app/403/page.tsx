import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <ShieldAlert className="h-24 w-24 text-muted-foreground" />
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
        <div className="flex gap-2">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
