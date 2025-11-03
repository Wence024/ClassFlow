-- Add dismissed field to resource_requests table
ALTER TABLE public.resource_requests 
ADD COLUMN dismissed BOOLEAN NOT NULL DEFAULT false;

-- Add index for better query performance
CREATE INDEX idx_resource_requests_dismissed ON public.resource_requests(dismissed);

-- Add index for common query pattern (requester + status + dismissed)
CREATE INDEX idx_resource_requests_requester_status_dismissed 
ON public.resource_requests(requester_id, status, dismissed);