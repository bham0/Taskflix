"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";

type Photo = {
  id: number;
  title: string;
};

const PAGE_SIZE = 12;

const TITLE_POOL = [
  "Mountain Sunset",
  "City Skyline",
  "Ocean Waves",
  "Forest Trail",
  "Desert Road",
  "Snow Peak",
  "Golden Beach",
  "River Bridge",
  "Night Lights",
  "Modern Building",
  "Green Valley",
  "Rainy Street",
  "Coffee Table",
  "Vintage Car",
  "Flower Garden",
  "Blue Lake",
  "Sunrise Clouds",
  "Rocky Hills",
  "Calm Water",
  "Urban View",
  "Hidden Waterfall",
  "Street Market",
  "Autumn Leaves",
  "Wild Nature",
  "Luxury Interior",
  "Sunny Meadow",
  "Foggy Forest",
  "Island Paradise",
  "Ancient Temple",
  "Sea Horizon",
  "Quiet Village",
  "Colorful Boats",
  "Skyline Tower",
  "Frozen River",
  "Tropical Trees",
  "Travel Route",
  "Stone Path",
  "Glass Building",
  "Creative Workspace",
  "Minimal Room",
  "Fresh Garden",
  "Countryside Road",
  "Lake Reflection",
  "Evening Street",
  "Wood Cabin",
  "Palm Beach",
  "Historic Street",
  "Camping Tent",
  "Moonlight Lake",
  "Adventure Trail",
];

const CATEGORIES = [
  "All",
  "Nature",
  "City",
  "Travel",
  "Lifestyle",
  "Architecture",
];

function getCategory(title: string) {
  const lower = title.toLowerCase();

  if (
    lower.includes("mountain") ||
    lower.includes("forest") ||
    lower.includes("lake") ||
    lower.includes("river") ||
    lower.includes("beach") ||
    lower.includes("garden") ||
    lower.includes("waterfall") ||
    lower.includes("nature") ||
    lower.includes("meadow") ||
    lower.includes("trees") ||
    lower.includes("ocean")
  ) {
    return "Nature";
  }

  if (
    lower.includes("city") ||
    lower.includes("street") ||
    lower.includes("urban") ||
    lower.includes("market") ||
    lower.includes("skyline")
  ) {
    return "City";
  }

  if (
    lower.includes("travel") ||
    lower.includes("route") ||
    lower.includes("village") ||
    lower.includes("adventure") ||
    lower.includes("camping") ||
    lower.includes("temple") ||
    lower.includes("island")
  ) {
    return "Travel";
  }

  if (
    lower.includes("coffee") ||
    lower.includes("workspace") ||
    lower.includes("room") ||
    lower.includes("interior") ||
    lower.includes("lifestyle")
  ) {
    return "Lifestyle";
  }

  return "Architecture";
}

export default function ImagesPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos?_limit=120")
      .then((r) => r.json())
      .then((data) => {
        const formatted = data.map((item: { id: number }) => ({
          id: item.id,
          title: `${TITLE_POOL[item.id % TITLE_POOL.length]} ${item.id}`,
        }));

        setPhotos(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch = photo.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || getCategory(photo.title) === category;

      return matchesSearch && matchesCategory;
    });
  }, [photos, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex bg-[var(--bg)] transition-colors">
      <AppSidebar />

      <main className="flex-1 md:ml-[72px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6 sm:py-8">
        <AppHeader />

        <section className="max-w-7xl mx-auto mt-6 sm:mt-10">
          <h1
            className="text-3xl font-semibold mb-6"
            style={{ color: "var(--text)" }}
          >
            Image Gallery
          </h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full md:w-[320px] h-[52px] px-5 rounded-2xl border outline-none"
              style={{
                backgroundColor: "var(--ui-bg)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-[52px] px-5 rounded-2xl border outline-none"
              style={{
                backgroundColor: "var(--ui-bg)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[240px] rounded-2xl animate-pulse"
                  style={{ backgroundColor: "var(--card)" }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No images found.</p>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl overflow-hidden border shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={`https://picsum.photos/seed/${photo.id}/400/400`}
                        alt={photo.title}
                        fill
                        unoptimized
                        className="object-cover hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="p-3">
                      <p
                        className="text-sm font-medium line-clamp-2"
                        style={{ color: "var(--text)" }}
                      >
                        {photo.title}
                      </p>

                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--muted)" }}
                      >
                        {getCategory(photo.title)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                  .map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className="w-10 h-10 rounded-xl border"
                      style={{
                        backgroundColor:
                          num === page ? "var(--btn-bg)" : "var(--card)",
                        color: num === page ? "var(--btn-text)" : "var(--text)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {num}
                    </button>
                  ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  Next
                </button>
              </div>

              <p
                className="text-center text-xs mt-4"
                style={{ color: "var(--muted)" }}
              >
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} images
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
