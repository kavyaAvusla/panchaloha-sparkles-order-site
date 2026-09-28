-- Order site — realistic demo data for an imitation jewellery shop.
-- Run this whole block ONCE, AFTER schema.sql.
-- It only inserts when a table is still empty, so running it twice adds nothing.

-- ---------------------------------------------------------------------------
-- items: what the shop sells
-- ---------------------------------------------------------------------------
insert into public.items (name, description, price, category, image)
select v.name, v.description, v.price, v.category, v.image
from (values
  ('Antique Jhumka (pair)',     'Matte gold finish with tiny pearl drops',        349.00,  'Earrings',    '/images/item-1.svg'),
  ('Kundan Choker Set',         'Choker with matching earrings, red and gold',   1299.00,  'Necklace set','/images/item-2.svg'),
  ('Pearl Bangles (set of 6)',  'Light cream pearls, medium size',                499.00,  'Bangles',     '/images/item-3.svg'),
  ('Oxidised Necklace',         'Oxidised finish, good for everyday wear',        349.00,  'Necklace',    '/images/item-4.svg'),
  ('AD Stone Earrings',         'White stone drops, party wear',                  599.00,  'Earrings',    '/images/item-5.svg'),
  ('Bridal Combo Set',          'Necklace, earrings and maang tikka together',   2499.00,  'Bridal set',  '/images/item-6.svg'),
  ('Everyday Studs',            'Small gold-tone studs for daily use',            149.00,  'Earrings',    '/images/item-6.svg'),
  ('Maang Tikka',               'Simple gold-tone tikka',                         299.00,  'Maang tikka', '/images/item-2.svg')
) as v(name, description, price, category, image)
where not exists (select 1 from public.items);

-- ---------------------------------------------------------------------------
-- orders: two sample rows so the shop's sheet is not empty on day one
-- ---------------------------------------------------------------------------
insert into public.orders (name, phone, item, price)
select v.name, v.phone, v.item, v.price
from (values
  ('Laxmi', '9951640472', 'Kundan Choker Set',        1299.00),
  ('Sneha', '9849012345', 'Pearl Bangles (set of 6)',  499.00)
) as v(name, phone, item, price)
where not exists (select 1 from public.orders);
