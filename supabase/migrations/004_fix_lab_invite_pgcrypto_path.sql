-- Rhine Lab 0.1.9 hotfix: expose Supabase's pgcrypto schema to invitation RPCs.
-- Run once in the Supabase SQL editor after 003_secure_lab_sharing.sql.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

alter function public.create_lab_invite(uuid, text)
    set search_path = public, auth, extensions;

alter function public.accept_lab_invite(text)
    set search_path = public, auth, extensions;
