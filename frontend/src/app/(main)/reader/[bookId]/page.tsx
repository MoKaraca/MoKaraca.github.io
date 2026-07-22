"use client";

import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, Settings, Bookmark, 
  Menu, X, ZoomIn, ZoomOut, Search, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/language-provider";

export default function ReaderPage({ params }: { params: Promise<{ bookId: string }> }) {
  const resolvedParams = use(params);
  const { t } = useLanguage();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState([100]);
  const [page, setPage] = useState(1);
  const totalPages = 432; // Mock

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(p => Math.min(totalPages, p + 1));
      if (e.key === "ArrowLeft") setPage(p => Math.max(1, p - 1));
      if (e.key === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] -m-4 md:-m-6 lg:-m-8 bg-[#EBEBEB] dark:bg-[#1A1A1A] overflow-hidden relative">
      {/* Sidebar TOC */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-card border-r flex flex-col z-20 flex-shrink-0 absolute md:relative shadow-xl md:shadow-none"
          >
            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold">{t("reader.contents")}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {[...Array(10)].map((_, i) => (
                <button key={i} onClick={() => setPage(i * 40 + 1)} className="w-full text-left rtl:text-right p-2 rounded-md hover:bg-muted text-sm flex justify-between">
                  <span className="truncate pr-4 rtl:pr-0 rtl:pl-4">{t("reader.chapter")} {i + 1}: The Architecture</span>
                  <span className="text-muted-foreground">{i * 40 + 1}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Reader Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <Link href="/my-books">
              <Button variant="ghost" size="icon" className="mr-2 rtl:mr-0 rtl:ml-2">
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </Button>
            <h1 className="font-semibold hidden sm:block ml-2 text-foreground">Clean Architecture</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4 bg-muted/50 p-1 rounded-md">
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setZoom([Math.max(50, zoom[0] - 10)])}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs font-medium w-12 text-center">{zoom[0]}%</span>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setZoom([Math.min(200, zoom[0] + 10)])}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Reader Canvas (Mock PDF rendering area) */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center relative">
          {/* Previous Page Button */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full shadow-lg bg-background/80 backdrop-blur rtl:rotate-180"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          {/* Book Page Mock */}
          <motion.div 
            className="bg-white dark:bg-[#2A2A2A] shadow-2xl origin-center transition-transform"
            style={{ 
              width: "100%", 
              maxWidth: "800px", 
              aspectRatio: "1/1.414", // A4 ratio
              scale: zoom[0] / 100 
            }}
          >
            <div className="w-full h-full p-12 md:p-20 flex flex-col">
              <div className="text-right text-xs text-muted-foreground mb-8 font-serif">{page}</div>
              <div className="flex-1 space-y-4 font-serif text-black dark:text-gray-200">
                {page === 1 ? (
                  <div className="text-center mt-20">
                    <h1 className="text-4xl font-bold mb-4">Clean Architecture</h1>
                    <h2 className="text-xl text-gray-600 dark:text-gray-400">A Craftsman's Guide to Software Structure and Design</h2>
                    <p className="mt-10">Robert C. Martin</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-6 rtl:text-right">{t("reader.chapter")} {Math.ceil(page/40)}</h3>
                    <p className="text-justify leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-justify leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p className="text-justify leading-relaxed">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Next Page Button */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full shadow-lg bg-background/80 backdrop-blur rtl:rotate-180"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Bottom Toolbar (Progress) */}
        <div className="h-12 bg-card border-t flex items-center px-6 gap-4 shrink-0">
          <span className="text-xs text-muted-foreground w-16">{t("reader.page")} {page}</span>
          <Slider 
            value={[page]} 
            max={totalPages} 
            min={1} 
            step={1}
            onValueChange={(val) => setPage(Array.isArray(val) ? val[0] : (val as unknown as number))}
            className="flex-1 [&>span:first-child]:bg-muted [&_[role=slider]]:bg-[var(--color-brand-green)] [&_[role=slider]]:border-[var(--color-brand-green)]"
          />
          <span className="text-xs text-muted-foreground w-16 text-right">{Math.round((page/totalPages)*100)}%</span>
        </div>
      </div>
    </div>
  );
}
