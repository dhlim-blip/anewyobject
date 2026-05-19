-- =============================================
-- A NEW OBJECT — Supabase Schema
-- =============================================

-- Products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category text not null check (category in ('indoor', 'outdoor', 'succulent')),
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null,
  total_amount integer not null check (total_amount >= 0),
  status text default 'pending' check (status in ('pending','paid','preparing','shipping','delivered','cancelled')),
  shipping_address jsonb not null,
  payment_key text,
  created_at timestamptz default now()
);

-- Order Items
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  price integer not null,
  quantity integer not null check (quantity > 0)
);

-- =============================================
-- Indexes
-- =============================================
create index if not exists idx_products_category on products(category);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- =============================================
-- RLS (Row Level Security)
-- =============================================
alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read, only admin can write
create policy "Products are publicly readable"
  on products for select using (true);

create policy "Admins can manage products"
  on products for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Profiles: users can read/update their own
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Orders: users can see their own
create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on orders for insert with check (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on orders for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Order items: viewable by order owner
create policy "Users can view own order items"
  on order_items for select using (
    exists (select 1 from orders where id = order_id and user_id = auth.uid())
  );

create policy "System can insert order items"
  on order_items for insert with check (true);

create policy "Admins can manage order items"
  on order_items for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================
-- Trigger: auto-create profile on signup
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Function: decrement stock safely
-- =============================================
create or replace function decrement_stock(p_product_id uuid, p_quantity integer)
returns void as $$
begin
  update products
  set stock = greatest(0, stock - p_quantity),
      updated_at = now()
  where id = p_product_id;
end;
$$ language plpgsql security definer;

-- =============================================
-- Function: updated_at trigger
-- =============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on products
  for each row execute procedure update_updated_at_column();
