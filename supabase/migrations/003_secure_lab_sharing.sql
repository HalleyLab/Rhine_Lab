-- Rhine Lab 0.1.9: encrypted member publications, owner-created LABs and email-bound invitations.
-- Apply after 001_rhine_lab_sync.sql and 002_lab_member_directory.sql.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.lab_invites (
    id uuid primary key default gen_random_uuid(),
    lab_id uuid not null references public.labs(id) on delete cascade,
    invited_email text not null,
    token_hash bytea not null unique,
    created_by uuid not null references auth.users(id) on delete cascade,
    expires_at timestamptz not null default (now() + interval '7 days'),
    used_at timestamptz,
    used_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    constraint lab_invites_email_check check (invited_email = lower(trim(invited_email)))
);

create table if not exists public.lab_member_publications (
    lab_id uuid not null references public.labs(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    encrypted_payload jsonb not null,
    revision bigint not null default 1,
    updated_at timestamptz not null default now(),
    primary key (lab_id, user_id)
);

create index if not exists lab_invites_lab_id_idx on public.lab_invites(lab_id);
create index if not exists lab_member_publications_lab_id_idx on public.lab_member_publications(lab_id);

create or replace function public.bump_lab_publication_revision()
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

drop trigger if exists bump_lab_publication_before_update on public.lab_member_publications;
create trigger bump_lab_publication_before_update
before update on public.lab_member_publications
for each row execute function public.bump_lab_publication_revision();

alter table public.lab_invites enable row level security;
alter table public.lab_member_publications enable row level security;

-- A LAB is created only through the audited RPC below. Direct client inserts are disabled.
drop policy if exists "users can create labs" on public.labs;
revoke insert, update on public.labs from authenticated;

-- Membership changes are performed only by invitation RPCs. Legacy managers lose write authority.
drop policy if exists "managers can add members" on public.lab_members;
drop policy if exists "managers can update members" on public.lab_members;
drop policy if exists "managers can remove members" on public.lab_members;
revoke insert, update, delete on public.lab_members from authenticated;

-- Legacy LAB snapshots may remain stored for rollback, but authenticated clients can no longer read or write them.
drop policy if exists "users can read allowed workspaces" on public.workspace_snapshots;
drop policy if exists "users can read personal workspaces" on public.workspace_snapshots;
create policy "users can read personal workspaces" on public.workspace_snapshots
for select to authenticated using (
    scope = 'personal'
    and owner_id = auth.uid()
    and lab_id is null
);
drop policy if exists "users can create allowed workspaces" on public.workspace_snapshots;
create policy "users can create personal workspaces" on public.workspace_snapshots
for insert to authenticated with check (
    scope = 'personal'
    and owner_id = auth.uid()
    and lab_id is null
    and updated_by = auth.uid()
);

drop policy if exists "users can update allowed workspaces" on public.workspace_snapshots;
create policy "users can update personal workspaces" on public.workspace_snapshots
for update to authenticated
using (scope = 'personal' and owner_id = auth.uid() and lab_id is null)
with check (scope = 'personal' and owner_id = auth.uid() and lab_id is null and updated_by = auth.uid());

drop policy if exists "lab owners can read invitations" on public.lab_invites;
create policy "lab owners can read invitations" on public.lab_invites
for select to authenticated using (
    exists (
        select 1 from public.lab_members membership
        where membership.lab_id = lab_invites.lab_id
          and membership.user_id = auth.uid()
          and membership.role = 'owner'
    )
);

drop policy if exists "members can read encrypted publications" on public.lab_member_publications;
create policy "members can read encrypted publications" on public.lab_member_publications
for select to authenticated using (public.is_lab_member(lab_id));

drop policy if exists "members can publish their own projection" on public.lab_member_publications;
create policy "members can publish their own projection" on public.lab_member_publications
for insert to authenticated with check (user_id = auth.uid() and public.is_lab_member(lab_id));

drop policy if exists "members can update their own projection" on public.lab_member_publications;
create policy "members can update their own projection" on public.lab_member_publications
for update to authenticated
using (user_id = auth.uid() and public.is_lab_member(lab_id))
with check (user_id = auth.uid() and public.is_lab_member(lab_id));

grant select, insert, update on public.lab_member_publications to authenticated;
grant select on public.lab_invites to authenticated;

-- New attachments are account-encrypted and private to their owner. Disable legacy LAB-folder access.
drop policy if exists "users can read allowed rhine attachments" on storage.objects;
create policy "users can read allowed rhine attachments" on storage.objects
for select to authenticated using (
    bucket_id = 'rhine-lab-attachments'
    and (storage.foldername(name))[1] = 'user'
    and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "users can upload allowed rhine attachments" on storage.objects;
create policy "users can upload allowed rhine attachments" on storage.objects
for insert to authenticated with check (
    bucket_id = 'rhine-lab-attachments'
    and (storage.foldername(name))[1] = 'user'
    and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "users can update allowed rhine attachments" on storage.objects;
create policy "users can update allowed rhine attachments" on storage.objects
for update to authenticated
using (
    bucket_id = 'rhine-lab-attachments'
    and (storage.foldername(name))[1] = 'user'
    and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
    bucket_id = 'rhine-lab-attachments'
    and (storage.foldername(name))[1] = 'user'
    and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "users can delete allowed rhine attachments" on storage.objects;
create policy "users can delete allowed rhine attachments" on storage.objects
for delete to authenticated using (
    bucket_id = 'rhine-lab-attachments'
    and (storage.foldername(name))[1] = 'user'
    and (storage.foldername(name))[2] = auth.uid()::text
);

create or replace function public.create_lab_with_owner(lab_name text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    caller uuid := auth.uid();
    created_lab uuid;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if exists (select 1 from public.labs where created_by = caller) then
        raise exception 'This account has already created a LAB';
    end if;
    if exists (select 1 from public.lab_members where user_id = caller) then
        raise exception 'This account already belongs to a LAB';
    end if;
    insert into public.labs (name, created_by)
    values (coalesce(nullif(trim(lab_name), ''), 'Rhine Lab'), caller)
    returning id into created_lab;
    return created_lab;
end;
$$;

create or replace function public.create_lab_invite(target_lab_id uuid, target_email text)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    normalized_email text := lower(trim(target_email));
    raw_token text := encode(gen_random_bytes(32), 'hex');
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then raise exception 'Invalid email address'; end if;
    if not exists (
        select 1 from public.lab_members
        where lab_id = target_lab_id and user_id = caller and role = 'owner'
    ) then raise exception 'Only the LAB creator can invite members'; end if;
    delete from public.lab_invites
    where lab_id = target_lab_id and invited_email = normalized_email and used_at is null;
    insert into public.lab_invites (lab_id, invited_email, token_hash, created_by)
    values (target_lab_id, normalized_email, digest(raw_token, 'sha256'), caller);
    return raw_token;
end;
$$;

create or replace function public.accept_lab_invite(raw_token text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    caller_email text;
    invitation public.lab_invites%rowtype;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    select lower(email::text) into caller_email from auth.users where id = caller;
    select * into invitation
    from public.lab_invites
    where token_hash = digest(raw_token, 'sha256')
      and used_at is null
      and expires_at > now()
    for update;
    if invitation.id is null then raise exception 'Invitation is invalid or expired'; end if;
    if invitation.invited_email <> caller_email then raise exception 'Invitation email does not match the signed-in account'; end if;
    if exists (select 1 from public.lab_members where user_id = caller and lab_id <> invitation.lab_id) then
        raise exception 'This account already belongs to another LAB';
    end if;
    insert into public.lab_members (lab_id, user_id, role)
    values (invitation.lab_id, caller, 'member')
    on conflict (lab_id, user_id) do nothing;
    update public.lab_invites set used_at = now(), used_by = caller where id = invitation.id;
    return invitation.lab_id;
end;
$$;

revoke all on function public.create_lab_with_owner(text) from public;
revoke all on function public.create_lab_invite(uuid, text) from public;
revoke all on function public.accept_lab_invite(text) from public;
grant execute on function public.create_lab_with_owner(text) to authenticated;
grant execute on function public.create_lab_invite(uuid, text) to authenticated;
grant execute on function public.accept_lab_invite(text) to authenticated;

create or replace function public.list_lab_member_emails(target_lab_id uuid)
returns table (user_id uuid, email text, role text, created_at timestamptz)
language sql
stable
security definer
set search_path = public, auth
as $$
    select memberships.user_id, accounts.email::text, memberships.role, memberships.created_at
    from public.lab_members memberships
    join auth.users accounts on accounts.id = memberships.user_id
    where memberships.lab_id = target_lab_id
      and exists (
          select 1 from public.lab_members caller
          where caller.lab_id = target_lab_id and caller.user_id = auth.uid() and caller.role = 'owner'
      )
    order by case memberships.role when 'owner' then 0 else 1 end, lower(accounts.email);
$$;

revoke all on function public.list_lab_member_emails(uuid) from public;
grant execute on function public.list_lab_member_emails(uuid) to authenticated;

do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lab_member_publications'
    ) then
        alter publication supabase_realtime add table public.lab_member_publications;
    end if;
end $$;

comment on table public.lab_member_publications is
'Each member may publish only their own application-generated, AES-GCM encrypted read-only projection.';
