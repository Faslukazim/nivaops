-- Drop the existing unique constraint that covers all rows (including inactive)
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_property_room_number_key;

-- Add a partial unique index so only active rooms are constrained
CREATE UNIQUE INDEX rooms_property_room_number_active_idx
  ON rooms (property_id, room_number)
  WHERE status = 'active';
