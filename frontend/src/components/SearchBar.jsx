import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, label = "Search tools" }) {
  return (
    <div className="search">
      <Search size={18} aria-hidden="true" />
      <label htmlFor="tool-search" className="sr-only" style={{ position: "absolute", left: -9999 }}>{label}</label>
      <input id="tool-search" type="search" placeholder="Search 21 free tools — try “thumbnail” or “hashtag”…" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
