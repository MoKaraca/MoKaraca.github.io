"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";

import useSWR from "swr";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AdminBooksPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const { data: books, isLoading, mutate } = useSWR('/books', api.get);
  const bookList = books || [];

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    categoryId: "cmrwboq2t0000ie767ii9fjjj", // default CS category for now
    totalCopies: 1,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        mutate();
      } catch (err) {
        alert("Failed to delete book");
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/books', {
        ...formData,
        availableCopies: formData.totalCopies,
        pageCount: 100,
        language: 'en'
      });
      setIsAddOpen(false);
      mutate();
      setFormData({ title: "", author: "", isbn: "", categoryId: "cmrwboq2t0000ie767ii9fjjj", totalCopies: 1 });
    } catch (err) {
      alert("Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("admin_books.title")}</h1>
          <p className="text-muted-foreground">{t("admin_books.desc")}</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="bg-[var(--color-brand-green)] hover:bg-[#15462a] text-white" />}>
            <Plus className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {t("admin_books.add")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Enter the book details to add it to the library catalog.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>ISBN</Label>
                <Input required value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Total Copies</Label>
                <Input type="number" required min={1} value={formData.totalCopies} onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value)})} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-[var(--color-brand-green)] text-white hover:bg-[#15462a]">
                  {isSubmitting ? "Adding..." : "Add Book"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("admin_books.search")}
            className="pl-9 rtl:pr-9 rtl:pl-3 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="rtl:text-right">{t("admin_books.table.title")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin_books.table.author")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin_books.table.category")}</TableHead>
              <TableHead className="text-center">{t("admin_books.table.inventory")}</TableHead>
              <TableHead className="rtl:text-right">{t("admin_books.table.status")}</TableHead>
              <TableHead className="text-right rtl:text-left">{t("admin_books.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : bookList.map((book: any) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  {t(
                    book.category?.name === "Computer Science" ? "cat.cs" :
                    book.category?.name === "Business" ? "cat.business" :
                    book.category?.name === "Self-Help" ? "cat.self" :
                    book.category?.name === "Economics" ? "cat.economics" :
                    book.category?.name === "Psychology" ? "cat.psychology" :
                    book.category?.name === "History" ? "cat.history" : book.category?.name || "Unknown"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={book.availableCopies === 0 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                    {book.availableCopies}
                  </span>
                  <span className="text-muted-foreground"> / {book.totalCopies}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={book.isAvailable ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"}>
                    {book.isAvailable ? "Active" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {t("admin_books.action.edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(book.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {t("admin_books.action.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
