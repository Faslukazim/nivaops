import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BedDouble, CheckCircle2, ChevronDown, MapPin, MessageCircle, Search, ShieldCheck, X } from 'lucide-react';
import { fetchListedProperties } from './services/listingService';
import { NivaLogo, NivaWordmark } from './components/NivaLogo';

const AMENITY_LABEL = { wifi: 'WiFi', food: 'Food', laundry: 'Laundry', security: 'Security', ac: 'AC' };
const GENDER_OPTIONS = [
  { value: 'any', label: 'All' },
  { value: 'male', label: 'Men' },
  { value: 'female', label: 'Women' },
];

function locationLine(property) {
  return [property.locality, property.city].filter(Boolean).join(', ') || 'Location on enquiry';
}

function whatsappHref(property) {
  const digits = String(property.whatsapp_number || '').replace(/\D/g, '').slice(-10);
  if (!digits) return null;
  const text = encodeURIComponent(`Hi, I'm interested in a vacant bed at ${property.name} (${property.locality || property.city || 'your property'}). Is it still available?`);
  return `https://wa.me/91${digits}?text=${text}`;
}

function GenderTag({ value }) {
  if (!value || value === 'any') return null;
  return <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">{value === 'male' ? 'Men' : 'Women'}</span>;
}

function PropertyImage({ property, detail = false }) {
  return (
    <div className={`relative overflow-hidden bg-[#edf1ee] ${detail ? 'aspect-[16/9]' : 'aspect-[1.12/1]'}`}>
      {property.cover_photo_url ? (
        <img src={property.cover_photo_url} alt={property.name} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(22,163,74,.14),transparent_42%)]">
          <BedDouble size={detail ? 54 : 42} strokeWidth={1.25} className="text-leaf/45" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
    </div>
  );
}

function PropertyCard({ property, onOpen, index }) {
  const amenities = property.amenities?.slice(0, 3).map(a => AMENITY_LABEL[a] || a) || [];
  return (
    <button
      type="button"
      onClick={() => onOpen(property)}
      style={{ animationDelay: `${index * 45}ms` }}
      className="group animate-rise w-full overflow-hidden rounded-[24px] border border-black/[0.07] bg-white text-left shadow-[0_2px_8px_rgba(15,23,42,.035)] transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-[0_22px_55px_-28px_rgba(15,23,42,.28)] focus:outline-none focus:ring-2 focus:ring-leaf/30"
    >
      <div className="relative">
        <PropertyImage property={property} />
        <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
          <span className="text-[11px] font-bold text-ink">{property.vacant_beds} available</span>
        </div>
        {property.gender_preference && property.gender_preference !== 'any' && (
          <div className="absolute bottom-3.5 right-3.5"><GenderTag value={property.gender_preference} /></div>
        )}
      </div>
      <div className="p-4.5 p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[17px] font-bold tracking-[-0.025em] text-ink">{property.name}</h2>
            <p className="mt-1.5 flex items-center gap-1.5 truncate text-[12px] text-slate2"><MapPin size={13} className="shrink-0" />{locationLine(property)}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-slate2 transition-all group-hover:bg-leaf group-hover:text-white"><ArrowRight size={16} /></span>
        </div>
        {amenities.length > 0 && <p className="mt-4 truncate text-[11px] font-medium text-slate2">{amenities.join('  ·  ')}</p>}
      </div>
    </button>
  );
}

