import { hasSupabaseConfig, supabase } from '../lib/supabase';

const STORAGE_KEY = 'stayb-tenants';
const DEFAULT_ORGANIZATION_NAME = 'Default Organization';
const DEFAULT_PROPERTY_NAME = 'Main Hostel';
const DEFAULT_TOTAL_BEDS = 24;
const DEFAULT_BED_NUMBER = '1';

const starterTenants = [
  {
    id: 'sample-1',
    name: 'Aarav Nair',
    phone: '919876543210',
    roomNumber: '101-A',
    monthlyRent: 6500,
    joinDate: '2026-05-01',
    paymentStatus: 'Paid',
    paymentDate: '2026-06-03',
  },
  {
    id: 'sample-2',
    name: 'Meera Khan',
    phone: '919812345678',
    roomNumber: '102-B',
    monthlyRent: 7000,
    joinDate: '2026-04-18',
    paymentStatus: 'Unpaid',
    paymentDate: '',
  },
  {
    id: 'sample-3',
    name: 'Rohan Das',
    phone: '919900112233',
    roomNumber: '103-A',
    monthlyRent: 6800,
    joinDate: '2026-06-01',
    paymentStatus: 'Unpaid',
    paymentDate: '',
  },
];

function readLocalTenants() {
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterTenants));
    return starterTenants;
  }

  return JSON.parse(saved);
}

function writeLocalTenants(tenants) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
}

function toUiTenant(occupancy) {
  return {
    id: occupancy.tenant.id,
    occupancyId: occupancy.id,
    propertyId: occupancy.property_id,
    roomId: occupancy.room_id,
    bedId: occupancy.bed_id,
    name: occupancy.tenant.name,
    phone: occupancy.tenant.phone,
    roomNumber: occupancy.room?.room_number ?? 'Unassigned',
    monthlyRent: Number(occupancy.monthly_rent ?? 0),
    joinDate: occupancy.tenant.join_date,
    paymentStatus: occupancy.payment_status,
    paymentDate: occupancy.payment_date ?? '',
  };
}

