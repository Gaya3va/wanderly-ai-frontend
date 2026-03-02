import { useState, useEffect } from "react";
import api from "@/api/api";   

import DestinationCard from "../components/discover/DestinationCard";
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  Globe,
  Map,
} from "lucide-react";

const CONTINENTS = ["All", "Asia", "Europe", "Americas", "Africa", "Oceania", "Middle East"];

const TRAVEL_TYPES = [
  "adventure",
  "culture",
  "beach",
  "nature",
  "culinary",
  "wellness",
  "history",
  "city",
];

const CLIMATES = ["Tropical", "Desert", "Temperate", "Cold", "Mediterranean", "Monsoon"];

const BUDGETS = [
  { label: "Budget (< $100/day)", value: "budget", max: 100 },
  { label: "Mid-range ($100-250/day)", value: "mid", max: 250 },
  { label: "Luxury ($250+/day)", value: "luxury", max: 99999 },
];

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search") || "";
  });

  const [continent, setContinent] = useState("All");

  const [selectedTypes, setSelectedTypes] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    return type ? [type] : [];
  });

  const [climate, setClimate] = useState("");
  const [budget, setBudget] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  /* ==============================
      LOAD DESTINATIONS (NEW API)
  ============================== */

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const res = await api.get("/destinations?limit=100");

        // backend expected:
        // { data: { data: [...] } }
        setDestinations(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch destinations", err);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  /* ==============================
      FILTERING (UNCHANGED)
  ============================== */

  useEffect(() => {
    let result = [...destinations];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.country?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (continent !== "All")
      result = result.filter((d) => d.continent === continent);

    if (selectedTypes.length > 0)
      result = result.filter((d) =>
        selectedTypes.some((t) => d.travel_types?.includes(t))
      );

    if (climate)
      result = result.filter((d) => d.climate === climate);

    if (budget) {
      const budgetObj = BUDGETS.find((b) => b.value === budget);
      if (budgetObj)
        result = result.filter(
          (d) => (d.avg_budget_per_day || 0) <= budgetObj.max
        );
    }

    if (sortBy === "rating")
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    if (sortBy === "price_asc")
      result.sort(
        (a, b) => (a.flight_cost_estimate || 0) - (b.flight_cost_estimate || 0)
      );

    if (sortBy === "price_desc")
      result.sort(
        (a, b) => (b.flight_cost_estimate || 0) - (a.flight_cost_estimate || 0)
      );

    setFiltered(result);
  }, [
    destinations,
    search,
    continent,
    selectedTypes,
    climate,
    budget,
    sortBy,
  ]);

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setContinent("All");
    setSelectedTypes([]);
    setClimate("");
    setBudget("");
  };

  const activeFilterCount =
    (continent !== "All" ? 1 : 0) +
    selectedTypes.length +
    (climate ? 1 : 0) +
    (budget ? 1 : 0);

  /* ==============================
      UI (UNCHANGED)
  ============================== */

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* HEADER */}
      <div
        className="py-16 px-6 text-center"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Globe className="w-5 h-5" style={{ color: "var(--accent)" }} />
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            Explore the World
          </span>
        </div>

        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          All Destinations
        </h1>

        <p style={{ color: "var(--text-secondary)" }}>
          Discover {destinations.length}+ handpicked destinations
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Map className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No destinations found</h3>
            <button onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6">
              Showing {filtered.length} destination
              {filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((dest) => (
                <DestinationCard
                  key={dest._id}   // ✅ Mongo ID
                  destination={dest}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}