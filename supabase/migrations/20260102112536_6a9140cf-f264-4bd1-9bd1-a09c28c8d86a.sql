-- Add optional email field to service_requests
ALTER TABLE public.service_requests ADD COLUMN email TEXT;