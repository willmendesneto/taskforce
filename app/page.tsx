import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between p-8">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-primary text-xl">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 p-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Manage your projects with ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TaskFlow helps you organize your projects and tasks in one place. Stay on top of
                    your work and collaborate with your team.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-4 shadow-lg">
                  <div className="absolute left-4 top-4 right-4 h-8 rounded bg-background"></div>
                  <div className="absolute left-4 top-16 w-2/3 h-4 rounded bg-background"></div>
                  <div className="absolute left-4 top-24 w-1/2 h-4 rounded bg-background"></div>
                  <div className="absolute left-4 top-36 right-4 h-24 rounded bg-background"></div>
                  <div className="absolute left-4 bottom-24 right-4 h-24 rounded bg-background"></div>
                  <div className="absolute left-4 bottom-4 w-1/3 h-8 rounded bg-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
