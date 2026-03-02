import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Star, MapPin, Heart, Share2, Calendar, Wallet, Users, Plane, Hotel,
  UtensilsCrossed, Zap, ChevronLeft, ChevronRight, Loader2, Globe, Camera,
  MessageSquare, ThumbsUp, Plus, ArrowRight
} from "lucide-react";

function BudgetEstimator({ destination }) {
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);

  const flight = (destination.flight_cost_estimate || 500) * travelers;
  const hotel = (destination.hotel_cost_per_night || 80) * days * travelers;
  const food = (destination.food_cost_per_day || 40) * days * travelers;
  const activities = (destination.activities_cost_per_day || 30) * days * travelers;
  const total = flight + hotel + food + activities;

  return (
    <div className="rounded-3xl p-6 card-glass">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="w-5 h-5" style={{ color: "var(--accent)" }} />
        <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Budget Estimator</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>DAYS</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setDays(Math.max(1, days - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>-</button>
            <span className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{days}</span>
            <button onClick={() => setDays(days + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>+</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>TRAVELERS</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>-</button>
            <span className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{travelers}</span>
            <button onClick={() => setTravelers(travelers + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>+</button>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {[
          { icon: Plane, label: "Flights", value: flight },
          { icon: Hotel, label: "Accommodation", value: hotel },
          { icon: UtensilsCrossed, label: "Food & Dining", value: food },
          { icon: Zap, label: "Activities", value: activities },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>${value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl flex items-center justify-between" style={{ backgroundColor: "var(--accent-soft)" }}>
        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Total Estimate</span>
        <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function DestinationDetail() {
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      base44.entities.Destination.filter({ id }),
      base44.entities.Review.filter({ destination_id: id }, "-created_date", 10),
    ]).then(([dests, revs]) => {
      setDestination(dests[0] || null);
      setReviews(revs);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
    </div>
  );

  if (!destination) return (
    <div className="text-center py-20">
      <p style={{ color: "var(--text-secondary)" }}>Destination not found.</p>
    </div>
  );

  const allImages = [destination.image_url, ...(destination.gallery_images || [])].filter(Boolean);
  if (allImages.length === 0) allImages.push("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80");

  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-all hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}>
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Hero Gallery */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="relative rounded-3xl overflow-hidden h-[50vh] md:h-[60vh]">
          <img src={allImages[activeImg]} alt={destination.name}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />

          {allImages.length > 1 && (
            <>
              <button onClick={() => setActiveImg((activeImg - 1 + allImages.length) % allImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button onClick={() => setActiveImg((activeImg + 1) % allImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="rounded-full transition-all"
                    style={{ width: i === activeImg ? "24px" : "8px", height: "8px", backgroundColor: i === activeImg ? "white" : "rgba(255,255,255,0.5)" }} />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">{destination.name}</h1>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-lg">{destination.country}</span>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex gap-3">
            <button onClick={() => setSaved(!saved)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: saved ? "var(--accent)" : "rgba(255,255,255,0.9)" }}>
              <Heart className={`w-5 h-5 ${saved ? "text-white fill-white" : "text-gray-700"}`} />
            </button>
            <button className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Star, label: "Rating", value: `${destination.rating?.toFixed(1) || "4.8"}/5`, sub: `${destination.review_count || reviews.length} reviews` },
                { icon: Calendar, label: "Best Season", value: destination.best_season || "Year-round", sub: destination.climate || "Temperate" },
                { icon: Globe, label: "Continent", value: destination.continent || "N/A", sub: destination.country },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="p-4 rounded-2xl text-center card-glass">
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
                  <p className="font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>About {destination.name}</h2>
              <p className="leading-relaxed text-base" style={{ color: "var(--text-secondary)" }}>
                {destination.description || "A breathtaking destination that offers a perfect blend of culture, adventure, and natural beauty. Whether you're seeking relaxation, exploration, or unforgettable experiences, this destination has something for every type of traveler."}
              </p>
            </div>

            {/* Highlights */}
            {destination.highlights?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Top Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Experiences */}
            {destination.local_experiences?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Local Experiences</h3>
                <div className="flex flex-wrap gap-3">
                  {destination.local_experiences.map((exp, i) => (
                    <span key={i} className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "var(--accent-2-soft)", color: "var(--accent-2)" }}>
                      ✦ {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Traveler Reviews ({reviews.length})
                </h3>
              </div>
              {reviews.length === 0 ? (
                <div className="text-center py-10 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                  <p style={{ color: "var(--text-secondary)" }}>No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-5 rounded-2xl card-glass">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                            {(review.author_name || "A")[0]}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{review.author_name || "Anonymous"}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{review.visit_date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      {review.title && <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{review.title}</h4>}
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{review.content}</p>
                      {review.pros?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {review.pros.map((p, i) => (
                            <span key={i} className="px-2.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}>
                              + {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BudgetEstimator destination={destination} />

            <div className="p-5 rounded-3xl card-glass">
              <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Plan Your Trip</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(createPageUrl("PlanTrip"))}
                  className="w-full py-3 rounded-2xl text-sm font-semibold text-white btn-primary flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add to Trip Plan
                </button>
                <button
                  onClick={() => navigate(createPageUrl("Journal"))}
                  className="w-full py-3 rounded-2xl text-sm font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                  Write in Journal
                </button>
              </div>
            </div>

            {destination.tags?.length > 0 && (
              <div className="p-5 rounded-3xl card-glass">
                <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}