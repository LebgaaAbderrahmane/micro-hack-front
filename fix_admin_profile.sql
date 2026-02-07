-- Fix missing admin profile
-- Replace 'cdb4d562-5836-4bfa-9976-bc7c5405269a' with your actual User ID if different
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    new_org_id uuid;
    target_user_id uuid := 'cdb4d562-5836-4bfa-9976-bc7c5405269a';
BEGIN
    -- 1. Create an Organization if it doesn't exist (or get existing one)
    INSERT INTO public.organisations (name, type)
    VALUES ('System Admin Org', 'ADMIN')
    ON CONFLICT DO NOTHING;
    
    SELECT id INTO new_org_id FROM public.organisations WHERE type = 'ADMIN' LIMIT 1;

    -- 2. Insert the User Profile
    INSERT INTO public.users (id, org_id, role, username, created_at)
    VALUES (
        target_user_id,
        new_org_id,
        'ADMIN',
        'admin_user',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        role = 'ADMIN',
        org_id = EXCLUDED.org_id;

    RAISE NOTICE 'Fixed profile for user % linked to org %', target_user_id, new_org_id;
END $$;
