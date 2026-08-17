-- Rhine Lab 0.1.9: multiple LAB memberships and password-based LAB joining.
-- Apply after 005_lab_password_and_email_invites.sql.

alter table public.labs
    add column if not exists key_envelope jsonb;

create unique index if not exists labs_normalized_name_unique
    on public.labs (lower(trim(name)));

create or replace function public.create_lab_with_owner(lab_name text, lab_password text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    normalized_name text := trim(lab_name);
    created_lab uuid;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if length(normalized_name) < 2 or length(normalized_name) > 80 then
        raise exception 'LAB name must contain 2 to 80 characters';
    end if;
    if length(coalesce(lab_password, '')) < 10 then
        raise exception 'LAB password must contain at least 10 characters';
    end if;

    insert into public.labs (name, created_by, password_hash)
    values (normalized_name, caller, crypt(lab_password, gen_salt('bf', 12)))
    returning id into created_lab;

    return created_lab;
end;
$$;

create or replace function public.set_lab_key_envelope(
    target_lab_id uuid,
    lab_password text,
    lab_key_envelope jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    stored_password_hash text;
    stored_envelope jsonb;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if length(coalesce(lab_password, '')) < 10 then
        raise exception 'LAB password must contain at least 10 characters';
    end if;
    if jsonb_typeof(lab_key_envelope) <> 'object'
       or lab_key_envelope ->> 'alg' <> 'A256GCM'
       or lab_key_envelope ->> 'purpose' <> 'lab-key-wrap' then
        raise exception 'Invalid LAB key envelope';
    end if;
    if not exists (
        select 1 from public.lab_members
        where lab_id = target_lab_id and user_id = caller and role = 'owner'
    ) then
        raise exception 'Only the LAB creator can configure password joining';
    end if;

    select password_hash, key_envelope
    into stored_password_hash, stored_envelope
    from public.labs
    where id = target_lab_id
    for update;

    if stored_password_hash is null then
        update public.labs
        set password_hash = crypt(lab_password, gen_salt('bf', 12))
        where id = target_lab_id;
    elsif crypt(lab_password, stored_password_hash) <> stored_password_hash then
        raise exception 'Incorrect LAB password';
    end if;

    if stored_envelope is null then
        update public.labs
        set key_envelope = lab_key_envelope
        where id = target_lab_id
        returning key_envelope into stored_envelope;
    end if;

    return stored_envelope;
end;
$$;

create or replace function public.join_lab_with_password(lab_name text, lab_password text)
returns table (lab_id uuid, key_envelope jsonb)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
    caller uuid := auth.uid();
    target public.labs%rowtype;
begin
    if caller is null then raise exception 'Authentication required'; end if;
    if length(coalesce(lab_password, '')) < 10 then
        raise exception 'LAB password must contain at least 10 characters';
    end if;

    select * into target
    from public.labs
    where lower(trim(name)) = lower(trim(lab_name));

    if target.id is null or target.password_hash is null
       or crypt(lab_password, target.password_hash) <> target.password_hash then
        raise exception 'Incorrect LAB name or password';
    end if;
    if target.key_envelope is null then
        raise exception 'Password joining is not enabled for this LAB; ask the creator for an invitation link';
    end if;

    insert into public.lab_members (lab_id, user_id, role)
    values (target.id, caller, 'member')
    on conflict (lab_id, user_id) do nothing;

    return query select target.id, target.key_envelope;
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
    if invitation.invited_email <> caller_email then
        raise exception 'Invitation email does not match the signed-in account';
    end if;

    insert into public.lab_members (lab_id, user_id, role)
    values (invitation.lab_id, caller, 'member')
    on conflict (lab_id, user_id) do nothing;

    update public.lab_invites
    set used_at = now(), used_by = caller
    where id = invitation.id;

    return invitation.lab_id;
end;
$$;

revoke all on function public.create_lab_with_owner(text, text) from public;
revoke all on function public.set_lab_key_envelope(uuid, text, jsonb) from public;
revoke all on function public.join_lab_with_password(text, text) from public;
revoke all on function public.accept_lab_invite(text) from public;
grant execute on function public.create_lab_with_owner(text, text) to authenticated;
grant execute on function public.set_lab_key_envelope(uuid, text, jsonb) to authenticated;
grant execute on function public.join_lab_with_password(text, text) to authenticated;
grant execute on function public.accept_lab_invite(text) to authenticated;

comment on column public.labs.key_envelope is
'Random LAB AES key wrapped client-side with the LAB password; plaintext keys and passwords are never stored.';
comment on function public.join_lab_with_password(text, text) is
'Adds the authenticated user to a uniquely named LAB after password verification and returns only the wrapped LAB key.';
