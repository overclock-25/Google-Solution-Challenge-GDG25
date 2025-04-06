'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '../../hooks/useAuth';
import { useGetUserQuery } from '@/lib/redux/authApi';
import { useLogoutUserMutation } from '@/lib/redux/authApi';
import { auth } from '@/lib/firebase/firebase-client';

export default function Dashboard() {
  const { data, error, isLoading: loading, refetch } = useGetUserQuery();
  const [logout] = useLogoutUserMutation();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    refetch();
    console.log(data);
  }

  useEffect(() => {
    if (!loading && !data?.user) {
      router.push('/');
    }
  }, [data?.user, loading, router]);
  
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  
  if (!data?.user) {
    return null;
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Welcome, {data?.userData?.displayName || data?.user.email}</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">Email: {data?.user.email}</p>
          {data?.userData?.lastLogin && (
            <p className="text-gray-600">
              Last login: {new Date(data?.userData.lastLogin._seconds * 1000).toLocaleString()}
            </p>
          )}
        </div>
        
        <button
          onClick={() => handleLogout()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}