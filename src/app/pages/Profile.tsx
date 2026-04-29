import { ChevronRight, Ticket, IceCream, Star, Gift, Utensils, Camera, MapPin, ThumbsUp, Users, Trophy, Crown, Lock, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getUser, clearUser, initialsFromName } from '../lib/auth';
import { getTheme } from '../lib/theme';

const INITIAL_POINTS = 1240;
const NEXT_REWARD_TARGET = 2000;

export function Profile() {
  const navigate = useNavigate();
  const user = getUser();
  const theme = getTheme(user?.school ?? 'guest');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Display name + initials based on actual logged-in user.
  const displayName = user?.name ?? 'Guest';
  const initials = initialsFromName(displayName);
  const username = user?.email?.split('@')[0] ?? 'guest';

  // ---- Rewards state ----
  // Tracks the user's running point balance (decreases as they redeem),
  // which rewards have already been redeemed (won't be clickable twice),
  // and the current toast message shown at the top of the screen.
  const [points, setPoints] = useState<number>(INITIAL_POINTS);
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  // Show a top toast that auto-hides after 1.5s.
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => {
      // Only clear if a newer toast hasn't replaced this one already.
      setToast((current) => (current === message ? null : current));
    }, 1500);
  };

  // Try to redeem a reward. No-op if already redeemed or insufficient points.
  const redeem = (id: string, cost: number, title: string) => {
    if (redeemedIds.has(id)) return;
    if (points < cost) return;
    setPoints((p) => p - cost);
    setRedeemedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    showToast(`Redemption successful — ${title}`);
  };

  // % progress toward the next reward tier. Capped at 100.
  const progressPct = Math.min(100, Math.round((points / NEXT_REWARD_TARGET) * 100));

  const handleLogout = () => {
    if (confirm('Sign out of NumNum?')) {
      clearUser();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-20">
      {toast && <RedemptionToast message={toast} />}
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-[#F0EBE3]">
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div
            className="size-16 sm:size-20 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-[#2C1A0E] mb-1 truncate">
              {displayName}
            </h1>
            <p className="text-[12px] sm:text-sm text-[#8A8078] truncate">
              @{username}
              {user?.school && user.school !== 'guest' && (
                <span
                  className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  {theme.label}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="size-9 rounded-full border border-[#E0D8D0] flex items-center justify-center hover:bg-[#FDF6EE] transition-colors flex-shrink-0"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-4 text-[#8A8078]" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-lg font-bold text-[#2C1A0E]">124</div>
            <div className="text-xs text-[#8A8078]">Check-ins</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#2C1A0E]">38</div>
            <div className="text-xs text-[#8A8078]">Reviews</div>
          </div>
          {/* "52 Saved" is clickable — jumps to the My Lists detail page. */}
          <button
            type="button"
            onClick={() => navigate('/lists')}
            className="text-left rounded-md -mx-1 px-1 py-0.5 hover:bg-[#FDF6EE] active:bg-[#FAECE7] transition-colors group"
            aria-label="View saved restaurants"
          >
            <div className="text-lg font-bold text-[#2C1A0E] group-hover:text-[#E8603C] transition-colors">
              52
            </div>
            <div className="text-xs text-[#8A8078] flex items-center gap-0.5">
              Saved
              <ChevronRight className="size-3 -mr-1 opacity-60 group-hover:opacity-100 group-hover:text-[#E8603C] transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Points & Rewards */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl p-4 border border-[#F0EBE3]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-[#2C1A0E]">Points & Rewards</h2>
            <button className="h-7 px-3.5 bg-[#E8603C] text-white rounded-full text-xs font-semibold hover:bg-[#D55534] transition-colors">
              Redeem
            </button>
          </div>

          {/* Points Balance with Circular Progress */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[28px] font-bold text-[#E8603C] leading-none mb-1">
                {points.toLocaleString()}
              </div>
              <div className="text-xs text-[#8A8078]">points earned</div>
            </div>
            <div className="flex flex-col items-center">
              <svg width="56" height="56" className="mb-1">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#F0EBE3"
                  strokeWidth="4"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#E8603C"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 24 * (progressPct / 100)} ${2 * Math.PI * 24}`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                />
                <text
                  x="28"
                  y="32"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#E8603C"
                >
                  {progressPct}%
                </text>
              </svg>
              <div className="text-[11px] text-[#8A8078]">to next reward</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-1.5 bg-[#F0EBE3] rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-[#E8603C] rounded-full transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#8A8078]">
              <span>{points.toLocaleString()} pts</span>
              <span>{NEXT_REWARD_TARGET.toLocaleString()} pts</span>
            </div>
          </div>

          {/* Available Rewards */}
          <div className="mt-4">
            <h3 className="text-[13px] font-semibold text-[#2C1A0E] mb-2">Available Rewards</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: 'coupon-10',       icon: Ticket,   title: '10% Off Coupon',   cost: 500  },
                { id: 'free-dessert',    icon: IceCream, title: 'Free Dessert',     cost: 800  },
                { id: 'priority-booking',icon: Star,     title: 'Priority Booking', cost: 1200 },
                { id: 'credit-50',       icon: Gift,     title: '$50 Credit',       cost: 2000 },
              ].map((r) => {
                const isRedeemed = redeemedIds.has(r.id);
                const canAfford  = points >= r.cost;
                return (
                  <RewardCard
                    key={r.id}
                    icon={r.icon}
                    title={r.title}
                    cost={r.cost}
                    canAfford={canAfford}
                    isRedeemed={isRedeemed}
                    onRedeem={() => redeem(r.id, r.cost, r.title)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl p-4 border border-[#F0EBE3]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-[#2C1A0E]">Achievements</h2>
            <button className="text-[13px] text-[#E8603C] font-medium">See All</button>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <BadgeItem
              icon={Utensils}
              title="First Review"
              earned
              bgColor="#E8603C"
              onClick={() =>
                navigate('/friends-space', { state: { injectFirstReview: true } })
              }
            />
            <BadgeItem icon={Camera} title="Photo Pro" earned bgColor="#1D9E75" />
            <BadgeItem
              icon={MapPin}
              title="Explorer"
              earned
              bgColor="#185FA5"
              onClick={() => navigate('/map')}
            />
            <BadgeItem icon={ThumbsUp} title="Trusted Voice" earned bgColor="#BA7517" />
            <BadgeItem icon={Star} title="Top Reviewer" />
            <BadgeItem icon={Users} title="Social Butterfly" />
            <BadgeItem icon={Trophy} title="NYC Expert" />
            <BadgeItem icon={Crown} title="Elite Member" />
          </div>

          {/* Next Badge Progress */}
          <div className="flex items-center gap-2 bg-[#FDF6EE] rounded-lg p-2 mt-3">
            <div className="w-0.5 h-8 bg-[#E8603C] rounded-full" />
            <p className="text-xs text-[#8A8078] flex-1">
              Next: <span className="font-medium text-[#2C1A0E]">Top Reviewer</span> — write 8 more reviews
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white px-4 py-3 mt-6 border-t border-[#F0EBE3]">
        <MenuItem label="My Lists" onClick={() => navigate('/lists')} />
        <MenuItem label="Language" value="English" onClick={() => navigate('/language-settings')} />
        <MenuItem label="Dietary Preferences" />
        <MenuItem label="Preferred Neighborhoods" />
        <MenuItem label="Notification Settings" />
        <MenuItem label="Privacy Settings" />
      </div>
    </div>
  );
}

/* RewardCard
 * - canAfford   : the user has enough points right now
 * - isRedeemed  : already redeemed in this session
 * - locked      : derived (cannot afford OR already redeemed) → grayed out
 *
 * The card is rendered as a real <button> only when actionable. Locked
 * cards are rendered as a non-interactive <div> so they swallow no clicks.
 * Card height bumped to h-24 + extra padding so the price chip has
 * breathing room from the icon/title block.
 */
function RewardCard({
  icon: Icon,
  title,
  cost,
  canAfford,
  isRedeemed,
  onRedeem,
}: {
  icon: any;
  title: string;
  cost: number;
  canAfford: boolean;
  isRedeemed: boolean;
  onRedeem: () => void;
}) {
  const locked = !canAfford || isRedeemed;
  const baseClasses =
    'flex-shrink-0 w-[120px] h-24 rounded-xl border border-[#F0EBE3] bg-white px-2.5 pt-2.5 pb-2 flex flex-col items-center justify-between text-center';

  const innerContent = (
    <>
      <Icon className={`size-6 flex-shrink-0 ${locked ? 'text-[#B4B2A9]' : 'text-[#E8603C]'}`} />
      <p
        className={`text-xs font-semibold leading-tight line-clamp-2 overflow-hidden ${
          locked ? 'text-[#B4B2A9]' : 'text-[#2C1A0E]'
        }`}
      >
        {title}
      </p>
      <span
        // mt-1.5 gives breathing room between the title text and the price chip.
        className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
          isRedeemed
            ? 'bg-[#EAF3DE] text-[#27500A]'
            : !canAfford
              ? 'bg-[#F0EBE3] text-[#B4B2A9]'
              : 'bg-[#FAEEDA] text-[#633806]'
        }`}
      >
        {isRedeemed ? 'Redeemed' : `${cost} pts`}
      </span>
    </>
  );

  if (locked) {
    return (
      <div
        className={`${baseClasses} ${isRedeemed ? 'opacity-80' : 'opacity-45'} cursor-default`}
        aria-disabled
      >
        {innerContent}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onRedeem}
      className={`${baseClasses} hover:border-[#E8603C]/40 hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer`}
      aria-label={`Redeem ${title} for ${cost} points`}
    >
      {innerContent}
    </button>
  );
}

/* RedemptionToast — pill toast that floats at the top of the screen for
 * 1.5 s. Position: fixed top-center, above the chat bubble + bottom nav. */
function RedemptionToast({ message }: { message: string }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-[#2D6A4F] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
        <CheckCircle2 className="size-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}

function BadgeItem({
  icon: Icon,
  title,
  earned,
  bgColor,
  onClick,
}: {
  icon: any;
  title: string;
  earned?: boolean;
  bgColor?: string;
  onClick?: () => void;
}) {
  // The badge tile is a real <button> when both `earned` and `onClick` are
  // present so it gets focus + hover + active states. Otherwise it's a
  // non-interactive <div>.
  const interactive = earned && onClick;
  const inner = (
    <>
      <div className="relative">
        <div
          className="size-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: earned ? bgColor : '#F0EBE3' }}
        >
          <Icon className={`size-5 ${earned ? 'text-white' : 'text-[#B4B2A9]'}`} />
        </div>
        {!earned && (
          <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-[#8A8078] rounded-full flex items-center justify-center">
            <Lock className="size-2.5 text-white" />
          </div>
        )}
      </div>
      <p
        className={`text-[11px] font-medium text-center leading-tight truncate w-full ${
          earned ? 'text-[#2C1A0E]' : 'text-[#B4B2A9]'
        }`}
      >
        {title}
      </p>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center gap-2 h-[72px] rounded-lg p-1 -m-1 hover:bg-[#FDF6EE] active:scale-95 transition-all"
        aria-label={`Open ${title}`}
      >
        {inner}
      </button>
    );
  }
  return <div className="flex flex-col items-center gap-2 h-[72px]">{inner}</div>;
}

function MenuItem({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 border-b border-[#2C1A0E]/5 last:border-0 hover:bg-[#FDF6EE]/50 transition-colors"
    >
      <span className="text-[#2C1A0E] font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-[#8A8078] text-sm">{value}</span>}
        <ChevronRight className="size-5 text-[#8A8078]" />
      </div>
    </button>
  );
}