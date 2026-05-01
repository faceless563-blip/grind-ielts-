import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle } from './firebase';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Curriculum from './components/Curriculum';
import Analytics from './components/Analytics';
import AIChat from './components/AIChat';
import CareerTrack from './components/CareerTrack';
import Vocabulary from './components/Vocabulary';
import ExamRecord from './components/ExamRecord';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const initializeStore = useStore(state => state.initialize);
  const isInitialized = useStore(state => state.isInitialized);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = initializeStore(user.uid);
      return () => unsub();
    }
  }, [user, initializeStore]);

  const handleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error already handled in signInWithGoogle helper mostly
    } finally {
      setSigningIn(false);
    }
  };

  if (loading || (user && !isInitialized)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg font-bold text-primary">Initializing Platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded border border-border bg-card text-primary">
            <GraduationCap size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">GrindIELTS</h1>
            <p className="text-foreground/60">Professional IELTS preparation studio.</p>
          </div>
          <Button 
            onClick={handleLogin}
            disabled={signingIn}
            className="h-12 w-full rounded-sm bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50"
          >
            <LogIn className="mr-2" size={18} />
            {signingIn ? 'Signing in...' : 'Student Login'}
          </Button>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">
            Secure Access • PROGRESSIVE UNLOCKS
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/exam-record" element={<ExamRecord />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/career" element={<CareerTrack />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

