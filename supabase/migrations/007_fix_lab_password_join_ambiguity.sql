-- Rhine Lab 0.1.9: remove the PL/pgSQL output-column ambiguity in password joining.
-- Apply after 006_multi_lab_password_join.sql.

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

    select lab_record.* into target
    from public.labs as lab_record
    where lower(trim(lab_record.name)) = lower(trim(join_lab_with_password.lab_name));

    if target.id is null or target.password_hash is null
       or crypt(lab_password, target.password_hash) <> target.password_hash then
        raise exception 'Incorrect LAB name or password';
    end if;
    if target.key_envelope is null then
        raise exception 'Password joining is not enabled for this LAB';
    end if;

    insert into public.lab_members as membership_record (lab_id, user_id, role)
    values (target.id, caller, 'member')
    on conflict on constraint lab_members_pkey do nothing;

    return query select target.id, target.key_envelope;
end;
$$;

revoke all on function public.join_lab_with_password(text, text) from public;
grant execute on function public.join_lab_with_password(text, text) to authenticated;

comment on function public.join_lab_with_password(text, text) is
'Adds the authenticated user to a uniquely named LAB after password verification and returns only the wrapped LAB key.';
