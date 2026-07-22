"use client";

import { use, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Globe, Building, FileText, Share2, Heart, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // use() allows unwrapping params in Next 15 component
  const resolvedParams = use(params);
  const { t } = useLanguage();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBorrowSuccess, setIsBorrowSuccess] = useState(false);

  const { data: book, isLoading, error } = useSWR(
    `/books/${resolvedParams.id}`,
    api.get
  );

  const handleBorrow = async () => {
    if (!book.isAvailable || book.availableCopies <= 0) {
      alert(t("action.waitlist_success") || "You have been added to the waitlist!");
      return;
    }
    
    try {
      await api.post(`/borrows/${book.id}`);
      setIsBorrowSuccess(true);
      setTimeout(() => {
        router.push("/my-books");
      }, 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to borrow book");
    }
  };

  const handleSave = async () => {
    if (isSaved) return;
    setIsSaving(true);
    try {
      await api.post(`/bookmarks/${book.id}`);
      setIsSaved(true);
    } catch (e) {
      alert("Failed to save book");
    } finally {
      setIsSaving(false);
    }
  };



  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (error || !book) return <div className="text-center py-20 text-destructive">Failed to load book details.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Link href="/books" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180 h-4 w-4" />
        {t("details.back")}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
        {/* Left Column: Cover & Actions */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-muted border border-border/50">
            {book.coverImageUrl ? (
              <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-brand-cream)] dark:bg-[#1A1A1A]">
                <BookOpen className="h-20 w-20 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge
                variant={book.isAvailable ? "default" : "destructive"}
                className={`shadow-md ${book.isAvailable ? "bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green)] text-white" : ""}`}
              >
                {book.isAvailable ? t("details.status.available") : t("details.status.borrowed")}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN" && (
              <motion.div animate={isBorrowSuccess ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 0.3 }}>
                <Button 
                  onClick={handleBorrow} 
                  disabled={isBorrowSuccess}
                  className={`w-full h-12 text-white shadow-md text-md transition-colors ${
                    isBorrowSuccess ? "bg-green-600 hover:bg-green-700" : "bg-[var(--color-brand-green)] hover:bg-[#15462a]"
                  }`}
                >
                  {isBorrowSuccess ? "Requested! ✓" : (book.isAvailable && book.availableCopies > 0 ? "Request Borrow" : t("details.btn.waitlist"))}
                </Button>
              </motion.div>
            )}
            {book.isAvailable && (
              <Link href={`/reader/${book.id}`} className="block">
                <Button variant="outline" className="w-full h-12 border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 text-md">
                  {t("details.btn.preview")}
                </Button>
              </Link>
            )}
          </div>
          
          <div className="pt-2">
            <Button variant="secondary" className="w-full h-12" onClick={handleSave} disabled={isSaving}>
              <motion.div
                initial={false}
                animate={isSaved ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.3, type: "tween" }}
                className="inline-flex items-center"
              >
                <Heart className={`mr-2 rtl:ml-2 rtl:mr-0 w-4 h-4 transition-colors duration-300 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
              </motion.div>
              {isSaved ? "Saved" : t("action.save")}
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <Badge variant="outline" className="mb-2 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/20">
              {t(
                book.category?.name === "Computer Science" ? "cat.cs" :
                book.category?.name === "Business" ? "cat.business" :
                book.category?.name === "Self-Help" ? "cat.self" :
                book.category?.name === "Economics" ? "cat.economics" :
                book.category?.name === "Psychology" ? "cat.psychology" :
                book.category?.name === "History" ? "cat.history" : book.category?.name || "Unknown"
              )}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{book.title}</h1>
            <p className="text-xl text-muted-foreground pt-1">{t("details.by")} <span className="font-medium text-foreground">{book.author}</span></p>
          </div>

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
            <p className="leading-relaxed">{t("details.description")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border/50">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm mb-1">
                <FileText className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t("details.meta.pages")}
              </div>
              <p className="font-semibold text-foreground">{book.pageCount}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm mb-1">
                <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t("details.meta.published")}
              </div>
              <p className="font-semibold text-foreground">{book.publishedYear}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm mb-1">
                <Globe className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t("details.meta.language")}
              </div>
              <p className="font-semibold text-foreground">{book.language}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm mb-1">
                <Building className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t("details.meta.publisher")}
              </div>
              <p className="font-semibold text-foreground">{book.publisher}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">{t("details.tags")}</h3>
            <div className="flex flex-wrap gap-2">
              {(book.keywords || []).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 font-normal bg-muted">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-xs text-muted-foreground">{t("details.isbn")}: {book.isbn}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
