"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImageUrl: string;
  isAvailable: boolean;
  totalCopies?: number;
  availableCopies?: number;
}

export function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/books/${book.id}`}>
        <Card className="group overflow-hidden border-0 bg-transparent hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-3">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-4 bg-muted">
              {book.coverImageUrl ? (
                <Image
                  src={book.coverImageUrl}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-brand-cream)] dark:bg-[#1A1A1A]">
                  <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
              
              {/* Availability Badge */}
              <div className="absolute top-2 right-2">
                <Badge
                  variant={book.isAvailable ? "default" : "destructive"}
                  className={`shadow-sm ${book.isAvailable ? "bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green)]" : ""}`}
                >
                  {book.isAvailable ? t("books.status.available") : t("books.status.borrowed")}
                </Badge>
              </div>
            </div>

            <div className="space-y-1 px-1">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider mb-2 font-medium">
                {t(
                  book.category === "Computer Science" ? "cat.cs" :
                  book.category === "Business" ? "cat.business" :
                  book.category === "Self-Help" ? "cat.self" :
                  book.category === "Economics" ? "cat.economics" :
                  book.category === "Psychology" ? "cat.psychology" :
                  book.category === "History" ? "cat.history" : book.category
                )}
              </Badge>
              <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-[var(--color-brand-green)] transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
