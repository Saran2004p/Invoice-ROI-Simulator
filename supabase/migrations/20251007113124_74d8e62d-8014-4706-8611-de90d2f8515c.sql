-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create scenarios table for storing ROI calculations
CREATE TABLE public.scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  monthly_invoice_volume INTEGER NOT NULL,
  num_ap_staff INTEGER NOT NULL,
  avg_hours_per_invoice FLOAT NOT NULL,
  hourly_wage FLOAT NOT NULL,
  error_rate_manual FLOAT NOT NULL,
  error_cost FLOAT NOT NULL,
  time_horizon_months INTEGER NOT NULL,
  one_time_implementation_cost FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and write scenarios (public app)
CREATE POLICY "Anyone can view scenarios"
  ON public.scenarios
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scenarios"
  ON public.scenarios
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update scenarios"
  ON public.scenarios
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete scenarios"
  ON public.scenarios
  FOR DELETE
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();