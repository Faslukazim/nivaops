-- Ensure booking advance and tenant linkage columns exist without breaking live schema
alter table public.bookings add column if not exists tenant_id uuid references public.tenants(id) on delete set null;
alter table public.occupancies add column if not exists booking_advance numeric(10,2) default 0;

-- Update trigger function to record tenant_id on the converted booking
create or replace function public.convert_booking_on_occupancy_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' then
    update public.bookings
    set status = 'converted',
        tenant_id = new.tenant_id,
        updated_at = now()
    where bed_id = new.bed_id
      and status = 'pending';
  end if;

  return new;
end;
$$;
