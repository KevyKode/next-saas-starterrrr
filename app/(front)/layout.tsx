// File: app/(front)/layout.tsx
'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Assuming Logo component exists and is imported correctly if needed
// import { Logo } from '@/components/logo'; 
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userPromise } = useUser();
  const user = use(userPromise);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push('/');
  }

  return (
    // Set background to transparent (or a very dark matching color if needed)
    // Removed bottom border, kept relative and z-index
    <header className="relative z-50 bg-transparent pt-2 pb-2"> {/* Adjusted padding slightly */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center"> {/* Adjusted padding */}
        <Link href="/" className="flex items-center">
        <Image
          // Assuming logo-long.png has a transparent background and white/light elements
          src="/logo-long.png" 
          alt="Logo"
          width={300} // Adjust size as needed
          height={100}
          className="object-contain" // Ensure logo scales correctly
        />
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            // --- Logged In State ---
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer size-9"> 
                  <AvatarImage alt={user?.name || ''} />
                  <AvatarFallback className="bg-purple-600 text-white"> 
                    {user?.email
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-1 bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem className="cursor-pointer hover:bg-purple-600 focus:bg-purple-600">
                  <Link href="/dashboard" className="flex w-full items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="w-full">
                  <button type="submit" className="flex w-full text-left">
                    <DropdownMenuItem className="w-full flex-1 cursor-pointer hover:bg-purple-600 focus:bg-purple-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // --- Logged Out State ---
            <>
            {/* Sign Up Button: Black background, white text, purple hover */}
            <Button
                asChild
                className="bg-black text-white hover:bg-purple-600 hover:text-white text-sm px-4 py-2 rounded-full border-0 transition-colors duration-200"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              {/* Sign In Button: White background, black text, purple hover */}
              <Button
                asChild
                className="bg-black text-white hover:bg-purple-600 hover:text-white text-sm px-4 py-2 rounded-full border-0 transition-colors duration-200"
              >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                </>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Removed dark background from main, letting page content define it
    <main className="flex flex-col min-h-screen"> 
      <Header />
      {children} 
    </main>
  );
}
