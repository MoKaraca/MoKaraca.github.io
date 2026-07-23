"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TypewriterText } from "@/components/animations/TypewriterText";
import { CountUpNumber } from "@/components/animations/CountUpNumber";
import { IslamicPattern } from "@/components/animations/IslamicPattern";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, Eye, EyeOff, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [subtitleStarted, setSubtitleStarted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleComplete = useCallback(() => setSubtitleStarted(true), []);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const router = useRouter();

  // Fix hydration error for next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    try {
      await login({ email, password });
      router.push("/home");
    } catch (err) {
      console.error(err);
      setIsFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background font-sans overflow-hidden">
      {/* Top Left Theme Toggle */}
      <div className="absolute top-6 right-6 rtl:left-6 rtl:right-auto z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full shadow-sm"
        >
          {mounted ? (
            theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          className="rounded-full shadow-sm ml-2 rtl:ml-0 rtl:mr-2 font-bold w-10 h-10 p-0"
        >
          {language === "en" ? "AR" : "EN"}
        </Button>
      </div>

      {/* Left Panel: Login Card (40%) */}
      <div className="w-full md:w-[40%] flex items-center justify-center p-8 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-xl bg-card rounded-3xl p-6 sm:p-10">
            <CardContent className="p-0">
              {/* Logo Animation */}
              <div className="flex justify-center mb-8 mt-16 lg:mt-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-24 h-24 relative bg-[#F5F1EB] dark:bg-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-inner"
                >
                  <Image
                    src="/logo.png"
                    alt="SOB Logo"
                    fill
                    className="object-contain p-2"
                  />
                </motion.div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-8 space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  <TypewriterText
                    key={language}
                    text={t("login.welcome")}
                    speed={60}
                    onComplete={handleComplete}
                  />
                </h1>
                <div className="text-muted-foreground text-sm h-5">
                  {subtitleStarted && (
                    <TypewriterText
                      key={language + "_sub"}
                      text={t("login.subtitle")}
                      speed={40}
                      showCursor={false}
                    />
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: subtitleStarted ? 1 : 0, y: subtitleStarted ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="sr-only">Email address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("login.email_placeholder")}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-6 rtl:pl-10 rtl:pr-4 bg-background/50 border-input rounded-xl"
                    />
                    <Mail className="absolute right-3 rtl:right-auto rtl:left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: subtitleStarted ? 1 : 0, y: subtitleStarted ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="sr-only">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.password_placeholder")}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`px-4 py-6 rtl:pl-10 rtl:pr-4 bg-background/50 border-input rounded-xl text-lg text-left rtl:text-right ${!showPassword ? 'tracking-widest' : ''}`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: subtitleStarted ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" className="rounded-md border-muted-foreground" />
                    <label htmlFor="remember" className="font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("login.remember")}
                    </label>
                  </div>
                  <a href="#" className="font-semibold text-[var(--color-brand-green)] hover:underline">
                    {t("login.forgot")}
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: subtitleStarted ? 1 : 0, y: subtitleStarted ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                >
                  {error && (
                    <div className="text-red-500 text-sm mb-3 text-center">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg rounded-xl bg-[var(--color-brand-green)] hover:bg-[#15462a] text-white shadow-md transition-all group"
                    disabled={isFormLoading}
                  >
                    {isFormLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        {t("login.signin")}
                        <span className="ml-2 rtl:ml-0 rtl:mr-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </Button>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: subtitleStarted ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 2.0 }}
                  className="relative my-6"
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {t("login.sso")}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: subtitleStarted ? 1 : 0, y: subtitleStarted ? 0 : 20 }}
                  transition={{ duration: 0.4, delay: 2.2 }}
                >
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full py-6 rounded-xl hover:bg-accent transition-colors"
                  >
                    <Image src="/logo.png" alt="SOB Portal" width={20} height={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("login.sso_btn")}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Panel: Hero (60%) */}
      <div className="hidden md:flex w-[60%] bg-[var(--color-brand-cream)] dark:bg-[#0A1A10] relative flex-col justify-center p-12 lg:p-24 overflow-hidden transition-colors duration-300">
        <IslamicPattern />
        
        {/* Top Right Logo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-8 right-12 rtl:right-auto rtl:left-12 flex items-center gap-3 z-10"
        >
          <div className="text-right rtl:text-left">
            <h2 className="font-bold text-[var(--color-brand-green)]">{t("login.org")}</h2>
            <p className="text-sm text-muted-foreground">{t("app.title")}</p>
          </div>
          <div className="w-12 h-12 relative bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="z-10 max-w-2xl relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex items-center gap-4 mb-8 origin-left rtl:origin-right"
          >
            <div className="h-[1px] w-12 bg-[var(--color-brand-gold)]" />
            <span className="text-[var(--color-brand-gold)] uppercase tracking-widest text-sm font-medium">
              {t("login.hero_subtitle")}
            </span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold text-[var(--color-brand-green)] mb-6 leading-tight">
            <TypewriterText 
              key={language}
              text={t("login.hero_title")} 
              speed={40} 
              delay={800}
            />
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="text-xl text-muted-foreground mb-16 leading-relaxed max-w-xl"
          >
            {t("login.hero_desc")}
          </motion.p>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            className="grid grid-cols-3 gap-6 bg-white/40 dark:bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-white/5"
          >
            <div>
              <div className="text-3xl font-bold text-foreground">
                <CountUpNumber end={500} delay={2600} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t("login.stats.students")}</div>
            </div>
            <div className="border-l rtl:border-l-0 rtl:border-r border-[var(--color-brand-green)]/20 pl-6 rtl:pl-0 rtl:pr-6">
              <div className="text-3xl font-bold text-foreground">
                <CountUpNumber end={48} delay={2800} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t("login.stats.events")}</div>
            </div>
            <div className="border-l rtl:border-l-0 rtl:border-r border-[var(--color-brand-green)]/20 pl-6 rtl:pl-0 rtl:pr-6">
              <div className="text-3xl font-bold text-foreground">
                <CountUpNumber end={120} delay={3000} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t("login.stats.opportunities")}</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Left Branding */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-12 rtl:left-auto rtl:right-12 flex items-center gap-3 z-10"
        >
          <div className="flex gap-2 rtl:space-x-reverse">
            <div className="w-4 h-1 bg-green-600" />
            <div className="w-4 h-1 bg-red-600" />
            <div className="w-4 h-1 bg-black dark:bg-white" />
          </div>
          <span className="text-sm text-muted-foreground">{t("login.org")}</span>
        </motion.div>
      </div>
    </div>
  );
}
