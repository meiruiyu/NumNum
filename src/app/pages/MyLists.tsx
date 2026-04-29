import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  ArrowLeft,
  Edit3,
  Star,
  Lock,
  Users as UsersIcon,
  Globe,
  Copy,
  Download,
  Sparkles,
  Instagram,
  X as CloseIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { BASE_URL } from '../api/client';

type ListsSnapshot = {
  wishlist: Array<{ name: string; cuisine: string; location: string; rating: number }>;
  collections: Array<{ name: string; count: number; privacy: 'private' | 'friends' | 'public' }>;
  exportedAt: string;
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/** XML attribute value for `href` etc. */
function escapeAttr(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll("'", '&apos;');
}

function truncatePosterText(value: string, maxLen: number) {
  const t = value.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
}

type PosterWishlistRow = {
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  reviewCount: number;
  imageUrl: string;
};

type PosterCollectionRow = {
  name: string;
  count: number;
  privacy: string;
  coverImage: string;
};

type PosterPayload = {
  exportedAt: string;
  wishlist: PosterWishlistRow[];
  collections: PosterCollectionRow[];
};

function buildPosterSvgString(payload: PosterPayload) {
  const wl = payload.wishlist.slice(0, 4);
  const col = payload.collections.slice(0, 3);
  const total = payload.wishlist.length + payload.collections.length;

  const wlTitleY = 218;
  const wlRow0 = 248;
  const wlStep = 168;
  const colHeadingY = wlRow0 + wl.length * wlStep + 22;
  const colRow0 = colHeadingY + 30;
  const colStep = 126;

  const wishlistBlocks = wl
    .map((item, i) => {
      const y = wlRow0 + i * wlStep;
      const clipId = `wlimg-${i}`;
      const reviews =
        item.reviewCount > 0 ? `${item.reviewCount.toLocaleString()} reviews` : 'Reviews N/A';
      return `
  <g transform="translate(40, ${y})">
    <rect width="1000" height="152" rx="22" fill="#FFFFFF" stroke="#EDE6DC" stroke-width="1.5" filter="url(#cardShadow)"/>
    <clipPath id="${clipId}">
      <rect x="22" y="16" width="132" height="120" rx="16"/>
    </clipPath>
    <image href="${escapeAttr(item.imageUrl)}" x="22" y="16" width="132" height="120" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>
    <rect x="22" y="16" width="132" height="120" rx="16" fill="none" stroke="#F0EBE3" stroke-width="1"/>
    <text x="182" y="48" font-size="30" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#2C1A0E" font-weight="700">${escapeXml(truncatePosterText(item.name, 34))}</text>
    <text x="182" y="82" font-size="22" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#8A8078">${escapeXml(truncatePosterText(item.location, 48))}</text>
    <text x="182" y="112" font-size="20" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#5C4A3A">${escapeXml(truncatePosterText(item.cuisine, 22))} · ${escapeXml(item.priceRange)}</text>
    <text x="182" y="142" font-size="20" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#C45A2A" font-weight="600">★ ${item.rating.toFixed(1)}</text>
    <text x="268" y="142" font-size="20" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#8A8078">${escapeXml(reviews)}</text>
  </g>`;
    })
    .join('');

  const collectionBlocks = col
    .map((item, i) => {
      const y = colRow0 + i * colStep;
      const clipId = `colimg-${i}`;
      return `
  <g transform="translate(40, ${y})">
    <rect width="1000" height="112" rx="20" fill="#FFFDF9" stroke="#EDE6DC" stroke-width="1.5" filter="url(#cardShadow)"/>
    <clipPath id="${clipId}">
      <rect x="18" y="14" width="92" height="84" rx="14"/>
    </clipPath>
    <image href="${escapeAttr(item.coverImage)}" x="18" y="14" width="92" height="84" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>
    <text x="128" y="44" font-size="26" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#2C1A0E" font-weight="700">${escapeXml(truncatePosterText(item.name, 36))}</text>
    <text x="128" y="74" font-size="19" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#8A8078">${item.count} places · ${escapeXml(item.privacy)}</text>
  </g>`;
    })
    .join('');

  const footerY = 1310;
  return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="posterHeaderGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E8603C"/>
      <stop offset="100%" stop-color="#F4A535"/>
    </linearGradient>
    <filter id="cardShadow" x="-8%" y="-8%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#2C1A0E" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1080" height="1350" fill="#FDF6EE"/>
  <rect width="1080" height="176" fill="url(#posterHeaderGrad)"/>
  <text x="56" y="88" font-size="56" font-family="Georgia, 'Times New Roman', serif" fill="#FFFFFF" font-weight="700">NumNum</text>
  <text x="56" y="138" font-size="26" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#FFF8F0">Wishlist + My Collections · ${total} records</text>
  <text x="56" y="198" font-size="22" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#8A8078">${escapeXml(
    new Date(payload.exportedAt).toLocaleString(),
  )}</text>
  <text x="56" y="${wlTitleY}" font-size="26" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#2C1A0E" font-weight="700">Wishlist</text>
  ${wishlistBlocks}
  <text x="56" y="${colHeadingY}" font-size="26" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#2C1A0E" font-weight="700">My Collections</text>
  ${collectionBlocks}
  <text x="540" y="${footerY}" text-anchor="middle" font-size="20" font-family="ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" fill="#B4A99A">numnum · share your picks</text>
