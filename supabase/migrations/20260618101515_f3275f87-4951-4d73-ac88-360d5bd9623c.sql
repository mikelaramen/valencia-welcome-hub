
DROP FUNCTION IF EXISTS public.claim_admin_if_unclaimed(uuid);

CREATE OR REPLACE FUNCTION public.claim_admin_if_unclaimed()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count int;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN FALSE;
  END IF;
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
    ON CONFLICT DO NOTHING;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_admin_if_unclaimed() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_unclaimed() TO authenticated;
