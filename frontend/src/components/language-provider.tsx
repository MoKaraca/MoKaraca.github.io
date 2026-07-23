"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation & Common
    "nav.home": "Home",
    "nav.browse": "Browse Books",
    "nav.borrows": "My Borrows",
    "nav.bookmarks": "Bookmarks",
    "nav.dashboard": "Dashboard",
    "nav.manage_books": "Manage Books",
    "nav.users": "Users",
    "nav.settings": "Settings",
    "nav.library": "Library",
    "nav.admin": "Administration",
    "nav.requests": "Requests",
    "nav.returns": "Returns",
    "app.title": "SOB E-Library",
    "action.search": "Search books, authors...",
    "action.logout": "Log out",
    "action.back": "Back",
    "action.cancel": "Cancel",
    "action.save": "Save",
    "action.share": "Share",

    // Login Page
    "login.welcome": "Welcome back",
    "login.subtitle": "Sign in to continue to your community.",
    "login.email_placeholder": "student@sob.local",
    "login.password_placeholder": "•••••••••••",
    "login.remember": "Remember me",
    "login.forgot": "Forgot password?",
    "login.signin": "Sign in",
    "login.sso": "Sign in via SSO",
    "login.sso_btn": "Continue with SOB Portal",
    "login.hero_subtitle": "Secure Community Access",
    "login.hero_title": "Where ambition meets belonging.",
    "login.hero_desc": "A professional digital home connecting Syrian students, ideas, opportunities, and academic achievement in Erzurum.",
    "login.stats.students": "Students",
    "login.stats.events": "Events",
    "login.stats.opportunities": "Opportunities",
    "login.org": "Syrian Students Association in Erzurum",

    // Home Page
    "home.welcome": "Welcome back, {name}!",
    "home.student": "Student",
    "home.subtitle": "Explore our library collection and request physical copies easily.",
    "home.btn.browse": "Browse Library",
    "home.btn.borrows": "View My Borrows",
    "home.continue": "Continue Reading",
    "home.view_all": "View all",
    "home.page_of": "Page {current} of {total}",
    "home.recommended": "Recommended for You",
    "home.see_all": "See all",
    "home.browse_cat": "Browse by Category",
    "home.books_count": "{count} books",
    
    // Browse Books
    "books.title": "Browse Library",
    "books.desc": "Discover books across multiple disciplines and topics.",
    "books.search": "Search by title, author, or ISBN...",
    "books.sort_by": "Sort by",
    "books.sort.relevance": "Relevance",
    "books.sort.newest": "Newest Arrivals",
    "books.sort.title_asc": "Title (A-Z)",
    "books.sort.title_desc": "Title (Z-A)",
    "books.no_books": "No books found",
    "books.no_books_desc": "Try adjusting your search or category filters.",
    "books.status.available": "Available",
    "books.status.borrowed": "Borrowed",

    // Book Details
    "details.back": "Back to Library",
    "details.status.available": "Available to Borrow",
    "details.status.borrowed": "Currently Borrowed",
    "details.btn.borrow": "Borrow Book",
    "details.btn.waitlist": "Join Waitlist",
    "details.btn.preview": "Read Preview",
    "details.by": "by",
    "details.description": "By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system. Now, building upon the success of his best-selling books Clean Code and The Clean Coder, legendary software craftsman Robert C. Martin (Uncle Bob) reveals those rules and helps you apply them.",
    "details.meta.pages": "Pages",
    "details.meta.published": "Published",
    "details.meta.language": "Language",
    "details.meta.publisher": "Publisher",
    "details.tags": "Tags & Keywords",
    "details.isbn": "ISBN",

    // My Borrows
    "borrows.title": "My Borrows",
    "borrows.desc": "Manage your current readings and view past borrows.",
    "borrows.tab.active": "Active Borrows",
    "borrows.tab.history": "History",
    "borrows.borrowed": "Borrowed",
    "borrows.due": "Due Date",
    "borrows.days_left": "({days} days left)",
    "borrows.ext_req": "Extension Requested",
    "borrows.status": "Status:",
    "borrows.btn.read": "Read Book",
    "borrows.btn.return": "Return",
    "borrows.return.title": "Return Book",
    "borrows.return.desc": 'Are you sure you want to return "{title}"? You will lose access to read it until you borrow it again.',
    "borrows.return.confirm": "Confirm Return",
    "borrows.table.book": "Book",
    "borrows.table.borrow_date": "Borrowed Date",
    "borrows.table.return_date": "Returned Date",
    "borrows.table.status": "Status",

    // Bookmarks
    "bookmarks.title": "Saved Bookmarks",
    "bookmarks.desc": "Books you've saved for later reading.",
    "bookmarks.empty.title": "No bookmarks yet",
    "bookmarks.empty.desc": "When you save a book, it will appear here.",

    // Admin Dashboard
    "admin.title": "Dashboard",
    "admin.desc": "Overview of library activity and statistics.",
    "admin.stats.total": "Total Books",
    "admin.stats.active": "Active Borrows",
    "admin.stats.users": "Active Users",
    "admin.stats.overdue": "Overdue Returns",
    "admin.stats.attention": "Needs attention",
    "admin.charts.trends": "Borrowing Trends",
    "admin.charts.category": "Category Distribution",

    // Admin Books
    "admin_books.title": "Manage Books",
    "admin_books.desc": "Add, edit, or remove books from the library inventory.",
    "admin_books.btn.add": "Add New Book",
    "admin_books.search": "Search books...",
    "admin_books.table.title": "Title",
    "admin_books.table.author": "Author",
    "admin_books.table.category": "Category",
    "admin_books.table.inventory": "Inventory",
    "admin_books.table.status": "Status",
    "admin_books.table.actions": "Actions",
    "admin_books.action.edit": "Edit Book",
    "admin_books.action.delete": "Delete Book",

    // Admin Requests
    "admin.requests.title": "Borrow Requests",
    "admin.requests.desc": "Manage pending physical book pickups.",
    "admin.requests.table.user": "User",
    "admin.requests.table.book": "Book Title",
    "admin.requests.table.date": "Request Date",
    "admin.requests.table.status": "Status",
    "admin.requests.table.actions": "Actions",
    "admin.requests.status.pending": "Pending",
    "admin.requests.action.reject": "Reject",
    "admin.requests.action.approve": "Approve Handover",
    "admin.requests.empty": "No pending borrow requests found.",
    "admin.requests.msg.approved": "Request approved! The book is now marked as borrowed.",
    "admin.requests.msg.rejected": "Request rejected.",

    // Admin Returns
    "admin.returns.title": "Return Management",
    "admin.returns.desc": "Manage active borrows and process physical book returns.",
    "admin.returns.table.student": "Student",
    "admin.returns.table.book": "Book",
    "admin.returns.table.borrow_date": "Borrow Date",
    "admin.returns.table.due_date": "Due Date",
    "admin.returns.table.status": "Status",
    "admin.returns.table.actions": "Actions",
    "admin.returns.empty": "No active borrows found.",
    "admin.returns.overdue": "OVERDUE",
    "admin.returns.active": "ACTIVE",
    "admin.returns.extended": "EXTENDED",
    "admin.returns.days_left": "days left",
    "admin.returns.days_overdue": "days overdue",
    "admin.returns.action.return": "Return Book",
    
    // Add Book Form
    "admin_books.add.title": "Add New Book",
    "admin_books.add.desc": "Enter the book details to add it to the library catalog.",
    "admin_books.add.field.title": "Title",
    "admin_books.add.field.author": "Author",
    "admin_books.add.field.isbn": "ISBN",
    "admin_books.add.field.totalCopies": "Total Copies",
    "admin_books.add.field.pageCount": "Page Count",
    "admin_books.add.field.language": "Language",
    "admin_books.add.field.publisher": "Publisher",
    "admin_books.add.field.description": "Description",
    "admin_books.add.btn.cancel": "Cancel",
    "admin_books.add.btn.submit": "Add Book",
    "admin_books.add.btn.submitting": "Adding...",

    // Admin Users
    "admin.users.title": "Users Management",
    "admin.users.desc": "Manage library patrons, students, and staff accounts.",
    "admin.users.coming_soon": "Users Module Coming Soon",
    "admin.users.coming_soon_desc": "This module is scheduled for a future update.",

    // Reader
    "reader.contents": "Contents",
    "reader.chapter": "Chapter",
    "reader.page": "Page",

    // Categories Data
    "cat.all": "All",
    "cat.cs": "Computer Science",
    "cat.business": "Business",
    "cat.self": "Self-Help",
    "cat.economics": "Economics",
    "cat.psychology": "Psychology",
    "cat.history": "History",
    "cat.engineering": "Engineering",
    "cat.medical": "Medical",
    "cat.languages": "Languages",
    "cat.law": "Law",
    "cat.literature": "Literature",
    
    // Notifications
    "notif.DUE_REMINDER.title": "Book Due Reminder",
    "notif.DUE_TODAY.title": "Book Due Today",
    "notif.OVERDUE.title": "Book Overdue",
    "notif.SYSTEM.title": "System Notice",
    "notif.EXTENSION_APPROVED.title": "Extension Approved",
    "notif.EXTENSION_REJECTED.title": "Extension Rejected",
    "notif.BOOK_RETURNED.title": "Book Returned",
  },
  ar: {
    // Navigation & Common
    "nav.home": "الرئيسية",
    "nav.browse": "تصفح الكتب",
    "nav.borrows": "استعاراتي",
    "nav.bookmarks": "العلامات المرجعية",
    "nav.dashboard": "لوحة التحكم",
    "nav.manage_books": "إدارة الكتب",
    "nav.users": "المستخدمين",
    "nav.settings": "الإعدادات",
    "nav.library": "المكتبة",
    "nav.admin": "الإدارة",
    "nav.requests": "الطلبات",
    "nav.returns": "المرتجعات",
    "app.title": "اتحاد طلبة سوريا - أرزروم",
    "action.search": "ابحث عن كتب، مؤلفين...",
    "action.logout": "تسجيل خروج",
    "action.back": "رجوع",
    "action.cancel": "إلغاء",
    "action.save": "حفظ",
    "action.share": "مشاركة",

    // Login Page
    "login.welcome": "مرحباً بعودتك",
    "login.subtitle": "قم بتسجيل الدخول للمتابعة إلى مجتمعك.",
    "login.email_placeholder": "student@sob.local",
    "login.password_placeholder": "•••••••••••",
    "login.remember": "تذكرني",
    "login.forgot": "هل نسيت كلمة المرور؟",
    "login.signin": "تسجيل الدخول",
    "login.sso": "تسجيل الدخول عبر الدخول الموحد",
    "login.sso_btn": "المتابعة عبر بوابة الطلاب",
    "login.hero_subtitle": "وصول آمن للمجتمع",
    "login.hero_title": "حيث يلتقي الطموح بالانتماء.",
    "login.hero_desc": "منزل رقمي احترافي يربط الطلاب السوريين، الأفكار، الفرص، والإنجازات الأكاديمية في أرضروم.",
    "login.stats.students": "الطلاب",
    "login.stats.events": "الفعاليات",
    "login.stats.opportunities": "الفرص",
    "login.org": "اتحاد الطلبة السوريين في أرضروم",

    // Home Page
    "home.welcome": "مرحباً بعودتك، {name}!",
    "home.student": "طالب",
    "home.subtitle": "استكشف مجموعة مكتبتنا واطلب نسخًا مادية بسهولة.",
    "home.btn.browse": "تصفح المكتبة",
    "home.btn.borrows": "عرض استعاراتي",
    "home.continue": "متابعة القراءة",
    "home.view_all": "عرض الكل",
    "home.page_of": "صفحة {current} من {total}",
    "home.recommended": "موصى به لك",
    "home.see_all": "رؤية الكل",
    "home.browse_cat": "تصفح حسب الفئة",
    "home.books_count": "{count} كتب",
    
    // Browse Books
    "books.title": "تصفح المكتبة",
    "books.desc": "اكتشف الكتب عبر التخصصات والمواضيع المتعددة.",
    "books.search": "ابحث بالعنوان، المؤلف، أو رقم ISBN...",
    "books.sort_by": "فرز حسب",
    "books.sort.relevance": "الصلة",
    "books.sort.newest": "الأحدث",
    "books.sort.title_asc": "العنوان (أ-ي)",
    "books.sort.title_desc": "العنوان (ي-أ)",
    "books.no_books": "لم يتم العثور على كتب",
    "books.no_books_desc": "حاول تعديل بحثك أو تصفية الفئات.",
    "books.status.available": "متاح",
    "books.status.borrowed": "مُستعار",

    // Book Details
    "details.back": "العودة للمكتبة",
    "details.status.available": "متاح للاستعارة",
    "details.status.borrowed": "مستعار حالياً",
    "details.btn.borrow": "استعارة الكتاب",
    "details.btn.waitlist": "الانضمام لقائمة الانتظار",
    "details.btn.preview": "قراءة المعاينة",
    "details.by": "بواسطة",
    "details.description": "من خلال تطبيق القواعد العالمية لهندسة البرمجيات، يمكنك تحسين إنتاجية المطورين بشكل كبير طوال دورة حياة أي نظام برمجي. الآن، بناءً على نجاح كتبه الأكثر مبيعاً Clean Code و The Clean Coder، يكشف الحرفي الأسطوري للبرمجيات روبرت سي مارتن عن تلك القواعد ويساعدك على تطبيقها.",
    "details.meta.pages": "الصفحات",
    "details.meta.published": "النشر",
    "details.meta.language": "اللغة",
    "details.meta.publisher": "الناشر",
    "details.tags": "الوسوم والكلمات المفتاحية",
    "details.isbn": "ISBN",

    // My Borrows
    "borrows.title": "استعاراتي",
    "borrows.desc": "إدارة قراءاتك الحالية وعرض الاستعارات السابقة.",
    "borrows.tab.active": "الاستعارات النشطة",
    "borrows.tab.history": "السجل",
    "borrows.borrowed": "تاريخ الاستعارة",
    "borrows.due": "تاريخ الاستحقاق",
    "borrows.days_left": "(متبقي {days} أيام)",
    "borrows.ext_req": "تم طلب التمديد",
    "borrows.status": "الحالة:",
    "borrows.btn.read": "قراءة الكتاب",
    "borrows.btn.return": "إرجاع",
    "borrows.return.title": "إرجاع الكتاب",
    "borrows.return.desc": 'هل أنت متأكد من أنك تريد إرجاع "{title}"؟ ستفقد القدرة على قراءته حتى تستعيره مرة أخرى.',
    "borrows.return.confirm": "تأكيد الإرجاع",
    "borrows.table.book": "الكتاب",
    "borrows.table.borrow_date": "تاريخ الاستعارة",
    "borrows.table.return_date": "تاريخ الإرجاع",
    "borrows.table.status": "الحالة",

    // Bookmarks
    "bookmarks.title": "العلامات المرجعية المحفوظة",
    "bookmarks.desc": "الكتب التي حفظتها لقراءتها لاحقاً.",
    "bookmarks.empty.title": "لا توجد علامات مرجعية بعد",
    "bookmarks.empty.desc": "عندما تقوم بحفظ كتاب، سيظهر هنا.",

    // Admin Dashboard
    "admin.title": "لوحة التحكم",
    "admin.desc": "نظرة عامة على نشاط المكتبة والإحصائيات.",
    "admin.stats.total": "إجمالي الكتب",
    "admin.stats.active": "الاستعارات النشطة",
    "admin.stats.users": "المستخدمين النشطين",
    "admin.stats.overdue": "المتأخرات",
    "admin.stats.attention": "يتطلب الانتباه",
    "admin.charts.trends": "اتجاهات الاستعارة",
    "admin.charts.category": "توزيع الفئات",

    // Admin Books
    "admin_books.title": "إدارة الكتب",
    "admin_books.desc": "إضافة، تعديل، أو إزالة الكتب من مخزون المكتبة.",
    "admin_books.btn.add": "إضافة كتاب جديد",
    "admin_books.search": "ابحث في الكتب...",
    "admin_books.table.title": "العنوان",
    "admin_books.table.author": "المؤلف",
    "admin_books.table.category": "الفئة",
    "admin_books.table.inventory": "المخزون",
    "admin_books.table.status": "الحالة",
    "admin_books.table.actions": "الإجراءات",
    "admin_books.action.edit": "تعديل الكتاب",
    "admin_books.action.delete": "حذف الكتاب",

    // Admin Requests
    "admin.requests.title": "طلبات الاستعارة",
    "admin.requests.desc": "إدارة طلبات استلام الكتب المادية.",
    "admin.requests.table.user": "المستخدم",
    "admin.requests.table.book": "عنوان الكتاب",
    "admin.requests.table.date": "تاريخ الطلب",
    "admin.requests.table.status": "الحالة",
    "admin.requests.table.actions": "الإجراءات",
    "admin.requests.status.pending": "قيد الانتظار",
    "admin.requests.action.reject": "رفض",
    "admin.requests.action.approve": "الموافقة والتسليم",
    "admin.requests.empty": "لا توجد طلبات استعارة معلقة.",
    "admin.requests.msg.approved": "تمت الموافقة! تم تعليم الكتاب كمُستعار.",
    "admin.requests.msg.rejected": "تم رفض الطلب.",

    // Admin Returns
    "admin.returns.title": "إدارة المرتجعات",
    "admin.returns.desc": "إدارة الاستعارات النشطة ومعالجة المرتجعات المادية للكتب.",
    "admin.returns.table.student": "الطالب",
    "admin.returns.table.book": "الكتاب",
    "admin.returns.table.borrow_date": "تاريخ الاستعارة",
    "admin.returns.table.due_date": "تاريخ الاستحقاق",
    "admin.returns.table.status": "الحالة",
    "admin.returns.table.actions": "الإجراءات",
    "admin.returns.empty": "لا توجد استعارات نشطة.",
    "admin.returns.overdue": "متأخر",
    "admin.returns.active": "نشط",
    "admin.returns.extended": "مُمدد",
    "admin.returns.days_left": "أيام متبقية",
    "admin.returns.days_overdue": "أيام تأخير",
    "admin.returns.action.return": "إرجاع الكتاب",
    
    // Add Book Form
    "admin_books.add.title": "إضافة كتاب جديد",
    "admin_books.add.desc": "أدخل تفاصيل الكتاب لإضافته إلى فهرس المكتبة.",
    "admin_books.add.field.title": "العنوان",
    "admin_books.add.field.author": "المؤلف",
    "admin_books.add.field.isbn": "رقم ISBN",
    "admin_books.add.field.totalCopies": "إجمالي النسخ",
    "admin_books.add.field.pageCount": "عدد الصفحات",
    "admin_books.add.field.language": "اللغة",
    "admin_books.add.field.publisher": "الناشر",
    "admin_books.add.field.description": "الوصف",
    "admin_books.add.btn.cancel": "إلغاء",
    "admin_books.add.btn.submit": "إضافة",
    "admin_books.add.btn.submitting": "جاري الإضافة...",

    // Admin Users
    "admin.users.title": "إدارة المستخدمين",
    "admin.users.desc": "إدارة حسابات رواد المكتبة، الطلاب، والموظفين.",
    "admin.users.coming_soon": "وحدة المستخدمين قريباً",
    "admin.users.coming_soon_desc": "هذه الوحدة مجدولة لتحديث مستقبلي.",

    // Reader
    "reader.contents": "المحتويات",
    "reader.chapter": "الفصل",
    "reader.page": "الصفحة",

    // Categories Data
    "cat.all": "الكل",
    "cat.cs": "علوم الحاسوب",
    "cat.business": "إدارة الأعمال",
    "cat.self": "تطوير الذات",
    "cat.economics": "الاقتصاد",
    "cat.psychology": "علم النفس",
    "cat.history": "التاريخ",
    "cat.engineering": "الهندسة",
    "cat.medical": "الطب",
    "cat.languages": "اللغات",
    "cat.law": "القانون",
    "cat.literature": "الأدب",

    // Notifications
    "notif.DUE_REMINDER.title": "تذكير بموعد الإرجاع",
    "notif.DUE_TODAY.title": "الكتاب مستحق اليوم",
    "notif.OVERDUE.title": "تأخير في الإرجاع",
    "notif.SYSTEM.title": "إشعار نظام",
    "notif.EXTENSION_APPROVED.title": "تمت الموافقة على التمديد",
    "notif.EXTENSION_REJECTED.title": "تم رفض التمديد",
    "notif.BOOK_RETURNED.title": "تم إرجاع الكتاب",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") as Language;
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  // On mount and change, ensure HTML attributes are synced
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
