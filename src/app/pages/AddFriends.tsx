import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, UserPlus, Check, X, QrCode } from 'lucide-react';

/* =========================================================================
 *  Add Friends page
 *  Accessed from the UserPlus icon in Friends Space, and from the
 *  prominent "Add friends" CTA inside the Friends tab.
 *
 *  Three sub-tabs:
 *    - Search: type a username / name to find users
 *    - Suggestions: people you may know
 *    - Requests: incoming and outgoing friend requests
 * ========================================================================= */

type AddTab = 'Search' | 'Suggestions' | 'Requests';

interface Candidate {
  id: string;
  name: string;
  username: string;
  initials: string;
  bgColor: string;
  mutualFriends: number;
  bio?: string;
}

interface RequestItem {
  id: string;
  name: string;
  username: string;
  initials: string;
  bgColor: string;
  mutualFriends: number;
  direction: 'incoming' | 'outgoing';
}

export function AddFriends() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AddTab>('Search');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const searchable: Candidate[] = [
    { id: 'u1', name: 'Sarah M.', username: 'sarahm', initials: 'SM', bgColor: '#FAECE7', mutualFriends: 4, bio: 'Hot pot enthusiast · NYC' },
    { id: 'u2', name: 'James L.', username: 'jamesl', initials: 'JL', bgColor: '#E6F1FB', mutualFriends: 2, bio: 'Ramen & sushi lover' },
    { id: 'u3', name: 'Lisa W.', username: 'lisaw', initials: 'LW', bgColor: '#EAF3DE', mutualFriends: 6, bio: 'Always hunting for hidden gems' },
    { id: 'u4', name: 'Alex P.', username: 'alexp', initials: 'AP', bgColor: '#EEEDFE', mutualFriends: 1, bio: 'Brunch > dinner' },
    { id: 'u5', name: 'Nina R.', username: 'ninar', initials: 'NR', bgColor: '#FAECE7', mutualFriends: 0, bio: 'Coffee shop regular' },
  ];

  const suggestions: Candidate[] = [
    { id: 's1', name: 'Jenny W.', username: 'jennyw', initials: 'JW', bgColor: '#E6F1FB', mutualFriends: 2, bio: 'Dim sum expert' },
    { id: 's2', name: 'Tom H.', username: 'tomh', initials: 'TH', bgColor: '#EEEDFE', mutualFriends: 5, bio: 'Koreatown local' },
    { id: 's3', name: 'Emma S.', username: 'emmas', initials: 'ES', bgColor: '#EAF3DE', mutualFriends: 3, bio: 'Boba tea explorer' },
  ];

  const initialRequests: RequestItem[] = [
    { id: 'r1', name: 'Chris Z.', username: 'chrisz', initials: 'CZ', bgColor: '#EAF3DE', mutualFriends: 3, direction: 'incoming' },
    { id: 'r2', name: 'Kelly T.', username: 'kellyt', initials: 'KT', bgColor: '#E6F1FB', mutualFriends: 1, direction: 'incoming' },
    { id: 'r3', name: 'Ryan B.', username: 'ryanb', initials: 'RB', bgColor: '#FAECE7', mutualFriends: 0, direction: 'outgoing' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-16">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#F0EBE3]">
        <div className="h-[52px] px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-1"
            aria-label="Back"
          >
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#2C1A0E]">Add Friends</h1>
          <button
            onClick={() => alert('Show your QR code to a friend to connect instantly.')}
            className="p-1"
            aria-label="Show my QR code"
          >
            <QrCode className="size-5 text-[#E8603C]" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="h-11 bg-[#FDF6EE] px-2 flex items-center gap-2">
          {(['Search', 'Suggestions', 'Requests'] as AddTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 h-8 rounded-full text-[13px] font-medium transition-all ${
                tab === t
                  ? 'bg-white text-[#E8603C] font-semibold shadow-sm'
                  : 'text-[#8A8078]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {tab === 'Search' && <SearchTab candidates={searchable} />}
        {tab === 'Suggestions' && <SuggestionsTab candidates={suggestions} />}
        {tab === 'Requests' && <RequestsTab initialRequests={initialRequests} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                             Search tab                              */
/* ------------------------------------------------------------------ */

function SearchTab({ candidates }: { candidates: Candidate[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q),
    );
  }, [candidates, query]);

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-full border border-[#F0EBE3] mb-4">
        <Search className="size-5 text-[#8A8078]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or @username..."
          className="flex-1 bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#8A8078] text-sm"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search">
            <X className="size-4 text-[#8A8078]" />
          </button>
        )}
      </div>

      {!query && (
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="size-12 rounded-full bg-[#FDF6EE] flex items-center justify-center mx-auto mb-3">
            <Search className="size-5 text-[#E8603C]" />
          </div>
          <p className="text-sm font-semibold text-[#2C1A0E] mb-1">Find your friends</p>
          <p className="text-xs text-[#8A8078] leading-relaxed">
            Type a name or @username to find someone. Or check Suggestions for
            people you might know.
          </p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#8A8078]">
          No users matched "{query}".
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-2xl overflow-hidden">
          {results.map((c, i) => (
            <CandidateRow
              key={c.id}
              candidate={c}
              isLast={i === results.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                          Suggestions tab                            */
/* ------------------------------------------------------------------ */

function SuggestionsTab({ candidates }: { candidates: Candidate[] }) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-[15px] font-bold text-[#2C1A0E] mb-1">People You May Know</h2>
        <p className="text-xs text-[#8A8078]">
          Based on mutual friends and shared taste
        </p>
      </div>
      <div className="bg-white rounded-2xl overflow-hidden">
        {candidates.map((c, i) => (
          <CandidateRow
            key={c.id}
            candidate={c}
            isLast={i === candidates.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                             Requests tab                            */
/* ------------------------------------------------------------------ */

function RequestsTab({ initialRequests }: { initialRequests: RequestItem[] }) {
  const [requests, setRequests] = useState(initialRequests);

  const incoming = requests.filter((r) => r.direction === 'incoming');
  const outgoing = requests.filter((r) => r.direction === 'outgoing');

  const accept = (id: string) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));
  const decline = (id: string) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));
  const cancel = (id: string) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-[15px] font-bold text-[#2C1A0E] mb-3">
          Incoming ({incoming.length})
        </h2>
        {incoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#8A8078]">
            No new friend requests right now.
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {incoming.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-4 ${
                  i !== incoming.length - 1 ? 'border-b border-[#F5F0EB]' : ''
                }`}
              >
                <Avatar initials={r.initials} bgColor={r.bgColor} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#2C1A0E]">
                    {r.name}
                  </div>
                  <div className="text-xs text-[#8A8078]">
                    @{r.username} · {r.mutualFriends} mutual
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => accept(r.id)}
                    className="size-8 rounded-full bg-[#E8603C] flex items-center justify-center hover:bg-[#D55534]"
                    aria-label="Accept request"
                  >
                    <Check className="size-4 text-white" strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => decline(r.id)}
                    className="size-8 rounded-full border border-[#F0EBE3] flex items-center justify-center hover:bg-[#FDF6EE]"
                    aria-label="Decline request"
                  >
                    <X className="size-4 text-[#8A8078]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-[15px] font-bold text-[#2C1A0E] mb-3">
          Sent ({outgoing.length})
        </h2>
        {outgoing.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#8A8078]">
            You haven't sent any pending requests.
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {outgoing.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-4 ${
                  i !== outgoing.length - 1 ? 'border-b border-[#F5F0EB]' : ''
                }`}
              >
                <Avatar initials={r.initials} bgColor={r.bgColor} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#2C1A0E]">
                    {r.name}
                  </div>
                  <div className="text-xs text-[#8A8078]">
                    @{r.username} · {r.mutualFriends} mutual
                  </div>
                </div>
                <button
                  onClick={() => cancel(r.id)}
                  className="px-3 py-1.5 rounded-full border border-[#F0EBE3] text-[#8A8078] text-xs hover:bg-[#FDF6EE]"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                             Shared rows                             */
/* ------------------------------------------------------------------ */

function CandidateRow({
  candidate,
  isLast,
}: {
  candidate: Candidate;
  isLast: boolean;
}) {
  const [requested, setRequested] = useState(false);
  return (
    <div
      className={`flex items-center gap-3 p-4 ${
        !isLast ? 'border-b border-[#F5F0EB]' : ''
      }`}
    >
      <Avatar initials={candidate.initials} bgColor={candidate.bgColor} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[#2C1A0E]">{candidate.name}</div>
        <div className="text-xs text-[#8A8078] truncate">
          @{candidate.username}
          {candidate.mutualFriends > 0 && ` · ${candidate.mutualFriends} mutual`}
        </div>
        {candidate.bio && (
          <div className="text-[11px] text-[#B4B2A9] truncate mt-0.5">
            {candidate.bio}
          </div>
        )}
      </div>
      <button
        onClick={() => setRequested((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
          requested
            ? 'bg-[#E8603C] text-white'
            : 'border border-[#E8603C] text-[#E8603C]'
        }`}
      >
        {requested ? (
          <>
            <Check className="size-3.5" strokeWidth={3} />
            Requested
          </>
        ) : (
          <>
            <UserPlus className="size-3.5" />
            Add
          </>
        )}
      </button>
    </div>
  );
}

function Avatar({ initials, bgColor }: { initials: string; bgColor: string }) {
  return (
    <div
      className="size-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
