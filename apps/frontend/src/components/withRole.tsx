import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function withRole(Component: React.FC, allowedRoles: string[]) {
  return function WrappedComponent(props: any) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) return;
      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }, [user]);

    if (!user || !allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}
