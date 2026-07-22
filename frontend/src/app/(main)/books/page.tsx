"use client";

import { useState, Suspense } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { BookCard, Book } from "@/components/books/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";

const CATEGORIES = ["All", "Computer Science", "Business", "Self-Help", "Economics", "Psychology", "History"];

function BooksContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("relevance");

  // Fetch books from API
  const { data, error, isLoading } = useSWR<Book[]>(
    `/books?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}&sort=${sortOption}`, 
    api.get
  );

  const filteredBooks = data || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("books.title")}</h1>
        <p className="text-muted-foreground">{t("books.desc")}</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("books.search")}
            className="pl-10 rtl:pr-10 rtl:pl-3 py-6 text-base bg-card border-none shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortOption} onValueChange={(val) => setSortOption(val || "newest")}>
            <SelectTrigger className="w-[180px] h-12 bg-card border-none shadow-sm">
              <SelectValue placeholder={t("books.sort_by")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{t("books.sort.relevance")}</SelectItem>
              <SelectItem value="newest">{t("books.sort.newest")}</SelectItem>
              <SelectItem value="title_asc">{t("books.sort.title_asc")}</SelectItem>
              <SelectItem value="title_desc">{t("books.sort.title_desc")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-12 w-12 bg-card border-none shadow-sm">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2 justify-start mb-6">
          {CATEGORIES.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="rounded-full px-4 py-2 bg-card data-[state=active]:bg-[var(--color-brand-green)] data-[state=active]:text-white shadow-sm border border-border/50"
            >
              {t(
                category === "All" ? "cat.all" :
                category === "Computer Science" ? "cat.cs" :
                category === "Business" ? "cat.business" :
                category === "Self-Help" ? "cat.self" :
                category === "Economics" ? "cat.economics" :
                category === "Psychology" ? "cat.psychology" :
                category === "History" ? "cat.history" : category
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory} className="mt-0 outline-none">
          {isLoading ? (
            <div className="py-20 text-center">
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Loading books...</h3>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <h3 className="text-xl font-semibold mb-2 text-destructive">Failed to load books</h3>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book: any, i) => (
                <BookCard key={book.id} book={{...book, category: book.category?.name || book.category}} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-xl font-semibold mb-2">{t("books.no_books")}</h3>
              <p className="text-muted-foreground">{t("books.no_books_desc")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <BooksContent />
    </Suspense>
  );
}
