-- Insert payment data for szkola type
-- All classes have max = 3750
-- wplacone values are specified per class

INSERT INTO payments (class, type, max, wplacone) VALUES
  ('1B', 'szkola', 3750, 1050),
  ('1C', 'szkola', 3750, 525),
  ('1D', 'szkola', 3750, 1255),
  ('1E', 'szkola', 3750, 1075),
  ('2A', 'szkola', 3750, 1625),
  ('2B', 'szkola', 3750, 1300),
  ('2C', 'szkola', 3750, 775),
  ('2D', 'szkola', 3750, 750),
  ('2E', 'szkola', 3750, 755),
  ('3A', 'szkola', 3750, 1125),
  ('3B', 'szkola', 3750, 150),
  ('3D', 'szkola', 3750, 900),
  ('3E', 'szkola', 3750, 1205),
  ('4A', 'szkola', 3750, 600),
  ('4B', 'szkola', 3750, 300),
  ('4C', 'szkola', 3750, 150),
  ('4D', 'szkola', 3750, 1100),
  ('5A', 'szkola', 3750, 150),
  ('5B', 'szkola', 3750, 300),
  ('5C', 'szkola', 3750, 450),
  ('5D', 'szkola', 3750, 1050),
  ('5E', 'szkola', 3750, 750),
  ('6A', 'szkola', 3750, 525),
  ('6B', 'szkola', 3750, 1125),
  ('6C', 'szkola', 3750, 150),
  ('6D', 'szkola', 3750, 1275),
  ('7A', 'szkola', 3750, 900),
  ('8A', 'szkola', 3750, 575),
  ('8B', 'szkola', 3750, 450)
ON CONFLICT (class, type) DO UPDATE SET
  max = EXCLUDED.max,
  wplacone = EXCLUDED.wplacone,
  updated_at = NOW();

