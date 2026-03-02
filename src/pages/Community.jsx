import { useState, useEffect } from "react";

import { Users, Heart, MessageSquare, Share2, Globe, Camera, Loader2, Search } from "lucide-react";

const COMMUNITY_POSTS = [
  { id: 1, author: "Sofia M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", location: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80", caption: "Lost in the bamboo groves of Arashiyama at golden hour. Nothing can prepare you for this magic ✨", likes: 1247, comments: 89, time: "2 hours ago", tags: ["kyoto", "japan", "bamboogrove", "goldenHour"] },
  { id: 2, author: "Luca R.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", location: "Amalfi Coast, Italy", image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80", caption: "Positano sunrise with a strong espresso. This is what living feels like ☀️🇮🇹", likes: 892, comments: 54, time: "5 hours ago", tags: ["amalfi", "italy", "sunrise", "positano"] },
  { id: 3, author: "Amara K.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80", location: "Serengeti, Tanzania", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80", caption: "Day 3 of my Serengeti safari. The migration is happening RIGHT NOW. Truly humbling 🦁🌅", likes: 3421, comments: 247, time: "1 day ago", tags: ["safari", "serengeti", "wildlife", "africa"] },
  { id: 4, author: "James O.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", location: "Santorini, Greece", image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80", caption: "The iconic blue domes of Oia at dusk. No filter needed — nature does it better 💙", likes: 5678, comments: 312, time: "2 days ago", tags: ["santorini", "greece", "oia", "travel"] },
  { id: 5, author: "Maya L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", location: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", caption: "Sunrise at Mount Batur volcano. Woke up at 2am for this — 100% worth it 🌋", likes: 2103, comments: 178, time: "3 days ago", tags: ["bali", "volcano", "sunrise", "indonesia"] },
  { id: 6, author: "Chen W.", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80", location: "Patagonia, Argentina", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80", caption: "Torres del Paine: where the land meets the sky. Every step here feels like you're on another planet 🏔️", likes: 4892, comments: 201, time: "4 days ago", tags: ["patagonia", "hiking", "argentina", "torres"] },
];

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="rounded-3xl overflow-hidden card-glass">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{post.author}</p>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" style={{ color: "var(--accent)" }} />
              <span className="text-xs" style={{ color: "var(--accent)" }}>{post.location}</span>
            </div>
          </div>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.time}</span>
      </div>

      {/* Image */}
      <div className="relative">
        <img src={post.image} alt={post.location} className="w-full h-72 object-cover" />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => setLiked(!liked)}
            className="flex items-center gap-1.5 transition-all"
            style={{ color: liked ? "#e05050" : "var(--text-secondary)" }}>
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{post.likes + (liked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="ml-auto" style={{ color: "var(--text-secondary)" }}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-primary)" }}>
          <span className="font-semibold">{post.author}</span>{" "}{post.caption}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity"
              style={{ color: "var(--accent-2)" }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function JournalPreview({ entry }) {
  return (
    <div className="p-5 rounded-2xl card-glass hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        {entry.cover_image && (
          <img src={entry.cover_image} alt={entry.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1 truncate" style={{ color: "var(--text-primary)" }}>{entry.title}</h4>
          <p className="text-xs mb-1" style={{ color: "var(--accent)" }}>{entry.destination_name}</p>
          <p className="text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }}>{entry.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Heart className="w-3 h-3" /> {entry.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    base44.entities.TravelJournal.filter({ is_public: true }, "-created_date", 10).then(data => {
      setJournals(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="py-16 px-6" style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>Traveler Community</span>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Travel Together</h1>
          <p style={{ color: "var(--text-secondary)" }}>Discover stories, share adventures, and connect with explorers worldwide</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8 justify-center">
          {[
            { key: "feed", label: "Explore Feed" },
            { key: "journals", label: "Travel Journals" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.key ? "var(--accent)" : "var(--bg-card)",
                color: activeTab === tab.key ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border-color)"
              }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "feed" ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {COMMUNITY_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
              </div>
            ) : journals.length === 0 ? (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>No public journals yet</h3>
                <p style={{ color: "var(--text-secondary)" }}>Be the first to share your travel story!</p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {journals.map(entry => (
                  <JournalPreview key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}