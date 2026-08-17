-- LAB passwords, email-confirmation invitations, and member-visible directory.
-- Apply after 004_fix_lab_invite_pgcrypto_path.sql.

alter table public.labs
    add column if not exists password_hash text;

drop function if exists public.create_lab_with_owner(text);
drop function if exists public.create_lab_invite(uuid, text);

create or replace function public.create_lab_with_owner(lab_name text, lab_password text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    created_lab uuid;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if length(coalesce(lab_password, '')) < 10 then raise exception 'LAB password must contain at least 10 characters'; end if;
    if exists (select 1 from public.labs where created_by = caller) then
        raise exception 'This account has already created a LAB';
    end if;
    if exists (select 1 from public.lab_members where user_id = caller) then
        raise exception 'This account already belongs to a LAB';
    end if;

    insert into public.labs (name, created_by, password_hash)
    values (
        coalesce(nullif(trim(lab_name), ''), 'Rhine Lab'),
        caller,
        crypt(lab_password, gen_salt('bf', 12))
    )
    returning id into created_lab;

    return created_lab;
end;
$$;

create or replace function public.create_lab_invite(target_lab_id uuid, target_email text, lab_password text)
returns text
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    normalized_email text := lower(trim(target_email));
    raw_token text := encode(gen_random_bytes(32), 'hex');
    stored_password_hash text;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if length(coalesce(lab_password, '')) < 10 then raise exception 'LAB password must contain at least 10 characters'; end if;
    if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
        raise exception 'Invalid email address';
    end if;
    if not exists (
        select 1 from public.lab_members
        where lab_id = target_lab_id and user_id = caller and role = 'owner'
    ) then
        raise exception 'Only the LAB creator can invite members';
    end if;

    select password_hash into stored_password_hash
    from public.labs
    where id = target_lab_id
    for update;

    -- Existing LABs created before this migration establish their password
    -- the first time the owner sends an invitation.
    if stored_password_hash is null then
        update public.labs
        set password_hash = crypt(lab_password, gen_salt('bf', 12))
        where id = target_lab_id;
    elsif crypt(lab_password, stored_password_hash) <> stored_password_hash then
        raise exception 'Incorrect LAB password';
    end if;

    delete from public.lab_invites
    where lab_id = target_lab_id
      and invited_email = normalized_email
      and used_at is null;

    insert into public.lab_invites (lab_id, invited_email, token_hash, created_by)
    values (target_lab_id, normalized_email, digest(raw_token, 'sha256'), caller);

    return raw_token;
end;
$$;

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
          where caller.lab_id = target_lab_id
            and caller.user_id = auth.uid()
      )
    order by case memberships.role when 'owner' then 0 else 1 end, lower(accounts.email);
$$;

revoke all on function public.create_lab_with_owner(text, text) from public;
revoke all on function public.create_lab_invite(uuid, text, text) from public;
revoke all on function public.list_lab_member_emails(uuid) from public;
grant execute on function public.create_lab_with_owner(text, text) to authenticated;
grant execute on function public.create_lab_invite(uuid, text, text) to authenticated;
grant execute on function public.list_lab_member_emails(uuid) to authenticated;

comment on column public.labs.password_hash is
'bcrypt hash used to authorize owner-only invitation operations; plaintext is never stored.';
comment on function public.list_lab_member_emails(uuid) is
'Returns the LAB email directory to any authenticated member of that LAB.';