</svg>`;
}

function posterDataUrlFromPayload(payload: PosterPayload) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildPosterSvgString(payload))}`;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(new Error('read failed'));
    fr.readAsDataURL(blob);
  });
}

/** Inline remote images so data-URL SVG works inside <img> (browser blocks cross-origin href). */
async function embedPosterImages(payload: PosterPayload): Promise<PosterPayload> {
  const cache = new Map<string, string>();
  async function toData(url: string): Promise<string> {
    if (!url || !url.startsWith('http')) return url;
    const hit = cache.get(url);
    if (hit) return hit;
    try {
      const res = await fetch(
        `${BASE_URL}/api/poster-image?url=${encodeURIComponent(url)}`,
      );
      if (!res.ok) throw new Error('proxy');
      const dataUrl = await blobToDataUrl(await res.blob());
      cache.set(url, dataUrl);
      return dataUrl;
    } catch {
      cache.set(url, url);
      return url;
    }
  }
  const wishlist = await Promise.all(
    payload.wishlist.map(async (w) => ({
      ...w,
      imageUrl: await toData(w.imageUrl),
    })),
  );
  const collections = await Promise.all(
    payload.collections.map(async (c) => ({
      ...c,
      coverImage: await toData(c.coverImage),
    })),
  );
  return { ...payload, wishlist, collections };
}