async function getDefaultOrganization() {
  const { data: existing, error: selectError } = await supabase
    .from('organizations')
    .select('*')
    .eq('name', DEFAULT_ORGANIZATION_NAME)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from('organizations')
    .insert({ name: DEFAULT_ORGANIZATION_NAME })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getDefaultProperty(organizationId) {
  const { data: existing, error: selectError } = await supabase
    .from('properties')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('name', DEFAULT_PROPERTY_NAME)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from('properties')
    .insert({
      organization_id: organizationId,
      name: DEFAULT_PROPERTY_NAME,
      total_beds: DEFAULT_TOTAL_BEDS,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getDefaultContext() {
  const organization = await getDefaultOrganization();
  const property = await getDefaultProperty(organization.id);
  return { organization, property };
}

async function getOrCreateRoom(propertyId, roomNumber) {
  const normalizedRoomNumber = String(roomNumber || 'Unassigned').trim() || 'Unassigned';

  const { data: existing, error: selectError } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .eq('room_number', normalizedRoomNumber)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      property_id: propertyId,
      room_number: normalizedRoomNumber,
      capacity: 1,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getOrCreateBed(roomId) {
  const { data: existing, error: selectError } = await supabase
    .from('beds')
    .select('*')
    .eq('room_id', roomId)
    .eq('bed_number', DEFAULT_BED_NUMBER)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from('beds')
    .insert({
      room_id: roomId,
      bed_number: DEFAULT_BED_NUMBER,
      status: 'available',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function fetchOccupancyByTenantId(tenantId) {
  const { data, error } = await supabase
    .from('occupancies')
    .select(`
      *,
      tenant:tenants(*),
      room:rooms(room_number),
      bed:beds(bed_number)
    `)
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .single();

  if (error) throw error;
  return data;
}

async function setBedStatus(bedId, status) {
  const { error } = await supabase.from('beds').update({ status }).eq('id', bedId);
  if (error) throw error;
}

export async function fetchTenants() {
  if (!hasSupabaseConfig) {
    return readLocalTenants();
  }

  await getDefaultContext();

  const { data, error } = await supabase
    .from('occupancies')
    .select(`
      *,
      tenant:tenants!inner(*),
      room:rooms(room_number),
      bed:beds(bed_number)
    `)
    .eq('status', 'active')
    .eq('tenant.status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toUiTenant);
}

export async function createTenant(tenant) {
  if (!hasSupabaseConfig) {
    const tenants = readLocalTenants();
    const newTenant = { ...tenant, id: crypto.randomUUID() };
    writeLocalTenants([newTenant, ...tenants]);
    return newTenant;
  }

  const { organization, property } = await getDefaultContext();
  const room = await getOrCreateRoom(property.id, tenant.roomNumber);
  const bed = await getOrCreateBed(room.id);

  const { data: createdTenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      organization_id: organization.id,
      property_id: property.id,
      name: tenant.name,
      phone: tenant.phone,
      join_date: tenant.joinDate,
      status: 'active',
    })
    .select()
    .single();

  if (tenantError) throw tenantError;

  const { data: occupancy, error: occupancyError } = await supabase
    .from('occupancies')
    .insert({
      tenant_id: createdTenant.id,
      property_id: property.id,
      room_id: room.id,
      bed_id: bed.id,
      monthly_rent: tenant.monthlyRent,
      payment_status: tenant.paymentStatus ?? 'Unpaid',
      payment_date: tenant.paymentDate || null,
      start_date: tenant.joinDate,
      status: 'active',
    })
    .select(`
      *,
      tenant:tenants(*),
      room:rooms(room_number),
      bed:beds(bed_number)
    `)
    .single();

  if (occupancyError) throw occupancyError;
  await setBedStatus(bed.id, 'occupied');
  return toUiTenant(occupancy);
}

export async function updateTenant(id, patch) {
  if (!hasSupabaseConfig) {
    const tenants = readLocalTenants();
    const updated = tenants.map((tenant) =>
      tenant.id === id ? { ...tenant, ...patch } : tenant,
    );
    writeLocalTenants(updated);
    return updated.find((tenant) => tenant.id === id);
  }

  const currentOccupancy = await fetchOccupancyByTenantId(id);
  const tenantPatch = {};
  const occupancyPatch = {};

  if (patch.name !== undefined) tenantPatch.name = patch.name;
  if (patch.phone !== undefined) tenantPatch.phone = patch.phone;
  if (patch.joinDate !== undefined) {
    tenantPatch.join_date = patch.joinDate;
    occupancyPatch.start_date = patch.joinDate;
  }
  if (patch.monthlyRent !== undefined) occupancyPatch.monthly_rent = patch.monthlyRent;
  if (patch.paymentStatus !== undefined) occupancyPatch.payment_status = patch.paymentStatus;
  if (patch.paymentDate !== undefined) occupancyPatch.payment_date = patch.paymentDate || null;

  if (Object.keys(tenantPatch).length > 0) {
    const { error } = await supabase.from('tenants').update(tenantPatch).eq('id', id);
    if (error) throw error;
  }

  if (patch.roomNumber !== undefined && patch.roomNumber !== currentOccupancy.room?.room_number) {
    const room = await getOrCreateRoom(currentOccupancy.property_id, patch.roomNumber);
    const bed = await getOrCreateBed(room.id);
    occupancyPatch.room_id = room.id;
    occupancyPatch.bed_id = bed.id;
    await setBedStatus(currentOccupancy.bed_id, 'available');
    await setBedStatus(bed.id, 'occupied');
  }

  if (Object.keys(occupancyPatch).length > 0) {
    const { error } = await supabase
      .from('occupancies')
      .update(occupancyPatch)
      .eq('id', currentOccupancy.id);

    if (error) throw error;
  }

  return toUiTenant(await fetchOccupancyByTenantId(id));
}

export async function deleteTenant(id) {
  if (!hasSupabaseConfig) {
    const tenants = readLocalTenants().filter((tenant) => tenant.id !== id);
    writeLocalTenants(tenants);
    return id;
  }

  const occupancy = await fetchOccupancyByTenantId(id);
  const today = new Date().toISOString().slice(0, 10);

  const { error: occupancyError } = await supabase
    .from('occupancies')
    .update({ status: 'ended', end_date: today })
    .eq('id', occupancy.id);

  if (occupancyError) throw occupancyError;

  const { error: tenantError } = await supabase
    .from('tenants')
    .update({ status: 'archived' })
    .eq('id', id);

  if (tenantError) throw tenantError;

  await setBedStatus(occupancy.bed_id, 'available');
  return id;
}
