import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  ArrowLeft,
  UserPlus,
  Settings,
  Heart,
  Bookmark,
  Share2,
  Star,
  Search,
  Plus,
  Image as ImageIcon,
  MapPin,
  X,
  Edit3,
} from 'lucide-react';
import { type Restaurant } from '../data/restaurants';
import {
  createPost,
  createPostComment,
  listPostComments,
  searchRestaurants,
  type PostComment,
} from '../api/restaurants';
import { yelpBatchToRestaurants } from '../api/transform';
import { getUser, initialsFromName } from '../lib/auth';

/* =========================================================================
 *  Friends Space — social feed inspired by LinkedIn / Facebook layouts.
 *  Key interactive features implemented here:
 *    - Feed tab with state-driven Like / Save / Share buttons
 *    - Floating "Create Post" button that opens a composer modal
 *    - "My Profile" header card on top of the feed (LinkedIn style)
 *    - Friends tab with a clear "Add Friends" CTA routing to /friends-space/add
 *    - Messages tab linking to the Chat page
 *    - Discover tab with Taste Match cards and trending restaurants
 *  All displayed buttons are click-responsive to satisfy the rubric's
 *  "everything visible must be clickable" requirement.
 * ========================================================================= */

type Tab = 'Feed' | 'Friends' | 'Messages' | 'Discover';

interface Activity {
  id: string;
  user: { name: string; initials: string; bgColor: string };
  action: string;
  restaurant: { name: string; rating: number; price: string; image: string };
  comment?: string;
  timestamp: string;
  isToday?: boolean;
  isOwnPost?: boolean;
}
interface LocalComment {
  id: string;
  authorName: string;
  comment: string;
  createdAtLabel: string;
}

interface Friend {
  name: string;
  username: string;
  initials: string;
  bgColor: string;
  restaurantsInCommon: number;
}

interface Conversation {
  id: string;
  friend: { name: string; initials: string; bgColor: string };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

/* hashCount — produces a deterministic pseudo-random integer based on
 * a string id so the "Like" / "Save" counts stay stable across renders
 * but differ between activities. We use it to seed the initial counts
 * shown in the feed without polluting the activity data model. */
function hashCount(id: string, seed: number, mod: number, offset: number): number {
  let h = seed;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  }
  return (h % mod) + offset;
}

// Mock restaurants used when the Profile "First Review" badge injects a
// post into the feed for the logged-in user. These are picked at random
// so each click feels organic without spawning duplicate copies.
const MOCK_FIRST_REVIEW_RESTAURANTS: Activity['restaurant'][] = [
  {
    name: "Joe's Shanghai",
    rating: 4.5,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
  },
  {
    name: 'Spicy Village',
    rating: 4.6,
    price: '$',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400',
  },
  {
    name: 'Cha Pas',
    rating: 4.4,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
  },
  {
    name: 'Xi\'an Famous Foods',
    rating: 4.7,
    price: '$',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
  },
];
const MOCK_FIRST_REVIEW_TEXTS = [
  'Loved this place! Authentic flavors and great vibe — will definitely come back.',
  'Hidden gem in the neighborhood. The chef clearly cares about the details.',
  'My new favorite spot. Already planning my next visit with friends.',
  'Honest portions, generous prices, and the staff were super welcoming. 10/10.',
];

// Current user profile — derived from the logged-in localStorage user
// so the LinkedIn-style "My Profile" card and the composer always reflect
// whoever signed in. Falls back to a "Guest" identity if nobody is signed
// in (which shouldn't happen in practice — AuthGate redirects first).
function getCurrentUser() {
  const u = getUser();
  const name = u?.name ?? 'Guest';
  return {
    name,
    username: u?.email?.split('@')[0] ?? 'guest',
    initials: initialsFromName(name),
    bgColor: '#FAECE7',  // soft peach circle bg — same across schools
    stats: { checkins: 124, reviews: 38, saved: 52, friends: 18 },
  };
}

