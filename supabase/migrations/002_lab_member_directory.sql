-- Manager-only LAB member email directory.
-- Apply after 001_rhine_lab_sync.sql.

create or replace function public.list_lab_member_emails(target_lab_id uuid)
returns table (
    user_id uuid,
    email text,
    role text,
    created_at timestamptz
)
language sql
stable
security definer
set search_path = public, auth
as $$
    select
        memberships.user_id,
        accounts.email::text,
        memberships.role,
        memberships.created_at
    from public.lab_members as memberships
    join auth.users as accounts on accounts.id = memberships.user_id
    where memberships.lab_id = target_lab_id
      and public.can_manage_lab(target_lab_id)
    order by
        case memberships.role when 'owner' then 0 when 'manager' then 1 else 2 end,
        lower(accounts.email);
$$;

revoke all on function public.list_lab_member_emails(uuid) from public;
grant execute on function public.list_lab_member_emails(uuid) to authenticated;

comment on function public.list_lab_member_emails(uuid) is
'Returns email addresses for one LAB only when the caller is that LAB owner or manager.';
