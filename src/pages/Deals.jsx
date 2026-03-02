import { useState } from "react";
import { Tag, Plane, Hotel, Globe, Clock, Star, ArrowRight, Search, Zap } from "lucide-react";

const ALL_DEALS = [
  { id: 1, type: "flight", destination: "Bali, Indonesia", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", original: 1200, discounted: 699, expires: "2 days", badge: "🔥 Flash Deal", description: "Round-trip flight from NYC", rating: 4.9, reviews: 234 },
  { id: 2, type: "hotel", destination: "Santorini, Greece", country: "Greece", image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80", original: 350, discounted: 199, expires: "5 days", badge: "⭐ Best Value", description: "5-star cliffside resort per night", rating: 4.8, reviews: 189 },
  { id: 3, type: "package", destination: "Tokyo, Japan", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", original: 3200, discounted: 1999, expires: "1 week", badge: "🌟 Popular", description: "7-night all-inclusive package", rating: 4.9, reviews: 456 },
  { id: 4, type: "flight", destination: "Machu Picchu, Peru", country: "Peru", image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=600&q=80", original: 800, discounted: 499, expires: "3 days", badge: "💎 Premium", description: "Round-trip with layover in Lima", rating: 4.7, reviews: 127 },
  { id: 5, type: "package", destination: "Safari, Kenya", country: "Kenya", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80", original: 5500, discounted: 3299, expires: "10 days", badge: "🦁 Adventure", description: "10-day luxury safari experience", rating: 5.0, reviews: 88 },
  { id: 6, type: "hotel", destination: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", original: 800, discounted: 459, expires: "4 days", badge: "🌊 Exclusive", description: "Overwater bungalow per night", rating: 4.9, reviews: 312 },
  { id: 7, type: "flight", destination: "New York, USA", country: "USA", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", original: 600, discounted: 349, expires: "6 days", badge: "🗽 City Break", description: "Round-trip transatlantic flight", rating: 4.6, reviews: 543 },
  { id: 8, type: "package", destination: "Amalfi Coast, Italy", country: "Italy", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80", original: 2800, discounted: 1699, expires: "8 days", badge: "🍕 Culture", description: "5-night coastal villa package", rating: 4.8, reviews: 201 },
];

const TYPE_ICONS = { flight: Plane, hotel: Hotel, package: Globe };

export default function Deals() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");

  const filtered = ALL_DEALS.filter(d => {
    const matchSearch = !search || d.destination.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "all" || d.type === activeType;
    return matchSearch && matchType;
  });

  const savings = filtered.reduce((sum, d) => sum + (d.original - d.discounted), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <div className="relative overflow-hidden py-16 px-6" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold uppercase tracking-widest text-yellow-400">Limited Time Offers</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Exclusive Travel Deals</h1>
          <p className="text-white/70 mb-8">Hand-picked discounts on flights, hotels, and packages. Save up to 60% off!</p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none bg-white/10 border border-white/20 text-white placeholder-white/40" />
            </div>
            <div className="flex gap-2">
              {["all", "flight", "hotel", "package"].map(type => (
                <button key={type} onClick={() => setActiveType(type)}
                  className="px-4 py-3 rounded-2xl text-sm font-medium capitalize transition-all"
                  style={{
                    backgroundColor: activeType === type ? "var(--accent)" : "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}>{type}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Savings Banner */}
      <div className="px-6 py-4" style={{ backgroundColor: "var(--accent-soft)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Tag className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            Total potential savings: <strong>${savings.toLocaleString()}</strong> across {filtered.length} deals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(deal => {
            const Icon = TYPE_ICONS[deal.type] || Globe;
            const pct = Math.round((1 - deal.discounted / deal.original) * 100);
            return (
              <div key={deal.id} className="rounded-3xl overflow-hidden card-glass group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={deal.image} alt={deal.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--accent)" }}>-{pct}% OFF</div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "var(--text-primary)" }}>{deal.badge}</div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                    <Icon className="w-3 h-3 text-white" />
                    <span className="text-white text-xs capitalize">{deal.type}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{deal.destination}</h3>
                  <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{deal.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{deal.rating}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>({deal.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>Expires in {deal.expires}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>${deal.original}</span>
                      <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>${deal.discounted}</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
                      Book <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}