export function MyLists() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'wishlist' | 'been' | 'collections'>('wishlist');
  const [toast, setToast] = useState<string | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePosterSrc, setSharePosterSrc] = useState<string | null>(null);
  const [sharePosterBusy, setSharePosterBusy] = useState(false);
  const [sharedSnapshot, setSharedSnapshot] = useState<{
    wishlist: Array<{ name: string; cuisine: string; location: string; rating: number }>;
    collections: Array<{ name: string; count: number; privacy: 'private' | 'friends' | 'public' }>;
  } | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const decodeSnapshotFromHash = (): ListsSnapshot | null => {
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
    const params = new URLSearchParams(hash);
    const raw = params.get('share');
    if (!raw) return null;
    try {
      const json = decodeURIComponent(atob(raw));
      return JSON.parse(json) as ListsSnapshot;
    } catch {
      return null;
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const buildSnapshot = (): ListsSnapshot => ({
    wishlist: currentWishlistItems.map((w) => ({
      name: w.name,
      cuisine: w.cuisine,
      location: w.location,
      rating: w.rating,
    })),
    collections: currentCollections.map((c) => ({
      name: c.name,
      count: c.count,
      privacy: c.privacy,
    })),
    exportedAt: new Date().toISOString(),
  });

  const buildShareUrl = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(buildSnapshot())));
    return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
  };

  const onCopyLink = async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      showToast('Share link copied (Wishlist + Collections)');
    } catch {
      showToast('Could not copy link');
    }
  };

  const onShareX = () => {
    const url = buildShareUrl();
    const text = encodeURIComponent('Check out my NumNum Wishlist + Collections');
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const onShareInstagram = async () => {
    const url = buildShareUrl();
    const caption = `NumNum — Wishlist + Collections\n${url}`;
    try {
      await navigator.clipboard.writeText(caption);
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      showToast('Caption copied — paste in Instagram');
    } catch {
      showToast('Could not copy caption');
    }
  };

  const onShareReddit = () => {
    const url = buildShareUrl();
    const title = encodeURIComponent('My NumNum Wishlist + Collections');
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${title}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const onDownloadPoster = async () => {
    try {
      showToast('Preparing poster…');
      const embedded = await embedPosterImages(buildPosterPayload());
      const href = posterDataUrlFromPayload(embedded);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'my-lists-poster.svg';
      a.click();
      showToast('Poster downloaded');
    } catch {
      showToast('Download failed');
    }
  };

  const openShareModal = () => setShowShareModal(true);

  const shareActionsRef = useRef({ openShareModal });
  shareActionsRef.current = { openShareModal };

  const tabs = [
    { id: 'wishlist' as const, label: 'Wishlist' },
    { id: 'been' as const, label: 'Been There' },
    { id: 'collections' as const, label: 'My Collections' },
  ];

  // Wishlist data
  const wishlistItems = [
    {
      id: '1',
      name: 'Flushing Hot Pot',
      cuisine: 'Chinese',
      location: 'Flushing, Queens',
      rating: 4.7,
      reviewCount: 3284,
      priceRange: '$$',
      addedDate: 'Mar 20',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    },
    {
      id: '2',
      name: 'Han Joo KBBQ',
      cuisine: 'Korean',
      location: 'Koreatown, Manhattan',
      rating: 4.5,
      reviewCount: 1892,
      priceRange: '$$$',
      addedDate: 'Mar 18',
      imageUrl: 'https://images.unsplash.com/photo-1709433420612-8cad609df914?w=400',
    },
    {
      id: '3',
      name: 'Pho Bac',
      cuisine: 'Vietnamese',
      location: 'Manhattan',
      rating: 4.5,
      reviewCount: 1876,
      priceRange: '$',
      addedDate: 'Mar 15',
      imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    },
    {
      id: '4',
      name: 'Ramen Nakamura',
      cuisine: 'Japanese',
      location: 'East Village',
      rating: 4.6,
      reviewCount: 2107,
      priceRange: '$$',
      addedDate: 'Mar 10',
      imageUrl: 'https://images.unsplash.com/photo-1691426445669-661d566447b1?w=400',
    },
  ];

  // Been There data
  const beenThereItems = [
    {
      id: '1',
      name: 'Golden Dumpling',
      cuisine: 'Chinese',
      location: 'Chinatown',
      rating: 4.7,
      reviewCount: 876,
      priceRange: '$',
      visitedDate: 'Mar 22',
      myRating: 5,
      imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
    },
    {
      id: '2',
      name: 'Bonchon',
      cuisine: 'Korean',
      location: 'Fort Lee, NJ',
      rating: 4.6,
      reviewCount: 2156,
      priceRange: '$$',
      visitedDate: 'Mar 14',
      myRating: 4,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    },
    {
      id: '3',
      name: 'Tiger Sugar',
      cuisine: 'Bubble Tea',
      location: 'Flushing',
      rating: 4.4,
      reviewCount: 4521,
      priceRange: '$',
      visitedDate: 'Feb 28',
      myRating: null,
      imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
    },
  ];

  // Collections data
  const collections = [
    {
      id: '1',
      name: 'Date Night Spots',
      count: 4,
      privacy: 'friends' as const,
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
        'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400',
      ],
    },
    {
      id: '2',
      name: 'Cheap Eats Queens',
      count: 7,
      privacy: 'private' as const,
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
        'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
      ],
    },
    {
      id: '3',
      name: 'Special Occasions',
      count: 3,
      privacy: 'private' as const,
      images: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
        'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      ],
    },
    {
      id: '4',
      name: 'Best Ramen NYC',
      count: 5,
      privacy: 'public' as const,
      images: [
        'https://images.unsplash.com/photo-1691426445669-661d566447b1?w=400',
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
        'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400',
      ],
    },
  ];

  const currentWishlistItems = sharedSnapshot
    ? sharedSnapshot.wishlist.map((w, idx) => ({
        id: `shared-w-${idx}`,
        name: w.name,
        cuisine: w.cuisine,
        location: w.location,
        rating: w.rating,
        reviewCount: 0,
        priceRange: '$$',
        addedDate: 'Shared',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      }))
    : wishlistItems;

  const currentCollections = sharedSnapshot
    ? sharedSnapshot.collections.map((c, idx) => ({
        id: `shared-c-${idx}`,
        name: c.name,
        count: c.count,
        privacy: c.privacy,
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
          'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400',
        ],
      }))
    : collections;

  const buildPosterPayload = (): PosterPayload => ({
    exportedAt: new Date().toISOString(),
    wishlist: currentWishlistItems.map((w) => ({
      name: w.name,
      cuisine: w.cuisine,
      location: w.location,
      rating: w.rating,
      priceRange: w.priceRange,
      reviewCount: w.reviewCount,
      imageUrl: w.imageUrl,
    })),
    collections: currentCollections.map((c) => ({
      name: c.name,
      count: c.count,
      privacy:
        c.privacy === 'friends'
          ? 'Friends only'
          : c.privacy === 'private'
            ? 'Private'
            : 'Public',
      coverImage: c.images[0] ?? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    })),
  });

  useEffect(() => {
    if (!showShareModal) {
      setSharePosterSrc(null);
      setSharePosterBusy(false);
      return;
    }
    let cancelled = false;
    setSharePosterBusy(true);
    setSharePosterSrc(null);
    embedPosterImages(buildPosterPayload())
      .then((embedded) => {
        if (cancelled) return;
        setSharePosterSrc(posterDataUrlFromPayload(embedded));
      })
      .catch(() => {
        if (!cancelled) setSharePosterSrc(posterDataUrlFromPayload(buildPosterPayload()));
      })
      .finally(() => {
        if (!cancelled) setSharePosterBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [showShareModal]);

  useEffect(() => {
    const applyHash = (showEntryToast: boolean) => {
      const snapshot = decodeSnapshotFromHash();
      if (snapshot) {
        setIsSharedView(true);
        setSharedSnapshot({
          wishlist: snapshot.wishlist,
          collections: snapshot.collections,
        });
        if (showEntryToast) showToast('Opened shared snapshot view');
      } else {
        setIsSharedView(false);
        setSharedSnapshot(null);
      }
    };

    applyHash(true);
    const onHashChange = () => applyHash(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      ) {
        return;
      }
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        shareActionsRef.current.openShareModal();
      }
      if (e.key === 'Escape' && showShareModal) {
        setShowShareModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showShareModal]);

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#F0EBE3] px-4 py-4">
        <div className="flex items-center justify-center relative mb-4">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-1">
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#2C1A0E]">My Lists</h1>
          <button className="absolute right-0 p-1">
            <Edit3 className="size-[18px] text-[#8A8078]" />
          </button>
        </div>

        {/* Internal Tab Bar */}
        <div className="flex gap-1.5 bg-[#F5EDE3] rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#E8603C] font-semibold shadow-sm'
                  : 'text-[#8A8078]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        <div className="mb-4 bg-white border border-[#F0EBE3] rounded-xl p-3">
          {isSharedView && (
            <div className="text-[11px] text-[#E8603C] font-semibold mb-2">
              Shared Snapshot Mode
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-[#8A8078]">
                Share <span className="font-semibold text-[#2C1A0E]">Wishlist + My Collections</span> as a poster or link
              </div>
              <p className="text-[10px] text-[#B4B2A9] mt-1">
                Shortcut: <kbd className="px-1 rounded bg-[#F5EDE3]">⌘/Ctrl</kbd>+<kbd className="px-1 rounded bg-[#F5EDE3]">Shift</kbd>+<kbd className="px-1 rounded bg-[#F5EDE3]">S</kbd>
              </p>
            </div>
            <button
              type="button"
              title="Share your lists"
              onClick={openShareModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-full bg-[#C9A227] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#B08F1F] sm:self-auto"
            >
              <Sparkles className="size-4" strokeWidth={2.2} />
              Share
            </button>
          </div>
        </div>
        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#2C1A0E]">Wishlist ({currentWishlistItems.length})</h2>
              <span className="text-[13px] text-[#8A8078]">{currentWishlistItems.length} places</span>
            </div>
            <div className="space-y-2 mb-6">
              {currentWishlistItems.map((item) => (
                <WishlistCard key={item.id} item={item} />
              ))}
            </div>
            <button className="w-full text-center text-sm font-medium text-[#E8603C] py-3">
              + Add a place
            </button>
          </>
        )}

        {/* Been There Tab */}
        {activeTab === 'been' && (
          <>
            <div className="mb-4">
              <h2 className="text-[16px] font-bold text-[#2C1A0E]">Been There ({beenThereItems.length})</h2>
            </div>
            <div className="space-y-2">
              {beenThereItems.map((item) => (
                <BeenThereCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {/* My Collections Tab */}
        {activeTab === 'collections' && (
          <>
            <div className="mb-4">
              <h2 className="text-[16px] font-bold text-[#2C1A0E]">My Collections</h2>
              <p className="text-[13px] text-[#8A8078] mt-1">Organize your saves into lists</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {currentCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>
            <button className="w-full h-12 border border-dashed border-[#D4C9BE] rounded-xl bg-transparent flex items-center justify-center gap-2 text-[#8A8078] hover:bg-[#FDF6EE] transition-colors">
              <span className="text-xl font-light">+</span>
              <span className="text-[13px]">Create New Collection</span>
            </button>
          </>
        )}
      </div>
      {showShareModal && (
        <ShareListsModal
          posterSrc={sharePosterSrc}
          posterLoading={sharePosterBusy}
          onClose={() => setShowShareModal(false)}
          onCopyLink={onCopyLink}
          onShareX={onShareX}
          onShareInstagram={onShareInstagram}
          onShareReddit={onShareReddit}
          onDownloadPoster={onDownloadPoster}
        />
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2C1A0E] text-white text-xs px-3 py-2 rounded-full shadow-lg z-[60]">
          {toast}
        </div>
      )}
    </div>
  );
}

function RedditGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.5 1.207-.5a1.678 1.678 0 0 1 .923 3.085c-.046-.082-.094-.15-.14-.23.21.065.416.133.6.25.828.45 1.096 1.56.6 2.475-.496.915-1.832 1.22-2.66.77-.33-.18-.574-.45-.735-.762A6.915 6.915 0 0 1 12 17.68a6.915 6.915 0 0 1-6.709-2.005 1.657 1.657 0 0 1-.722-.762c-.828-.45-2.164-.145-2.66.77-.496.915-.228 2.025.6 2.475.184.117.39.185.6.25-.046.08-.094.148-.14.23a1.678 1.678 0 0 1 .923-3.085c.478 0 .9.191 1.207.5 1.194-.856 2.85-1.418 4.674-1.488l-.8-3.748-2.597.547a1.25 1.25 0 1 1-1.178-2.008 1.25 1.25 0 0 1 1.072-.547l3.45.726a.25.25 0 0 0 .206-.139l1.646-3.705zM9.25 12C8.561 12 8 12.562 8 13.25c0 .688.561 1.25 1.25 1.25.687 0 1.25-.562 1.25-1.25 0-.688-.563-1.25-1.25-1.25zm5.5 0c-.689 0-1.25.562-1.25 1.25 0 .688.561 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.688-.562-1.25-1.25-1.25zm-5.466 3.75a.75.75 0 0 0-.678.422 4.965 4.965 0 0 0 4.394 2.578 4.965 4.965 0 0 0 4.394-2.578.75.75 0 1 0-1.35-.65 3.465 3.465 0 0 1-6.088 0 .75.75 0 0 0-.672-.422z" />
    </svg>
  );
}

function XLogoGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ShareListsModal({
  posterSrc,
  posterLoading,
  onClose,
  onCopyLink,
  onShareX,
  onShareInstagram,
  onShareReddit,
  onDownloadPoster,
}: {
  posterSrc: string | null;
  posterLoading: boolean;
  onClose: () => void;
  onCopyLink: () => void | Promise<void>;
  onShareX: () => void;
  onShareInstagram: () => void | Promise<void>;
  onShareReddit: () => void;
  onDownloadPoster: () => void | Promise<void>;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-lists-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[92vw] sm:max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-[#8A8078] hover:bg-[#FDF6EE]"
          aria-label="Close"
        >
          <CloseIcon className="size-5" />
        </button>
        <div className="border-b border-[#F0EBE3] px-5 pb-3 pt-4 pr-12">
          <h2 id="share-lists-title" className="text-[15px] font-semibold leading-snug text-[#2C1A0E]">
            My NumNum — Wishlist + Collections
          </h2>
        </div>
        <div className="max-h-[65vh] sm:max-h-[55vh] overflow-auto px-4 py-4">
          <div className="mx-auto flex min-h-[260px] sm:min-h-[320px] max-w-[280px] items-center justify-center overflow-hidden rounded-xl border border-[#E8E0D8] bg-[#F5F3EF] p-2 shadow-inner">
            {posterLoading && !posterSrc ? (
              <div className="px-4 py-12 text-center text-sm text-[#8A8078]">
                Loading images for preview…
              </div>
            ) : posterSrc ? (
              <img src={posterSrc} alt="List poster preview" className="block w-full" />
            ) : (
              <div className="px-4 py-12 text-center text-sm text-[#8A8078]">Preview unavailable</div>
            )}
          </div>
        </div>
        <div className="border-t border-[#F0EBE3] px-4 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 items-start gap-3">
            <ShareCircleButton label="Copy link" onClick={() => void onCopyLink()}>
              <Copy className="size-5" />
            </ShareCircleButton>
            <ShareCircleButton label="X" onClick={onShareX}>
              <XLogoGlyph className="size-5" />
            </ShareCircleButton>
            <ShareCircleButton label="Instagram" onClick={() => void onShareInstagram()}>
              <Instagram className="size-5" />
            </ShareCircleButton>
            <ShareCircleButton label="Reddit" onClick={onShareReddit}>
              <RedditGlyph className="size-5" />
            </ShareCircleButton>
            <ShareCircleButton label="Download" onClick={onDownloadPoster}>
              <Download className="size-5" />
            </ShareCircleButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareCircleButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center gap-1.5 text-[#2C1A0E]"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-[#2C1A0E] text-white shadow-sm transition-transform hover:scale-105 active:scale-95">
        {children}
      </span>
      <span className="max-w-[4.5rem] text-center text-[10px] font-medium leading-tight text-[#8A8078]">{label}</span>
    </button>
  );
}

function WishlistCard({ item }: { item: any }) {
  return (
    <Link
      to={`/restaurant/${item.id}`}
      className="w-full h-[88px] bg-white rounded-xl border-[0.5px] border-[#F0EBE3] flex items-center gap-3 px-3.5 py-2.5 hover:border-[#E8603C]/30 transition-all overflow-hidden"
    >
      {/* Photo */}
      <div className="w-20 h-[68px] flex-shrink-0">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full rounded-[10px] object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-sm font-semibold text-[#2C1A0E] mb-0.5 truncate overflow-hidden whitespace-nowrap">
          {item.name}
        </h3>
        <p className="text-xs text-[#8A8078] mb-1 truncate overflow-hidden whitespace-nowrap">
          {item.cuisine} · {item.location}
        </p>
        <div className="flex items-center gap-1 mb-1 whitespace-nowrap overflow-hidden">
          <Star className="size-3 fill-[#F4A535] text-[#F4A535] flex-shrink-0" />
          <span className="text-xs font-medium text-[#4A3728]">{item.rating}</span>
          <span className="text-[11px] text-[#8A8078]">({item.reviewCount.toLocaleString()})</span>
          <span className="text-[#8A8078] mx-0.5">·</span>
          <span className="text-xs font-medium text-[#4A3728]">{item.priceRange}</span>
        </div>
        <p className="text-[11px] text-[#8A8078]">Added {item.addedDate}</p>
      </div>

      {/* Chevron */}
      <svg className="size-4 text-[#C5BDB4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function BeenThereCard({ item }: { item: any }) {
  return (
    <Link
      to={`/restaurant/${item.id}`}
      className="w-full h-[88px] bg-white rounded-xl border-[0.5px] border-[#F0EBE3] flex items-center gap-3 px-3.5 py-2.5 hover:border-[#E8603C]/30 transition-all overflow-hidden"
    >
      {/* Photo */}
      <div className="w-20 h-[68px] flex-shrink-0">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full rounded-[10px] object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-sm font-semibold text-[#2C1A0E] mb-0.5 truncate overflow-hidden whitespace-nowrap">
          {item.name}
        </h3>
        <p className="text-xs text-[#8A8078] mb-1 truncate overflow-hidden whitespace-nowrap">
          {item.cuisine} · {item.location}
        </p>
        <div className="flex items-center gap-1 mb-1 whitespace-nowrap overflow-hidden">
          <Star className="size-3 fill-[#F4A535] text-[#F4A535] flex-shrink-0" />
          <span className="text-xs font-medium text-[#4A3728]">{item.rating}</span>
          <span className="text-[11px] text-[#8A8078]">({item.reviewCount.toLocaleString()})</span>
          <span className="text-[#8A8078] mx-0.5">·</span>
          <span className="text-xs font-medium text-[#4A3728]">{item.priceRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[11px] text-[#8A8078]">Visited {item.visitedDate}</p>
          {item.myRating ? (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${
                    i < item.myRating ? 'fill-[#F4A535] text-[#F4A535]' : 'text-[#E8E0D8]'
                  }`}
                />
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-[#E8603C] font-medium">Rate this</span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <svg className="size-4 text-[#C5BDB4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function CollectionCard({
  collection,
}: {
  collection: any;
}) {
  const privacyIcon = {
    private: <Lock className="size-[10px] text-[#8A8078]" />,
    friends: <UsersIcon className="size-[10px] text-[#8A8078]" />,
    public: <Globe className="size-[10px] text-[#8A8078]" />,
  };

  return (
    <div className="w-full bg-white border border-[#F0EBE3] rounded-xl overflow-hidden hover:border-[#E8603C]/30 transition-all">
      {/* Photo Collage */}
      <div className="h-[90px] grid grid-cols-2 grid-rows-2">
        {collection.images.slice(0, 4).map((img: string, idx: number) => (
          <div key={idx} className="w-full h-full">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="h-[50px] px-2.5 py-2 bg-white">
        <h3 className="text-[13px] font-semibold text-[#2C1A0E] mb-1 truncate overflow-hidden whitespace-nowrap">
          {collection.name}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8A8078]">
          <span>{collection.count} places</span>
          <span>·</span>
          {privacyIcon[collection.privacy]}
        </div>
      </div>
    </div>
  );
}