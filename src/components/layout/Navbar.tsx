import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import addcartImg from '../../assets/cart.png';
import log2Img from '../../assets/logo2.png';

type NavItemKey = { href: string; key: string; special?: boolean };

const NAV_ITEM_KEYS: NavItemKey[] = [
  { href: '/', key: 'home' },
  { href: '/category', key: 'category' },
  { href: '/shop', key: 'shop' },
  { href: '/wishlist', key: 'wishList' },
];

const TRANSLATIONS: Record<
  string,
  {
    nav: Record<string, string>;
    login: string;
    signup: string;
    startSelling: string;
  }
> = {
  en: {
    nav: { home: 'Home', category: 'Category', shop: 'Shop', wishList: 'WishList' },
    login: 'Login',
    signup: 'Sign up',
    startSelling: 'Start Selling',
  },
  fr: {
    nav: { home: 'Accueil', category: 'Catégorie', shop: 'Boutique', wishList: 'Liste de souhaits' },
    login: 'Connexion',
    signup: "S'inscrire",
    startSelling: 'Vendre',
  },
  kny: {
    nav: { home: 'Ahabanza', category: 'Ibyiciro', shop: 'Iduka', wishList: 'Urutonde rw’ibyifuzwa' },
    login: 'Injira',
    signup: 'Iyandikishe',
    startSelling: 'Tangira Gucuruza',
  },
};

const LANGUAGES = [
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png', emoji: '🇬🇧' },
  { code: 'fr', label: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png', emoji: '🇫🇷' },
  { code: 'kny', label: 'Kinyarwanda', flagUrl: 'https://flagcdn.com/w40/rw.png', emoji: '🇷🇼' },
] as const;
type Lang = (typeof LANGUAGES)[number]['code'];

function getLangObj(code: Lang) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false); // mobile menu
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // mobile search panel
  const location = useLocation();
  const navigate = useNavigate();

  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('ecuruza_lang') as Lang) || 'en';
  });

  // persist language
  useEffect(() => {
    localStorage.setItem('ecuruza_lang', lang);
  }, [lang]);

  // close panels on route change
  useEffect(() => {
    if (open || mobileSearchOpen) {
      queueMicrotask(() => {
        setOpen(false);
        setMobileSearchOpen(false);
      });
    }
  }, [location.pathname]);

  // prevent scrolling when panels are open
  useEffect(() => {
    if (open || mobileSearchOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, mobileSearchOpen]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const [failedFlags, setFailedFlags] = useState<string[]>([]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const onSelectLang = (code: Lang) => {
    setLang(code);
    setLangOpen(false);
  };

  const onFlagError = (code: string) => {
    setFailedFlags((prev) => (prev.includes(code) ? prev : [...prev, code]));
  };

  const currentLang = getLangObj(lang);

  // SEARCH
  const [search, setSearch] = useState('');
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearch('');
    setOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border border-gray-200 shadow-sm">
      {/* Upper row: logo + search + actions */}
      <div className=" mx-auto px-4 flex items-center gap-3">
        <Link to="/" className="items-center gap-0.5 flex-shrink-0">
          <img src={log2Img} alt="E-Curuza logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop search */}
        <div className="flex-1 left-0 hidden md:flex items-center">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <label htmlFor="nav-search" className="sr-only">Search</label>
            <div className="relative ml-20">
              <input
                id="nav-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button type="submit" aria-label="Search" className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Actions: language, auth buttons, wishlist, mobile toggles */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((s) => !s)}
              className="inline-flex items-center gap-2 justify-center h-8 px-3 text-sm rounded-md bg-gray-100 border border-gray-300"
            >
              {!failedFlags.includes(currentLang.code) ? (
                <img src={currentLang.flagUrl} alt={`${currentLang.label} flag`} className="w-6 h-4 object-cover rounded-sm" onError={() => onFlagError(currentLang.code)} />
              ) : (
                <span className="text-lg">{currentLang.emoji}</span>
              )}
              <span className="font-medium">{currentLang.code.toUpperCase()}</span>
              <svg className="w-3 h-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </button>

            {langOpen && (
              <ul className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
                {LANGUAGES.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      onClick={() => onSelectLang(l.code)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 ${l.code === lang ? 'bg-gray-100' : ''}`}
                    >
                      {!failedFlags.includes(l.code) ? (
                        <img src={l.flagUrl} alt={`${l.label} flag`} className="w-6 h-4 object-cover rounded-sm" onError={() => onFlagError(l.code)} />
                      ) : (
                        <span className="text-lg">{l.emoji}</span>
                      )}
                      <span className="flex-1 text-sm">{l.label}</span>
                      {l.code === lang && <span className="text-xs text-gray-500">Selected</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/login" className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-[#3F4E40] text-white">{t.login}</Link>
          <Link to="/seller-registration" className="hidden sm:inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-gray-100 text-[#0C6227]">{t.startSelling}</Link>

          <Link to="/wishlist" title="Wishlist" className="hidden sm:inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100">
            <span className="relative inline-flex">
              <img src={addcartImg} alt="Wishlist" className="w-8 h-8 bg-[#3F4E40] object-contain" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-1 ring-white" />
            </span>
          </Link>

          {/* Mobile search toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle search"
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              setOpen(false);
            }}
          >
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </button>

          {/* Hamburger toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setOpen(!open);
              setMobileSearchOpen(false);
            }}
          >
            {open ? (
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Lower row: desktop nav items */}
      <div className="border-t border-gray-200 bg-white/95">
        <div className="px-4 h-12 flex items-center">
          <div className="hidden md:flex items-center gap-4">
            {NAV_ITEM_KEYS.map((item) => (
              <Link key={item.href} to={item.href} className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-md text-[#0C6227] hover:underline">
                {t.nav[item.key]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile search panel */}
      {mobileSearchOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full z-40 bg-white border-t border-gray-200 shadow-md px-4 py-3">
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1">
              <label htmlFor="mobile-search-input" className="sr-only">Search</label>
              <div className="relative">
                <input
                  id="mobile-search-input"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none"
                  autoFocus
                />
                <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                  </svg>
                </button>
              </div>
            </form>
            <button type="button" className="p-2 rounded-md hover:bg-gray-100" aria-label="Close search" onClick={() => setMobileSearchOpen(false)}>
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full z-50 bg-white border-t border-gray-200 shadow-md px-4 py-4">
          {/* Cart / Wishlist at top-right */}
          <Link to="/wishlist" title="Wishlist" className="absolute right-4 top-3 p-1 rounded-md hover:bg-gray-100">
            <span className="relative inline-flex">
              <img src={addcartImg} alt="Wishlist" className="w-8 h-8 bg-[#3F4E40] object-contain" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-1 ring-white" />
            </span>
          </Link>

          {/* Nav items */}
          <div className="grid grid-cols-1 gap-3 mt-10">
            {NAV_ITEM_KEYS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="w-full h-10 inline-flex items-center justify-center rounded-md text-sm font-medium text-[#0C6227] bg-gray-50"
                onClick={() => setOpen(false)}
              >
                {t.nav[item.key]}
              </Link>
            ))}

            {/* Auth buttons */}
            <div className="pt-2 border-t border-gray-100 mt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full h-10 inline-flex items-center justify-center rounded-md bg-[#3F4E40] text-white"
                onClick={() => setOpen(false)}
              >
                {t.login}
              </Link>
              <Link
                to="/signup"
                className="w-full h-10 inline-flex items-center justify-center rounded-md bg-gray-100 text-[#0C6227]"
                onClick={() => setOpen(false)}
              >
                {t.startSelling}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;