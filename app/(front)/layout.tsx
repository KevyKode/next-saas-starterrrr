// File: app/(front)/layout.tsx
'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Home, LogOut } from 'lucide-react'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions'; 
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils'; 

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
    <header className="relative z-50 bg-transparent pt-2 pb-2"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center"> 
        <Link href="/" className="flex items-center">
        <Image
          src="/logo-square.png" 
          alt="Logo"
          width={90} 
          height={90}
          className="object-contain h-auto" 
          priority 
        />
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            // Logged In State 
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger> 
                <Avatar className="cursor-pointer size-9"> 
                  <AvatarImage alt={user?.name || ''} />
                  <AvatarFallback className="bg-purple-600 text-white"> 
                    {user?.email?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
               <DropdownMenuContent variant="cosmic" align="end" className="flex flex-col gap-1">
                 <DropdownMenuItem variant="cosmic"> <Link href="/dashboard" className="flex w-full items-center"><Home className="mr-2 h-4 w-4" /><span>Dashboard</span></Link> </DropdownMenuItem>
                 <form action={handleSignOut} className="w-full"><button type="submit" className="flex w-full text-left"><DropdownMenuItem variant="cosmic" className="w-full flex-1"><LogOut className="mr-2 h-4 w-4" /><span>Sign out</span></DropdownMenuItem></button></form>
               </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // --- Logged Out State (MODIFIED BUTTONS) ---
            <>
            {/* Sign Up Button: Black background, white text, purple hover */}
            <Button
                asChild
                // --- Corrected Style ---
                className="bg-black text-white hover:bg-purple-600 hover:text-white text-sm px-4 py-2 rounded-full border-0 transition-colors duration-200"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              {/* Sign In Button: White background, black text, purple hover */}
              <Button
                asChild
                // --- Corrected Style ---
                className="bg-white text-black hover:bg-purple-600 hover:text-white text-sm px-4 py-2 rounded-full border-0 transition-colors duration-200" 
              >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
            </>
            // --- End Modification ---
          )}
        </div>
      </div>
    </header>
  );
}

export default function FrontLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <main className="flex flex-col min-h-screen"> 
      <Header /> 
      {children} 
    </main>
  );
}
