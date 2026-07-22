"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { TypewriterText } from "@/components/animations/TypewriterText";
import { BookCard, Book } from "@/components/books/BookCard";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ArrowRight, BookOpen, Layers, Laptop, Globe, Scale, Heart, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-provider";

import useSWR from "swr";
import { api } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_CATEGORIES = [
  { name: "Computer Science", icon: Laptop },
  { name: "Engineering", icon: Layers },
  { name: "Medical", icon: Heart },
  { name: "Languages", icon: Globe },
  { name: "Law", icon: Scale },
  { name: "Literature", icon: BookOpen },
];

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const { t, language } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: books, isLoading } = useSWR('/books?take=5', api.get);
  const { data: allBooks } = useSWR('/books', api.get);

  const recommendedBooks = books || [];

  const categoryCounts = (allBooks || []).reduce((acc: any, book: any) => {
    const catName = book.category?.name;
    if (catName) {
      acc[catName] = (acc[catName] || 0) + 1;
    }
    return acc;
  }, {});

  const dynamicCategories = DEFAULT_CATEGORIES.map(cat => ({
    ...cat,
    count: categoryCounts[cat.name] || 0
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-[var(--color-brand-cream)] dark:bg-[#111] p-8 md:p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          {/* Subtle Islamic pattern background for the hero */}
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzFCNUUzQSIvPjwvc3ZnPg==')] [background-size:20px_20px]" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <TypewriterText key={language} text={t("home.welcome").replace("{name}", user?.name || t("home.student"))} speed={50} />
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t("home.subtitle")}
          </p>
          <form onSubmit={handleSearch} className="flex gap-4 max-w-md w-full mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground rtl:right-3 rtl:left-auto" />
              <Input
                type="search"
                placeholder={t("action.search") || "Search for a book..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 pl-10 rtl:pr-10 rtl:pl-3 border-muted/50 h-12 text-md"
              />
            </div>
            <Button type="submit" className="bg-[var(--color-brand-green)] hover:bg-[#15462a] text-white px-8 h-12 rounded-xl text-md shadow-lg transition-transform hover:-translate-y-1">
              {t("action.search") || "Search"}
            </Button>
          </form>
          <div className="flex gap-4">
            <Link href="/books">
              <Button variant="outline" className="px-8 py-6 rounded-xl text-md border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10">
                {t("home.btn.browse")}
              </Button>
            </Link>
            <Link href="/my-books">
              <Button variant="ghost" className="px-8 py-6 rounded-xl text-md text-foreground hover:bg-muted">
                {t("home.btn.borrows")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Continue Reading Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{t("home.continue")}</h2>
          <Link href="/my-books">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              {t("home.view_all")} <ChevronRight className="ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180 w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow border-muted/50 cursor-pointer">
            <CardContent className="p-4 flex gap-4 items-center">
              <div className="w-16 h-24 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">Introduction to Algorithms</h3>
                  <p className="text-sm text-muted-foreground">Thomas H. Cormen</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("home.page_of").replace("{current}", "142").replace("{total}", "1292")}</span>
                    <span>11%</span>
                  </div>
                  <Progress value={11} className="h-2 [&>div]:bg-[var(--color-brand-green)]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow border-muted/50 cursor-pointer">
            <CardContent className="p-4 flex gap-4 items-center">
              <div className="w-16 h-24 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">Principles of Economics</h3>
                  <p className="text-sm text-muted-foreground">N. Gregory Mankiw</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("home.page_of").replace("{current}", "450").replace("{total}", "800")}</span>
                    <span>56%</span>
                  </div>
                  <Progress value={56} className="h-2 [&>div]:bg-[var(--color-brand-green)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recommended for You */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{t("home.recommended")}</h2>
          <Link href="/books">
            <Button variant="ghost" className="text-[var(--color-brand-green)] hover:text-[#15462a]">
              {t("home.see_all")} <ArrowRight className="ml-1 rtl:ml-0 rtl:mr-1 rtl:rotate-180 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : recommendedBooks.slice(0, 5).map((book: any, i: number) => (
            <BookCard key={book.id} book={{...book, category: book.category?.name || book.category}} index={i} />
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">{t("home.browse_cat")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dynamicCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/books?category=${cat.name}`}>
                <Card className="h-full hover:bg-[var(--color-brand-green)] hover:text-white transition-colors group border-muted/50 cursor-pointer text-center">
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                    <cat.icon className="w-8 h-8 text-[var(--color-brand-gold)] group-hover:text-white transition-colors" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm leading-tight">
                        {t(
                          cat.name === "Computer Science" ? "cat.cs" :
                          cat.name === "Engineering" ? "cat.engineering" :
                          cat.name === "Medical" ? "cat.medical" :
                          cat.name === "Languages" ? "cat.languages" :
                          cat.name === "Law" ? "cat.law" :
                          cat.name === "Literature" ? "cat.literature" : cat.name
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground group-hover:text-white/80">{t("home.books_count").replace("{count}", String(cat.count))}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
