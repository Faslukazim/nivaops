import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  ChevronDown,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { fetchListedProperties } from './services/listingService';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';

const AMENITY_LABEL = {
  wifi: 'WiFi',
  food: 'Food',
  laundry: 'Laundry',
  security: 'Security',
  ac: 'AC',
};

const GENDER_OPTIONS = [
  { value: 'any', label: 'All stays' },
  { value: 'male', label: 'Men' },
  { value: 'female', label: 'Women' },
];

function amenityLine(amenities) {
  if (!amenities?.length) return null;
  return amenities.map(a => AMENITY_LABEL[a] || a).join(' · ');
}

function locationLine(property) {
  return [property.locality, property.city].filter(Boolean).join(', ') || 'Location available on enquiry';
}

function GenderTag({ value }) {
  if (value === 'any' || !value) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate2">
      {value === 'male' ? 'Men only' : 'Women only'}
    </span>
  );
}

function whatsappHref(property) {
  const digits = String(property.whatsapp_number || '').replace(/\D/g, '').slice(-10);
  if (!digits) return null;
  const text = encodeURIComponent(
    `Hi, I'm interested in a vacant bed at ${property.name} (${property.locality || property.city || 'your property'}). Is it still available?`
  );
  return `https://wa.me/91${digits}?text=${text}`;
}

function PropertyImage({ property, detail = false }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-leaf/15 via-mist to-white ${detail ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
      {property.cover_photo_url ? (
        <img
          src={property.cover_photo_url}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <BedDouble size={detail ? 52 : 42} className="text-leaf/30" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/35 to-transparent" />
    </div>
  );
}

function PropertyCard({ property, onOpen, index }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(property)}
      style={{ animationDelay: `${index * 55}ms` }}
      className="group w-full overflow-hidden rounded-[26px] border border-border bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_45px_-18px_rgba(15,23,42,0.28)] animate-rise"
    >
      <div className="relative">
        <PropertyImage property={property} />
        <div className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
          <span className="text-[11px] font-bold text-ink">
            {property.vacant_beds} bed{property.vacant_beds === 1 ? '' : 's'} available
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-bold leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-leaf">
              {property.name}
            </h2>
            <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-slate2">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>{locationLine(property)}</span>
            </p>
          </div>
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-mist text-slate2 transition-all group-hover:border-leaf/30 group-hover:bg-leaf group-hover:text-white">
            <ArrowRight size={17} />
          </span>
        </div>

        <div className="mt-4 flex min-h-6 flex-wrap items-center gap-2">
          <GenderTag value={property.gender_preference} />
          {amenityLine(property.amenities) && (
            <span className="text-[12px] text-slate2">{amenityLine(property.amenities)}</span>
          )}
        </div>
      </div>
    </button>
  );
}

