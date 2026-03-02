import { useState } from "react";
import { Heart, Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function DestinationCard({ destination, onSave, saved }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(saved || false);

  const handleLike = (e) => {
    e.preventDefault();
    setLiked(!liked);
    onSave && onSave(destination, !liked);
  };

  const travelTypeColors = {
    adventure: "bg-orange-100 text-orange-700",
    culture: "bg-purple-100 text-purple-700",
    beach: "bg-blue-100 text-blue-700",
    nature: "bg-green-100 text-green-700",
    culinary: "bg-yellow-100 text-yellow-700",
    wellness: "bg-pink-100 text-pink-700",
  };

  return (
    <Link to={createPageUrl(`DestinationDetail?id=${destination.id}`)}>
      <div
        className="destination-card relative rounded-3xl overflow-hidden cursor-pointer group"
        style={{ boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow)", transition: "all 0.4s ease" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={destination.image_url || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80`}
            alt={destination.name}
            className="w-full h-full object-cover"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s ease" }}
          />
          <div className="absolute inset-0 card-overlay"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />

          {/* Save Button */}
          <button
            onClick={handleLike}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
            style={{ backgroundColor: liked ? "var(--accent)" : "rgba(255,255,255,0.9)" }}>
            <Heart className={`w-4 h-4 ${liked ? "text-white fill-white" : "text-gray-600"}`} />
          </button>

          {/* Featured badge */}
          {destination.featured && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white z-10"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              ✨ Featured
            </div>
          )}

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-white/70" />
                  <span className="text-white/70 text-sm">{destination.country}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm font-semibold">{destination.rating?.toFixed(1) || "4.8"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4" style={{ backgroundColor: "var(--bg-card)" }}>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {destination.description || "A breathtaking destination waiting to be explored."}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {destination.travel_types?.slice(0, 3).map(type => (
              <span key={type} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${travelTypeColors[type] || "bg-gray-100 text-gray-600"}`}>
                {type}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>From</span>
              <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                ${destination.flight_cost_estimate || 450}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--accent)" }}>
              Explore <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}