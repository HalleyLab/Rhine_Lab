-- Rhine Lab cross-device synchronization and server-enforced permissions.
-- Run in the Supabase SQL editor as the project owner.

create extension if not exists pgcrypto;

create table if not exists public.labs (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    created_by uuid not null references auth.users(id) on delete restrict,
    created_at timestamptz not null default now()
);

create table if not exists public.lab_members (
    lab_id uuid not null references public.labs(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'member' check (role in ('owner', 'manager', 'member')),
    created_at timestamptz not null default now(),
    primary key (lab_id, user_id)
);

create table if not exists public.workspace_snapshots (
    workspace_key text primary key,
    scope text not null check (scope in ('personal', 'lab')),
    owner_id uuid references auth.users(id) on delete cascade,
    lab_id uuid references public.labs(id) on delete cascade,
    payload jsonb not null default '{}'::jsonb,
    revision bigint not null default 1,
    updated_by uuid not null references auth.users(id) on delete restrict,
    updated_at timestamptz not null default now(),
    constraint workspace_scope_owner_check check (
        (scope = 'personal' and owner_id is not null and lab_id is null and workspace_key = 'user:' || owner_id::text)
        or
        (scope = 'lab' and owner_id is null and lab_id is not null and workspace_key = 'lab:' || lab_id::text)
    )
);

create index if not exists lab_members_user_id_idx on public.lab_members(user_id);
create index if not exists workspace_snapshots_owner_id_idx on public.workspace_snapshots(owner_id);
create index if not exists workspace_snapshots_lab_id_idx on public.workspace_snapshots(lab_id);

create or replace function public.is_lab_member(target_lab_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.lab_members
        where lab_id = target_lab_id and user_id = auth.uid()
    );
$$;

create or replace function public.can_manage_lab(target_lab_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.lab_members
        where lab_id = target_lab_id
          and user_id = auth.uid()
          and role in ('owner', 'manager')
    );
$$;

create or replace function public.is_lab_member_text(target_lab_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.lab_members
        where lab_id::text = target_lab_id and user_id = auth.uid()
    );
$$;

create or replace function public.can_manage_lab_text(target_lab_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.lab_members
        where lab_id::text = target_lab_id
          and user_id = auth.uid()
          and role in ('owner', 'manager')
    );
$$;

create or replace function public.add_lab_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.lab_members (lab_id, user_id, role)
    values (new.id, new.created_by, 'owner')
    on conflict (lab_id, user_id) do update set role = 'owner';
    return new;
end;
$$;

drop trigger if exists add_lab_owner_after_insert on public.labs;
create trigger add_lab_owner_after_insert
after insert on public.labs
for each row execute function public.add_lab_owner_membership();

create or replace function public.bump_workspace_revision()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.revision = old.revision + 1;
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists bump_workspace_revision_before_update on public.workspace_snapshots;
create trigger bump_workspace_revision_before_update
before update on public.workspace_snapshots
for each row execute function public.bump_workspace_revision();

alter table public.labs enable row level security;
alter table public.lab_members enable row level security;
alter table public.workspace_snapshots enable row level security;

drop policy if exists "members can read labs" on public.labs;
create policy "members can read labs" on public.labs
for select to authenticated using (public.is_lab_member(id));

drop policy if exists "users can create labs" on public.labs;
create policy "users can create labs" on public.labs
for insert to authenticated with check (created_by = auth.uid());

drop policy if exists "owners can update labs" on public.labs;
create policy "owners can update labs" on public.labs
for update to authenticated
using (exists (select 1 from public.lab_members m where m.lab_id = id and m.user_id = auth.uid() and m.role = 'owner'))
with check (exists (select 1 from public.lab_members m where m.lab_id = id and m.user_id = auth.uid() and m.role = 'owner'));

drop policy if exists "members can read memberships" on public.lab_members;
create policy "members can read memberships" on public.lab_members
for select to authenticated using (user_id = auth.uid() or public.is_lab_member(lab_id));

drop policy if exists "managers can add members" on public.lab_members;
create policy "managers can add members" on public.lab_members
for insert to authenticated with check (public.can_manage_lab(lab_id));

drop policy if exists "managers can update members" on public.lab_members;
create policy "managers can update members" on public.lab_members
for update to authenticated
using (public.can_manage_lab(lab_id))
with check (public.can_manage_lab(lab_id));

drop policy if exists "managers can remove members" on public.lab_members;
create policy "managers can remove members" on public.lab_members
for delete to authenticated using (public.can_manage_lab(lab_id) and role <> 'owner');

drop policy if exists "users can read allowed workspaces" on public.workspace_snapshots;
create policy "users can read allowed workspaces" on public.workspace_snapshots
for select to authenticated using (
    (scope = 'personal' and owner_id = auth.uid())
    or (scope = 'lab' and public.is_lab_member(lab_id))
);

drop policy if exists "users can create allowed workspaces" on public.workspace_snapshots;
create policy "users can create allowed workspaces" on public.workspace_snapshots
for insert to authenticated with check (
    updated_by = auth.uid()
    and (
        (scope = 'personal' and owner_id = auth.uid())
        or (scope = 'lab' and public.can_manage_lab(lab_id))
    )
);

drop policy if exists "users can update allowed workspaces" on public.workspace_snapshots;
create policy "users can update allowed workspaces" on public.workspace_snapshots
for update to authenticated
using (
    (scope = 'personal' and owner_id = auth.uid())
    or (scope = 'lab' and public.can_manage_lab(lab_id))
)
with check (
    updated_by = auth.uid()
    and (
        (scope = 'personal' and owner_id = auth.uid())
        or (scope = 'lab' and public.can_manage_lab(lab_id))
    )
);

grant select, insert, update on public.workspace_snapshots to authenticated;
grant select on public.labs, public.lab_members to authenticated;
grant insert, update on public.labs to authenticated;
grant insert, update, delete on public.lab_members to authenticated;

insert into storage.buckets (id, name, public)
values ('rhine-lab-attachments', 'rhine-lab-attachments', false)
on conflict (id) do update set public = false;

drop policy if exists "users can read allowed rhine attachments" on storage.objects;
create policy "users can read allowed rhine attachments" on storage.objects
for select to authenticated using (
    bucket_id = 'rhine-lab-attachments'
    and (
        ((storage.foldername(name))[1] = 'user' and (storage.foldername(name))[2] = auth.uid()::text)
        or
        ((storage.foldername(name))[1] = 'lab' and public.is_lab_member_text((storage.foldername(name))[2]))
    )
);

drop policy if exists "users can upload allowed rhine attachments" on storage.objects;
create policy "users can upload allowed rhine attachments" on storage.objects
for insert to authenticated with check (
    bucket_id = 'rhine-lab-attachments'
    and (
        ((storage.foldername(name))[1] = 'user' and (storage.foldername(name))[2] = auth.uid()::text)
        or
        ((storage.foldername(name))[1] = 'lab' and public.can_manage_lab_text((storage.foldername(name))[2]))
    )
);

drop policy if exists "users can update allowed rhine attachments" on storage.objects;
create policy "users can update allowed rhine attachments" on storage.objects
for update to authenticated
using (
    bucket_id = 'rhine-lab-attachments'
    and (
        ((storage.foldername(name))[1] = 'user' and (storage.foldername(name))[2] = auth.uid()::text)
        or
        ((storage.foldername(name))[1] = 'lab' and public.can_manage_lab_text((storage.foldername(name))[2]))
    )
)
with check (
    bucket_id = 'rhine-lab-attachments'
    and (
        ((storage.foldername(name))[1] = 'user' and (storage.foldername(name))[2] = auth.uid()::text)
        or
        ((storage.foldername(name))[1] = 'lab' and public.can_manage_lab_text((storage.foldername(name))[2]))
    )
);

do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'workspace_snapshots'
    ) then
        alter publication supabase_realtime add table public.workspace_snapshots;
    end if;
end $$;

-- Create the first LAB after signing up, replacing the UUID with the manager's auth.users.id:
-- insert into public.labs (name, created_by) values ('Rhine Lab', '00000000-0000-0000-0000-000000000000');
