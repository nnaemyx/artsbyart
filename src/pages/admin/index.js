import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import { useAuth } from '@/utils/AuthContent';

const Admin = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/authentication/login");
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-10'>
      <h1>Welcome, {user?.name || 'Admin'}!</h1>
    </div>
  );
};

export default Admin;
