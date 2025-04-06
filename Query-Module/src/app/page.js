'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUserQuery } from '@/lib/redux/authApi';

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetUserQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!user || isError) {
        router.replace('/auth/login');
      } else {
        router.replace('/farms'); 
      }
    }
  }, [user, isLoading, isError, router]);

  return null;
}
