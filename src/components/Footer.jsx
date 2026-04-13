import React, { useState } from 'react';
import { Pen, X, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanel from './AdminPanel';

import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import metadata from '../data/metadata.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!metadata.name);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [currentKey, setCurrentKey] = useState("");
  const [loadingKey, setLoadingKey] = useState(true);
  const [showSystemKeyOverlay, setShowSystemKeyOverlay] = useState(false);

  // Fetch current access key
  React.useEffect(() => {
    setLoadingKey(true);
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.adminAccessKey) {
          setCurrentKey(data.adminAccessKey);
        } else {
          // Hardcoded fallback hash for MYPORT@123
          setCurrentKey("45729181a21304931555490a74f362451b681dd358ea7d427ba26562d8881dd2");
        }
      })
      .catch(err => {
        console.error(err);
        setCurrentKey("45729181a21304931555490a74f362451b681dd358ea7d427ba26562d8881dd2");
      })
      .finally(() => setLoadingKey(false));
  }, [isAuthModalOpen]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (loadingKey) return;
    
    try {
      // Hash the entered access key using SHA-256 (trimmed for safety)
      const msgUint8 = new TextEncoder().encode(accessKey.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedEnteredKey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashedEnteredKey === currentKey) {
        setIsAuthModalOpen(false);
        setIsDashboardOpen(true);
        setError("");
        setAccessKey("");
      } else {
        setError("Invalid access key. Please try again.");
      }
    } catch (err) {
      console.error('Hashing failed:', err);
      setError("Security verification failed. Please try again.");
    }
  };

  return (
    <>
      <footer className="border-t border-border/50 py-12 mt-12 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-muted-foreground bg-secondary/20 px-6 py-3 rounded-full border border-border/30 backdrop-blur-md shadow-sm">
            {metadata.contact?.github && (
              <a href={metadata.contact.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition-all hover:scale-110 active:scale-95">
                <FaGithub size={20} />
              </a>
            )}
            {metadata.contact?.linkedin && (
              <a href={metadata.contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#0A66C2] transition-all hover:scale-110 active:scale-95">
                <FaLinkedin size={20} />
              </a>
            )}
            {metadata.contact?.instagram && (
              <a href={metadata.contact.instagram} target="_blank" rel="noreferrer" className="hover:text-[#E4405F] transition-all hover:scale-110 active:scale-95">
                <FaInstagram size={20} />
              </a>
            )}
            {metadata.contact?.leetcode && (
              <a href={metadata.contact.leetcode} target="_blank" rel="noreferrer" className="hover:text-[#FFA116] transition-all hover:scale-110 active:scale-95">
                <SiLeetcode size={20} />
              </a>
            )}
            
            <div className="w-[1px] h-4 bg-border/50 mx-1" />

            <div className="relative group flex items-center justify-center">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-primary transition-colors cursor-pointer" 
                aria-label="Admin Access"
              >
                <Pen size={18} />
              </button>
              <div className="absolute bottom-full mb-3 origin-bottom scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 pointer-events-none w-max bg-background border border-border text-foreground text-xs rounded-md px-2 py-1.5 shadow-xl">
                Unlock Secret Tool
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            © {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    {/* Auth Modal (Small) */}
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              x: error ? [-10, 10, -10, 10, 0] : 0 
            }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-full max-w-sm bg-card border-2 border-border/80 rounded-3xl p-8 shadow-[0_25px_50px_-12px_rgba(var(--primary),0.25)] overflow-hidden flex flex-col"
          >
            <button 
              onClick={() => {
                setIsAuthModalOpen(false);
                setError("");
                setAccessKey("");
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close Auth"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2 mt-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Lock size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Admin Access</h3>
              <p className="text-muted-foreground text-sm">Please enter your edit access key.</p>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-2xl border border-red-500/20 mt-4 mx-auto w-full"
                >
                  <AlertCircle size={14} />
                  <p className="text-[11px] font-bold uppercase tracking-wider">
                    {error}
                  </p>
                </motion.div>
              )}
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <input 
                  type="password" 
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••••••"
                  className={`w-full bg-background/50 border-2 ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-border focus:border-primary/50 focus:shadow-[0_0_20px_rgba(var(--primary),0.2)]'} rounded-xl px-4 py-4 text-center text-2xl tracking-[0.4em] font-mono focus:outline-none transition-all duration-300 placeholder:opacity-30`}
                  required
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                  Verify Key
                </button>
                <button 
                  type="button"
                  disabled={error !== "Invalid access key. Please try again."}
                  onClick={() => setShowSystemKeyOverlay(true)}
                  className={`text-sm tracking-wide transition-all w-max mx-auto ${
                    error === "Invalid access key. Please try again." 
                      ? "text-primary hover:text-primary/80 cursor-pointer underline underline-offset-4" 
                      : "text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  Use System Key
                </button>
              </div>
            </form>

            <AnimatePresence>
              {showSystemKeyOverlay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/95 backdrop-blur-md z-[70] flex flex-col justify-center items-center p-8 text-center"
                >
                  <AlertCircle size={48} className="text-primary mb-6" />
                  <h4 className="text-xl font-bold mb-3 tracking-tight">System Key Reset</h4>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                    Your password will be reset to the system key. Use the system key to get Admin Access. Afterwards, please go to <span className="font-semibold text-foreground">Config &gt; Admin Access</span> to change your custom access key.
                  </p>
                  <div className="flex w-full gap-4">
                    <button 
                      onClick={() => setShowSystemKeyOverlay(false)}
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          await fetch('/api/config', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ adminAccessKey: 'MYPORT@123' })
                          });
                          setCurrentKey("45729181a21304931555490a74f362451b681dd358ea7d427ba26562d8881dd2");
                        } catch (err) {
                          console.error("System key reset failed:", err);
                        } finally {
                          setShowSystemKeyOverlay(false);
                          setAccessKey(""); // Clears the input instead of auto-filling
                          setError("");
                        }
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-semibold transition-all shadow-lg shadow-primary/25"
                    >
                      Proceed
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Admin Dashboard Overlay (Fullscreen) */}
    <AnimatePresence>
      {isDashboardOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 sm:p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full h-full max-w-5xl bg-card border border-border rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col"
          >
              <AdminPanel onClose={() => setIsDashboardOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
