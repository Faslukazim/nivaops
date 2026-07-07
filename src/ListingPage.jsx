import { useEffect, useMemo, useState } from 'react';
import { MapPin, Wifi, Utensils, Shirt, ShieldCheck, Wind, Search, X, ArrowRight, BedDouble, ArrowLeft, MessageCircle } from 'lucide-react';
import { fetchListedProperties } from './services/listingService';

const AMENITY_ICON = {
  wifi: Wifi,
  food: Utensils,
  laundry: Shirt,
  security: ShieldCheck,
  ac: Wind,
};

function GenderTag({ value }) {
  if (value === 'any' || !value) return null;
  const label = value === 'male' ? 'Men only' : 'Women only';
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate2 bg-mist px-2 py-1 rounded-full border border-border">
      {label}
    </span>
  );
}

function whatsappHref(property) {
  const digits = String(property.whatsapp_number || '').replace(/\D/g, '').slice(-10);
  if (!digits) return null;
  const text = encodeURIComponent(`Hi, I'm interested in a vacant bed at ${property.name} (${property.locality || property.city}). Is it still available?`);
  return `https://wa.me/91${digits}?text=${text}`;
}

function PropertyCard({ p, onOpen, index }) {
  return (
    <button
      onClick={() => onOpen(p)}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group text-left rounded-3xl overflow-hidden border border-border bg-white
                 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]
                 hover:-translate-y-1.5 transition-all duration-500 ease-out animate-rise"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-leaf/15 to-mist overflow-hidden">
        {p.cover_photo_url ? (
          <img
            src={p.cover_photo_url}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BedDouble size={40} className="text-leaf/40" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-leaf animate-pulse" />
          <span className="text-[11px] font-bold text-ink">{p.vacant_beds} bed{p.vacant_beds === 1 ? '' : 's'} vacant</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-[17px] leading-snug text-ink group-hover:text-leaf transition-colors">{p.name}</h3>
          <ArrowRight size={18} className="shrink-0 mt-1 text-slate2 group-hover:text-leaf group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="flex items-center gap-1 text-[13px] text-slate2 mt-1.5">
          <MapPin size={13} className="shrink-0" />
          {[p.locality, p.city].filter(Boolean).join(', ')}
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <GenderTag value={p.gender_preference} />
          {(p.amenities || []).slice(0, 3).map(a => {
            const Icon = AMENITY_ICON[a];
            return (
              <span key={a} className="flex items-center gap-1 text-[11px] font-medium text-slate2 bg-mist px-2 py-1 rounded-full border border-border">
                {Icon && <Icon size={11} />} {a}
              </span>
            );
          })}
        </div>
      </div>
    </button>
  );
}

function PropertyDetail({ property, onClose }) {
  const href = whatsappHref(property);

  return (
    <div className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fadein">
      <div className="bg-white w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto animate-slideup">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-leaf/15 to-mist">
          {property.cover_photo_url ? (
            <img src={property.cover_photo_url} alt={property.name} className="w-full h-full object-cover sm:rounded-t-3xl" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><BedDouble size={48} className="text-leaf/40" /></div>
          )}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-ink tracking-tight">{property.name}</h2>
          <p className="flex items-center gap-1.5 text-slate2 mt-1.5">
            <MapPin size={14} /> {[property.locality, property.city].filter(Boolean).join(', ')}
          </p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <GenderTag value={property.gender_preference} />
            {(property.amenities || []).map(a => {
              const Icon = AMENITY_ICON[a];
              return (
                <span key={a} className="flex items-center gap-1.5 text-xs font-medium text-slate2 bg-mist px-2.5 py-1.5 rounded-full border border-border capitalize">
                  {Icon && <Icon size={12} />} {a}
                </span>
              );
            })}
          </div>
          {property.listing_description && (
            <p className="mt-5 text-[14.5px] leading-relaxed text-slate2">{property.listing_description}</p>
          )}

          <div className="mt-6 border-t border-border pt-5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-leaf">
              {property.vacant_beds} bed{property.vacant_beds === 1 ? '' : 's'} available now
            </p>
          </div>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full bg-leaf text-white font-semibold py-3.5 rounded-2xl hover:bg-leaf/90 transition-colors"
            >
              <MessageCircle size={18} /> Enquire on WhatsApp
            </a>
          ) : (
            <p className="mt-6 text-center text-sm text-slate2">Contact details unavailable for this listing.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingPage({ city: initialCity, onExit }) {
  const [city, setCity] = useState(initialCity || '');
  const [query, setQuery] = useState('');
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    setProperties(null);
    fetchListedProperties(city || null)
      .then(data => { if (active) setProperties(data); })
      .catch(e => { if (active) { setError(e.message); setProperties([]); } });
    return () => { active = false; };
  }, [city]);

  const filtered = useMemo(() => {
    if (!properties) return [];
    if (!query.trim()) return properties;
    const q = query.toLowerCase();
    return properties.filter(p =>
      p.name.toLowerCase().includes(q) || (p.locality || '').toLowerCase().includes(q));
  }, [properties, query]);

  const cityLabel = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'your city';

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <span className="text-leaf font-black text-sm">N</span>
            </div>
            <span className="font-bold text-ink tracking-tight">NivaOps</span>
            <span className="text-slate2 text-sm hidden sm:inline">/ pg / {city || 'browse'}</span>
          </div>
          {onExit && (
            <button onClick={onExit} className="flex items-center gap-1.5 text-sm font-medium text-slate2 hover:text-ink transition-colors">
              <ArrowLeft size={15} /> Back
            </button>
          )}
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-leaf mb-4">Live vacancy · Updated in real time</p>
        <h1 className="text-[clamp(34px,6vw,58px)] font-extrabold tracking-tight leading-[1.03] text-ink max-w-3xl text-wrap-balance">
          Find a verified PG or hostel bed in {cityLabel}.
        </h1>
        <p className="text-slate2 text-[16px] sm:text-[17px] mt-4 max-w-xl leading-relaxed">
          Every bed shown here is confirmed vacant right now by the owner's own booking system —
          not a stale listing. No brokerage, no middlemen.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate2" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by hostel name or locality"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-white text-[15px]
                         focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-shadow"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        {error && (
          <p className="text-coral text-sm mb-6">{error}</p>
        )}

        {properties === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-3xl border border-border bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-mist animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-mist rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-mist rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BedDouble size={40} className="mx-auto text-slate2/40 mb-4" />
            <p className="font-semibold text-ink">No vacant beds listed here yet</p>
            <p className="text-slate2 text-sm mt-1">Check back soon, or try a different city.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate2 mb-5">{filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'} with beds available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i} onOpen={setSelected} />
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-center">
          <p className="text-sm text-slate2">
            Powered by <span className="font-semibold text-ink">NivaOps</span> — the operations platform Kochi's hostels run on.
          </p>
        </div>
      </footer>

      {selected && <PropertyDetail property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
