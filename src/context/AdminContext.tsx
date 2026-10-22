import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/ecommerce';

interface AdminContextType {
  adminToken: string | null;
  adminUser: Omit<AdminUser, 'passwordHash' | 'salt'> | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('kh_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<Omit<AdminUser, 'passwordHash' | 'salt'> | null>(() => {
    try {
      const saved = localStorage.getItem('kh_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (adminToken) {
      headers.set('Authorization', `Bearer ${adminToken}`);
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      logout();
    }
    return response;
  };

  useEffect(() => {
    if (adminToken && !adminUser) {
      fetchWithAuth('/api/admin/me')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Unauthorized');
        })
        .then(user => {
          setAdminUser(user);
          localStorage.setItem('kh_admin_user', JSON.stringify(user));
        })
        .catch(() => {
          logout();
        });
    }
  }, [adminToken]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        setAdminUser(data.user);
        localStorage.setItem('kh_admin_token', data.token);
        localStorage.setItem('kh_admin_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Connection error during admin login' };
    }
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('kh_admin_token');
    localStorage.removeItem('kh_admin_user');
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetchWithAuth('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update password' };
    } catch {
      return { success: false, error: 'Network error updating password' };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminToken,
        adminUser,
        isAuthenticated: !!adminToken,
        login,
        logout,
        changePassword,
        fetchWithAuth
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