function PropertyDetail({ property, onClose }) {
  const href = whatsappHref(property);
  const amenities = property.amenities?.map(a => AMENITY_LABEL[a] || a).filter(Boolean) || [];

  useEffect(() => {
    const onKeyDown = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previous; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-ink/55 p-0 backdrop-blur-md animate-fadein sm:items-center sm:p-5" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[30px] bg-white shadow-2xl animate-slideup sm:max-w-[640px] sm:rounded-[30px]">
        <div className="relative">
          <PropertyImage property={property} detail />
          <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-105"><X size={18} /></button>
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur"><span className="h-1.5 w-1.5 rounded-full bg-leaf" />Live vacancy</div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[25px] font-extrabold tracking-[-0.04em] text-ink">{property.name}</h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-slate2"><MapPin size={14} />{locationLine(property)}</p>
            </div>
            <GenderTag value={property.gender_preference} />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-leaf/15 bg-leaf/[0.045] p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf text-white"><BedDouble size={21} /></div>
            <div><p className="text-xl font-extrabold tracking-tight text-ink">{property.vacant_beds}</p><p className="text-[11px] font-medium text-slate2">bed{property.vacant_beds === 1 ? '' : 's'} available now</p></div>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-leaf"><CheckCircle2 size={14} />Live</div>
          </div>

          {property.listing_description && <p className="mt-6 text-[14px] leading-6 text-slate2">{property.listing_description}</p>}

          {amenities.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate2">Basics</p>
              <div className="mt-2.5 flex flex-wrap gap-2">{amenities.map(a => <span key={a} className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-ink">{a}</span>)}</div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-[11px] text-slate2"><ShieldCheck size={15} className="text-leaf" />Owner-managed listing · availability from NivaOps</div>

          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-[14px] font-bold text-white transition-all hover:bg-leaf hover:shadow-[0_12px_28px_-14px_rgba(22,101,52,.7)]"><MessageCircle size={18} />Talk to property</a>
          ) : <p className="mt-6 rounded-2xl bg-mist px-4 py-3.5 text-center text-sm text-slate2">Contact the property directly for availability.</p>}
        </div>
      </div>
    </div>
  );
}

function GenderSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = GENDER_OPTIONS.find(o => o.value === value) || GENDER_OPTIONS[0];
  return (
    <div className="relative shrink-0">
      <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className="flex h-11 items-center gap-1.5 rounded-xl px-3 text-[12px] font-bold text-ink hover:bg-mist sm:px-4">{current.label}<ChevronDown size={14} className={`text-slate2 transition-transform ${open ? 'rotate-180' : ''}`} /></button>
      {open && <><button type="button" aria-label="Close" className="fixed inset-0 z-10" onClick={() => setOpen(false)} /><div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[120px] rounded-2xl border border-border bg-white p-1.5 shadow-xl">{GENDER_OPTIONS.map(o => <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }} className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm hover:bg-mist ${o.value === value ? 'font-bold text-leaf' : 'text-ink'}`}>{o.label}</button>)}</div></>}
    </div>
  );
}

function LoadingCard() {
  return <div className="overflow-hidden rounded-[24px] border border-border bg-white"><div className="aspect-[1.12/1] animate-pulse bg-mist" /><div className="space-y-3 p-5"><div className="h-4 w-2/3 animate-pulse rounded bg-mist" /><div className="h-3 w-1/2 animate-pulse rounded bg-mist" /><div className="h-3 w-3/4 animate-pulse rounded bg-mist" /></div></div>;
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
    setProperties(null); setError('');
    fetchListedProperties(city || null).then(data => { if (active) setProperties(Array.isArray(data) ? data : []); }).catch(err => { if (active) { setError(err?.message || 'Listings are unavailable right now.'); setProperties([]); } });
    return () => { active = false; };
  }, [city]);

  const filtered = useMemo(() => {
    if (!properties) return [];
    const q = query.trim().toLowerCase();
    return properties.filter(property => {
      const genderMatch = gender === 'any' || property.gender_preference === gender || property.gender_preference === 'any';
      const searchMatch = !q || [property.name, property.locality, property.city].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
      return genderMatch && searchMatch;
    });
  }, [properties, query, gender]);

  const cityLabel = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'near you';
  const availableCount = filtered.reduce((sum, property) => sum + Number(property.vacant_beds || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-ink">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top,0px)' }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2"><NivaLogo size={25} /><NivaWordmark size="base" /><span className="hidden pl-2 text-xs text-slate2 sm:inline">STAYS</span></div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-slate2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" />Live</div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-black/[0.06] bg-white">
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-leaf/[0.07] blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 pb-7 pt-9 sm:px-8 sm:pb-12 sm:pt-16">
            <div className="grid gap-7 lg:grid-cols-[1fr_460px] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-leaf"><span className="h-1.5 w-1.5 rounded-full bg-leaf" />Live vacancy</div>
                <h1 className="max-w-2xl text-[clamp(38px,7vw,66px)] font-extrabold leading-[.94] tracking-[-.06em] text-ink">Find a bed.<br /><span className="text-leaf">Move smarter.</span></h1>
                <p className="mt-4 text-[13px] text-slate2 sm:text-[15px]">Available now in {cityLabel}.</p>
              </div>

              <div className="rounded-[22px] border border-black/[0.08] bg-[#fafbfa] p-2 shadow-[0_18px_45px_-30px_rgba(15,23,42,.28)] focus-within:border-black/[0.16] focus-within:bg-white">
                <div className="flex h-11 items-center">
                  <Search size={17} className="ml-3 shrink-0 text-slate2" />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by area or property" aria-label="Search PGs and hostels" className="min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none placeholder:text-slate2/60" />
                  {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist"><X size={14} /></button>}
                  <GenderSelect value={gender} onChange={setGender} />
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between border-t border-black/[0.06] pt-4">
              <div><span className="text-[clamp(25px,5vw,34px)] font-extrabold tracking-[-.045em] text-ink">{properties === null ? '—' : availableCount}</span><span className="ml-2 text-[11px] font-medium uppercase tracking-[.12em] text-slate2">beds available</span></div>
              <div className="hidden items-center gap-4 text-[10px] font-semibold uppercase tracking-[.12em] text-slate2 sm:flex"><span>Direct contact</span><span>No brokerage</span></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-12">
          {error && <div className="mb-5 rounded-2xl border border-coral/20 bg-coral/5 px-4 py-3 text-sm text-coral">{error}</div>}
          {properties === null ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map(i => <LoadingCard key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center sm:py-24"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white ring-1 ring-border"><BedDouble size={24} className="text-slate2/50" /></div><h2 className="mt-5 text-lg font-bold tracking-tight">{query || gender !== 'any' ? 'No match' : 'No live vacancies'}</h2><p className="mt-2 text-sm leading-6 text-slate2">{query || gender !== 'any' ? 'Try another area or stay type.' : 'New vacancies appear here as properties open beds.'}</p>{(query || gender !== 'any') && <button type="button" onClick={() => { setQuery(''); setGender('any'); }} className="mt-4 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">Clear filters</button>}</div>
          ) : (
            <>
              <div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-leaf">Available now</p><h2 className="mt-1 text-[22px] font-extrabold tracking-[-.035em] sm:text-[26px]">Places with a bed</h2></div><span className="text-[11px] text-slate2">{filtered.length} {filtered.length === 1 ? 'property' : 'properties'}</span></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((property, index) => <PropertyCard key={property.id} property={property} index={index} onOpen={setSelected} />)}</div>
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-black/[0.06] bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-7 sm:px-8"><div className="flex items-center gap-2"><NivaLogo size={19} /><span className="text-xs font-semibold">NivaOps</span></div><span className="text-[10px] text-slate2">Live accommodation listings</span></div></footer>
      {selected && <PropertyDetail property={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
