'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/user';

interface RequireRoleProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({ allowedRoles, children, fallback = null }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}