ALTER TABLE expenses DROP CONSTRAINT expenses_category_check;
ALTER TABLE expenses ADD CONSTRAINT expenses_category_check
  CHECK (category = ANY (ARRAY['building_rent','food','salary','electricity','internet','maintenance','deposit_refund','misc']));
