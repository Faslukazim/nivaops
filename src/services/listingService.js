import { hasSupabaseConfig, supabase } from '../lib/supabase';

export async function fetchListedProperties(city) {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase.rpc('get_listed_properties', { p_city: city ?? null });
  if (error) throw error;
  return data ?? [];
}

export async function fetchListedPropertyBeds(propertyId) {
  if (!hasSupabaseConfig) return [];
  const { data, error } = await supabase.rpc('get_listed_property_beds', { p_property_id: propertyId });
  if (error) throw error;
  return data ?? [];
}

export async function saveListingSettings(propertyId, {
  isListed, city, locality, description, coverPhotoUrl, genderPreference, amenities,
}) {
  const { error } = await supabase.rpc('set_property_listing', {
    p_property_id: propertyId,
    p_is_listed: isListed,
    p_city: city || null,
    p_locality: locality || null,
    p_listing_description: description || null,
    p_cover_photo_url: coverPhotoUrl || null,
    p_gender_preference: genderPreference || 'any',
    p_amenities: amenities || [],
  });
  if (error) throw error;
}

export async function saveBedAskingRent(bedId, askingRent) {
  const { error } = await supabase.rpc('set_bed_asking_rent', {
    p_bed_id: bedId,
    p_asking_rent: askingRent === '' || askingRent == null ? null : Number(askingRent),
  });
  if (error) throw error;
}