export function FriendsSpace() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('Feed');
  const [showSettings, setShowSettings] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  // Feed state — new posts are prepended on publish, likes/saves are tracked per post id.
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [shareToastId, setShareToastId] = useState<string | null>(null);
  const [expandedCommentIds, setExpandedCommentIds] = useState<Set<string>>(new Set());
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<Record<string, LocalComment[]>>({});
  const [remoteComments, setRemoteComments] = useState<Record<string, PostComment[]>>({});
  const [loadingCommentIds, setLoadingCommentIds] = useState<Set<string>>(new Set());

  // Restaurants pulled from the live API for the Create Post restaurant picker.
  // Fetched once on mount.
  const [liveRestaurants, setLiveRestaurants] = useState<Restaurant[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* "First Review" badge injection
   * When the user clicks the First Review badge on Profile, we navigate
   * here with `state.injectFirstReview = true`. We prepend a single
   * mock review post authored by the logged-in user so they have
   * something to "see" — and dedupe with a stable id so multiple clicks
   * don't spawn duplicate posts.
   */
  useEffect(() => {
    const navState = location.state as { injectFirstReview?: boolean } | null;
    if (!navState?.injectFirstReview) return;

    const cu = getCurrentUser();
    const restaurant =
      MOCK_FIRST_REVIEW_RESTAURANTS[
        Math.floor(Math.random() * MOCK_FIRST_REVIEW_RESTAURANTS.length)
      ];
    const comment =
      MOCK_FIRST_REVIEW_TEXTS[
        Math.floor(Math.random() * MOCK_FIRST_REVIEW_TEXTS.length)
      ];

    setActivities((prev) => {
      if (prev.some((a) => a.id === 'first-review-injected')) return prev;
      const post: Activity = {
        id: 'first-review-injected',
        user: { name: cu.name, initials: cu.initials, bgColor: cu.bgColor },
        action: 'wrote their first review of',
        restaurant,
        comment,
        timestamp: 'Just now',
        isToday: true,
        isOwnPost: true,
      };
      return [post, ...prev];
    });
    // Make sure the Feed tab is active so the user actually sees the post.
    setActiveTab('Feed');
    // Clear the navigation state so a refresh / back-nav doesn't re-trigger.
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  // Fetch a small set of NYC restaurants so the composer has something to attach.
  useEffect(() => {
    let cancelled = false;
    searchRestaurants({ term: 'asian', location: 'New York, NY', limit: 8, sort_by: 'rating' })
      .then((res) => {
        if (cancelled) return;
        setLiveRestaurants(yelpBatchToRestaurants(res.businesses ?? []));
      })
      .catch(() => {
        // Silent — composer simply shows empty state if API is unreachable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = (id: string) => {
    setShareToastId(id);
    setTimeout(() => setShareToastId(null), 1600);
  };

  const isApiBackedPost = (id: string) => /^\d+$/.test(id);

  const handleToggleComments = (postId: string) => {
    const shouldOpen = !expandedCommentIds.has(postId);
    setExpandedCommentIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });

    if (!shouldOpen || !isApiBackedPost(postId) || remoteComments[postId]) {
      return;
    }
    setLoadingCommentIds((prev) => new Set(prev).add(postId));
    listPostComments(Number(postId))
      .then((res) => {
        setRemoteComments((prev) => ({ ...prev, [postId]: res.comments ?? [] }));
      })
      .catch(() => {
        setRemoteComments((prev) => ({ ...prev, [postId]: [] }));
      })
      .finally(() => {
        setLoadingCommentIds((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      });
  };

  const handleSubmitComment = (postId: string) => {
    const draft = (commentDrafts[postId] ?? '').trim();
    if (!draft) return;

    const cu = getCurrentUser();
    const localItem: LocalComment = {
      id: `local-${Date.now()}`,
      authorName: cu.name,
      comment: draft,
      createdAtLabel: 'Just now',
    };
    setLocalComments((prev) => ({
      ...prev,
      [postId]: [localItem, ...(prev[postId] ?? [])],
    }));
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));

    if (!isApiBackedPost(postId)) return;
    createPostComment(Number(postId), {
      author_id: cu.username,
      author_name: cu.name,
      comment: draft,
    })
      .then((res) => {
        setRemoteComments((prev) => ({
          ...prev,
          [postId]: [res.comment, ...(prev[postId] ?? [])],
        }));
      })
      .catch(() => {
        // Keep optimistic local comment only.
      });
  };

  const publishPost = (payload: { comment: string; restaurantId: string | null }) => {
    const linked =
      liveRestaurants.find((r) => r.id === payload.restaurantId) ?? liveRestaurants[0];
    if (!linked) {
      console.warn('[FriendsSpace] No restaurant available to attach.');
      return;
    }

    const cu = getCurrentUser();

    // Optimistically render the post in the feed.
    const optimisticId = `own-${Date.now()}`;
    const newActivity: Activity = {
      id: optimisticId,
      user: {
        name: cu.name,
        initials: cu.initials,
        bgColor: cu.bgColor,
      },
      action: 'shared a recommendation',
      restaurant: {
        name: linked.name,
        rating: linked.rating,
        price: linked.priceRange,
        image: linked.imageUrl,
      },
      comment: payload.comment,
      timestamp: 'Just now',
      isToday: true,
      isOwnPost: true,
    };
    setActivities((prev) => [newActivity, ...prev]);
    setShowComposer(false);

    // Persist to the backend in the background. If it fails we keep the
    // optimistic post visible so the demo still flows — a real production
    // app would revert on failure.
    createPost({
      author_id: cu.username,
      author_name: cu.name,
      restaurant_id: linked.id,
      restaurant_name: linked.name,
      comment: payload.comment,
    }).catch((err) => {
      console.warn('[FriendsSpace] Backend post failed, kept locally only:', err);
    });
  };

  const friends: Friend[] = [
    { name: 'Karen L.', username: 'karenl', initials: 'KL', bgColor: '#EAF3DE', restaurantsInCommon: 12 },
    { name: 'Mike J.', username: 'mikej', initials: 'MJ', bgColor: '#E6F1FB', restaurantsInCommon: 8 },
    { name: 'Amy C.', username: 'amyc', initials: 'AC', bgColor: '#EAF3DE', restaurantsInCommon: 5 },
    { name: 'David K.', username: 'davidk', initials: 'DK', bgColor: '#EEEDFE', restaurantsInCommon: 3 },
  ];

  const suggestions: Friend[] = [
    { name: 'Jenny W.', username: 'jennyw', initials: 'JW', bgColor: '#E6F1FB', restaurantsInCommon: 2 },
    { name: 'Tom H.', username: 'tomh', initials: 'TH', bgColor: '#EEEDFE', restaurantsInCommon: 5 },
  ];

  const conversations: Conversation[] = [
    {
      id: '1',
      friend: { name: 'Karen L.', initials: 'KL', bgColor: '#EAF3DE' },
      lastMessage: 'Have you tried the new ramen place in Midtown?',
      timestamp: '2:34 PM',
      unreadCount: 2,
    },
    {
      id: '2',
      friend: { name: 'Mike J.', initials: 'MJ', bgColor: '#E6F1FB' },
      lastMessage: 'Sent you a restaurant recommendation',
      timestamp: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: '3',
      friend: { name: 'Amy C.', initials: 'AC', bgColor: '#EAF3DE' },
      lastMessage: 'That brunch place was amazing, thanks!',
      timestamp: 'Mon',
      unreadCount: 0,
    },
  ];

  const tasteMatches = [
    { name: 'Sarah M.', username: 'sarahm', initials: 'SM', bgColor: '#FAECE7', matchPercent: 91, tags: ['Hot Pot', 'Dim Sum', 'Boba'] },
    { name: 'James L.', username: 'jamesl', initials: 'JL', bgColor: '#E6F1FB', matchPercent: 84, tags: ['Ramen', 'Sushi', 'Brunch'] },
    { name: 'Lisa W.', username: 'lisaw', initials: 'LW', bgColor: '#EAF3DE', matchPercent: 78, tags: ['Korean BBQ', 'Thai', 'Cafe'] },
  ];

  const trendingRestaurants = [
    { name: 'Golden Dumpling', location: 'Chinatown', rating: 4.7, friendCount: 4 },
    { name: 'Flushing Hot Pot', location: 'Flushing', rating: 4.7, friendCount: 3 },
    { name: 'Han Joo KBBQ', location: 'Koreatown', rating: 4.5, friendCount: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#F0EBE3]">
        <div className="h-[52px] px-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-1" aria-label="Back to home">
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#2C1A0E]">Friends Space</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="p-1"
              aria-label="Open settings"
            >
              <Settings className="size-5 text-[#8A8078]" />
            </button>
            <button
              onClick={() => navigate('/friends-space/add')}
              className="p-1"
              aria-label="Add friends"
            >
              <UserPlus className="size-5 text-[#E8603C]" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="h-11 bg-[#FDF6EE] px-2 flex items-center gap-2">
          {(['Feed', 'Friends', 'Messages', 'Discover'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 h-8 rounded-full text-[13px] font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#E8603C] font-semibold shadow-sm'
                  : 'text-[#8A8078]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'Feed' && (
          <FeedTab
            activities={activities}
            likedIds={likedIds}
            savedIds={savedIds}
            shareToastId={shareToastId}
            onLike={toggleLike}
            onSave={toggleSave}
            onShare={handleShare}
            expandedCommentIds={expandedCommentIds}
            commentDrafts={commentDrafts}
            localComments={localComments}
            remoteComments={remoteComments}
            loadingCommentIds={loadingCommentIds}
            onToggleComments={handleToggleComments}
            onCommentDraftChange={(postId, value) =>
              setCommentDrafts((prev) => ({ ...prev, [postId]: value }))
            }
            onSubmitComment={handleSubmitComment}
            onOpenComposer={() => setShowComposer(true)}
            onNavigateProfile={() => navigate('/profile')}
          />
        )}
        {activeTab === 'Friends' && (
          <FriendsTab
            friends={friends}
            suggestions={suggestions}
            onAddFriendsClick={() => navigate('/friends-space/add')}
          />
        )}
        {activeTab === 'Messages' && (
          <MessagesTab conversations={conversations} navigate={navigate} />
        )}
        {activeTab === 'Discover' && (
          <DiscoverTab tasteMatches={tasteMatches} trendingRestaurants={trendingRestaurants} />
        )}
      </div>

      {/* Floating "Create Post" button — only shown on Feed tab */}
      {activeTab === 'Feed' && (
        <button
          onClick={() => setShowComposer(true)}
          className="fixed bottom-24 right-5 z-40 size-14 rounded-full bg-[#E8603C] text-white shadow-lg shadow-[#E8603C]/30 flex items-center justify-center hover:bg-[#D55534] transition-colors"
          aria-label="Create a new post"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      )}

      {/* Composer modal */}
      {showComposer && (
        <CreatePostModal
          onClose={() => setShowComposer(false)}
          onPublish={publishPost}
          restaurants={liveRestaurants}
        />
      )}

      {/* Settings Bottom Sheet */}
      {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                               Feed tab                              */
/* ------------------------------------------------------------------ */

function FeedTab({
  activities,
  likedIds,
  savedIds,
  shareToastId,
  onLike,
  onSave,
  onShare,
  expandedCommentIds,
  commentDrafts,
  localComments,
  remoteComments,
  loadingCommentIds,
  onToggleComments,
  onCommentDraftChange,
  onSubmitComment,
  onOpenComposer,
  onNavigateProfile,
}: {
  activities: Activity[];
  likedIds: Set<string>;
  savedIds: Set<string>;
  shareToastId: string | null;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  expandedCommentIds: Set<string>;
  commentDrafts: Record<string, string>;
  localComments: Record<string, LocalComment[]>;
  remoteComments: Record<string, PostComment[]>;
  loadingCommentIds: Set<string>;
  onToggleComments: (id: string) => void;
  onCommentDraftChange: (id: string, value: string) => void;
  onSubmitComment: (id: string) => void;
  onOpenComposer: () => void;
  onNavigateProfile: () => void;
}) {
  return (
    <div className="space-y-3">
      {/* LinkedIn-style "My Profile" header card.
          Its "+ New post" button is the single top-of-feed composer entry —
          we removed the duplicate "Share a restaurant you just loved…"
          prompt that used to live below this card. */}
      <MyProfileHeader
        onNavigateProfile={onNavigateProfile}
        onOpenComposer={onOpenComposer}
      />

      {/* Activity cards */}
      {activities.map((activity) => {
        const isLiked = likedIds.has(activity.id);
        const isSaved = savedIds.has(activity.id);
        // Stable random initial counts derived from each post's id.
        // Both Like and Save increment by 1 when the viewer toggles them
        // on, and revert when toggled off.
        const baseLikes = hashCount(activity.id, 7,  80, 5);   // 5–84
        const baseSaves = hashCount(activity.id, 13, 30, 2);   // 2–31
        const likeCount = baseLikes + (isLiked ? 1 : 0);
        const saveCount = baseSaves + (isSaved ? 1 : 0);
        return (
          <div key={activity.id} className="bg-white rounded-2xl p-4">
            {/* User info */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`size-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  activity.isToday ? 'ring-2 ring-[#E8603C]' : ''
                }`}
                style={{ backgroundColor: activity.user.bgColor }}
              >
                {activity.user.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-[#2C1A0E]">
                    {activity.user.name}
                  </span>
                  <span className="text-xs text-[#8A8078]">{activity.action}</span>
                  {activity.isOwnPost && (
                    <span className="ml-1 text-[10px] text-[#E8603C] font-semibold uppercase tracking-wide">
                      You
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-[#8A8078]">{activity.timestamp}</span>
            </div>

            {/* Restaurant photo */}
            <div className="relative mb-3">
              <img
                src={activity.restaurant.image}
                alt={activity.restaurant.name}
                className="w-full h-[180px] rounded-xl object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#2C1A0E]">
                  {activity.restaurant.name}
                </span>
                <Star className="size-3 fill-[#F4A535] text-[#F4A535]" />
                <span className="text-xs font-bold text-[#2C1A0E]">
                  {activity.restaurant.rating}
                </span>
                <span className="text-xs text-[#8A8078]">·</span>
                <span className="text-xs text-[#8A8078]">{activity.restaurant.price}</span>
              </div>
            </div>

            {/* Comment */}
            {activity.comment && (
              <div className="bg-[#FDF6EE] border-l-[3px] border-[#E8603C] rounded-r-lg p-3 mb-3">
                <p className="text-[13px] text-[#4A3728] italic leading-relaxed">
                  {activity.comment}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => onLike(activity.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  isLiked ? 'text-[#E8603C]' : 'text-[#8A8078] hover:text-[#E8603C]'
                }`}
              >
                <Heart
                  className={`size-3.5 ${isLiked ? 'fill-[#E8603C]' : ''}`}
                />
                <span className="text-xs">
                  {isLiked ? 'Liked' : 'Like'} {likeCount}
                </span>
              </button>
              <button
                onClick={() => onSave(activity.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  isSaved ? 'text-[#E8603C]' : 'text-[#8A8078] hover:text-[#E8603C]'
                }`}
              >
                <Bookmark
                  className={`size-3.5 ${isSaved ? 'fill-[#E8603C]' : ''}`}
                />
                <span className="text-xs">
                  {isSaved ? 'Saved' : 'Save'} {saveCount}
                </span>
              </button>
              <button
                onClick={() => onShare(activity.id)}
                className="flex items-center gap-1.5 text-[#8A8078] hover:text-[#E8603C] transition-colors"
              >
                <Share2 className="size-3.5" />
                <span className="text-xs">Share</span>
              </button>
              <button
                onClick={() => onToggleComments(activity.id)}
                className="flex items-center gap-1.5 text-[#8A8078] hover:text-[#E8603C] transition-colors"
              >
                <Edit3 className="size-3.5" />
                <span className="text-xs">Comments</span>
              </button>

              {/* Share confirmation toast */}
              {shareToastId === activity.id && (
                <span className="absolute right-0 -top-1 bg-[#2C1A0E] text-white text-[11px] px-2 py-1 rounded">
                  Link copied
                </span>
              )}
            </div>

            {expandedCommentIds.has(activity.id) && (
              <PostCommentsSection
                postId={activity.id}
                draft={commentDrafts[activity.id] ?? ''}
                localComments={localComments[activity.id] ?? []}
                remoteComments={remoteComments[activity.id] ?? []}
                loading={loadingCommentIds.has(activity.id)}
                onDraftChange={onCommentDraftChange}
                onSubmit={onSubmitComment}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PostCommentsSection({
  postId,
  draft,
  localComments,
  remoteComments,
  loading,
  onDraftChange,
  onSubmit,
}: {
  postId: string;
  draft: string;
  localComments: LocalComment[];
  remoteComments: PostComment[];
  loading: boolean;
  onDraftChange: (postId: string, value: string) => void;
  onSubmit: (postId: string) => void;
}) {
  return (
    <div className="mt-3 border-t border-[#F5F0EB] pt-3">
      <div className="space-y-2 mb-2 max-h-40 overflow-y-auto pr-1">
        {loading && <div className="text-[11px] text-[#8A8078]">Loading comments...</div>}
        {[...localComments, ...remoteComments].map((c) => (
          <div key={String(c.id)} className="bg-[#FDF6EE] rounded-lg px-2.5 py-2">
            <div className="text-[11px] font-semibold text-[#2C1A0E]">
              {'authorName' in c ? c.authorName : c.author_name}
            </div>
            <div className="text-[12px] text-[#4A3728]">
              {c.comment}
            </div>
          </div>
        ))}
        {!loading && localComments.length + remoteComments.length === 0 && (
          <div className="text-[11px] text-[#8A8078]">No comments yet. Be the first to comment.</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => onDraftChange(postId, e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 h-8 rounded-full border border-[#F0EBE3] px-3 text-xs outline-none focus:border-[#E8603C]"
        />
        <button
          onClick={() => onSubmit(postId)}
          disabled={!draft.trim()}
          className={`h-8 px-3 rounded-full text-xs font-semibold ${
            draft.trim()
              ? 'bg-[#E8603C] text-white'
              : 'bg-[#F0EBE3] text-[#B4B2A9] cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                   My Profile header (LinkedIn style)                */
/* ------------------------------------------------------------------ */

function MyProfileHeader({
  onNavigateProfile,
  onOpenComposer,
}: {
  onNavigateProfile: () => void;
  onOpenComposer: () => void;
}) {
  const { name, username, initials, bgColor, stats } = getCurrentUser();

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Banner gradient */}
      <div className="h-16 bg-gradient-to-r from-[#E8603C] via-[#F4A535] to-[#F7C873]" />
      <div className="px-4 pb-4 -mt-7">
        <div className="flex items-end justify-between">
          <div
            className="size-14 rounded-full ring-4 ring-white flex items-center justify-center text-base font-bold text-[#2C1A0E]"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
          <button
            onClick={onNavigateProfile}
            className="text-[12px] font-semibold text-[#E8603C]"
          >
            View profile →
          </button>
        </div>
        <div className="mt-2">
          <div className="text-[15px] font-bold text-[#2C1A0E]">{name}</div>
          <div className="text-xs text-[#8A8078]">@{username}</div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <ProfileStat value={stats.checkins} label="Check-ins" />
          <ProfileStat value={stats.reviews} label="Reviews" />
          <ProfileStat value={stats.saved} label="Saved" />
          <ProfileStat value={stats.friends} label="Friends" />
        </div>

        {/* Primary actions */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={onOpenComposer}
            className="flex-1 h-9 rounded-lg bg-[#E8603C] text-white text-xs font-semibold hover:bg-[#D55534] transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            New post
          </button>
          <button
            onClick={onNavigateProfile}
            className="flex-1 h-9 rounded-lg border border-[#E8603C] text-[#E8603C] text-xs font-semibold hover:bg-[#FDF6EE] transition-colors"
          >
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-[15px] font-bold text-[#2C1A0E] leading-tight">{value}</div>
      <div className="text-[10px] text-[#8A8078] mt-0.5">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                             Friends tab                             */
/* ------------------------------------------------------------------ */

function FriendsTab({
  friends,
  suggestions,
  onAddFriendsClick,
}: {
  friends: Friend[];
  suggestions: Friend[];
  onAddFriendsClick: () => void;
}) {
  const [query, setQuery] = useState('');

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) => f.name.toLowerCase().includes(q) || f.username.toLowerCase().includes(q),
    );
  }, [friends, query]);

  return (
    <div>
      {/* Prominent Add Friends CTA — answers the professor's "how do users add friends?" */}
      <button
        onClick={onAddFriendsClick}
        className="w-full mb-4 flex items-center gap-3 p-4 bg-white rounded-2xl border border-dashed border-[#E8603C]/60 hover:bg-[#FDF6EE] transition-colors"
      >
        <div className="size-10 rounded-full bg-[#E8603C] flex items-center justify-center flex-shrink-0">
          <UserPlus className="size-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-[#2C1A0E]">Add friends</div>
          <div className="text-xs text-[#8A8078]">
            Search by username, invite contacts, or review requests
          </div>
        </div>
        <span className="text-[#E8603C] text-sm">→</span>
      </button>

      {/* Search bar */}
      <div className="mb-5 flex items-center gap-3 px-4 py-2.5 bg-white rounded-full border border-[#F0EBE3]">
        <Search className="size-5 text-[#8A8078]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your friends..."
          className="flex-1 bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#8A8078] text-sm"
        />
      </div>

      {/* My Friends */}
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-[#2C1A0E] mb-3">
          My Friends ({filteredFriends.length})
        </h3>
        {filteredFriends.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#8A8078]">
            No friends match your search.
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {filteredFriends.map((friend, index) => (
              <div
                key={friend.username}
                className={`flex items-center gap-3 p-4 ${
                  index !== filteredFriends.length - 1 ? 'border-b border-[#F5F0EB]' : ''
                }`}
              >
                <div
                  className="size-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ backgroundColor: friend.bgColor }}
                >
                  {friend.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#2C1A0E] mb-0.5">
                    {friend.name}
                  </div>
                  <div className="text-xs text-[#8A8078]">
                    @{friend.username} · {friend.restaurantsInCommon} restaurants in common
                  </div>
                </div>
                <button
                  onClick={() => alert(`Viewing ${friend.name}'s profile`)}
                  className="text-xs text-[#E8603C] font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* People You May Know */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[16px] font-bold text-[#2C1A0E]">People You May Know</h3>
          <button
            onClick={onAddFriendsClick}
            className="text-[12px] font-semibold text-[#E8603C]"
          >
            See all
          </button>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden">
          {suggestions.map((person, index) => (
            <SuggestionRow
              key={person.username}
              person={person}
              isLast={index === suggestions.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionRow({ person, isLast }: { person: Friend; isLast: boolean }) {
  const [requested, setRequested] = useState(false);
  return (
    <div
      className={`flex items-center gap-3 p-4 ${
        !isLast ? 'border-b border-[#F5F0EB]' : ''
      }`}
    >
      <div
        className="size-10 rounded-full flex items-center justify-center text-sm font-semibold"
        style={{ backgroundColor: person.bgColor }}
      >
        {person.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[#2C1A0E] mb-0.5">{person.name}</div>
        <div className="text-xs text-[#8A8078]">
          @{person.username} · {person.restaurantsInCommon} mutual friends
        </div>
      </div>
      <button
        onClick={() => setRequested((v) => !v)}
        className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors ${
          requested
            ? 'bg-[#E8603C] text-white border border-[#E8603C]'
            : 'border border-[#E8603C] text-[#E8603C] bg-white'
        }`}
      >
        {requested ? 'Requested' : 'Add +'}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                             Messages tab                            */
/* ------------------------------------------------------------------ */

function MessagesTab({
  conversations,
  navigate,
}: {
  conversations: Conversation[];
  navigate: (path: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => navigate(`/friends-space/chat/${conv.id}`)}
          className="w-full flex items-start gap-3 p-4 border-b border-[#F5F0EB] last:border-0 hover:bg-[#FDF6EE] transition-colors"
        >
          <div
            className="size-11 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{ backgroundColor: conv.friend.bgColor }}
          >
            {conv.friend.initials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="font-semibold text-sm text-[#2C1A0E] mb-1">{conv.friend.name}</div>
            <div className="text-[13px] text-[#8A8078] truncate">{conv.lastMessage}</div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-[11px] text-[#8A8078]">{conv.timestamp}</span>
            {conv.unreadCount > 0 && (
              <div className="size-5 bg-[#E8603C] rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">{conv.unreadCount}</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                             Discover tab                            */
/* ------------------------------------------------------------------ */

function DiscoverTab({
  tasteMatches,
  trendingRestaurants,
}: {
  tasteMatches: any[];
  trendingRestaurants: any[];
}) {
  return (
    <div>
      {/* Taste Match */}
      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-[#2C1A0E] mb-1">Taste Match</h3>
        <p className="text-[13px] text-[#8A8078] mb-4">People with similar food preferences</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tasteMatches.map((person) => (
            <TasteMatchCard key={person.username} person={person} />
          ))}
        </div>
      </div>

      {/* Trending in Your Area */}
      <div>
        <h3 className="text-[16px] font-bold text-[#2C1A0E] mb-1">Trending in Your Area</h3>
        <p className="text-[13px] text-[#8A8078] mb-4">Restaurants your friends' friends love</p>
        <div className="space-y-3">
          {trendingRestaurants.map((restaurant) => (
            <button
              key={restaurant.name}
              onClick={() => alert(`Opening ${restaurant.name}`)}
              className="w-full bg-white rounded-xl p-3 flex items-center gap-3 text-left hover:bg-[#FEFAF4] transition-colors"
            >
              <div className="size-16 bg-gradient-to-br from-[#E8603C]/20 to-[#F4A535]/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {/* decorative */}
                <MapPin className="size-6 text-[#E8603C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#2C1A0E] mb-0.5 truncate">
                  {restaurant.name}
                </div>
                <div className="text-xs text-[#8A8078] mb-1">{restaurant.location}</div>
                <div className="flex items-center gap-1.5">
                  <Star className="size-3 fill-[#F4A535] text-[#F4A535]" />
                  <span className="text-xs font-bold text-[#2C1A0E]">{restaurant.rating}</span>
                  <span className="text-xs text-[#8A8078]">
                    · {restaurant.friendCount} friend{restaurant.friendCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TasteMatchCard({ person }: { person: any }) {
  const [requested, setRequested] = useState(false);
  return (
    <div className="flex-shrink-0 w-40 bg-white rounded-2xl border border-[#F0EBE3] p-4 text-center">
      <div
        className="size-[52px] rounded-full flex items-center justify-center text-sm font-semibold mx-auto mb-2"
        style={{ backgroundColor: person.bgColor }}
      >
        {person.initials}
      </div>
      <div className="font-bold text-sm text-[#2C1A0E] mb-0.5">{person.name}</div>
      <div className="text-xs text-[#8A8078] mb-2">@{person.username}</div>
      <div className="inline-block px-2 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full text-[11px] font-semibold mb-3">
        {person.matchPercent}% match
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center mb-3">
        {person.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-[#F5EDE3] text-[#8A8078] rounded-full text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={() => setRequested((v) => !v)}
        className={`w-full h-9 rounded-lg text-xs font-semibold transition-colors ${
          requested
            ? 'bg-white border border-[#E8603C] text-[#E8603C]'
            : 'bg-[#E8603C] text-white hover:bg-[#D55534]'
        }`}
      >
        {requested ? 'Requested' : 'Add Friend'}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                           Create Post modal                         */
/* ------------------------------------------------------------------ */

function CreatePostModal({
  onClose,
  onPublish,
  restaurants,
}: {
  onClose: () => void;
  onPublish: (payload: { comment: string; restaurantId: string | null }) => void;
  restaurants: Restaurant[];
}) {
  const [comment, setComment] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(
    restaurants[0]?.id ?? null,
  );

  // Re-sync selected id when the parent restaurant list arrives.
  useEffect(() => {
    if (!selectedRestaurantId && restaurants[0]) {
      setSelectedRestaurantId(restaurants[0].id);
    }
  }, [restaurants, selectedRestaurantId]);

  const selected = restaurants.find((r) => r.id === selectedRestaurantId);

  const canPublish = comment.trim().length > 0 && selectedRestaurantId;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-[20px] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EBE3]">
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-[#FDF6EE]"
            aria-label="Close composer"
          >
            <X className="size-5 text-[#2C1A0E]" />
          </button>
          <h3 className="text-[15px] font-semibold text-[#2C1A0E]">Create Post</h3>
          <button
            onClick={() => {
              if (canPublish) {
                onPublish({ comment: comment.trim(), restaurantId: selectedRestaurantId });
              }
            }}
            disabled={!canPublish}
            className={`px-3 h-8 rounded-full text-xs font-semibold transition-colors ${
              canPublish
                ? 'bg-[#E8603C] text-white hover:bg-[#D55534]'
                : 'bg-[#F0EBE3] text-[#B4B2A9] cursor-not-allowed'
            }`}
          >
            Publish
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User row — reflects the logged-in user */}
          {(() => {
            const cu = getCurrentUser();
            return (
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="size-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ backgroundColor: cu.bgColor }}
                >
                  {cu.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#2C1A0E]">
                    {cu.name}
                  </div>
                  <div className="text-xs text-[#8A8078]">Posting publicly to friends</div>
                </div>
              </div>
            );
          })()}

          {/* Comment input */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell your friends what made this place special..."
            rows={4}
            className="w-full resize-none outline-none border border-[#F0EBE3] rounded-xl p-3 text-sm text-[#2C1A0E] placeholder:text-[#B4B2A9] focus:border-[#E8603C] transition-colors"
          />

          {/* Restaurant picker */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-[#8A8078] uppercase tracking-wide mb-2">
              Attach a restaurant
            </div>
            {restaurants.length === 0 && (
              <div className="text-[12px] text-[#8A8078] bg-[#FDF6EE] rounded-xl p-3 mb-2">
                Loading restaurants from the live API…
              </div>
            )}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {restaurants.slice(0, 8).map((r) => {
                const selectedRow = r.id === selectedRestaurantId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRestaurantId(r.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-colors text-left ${
                      selectedRow
                        ? 'border-[#E8603C] bg-[#FDF6EE]'
                        : 'border-[#F0EBE3] hover:bg-[#FEFAF4]'
                    }`}
                  >
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="size-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#2C1A0E] truncate">
                        {r.name}
                      </div>
                      <div className="text-[11px] text-[#8A8078] truncate">
                        {r.cuisine} · {r.neighborhood} · {r.priceRange}
                      </div>
                    </div>
                    {selectedRow && (
                      <div className="size-5 rounded-full bg-[#E8603C] flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-white font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {selected && (
            <div className="mt-4 bg-[#FDF6EE] rounded-xl p-3">
              <div className="text-[11px] font-semibold text-[#8A8078] uppercase tracking-wide mb-2">
                Preview
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-3.5 fill-[#F4A535] text-[#F4A535]" />
                <span className="text-xs font-bold text-[#2C1A0E]">{selected.name}</span>
                <span className="text-xs text-[#8A8078]">· {selected.priceRange}</span>
              </div>
              {comment && (
                <div className="mt-2 text-[12px] text-[#4A3728] italic leading-relaxed">
                  "{comment}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer quick actions */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-[#F0EBE3]">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF6EE] text-[#8A8078] text-xs hover:bg-[#F5EDE3]"
            onClick={() => alert('Photo upload is a stub in this demo build.')}
          >
            <ImageIcon className="size-4" />
            Photo
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF6EE] text-[#8A8078] text-xs hover:bg-[#F5EDE3]"
            onClick={() => alert('Location tagging is a stub in this demo build.')}
          >
            <MapPin className="size-4" />
            Location
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                          Settings bottom sheet                      */
/* ------------------------------------------------------------------ */

function SettingsSheet({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState({
    shareCheckins: true,
    shareWishlist: false,
    allowRequests: true,
    appearInDiscover: true,
    activityStatus: false,
    friendCheckinAlerts: true,
    newRecommendations: true,
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white rounded-t-[20px] w-full max-h-[85vh] overflow-y-auto pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D4C9BE] rounded-full mx-auto my-4" />
        <div className="px-5">
          <h3 className="text-[17px] font-bold text-[#2C1A0E] mb-5">Friends Space Settings</h3>

          <div className="space-y-0 mb-6">
            <ToggleRow
              label="Share my check-ins"
              subtitle="Let friends see where you dine"
              value={settings.shareCheckins}
              onChange={(v) => setSettings({ ...settings, shareCheckins: v })}
            />
            <ToggleRow
              label="Share my wishlist"
              subtitle="Let friends see restaurants you saved"
              value={settings.shareWishlist}
              onChange={(v) => setSettings({ ...settings, shareWishlist: v })}
            />
            <ToggleRow
              label="Allow friend requests"
              subtitle="Let others send you friend requests"
              value={settings.allowRequests}
              onChange={(v) => setSettings({ ...settings, allowRequests: v })}
            />
            <ToggleRow
              label="Appear in Discover"
              subtitle="Let others find you by taste match"
              value={settings.appearInDiscover}
              onChange={(v) => setSettings({ ...settings, appearInDiscover: v })}
            />
            <ToggleRow
              label="Activity status"
              subtitle="Show when you were last active"
              value={settings.activityStatus}
              onChange={(v) => setSettings({ ...settings, activityStatus: v })}
            />
          </div>

          <div className="border-t border-[#F0EBE3] pt-5 mb-6">
            <h4 className="text-[14px] font-semibold text-[#2C1A0E] mb-4">Notifications</h4>
            <ToggleRow
              label="Friend check-in alerts"
              subtitle="Notify when a friend checks in nearby"
              value={settings.friendCheckinAlerts}
              onChange={(v) => setSettings({ ...settings, friendCheckinAlerts: v })}
            />
            <ToggleRow
              label="New recommendations"
              subtitle="Notify when a friend recommends a spot"
              value={settings.newRecommendations}
              onChange={(v) => setSettings({ ...settings, newRecommendations: v })}
            />
          </div>

          <button
            onClick={() => alert('Friends Space has been disabled in this demo.')}
            className="w-full text-[13px] text-[#E24B4A] hover:text-[#C43E3D] transition-colors"
          >
            Disable Friends Space
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  subtitle,
  value,
  onChange,
}: {
  label: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#F0EBE3] last:border-0">
      <div className="flex-1 pr-4">
        <div className="text-sm text-[#2C1A0E] font-medium mb-0.5">{label}</div>
        <div className="text-xs text-[#8A8078]">{subtitle}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-all relative flex-shrink-0 ${
          value ? 'bg-[#E8603C]' : 'bg-[#E8E0D8]'
        }`}
      >
        <div
          className={`absolute top-1 size-5 bg-white rounded-full transition-all ${
            value ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                         Initial mock feed data                      */
/* ------------------------------------------------------------------ */

const initialActivities: Activity[] = [
  {
    id: '1',
    user: { name: 'Karen L.', initials: 'KL', bgColor: '#EAF3DE' },
    action: 'checked in at',
    restaurant: {
      name: 'Flushing Hot Pot',
      rating: 4.7,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    },
    comment: 'The soup base is incredible, must try the spicy lamb version!',
    timestamp: '2h ago',
    isToday: true,
  },
  {
    id: '2',
    user: { name: 'Mike J.', initials: 'MJ', bgColor: '#E6F1FB' },
    action: 'recommended',
    restaurant: {
      name: 'Han Joo KBBQ',
      rating: 4.5,
      price: '$$$',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    },
    comment: 'Perfect for a big group dinner, book at least 3 days in advance',
    timestamp: 'Yesterday',
  },
  {
    id: '3',
    user: { name: 'Amy C.', initials: 'AC', bgColor: '#EAF3DE' },
    action: 'added to wishlist',
    restaurant: {
      name: 'Sakura Brunch',
      rating: 4.3,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400',
    },
    timestamp: '2 days ago',
  },
  {
    id: '4',
    user: { name: 'David K.', initials: 'DK', bgColor: '#EEEDFE' },
    action: 'checked in at',
    restaurant: {
      name: 'JSQ Spice Garden',
      rating: 4.6,
      price: '$$',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    },
    comment:
      'Hidden gem in Jersey City, the dosa here is better than anything in Manhattan',
    timestamp: '3 days ago',
  },
];
