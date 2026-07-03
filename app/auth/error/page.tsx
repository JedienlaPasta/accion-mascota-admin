'use client';
import { useEffect } from 'react';

export default function AuthErrorPage() {
  useEffect(() => {
    window.location.href = '/';
  }, []);

  return null;
}
