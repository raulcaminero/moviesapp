import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectToSignin() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signin');
  }, [router]);

  return null;
}