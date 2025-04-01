// File: app/(login)/login.tsx
'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions'; // Assuming this path is now correct
import { ActionState } from '@/lib/auth/middleware';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Import cn

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' },
  );

  return (
    // --- MODIFIED: Main container background and base text color ---
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950 text-gray-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6"> 
          <Link href="/"> 
            <Image 
              alt="Logo" 
              src="/logo-long.png" 
              width={200} 
              height={100} 
              className="object-contain"
            />
          </Link>
        </div>
        {/* --- MODIFIED: Heading text color --- */}
        <h2 className="text-center text-3xl font-extrabold text-white">
          {mode === 'signin'
            ? 'Sign in to your account'
            : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" action={formAction}>
          <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} />
          <div>
            {/* --- MODIFIED: Label text color --- */}
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </Label>
            <div className="mt-1">
              {/* --- MODIFIED: Input uses 'cosmic' variant and dark theme styles --- */}
              <Input
                id="email"
                name="email"
                type="email"
                variant="cosmic" // Use dark theme variant
                rounded="full"   // Keep rounded style
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                placeholder="Enter your email"
                className="text-white placeholder-gray-500" // Ensure text/placeholder colors fit dark theme
              />
            </div>
          </div>

          <div>
            {/* --- MODIFIED: Label text color --- */}
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </Label>
            <div className="mt-1">
              {/* --- MODIFIED: Input uses 'cosmic' variant and dark theme styles --- */}
              <Input
                id="password"
                name="password"
                type="password"
                variant="cosmic" // Use dark theme variant
                rounded="full"   // Keep rounded style
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                placeholder="Enter your password"
                className="text-white placeholder-gray-500" // Ensure text/placeholder colors fit dark theme
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-400 text-sm">{state.error}</div> // Adjusted error color
          )}

          <div>
            {/* --- MODIFIED: Submit Button uses ITT gradient --- */}
            <Button
              type="submit"
              variant="gradient" // Use gradient variant from button.tsx
              rounded="full"     // Keep rounded style
              className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white hover:shadow-purple-500/30" // Adjusted hover shadow
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === 'signin' ? (
                'Sign in'
              ) : (
                'Sign up'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              {/* --- MODIFIED: Divider color --- */}
              <div className="w-full border-t border-gray-700" /> 
            </div>
            <div className="relative flex justify-center text-sm">
              {/* --- MODIFIED: Divider text background and color --- */}
              <span className="px-2 bg-gray-950 text-gray-400"> 
                {mode === 'signin'
                  ? 'New to our platform?'
                  : 'Already have an account?'}
              </span>
            </div>
          </div>

          <div className="mt-6">
             {/* --- MODIFIED: Switch Mode Link Button uses outline style for dark theme --- */}
            <Button 
              asChild 
              variant="outline" 
              rounded="full" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500"
            >
              <Link
                href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                  redirect ? `?redirect=${redirect}` : ''
                }${priceId ? `&priceId=${priceId}` : ''}`}
              >
                {mode === 'signin'
                  ? 'Create an account'
                  : 'Sign in to existing account'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
