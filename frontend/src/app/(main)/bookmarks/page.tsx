"use client";

import { BookCard, Book } from "@/components/books/BookCard";
import { Bookmark as BookmarkIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

import useSWR from "swr";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function BookmarksPage() {
  const { t } = useLanguage();
  const { data: bookmarks, isLoading } = useSWR('/bookmarks', api.get);
  const bookmarkList = bookmarks || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <BookmarkIcon className="w-8 h-8 text-[var(--color-brand-green)]" />
          {t("bookmarks.title")}
        </h1>
        <p className="text-muted-foreground">{t("bookmarks.desc")}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : bookmarkList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
          {bookmarkList.map((book: any, i: number) => (
            <BookCard key={book.id} book={{...book, category: book.category?.name || book.category}} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed border-border/50">
          <BookmarkIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-1">{t("bookmarks.empty.title")}</h3>
          <p className="text-muted-foreground text-sm">{t("bookmarks.empty.desc")}</p>
        </div>
      )}
    </div>
  );
}
