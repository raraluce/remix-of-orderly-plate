alter table public.restaurant_members enable row level security;

create policy "users can view own memberships"
  on public.restaurant_members
  for select
  to authenticated
  using (user_id = auth.uid());