function PropertyDetail({ property, onClose }) {
  const href = whatsappHref(property);
  const amenities = property.amenities?.map(a => AMENITY_LABEL[a] || a).filter(Boolean) || [];

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/55 p-0 backdrop-blur-sm animate-fadein sm:items-center sm:p-6"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[28px] bg-white shadow-2xl animate-slideup sm:max-w-2xl sm:rounded-[28px]">
        <div className="relative">
          <PropertyImage property={property} detail />
          <button
            type="button"
            aria-label="Close property details"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition-transform hover:scale-105"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur">
            <CheckCircle2 size={14} className="text-leaf" />
            <span className="text-[11px] font-bold text-ink">Live availability</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[27px] font-extrabold tracking-[-0.035em] text-ink">{property.name}</h2>
              <p className="mt-2 flex items-start gap-1.5 text-[14px] text-slate2">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                {locationLine(property)}
              </p>
            </div>
            <GenderTag value={property.gender_preference} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-mist p-4">
              <BedDouble size={18} className="text-leaf" />
              <p className="mt-3 text-xl font-extrabold tracking-tight text-ink">{property.vacant_beds}</p>
              <p className="mt-0.5 text-[12px] text-slate2">beds available</p>
            </div>
            <div className="rounded-2xl bg-mist p-4">
              <ShieldCheck size={18} className="text-leaf" />
              <p className="mt-3 text-xl font-extrabold tracking-tight text-ink">Live</p>
              <p className="mt-0.5 text-[12px] text-slate2">owner-managed listing</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-mist p-4 sm:col-span-1">
              <MapPin size={18} className="text-leaf" />
              <p className="mt-3 truncate text-xl font-extrabold tracking-tight text-ink">{property.city || 'Nearby'}</p>
              <p className="mt-0.5 text-[12px] text-slate2">area</p>
            </div>
          </div>

          {property.listing_description && (
            <p className="mt-7 text-[15px] leading-7 text-slate2">{property.listing_description}</p>
          )}

          {amenities.length > 0 && (
            <div className="mt-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate2">What’s included</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {amenities.map(amenity => (
                  <span key={amenity} className="rounded-full border border-border bg-white px-3 py-2 text-[13px] font-medium text-ink">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 rounded-2xl border border-leaf/15 bg-leaf/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-leaf" />
              <div>
                <p className="text-sm font-bold text-ink">{property.vacant_beds} vacant bed{property.vacant_beds === 1 ? '' : 's'} right now</p>
                <p className="mt-1 text-xs leading-relaxed text-slate2">Availability comes from the property’s NivaOps occupancy data.</p>
              </div>
            </div>
          </div>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf py-4 text-[15px] font-bold text-white shadow-[0_10px_25px_-12px_rgba(22,101,52,0.6)] transition-all hover:-translate-y-0.5 hover:bg-leaf/90"
            >
              <MessageCircle size={19} />
              Ask about a bed on WhatsApp
            </a>
          ) : (
            <p className="mt-6 rounded-2xl bg-mist px-4 py-4 text-center text-sm text-slate2">Contact the property directly for availability.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function GenderSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = GENDER_OPTIONS.find(option => option.value === value) || GENDER_OPTIONS[0];

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        className="flex h-12 items-center gap-1.5 border-l border-border px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-mist/60 sm:px-5"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current.label}
        <ChevronDown size={15} className={`text-slate2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <button type="button" aria-label="Close filter menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[140px] overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-xl" role="listbox">
            {GENDER_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-mist ${option.value === value ? 'font-bold text-leaf' : 'text-ink'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-border bg-white">
      <div className="aspect-[4/3] animate-pulse bg-mist" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-mist" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-mist" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-mist" />
      </div>
    </div>
  );
}

export default function ListingPage({ city: initialCity }) {
  const [city] = useState(initialCity || '');
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('any');
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    setProperties(null);
    setError('');

    fetchListedProperties(city || null)
      .then(data => {
        if (active) setProperties(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        if (active) {
          setError(error?.message || 'We could not load listings right now.');
          setProperties([]);
        }
      });

    return () => {
      active = false;
    };
  }, [city]);

  const filtered = useMemo(() => {
    if (!properties) return [];
    const q = query.trim().toLowerCase();

    return properties.filter(property => {
      const genderMatch = gender === 'any' || property.gender_preference === gender || property.gender_preference === 'any';
      const searchMatch = !q || [property.name, property.locality, property.city].filter(Boolean).some(value => value.toLowerCase().includes(q));
      return genderMatch && searchMatch;
    });
  }, [properties, query, gender]);

  const cityLabel = city
    ? city.charAt(0).toUpperCase() + city.slice(1)
    : 'your city';

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header
        className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <NivaLogo size={27} />
            <NivaWordmark size="base" />
            <span className="hidden text-sm text-slate2 sm:inline">/ stays / {city || 'browse'}</span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-slate2 sm:flex">
            <CheckCircle2 size={14} className="text-leaf" />
            Live availability
          </div>
        </div>
      </header>

      <main>
        <section className="relative border-b border-border bg-white">
          <div className="pointer-events-none absolute -right-32 -top-40 h-80 w-80 rounded-full bg-leaf/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-[-180px] h-96 w-96 rounded-full bg-leaf/5 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-leaf/15 bg-leaf/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-leaf">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse" />
                Live vacancy
              </div>
              <h1 className="mt-5 max-w-3xl text-[clamp(38px,6vw,64px)] font-extrabold leading-[0.98] tracking-[-0.055em] text-ink text-wrap-balance">
                Find your next place to stay in {cityLabel}.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-7 text-slate2 sm:text-[18px]">
                Browse PGs and hostels with beds available now. See the live vacancy, check the basics, then talk directly to the property.
              </p>
            </div>

            <div className="mt-8 max-w-3xl rounded-[22px] border border-border bg-white shadow-[0_12px_40px_-25px_rgba(15,23,42,0.3)] transition-shadow focus-within:shadow-[0_18px_50px_-25px_rgba(15,23,42,0.35)] focus-within:ring-2 focus-within:ring-leaf/15">
              <div className="flex h-12 items-center">
                <Search size={18} className="ml-4 shrink-0 text-slate2" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search hostel or locality"
                  aria-label="Search PGs and hostels"
                  className="min-w-0 flex-1 bg-transparent px-3 text-[14px] text-ink outline-none placeholder:text-slate2/70 sm:text-[15px]"
                />
                {query && (
                  <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="mr-1 flex h-9 w-9 items-center justify-center rounded-full text-slate2 hover:bg-mist">
                    <X size={15} />
                  </button>
                )}
                <GenderSelect value={gender} onChange={setGender} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate2">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-leaf" /> Owner-managed listings</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-leaf" /> No brokerage</span>
              <span className="inline-flex items-center gap-1.5"><MessageCircle size={14} className="text-leaf" /> Direct WhatsApp enquiry</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          {error && (
            <div className="mb-6 rounded-2xl border border-coral/20 bg-coral/5 px-4 py-3 text-sm text-coral">
              {error}
            </div>
          )}

          {properties === null ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(index => <LoadingCard key={index} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center sm:py-24">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border">
                <BedDouble size={28} className="text-slate2/50" />
              </div>
              <h2 className="mt-6 text-xl font-bold tracking-tight text-ink">
                {query || gender !== 'any' ? 'Nothing matches that search' : 'No vacant beds listed yet'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate2">
                {query || gender !== 'any'
                  ? 'Try a different hostel, locality, or stay type.'
                  : 'New vacancies will appear here as properties open beds.'}
              </p>
              {(query || gender !== 'any') && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setGender('any'); }}
                  className="mt-5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-leaf">Available now</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-[28px]">
                    {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
                  </h2>
                </div>
                <p className="hidden text-right text-xs text-slate2 sm:block">Tap a property to see details</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} onOpen={setSelected} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2">
            <NivaLogo size={21} />
            <span className="text-sm font-semibold text-ink">NivaOps</span>
          </div>
          <p className="text-xs text-slate2">Live PG & hostel listings powered by NivaOps.</p>
        </div>
      </footer>

      {selected && <PropertyDetail property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
