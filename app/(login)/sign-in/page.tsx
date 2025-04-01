// File: app/(login)/sign-in/page.tsx
import { Suspense } from 'react';
import { Login } from '../login'; // Import the Login component from the file we just renamed/moved

export const metadata = {
  title: 'Sign In', // Optional: Add metadata
};

export default function SignInPage() {
  return (
    // Suspense might be needed if searchParams are used internally in Login
    <Suspense fallback={<div>Loading...</div>}> 
      <Login mode="signin" />
    </Suspense>
  );
}
