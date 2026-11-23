import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, label = "Search tools" }) {
  return (
    <div className="search">
      <Search size={18} aria-hidden="true" />
      <label htmlFor="tool-search" className="sr-only">{label}</label>
      <input id="tool-search" type="search" placeholder="Search 54 free tools — try “merge PDF” or “thumbnail”…" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
