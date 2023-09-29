import { useEffect, useMemo, useState } from "react";
import ColorSelect from "./inputs/colorSelect";
import type { ProjectThemeOptions } from "~/server/db/schema/enums";
import { ImageIcon, ExternalLink, Search } from "lucide-react";
import { cn } from "~/lib/cn";
import { useDebounce } from "~/hooks/debounce";
import { api } from "~/utils/api";
import type { Basic } from "unsplash-js/dist/methods/photos/types";

const TOPICS = [
  "Mountain",
  "Beach",
  "Forest",
  "Desert",
  "Field",
  "Lake",
  "Urban",
  "River",
  "Waterfall",
  "Bridge",
  "Cave",
  "Canyon",
  "Island",
  "Volcano",
  "Sunset",
  "Sunrise",
  "Space",
  "Planet",
  "Clouds",
  "Abstract",
];

interface UnsplashPhotoProps {
  photo: Basic;
  onSelect: (photo: Basic) => void;
}

function UnsplashPhoto({ photo, onSelect }: UnsplashPhotoProps) {
  return (
    <div
      key={photo.id}
      className="relative aspect-video h-48 w-full overflow-hidden rounded-lg"
    >
      <a
        href={photo.links.html}
        target="_blank"
        rel="noreferrer"
        className="absolute left-2 top-2 flex items-center justify-center rounded-md bg-white/75 p-2 backdrop-blur-md transition-colors duration-150 hover:bg-white"
      >
        <ExternalLink className="h-5 w-5" />
      </a>
      <img
        alt={photo.description ?? ""}
        src={photo.urls.small}
        className="h-full w-full cursor-pointer object-cover"
        onClick={() => onSelect(photo)}
      />

      {photo.user.portfolio_url ? (
        <a
          href={photo.user.portfolio_url}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-0 right-0 flex items-center"
        >
          <span
            className="flex h-6 items-center justify-center gap-2 rounded-tl-md bg-white/75 px-2 backdrop-blur-md transition-colors duration-150 hover:bg-white"
            onClick={() => console.log("clicking here")}
          >
            <ImageIcon className="h-3 w-3" />
            <span className="truncate text-xs">
              Photo by {photo.user.name} on Unsplash
            </span>
          </span>
        </a>
      ) : (
        <span className="absolute bottom-0 right-0 flex items-center">
          <span
            className="flex h-6 items-center justify-center gap-2 rounded-tl-md bg-white/75 px-2 backdrop-blur-md transition-colors duration-150 hover:bg-white"
            onClick={() => console.log("clicking here")}
          >
            <ImageIcon className="h-3 w-3" />
            <span className="truncate text-xs">
              Photo by {photo.user.name} on Unsplash
            </span>
          </span>
        </span>
      )}
    </div>
  );
}

interface UnsplashFormProps {
  onSelect: (image: Basic) => void;
}

function UnsplashForm({ onSelect }: UnsplashFormProps) {
  const [color, setColor] = useState<ProjectThemeOptions | null>(null);
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState<Basic[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce<string>(search, 500);
  const defaultSearch = useMemo(() => {
    return TOPICS[Math.floor(Math.random() * TOPICS.length)];
  }, []);
  const listPhotos = api.unsplash.list.useMutation();

  useEffect(() => {
    setSearch(defaultSearch ?? "");
  }, [defaultSearch, setSearch]);

  useEffect(() => {
    if (debouncedSearch !== "") {
      setPage(1);
      listPhotos
        .mutateAsync({
          query: debouncedSearch,
          color: color ?? undefined,
        })
        .then((res) => {
          if (res) {
            console.log("setting photos");
            console.log(res.results.length);
            setPhotos(res.results);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [debouncedSearch, color]);

  useEffect(() => {
    if (page > 1) {
      listPhotos
        .mutateAsync({
          query: debouncedSearch,
          color: color ?? undefined,
          page,
        })
        .then((res) => {
          if (res) setPhotos([...photos, ...res.results]);
        })
        .catch((err) => console.log(err));
    }
  }, [page]);

  return (
    <>
      <div className="flex justify-center gap-2">
        <ColorSelect
          allowAny
          className="w-auto grow-0"
          isCompact
          label="Color"
          onChange={setColor}
          value={color}
        />
        <div className="relative flex w-full items-center">
          <input
            type="text"
            className="h-full w-full rounded-lg border border-zinc-300 bg-white pl-10 text-zinc-800"
            placeholder="Forest, Caves, Space, etc."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <span className="absolute left-2 flex h-full items-center justify-center pl-2">
            <Search className="h-4 w-4" />
          </span>
        </div>
      </div>
      <section className="grid grid-cols-1 gap-4">
        {photos.map((photo) => (
          <UnsplashPhoto key={photo.id} photo={photo} onSelect={onSelect} />
        ))}
        {debouncedSearch === "" || listPhotos.isLoading ? (
          <>
            {[...new Array<string>(10)].map((_, i) => (
              <div
                key={`loading-image-${i}`}
                className={cn(
                  "flex h-48 animate-pulse items-center justify-center rounded-lg bg-zinc-200",
                  i % 2 === 0 ? "delay-500" : ""
                )}
              />
            ))}
          </>
        ) : (
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md px-6 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
            onClick={() => setPage(page + 1)}
          >
            <span>View More</span>
          </button>
        )}
      </section>
    </>
  );
}

export default UnsplashForm;
