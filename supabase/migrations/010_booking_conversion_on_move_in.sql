-- A booking is only converted after a real active occupancy is created for
-- the reserved bed. This keeps the booking visible while the tenant form is
-- being filled and prevents an abandoned conversion from losing the booking.

create or replace function public.convert_booking_on_occupancy_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' then
    update public.bookings
    set status = 'converted', updated_at = now()
    where bed_id = new.bed_id
      and status = 'pending';
  end if;

  return new;
end;
$$;

drop trigger if exists convert_booking_after_occupancy_insert on public.occupancies;
create trigger convert_booking_after_occupancy_insert
after insert on public.occupancies
for each row execute function public.convert_booking_on_occupancy_insert();