import { useState, useEffect } from "react";
import api from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star, MapPin, Heart, Share2, Calendar, Wallet,
  Plane, Hotel, UtensilsCrossed, Zap,
  ChevronLeft, ChevronRight, Loader2,
  Globe, MessageSquare, Plus
} from "lucide-react";

/* ===============================
   Budget Estimator (UNCHANGED)
================================ */

function BudgetEstimator({ destination }) {
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);

  const flight = (destination.flight_cost_estimate || 500) * travelers;
  const hotel = (destination.hotel_cost_per_night || 80) * days * travelers;
  const food = (destination.food_cost_per_day || 40) * days * travelers;
  const activities =
    (destination.activities_cost_per_day || 30) *
    days *
    travelers;

  const total = flight + hotel + food + activities;

  return (
    <div className="rounded-3xl p-6 card-glass">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="w-5 h-5" />
        <h3 className="font-bold text-lg">Budget Estimator</h3>
      </div>

      <div className="space-y-3 mb-5">
        {[
          { icon: Plane, label: "Flights", value: flight },
          { icon: Hotel, label: "Accommodation", value: hotel },
          { icon: UtensilsCrossed, label: "Food & Dining", value: food },
          { icon: Zap, label: "Activities", value: activities },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
            <span>${value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl flex justify-between bg-gray-100">
        <span>Total Estimate</span>
        <span className="text-xl font-bold">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ===============================
   MAIN COMPONENT
================================ */

export default function DestinationDetail() {
  const { id } = useParams();   // ✅ route param
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);

  /* ===============================
     LOAD FROM BACKEND
  ================================= */

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [destRes, reviewRes] = await Promise.all([
          api.get(`/destinations/${id}`),
          api.get(`/reviews/destination/${id}`)
        ]);

        setDestination(destRes.data);
        setReviews(reviewRes.data || []);
      } catch (err) {
        console.error(err);
        setDestination(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* ===============================
     LOADING STATE
  ================================= */

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  if (!destination)
    return (
      <div className="text-center py-20">
        Destination not found.
      </div>
    );

  const allImages = [
    destination.image_url,
    ...(destination.gallery_images || []),
  ].filter(Boolean);

  /* ===============================
     UI (UNCHANGED)
  ================================= */

  return (
    <div>
      {/* BACK */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* HERO IMAGE */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="relative rounded-3xl overflow-hidden h-[60vh]">
          <img
            src={allImages[activeImg]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-4xl font-bold">
            {destination.name}
          </h1>

          <p>{destination.description}</p>

          {/* Reviews */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Reviews ({reviews.length})
            </h3>

            {reviews.map((review) => (
              <div
                key={review._id}  // ✅ Mongo ID
                className="p-4 border rounded-xl mb-4"
              >
                <p className="font-semibold">
                  {review.author_name}
                </p>
                <p>{review.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <BudgetEstimator destination={destination} />

          <button
            onClick={() => navigate("/plan-trip")}
            className="w-full py-3 bg-black text-white rounded-xl flex justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Trip Plan
          </button>
        </div>
      </div>
    </div>
  );
}