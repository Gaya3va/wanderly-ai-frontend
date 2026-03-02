import { Tag, ArrowRight, Clock, Plane } from "lucide-react";

const deals = [
  {
    id: 1,
    destination: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    original: 1800,
    discounted: 999,
    discount: "44%",
    type: "Flight + Hotel",
    expires: "3 days left",
    badge: "🔥 Hot Deal"
  },
  {
    id: 2,
    destination: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80",
    original: 2400,
    discounted: 1499,
    discount: "37%",
    type: "All Inclusive",
    expires: "7 days left",
    badge: "⭐ Best Value"
  },
  {
    id: 3,
    destination: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    original: 2100,
    discounted: 1299,
    discount: "38%",
    type: "Flight + Hotel",
    expires: "5 days left",
    badge: "🌟 Popular"
  },
];

export default function FeaturedDeals() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>Limited Time</span>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Exclusive Travel Deals</h2>
        </div>
        <button className="hidden md:flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          View all deals <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map(deal => (
          <div key={deal.id} className="rounded-3xl overflow-hidden group cursor-pointer card-glass hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={deal.image} alt={deal.destination}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg, var(--accent), #d4552a)" }}>
                -{deal.discount} OFF
              </div>
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "var(--text-primary)" }}>
                {deal.badge}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{deal.destination}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Plane className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{deal.type}</span>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
                <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{deal.expires}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>${deal.original}</span>
                  <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>${deal.discounted}</p>
                </div>
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}