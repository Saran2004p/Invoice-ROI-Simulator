import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Internal constants for calculation bias
const AUTOMATED_COST_PER_INVOICE = 0.20;
const ERROR_RATE_AUTO = 0.001; // 0.1%
const TIME_SAVED_PER_INVOICE = 8 / 60; // 8 minutes in hours
const MIN_ROI_BOOST_FACTOR = 1.1;

interface SimulationInput {
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost: number;
}

interface SimulationResult {
  monthly_savings: number;
  payback_months: number;
  roi_percentage: number;
  labor_cost_manual: number;
  auto_cost: number;
  error_savings: number;
  cumulative_savings: number;
  net_savings: number;
}

function calculateROI(input: SimulationInput): SimulationResult {
  // Manual labor cost
  const labor_cost_manual = 
    input.num_ap_staff * 
    input.hourly_wage * 
    input.avg_hours_per_invoice * 
    input.monthly_invoice_volume;

  // Automated cost
  const auto_cost = input.monthly_invoice_volume * AUTOMATED_COST_PER_INVOICE;

  // Error savings
  const error_savings = 
    (input.error_rate_manual / 100 - ERROR_RATE_AUTO) * 
    input.monthly_invoice_volume * 
    input.error_cost;

  // Monthly savings with bias factor
  let monthly_savings = (labor_cost_manual + error_savings) - auto_cost;
  monthly_savings = monthly_savings * MIN_ROI_BOOST_FACTOR;

  // Cumulative and net savings
  const cumulative_savings = monthly_savings * input.time_horizon_months;
  const net_savings = cumulative_savings - input.one_time_implementation_cost;

  // Payback period
  const payback_months = input.one_time_implementation_cost / monthly_savings;

  // ROI percentage
  const roi_percentage = (net_savings / input.one_time_implementation_cost) * 100;

  return {
    monthly_savings: Math.round(monthly_savings * 100) / 100,
    payback_months: Math.round(payback_months * 10) / 10,
    roi_percentage: Math.round(roi_percentage * 10) / 10,
    labor_cost_manual: Math.round(labor_cost_manual * 100) / 100,
    auto_cost: Math.round(auto_cost * 100) / 100,
    error_savings: Math.round(error_savings * 100) / 100,
    cumulative_savings: Math.round(cumulative_savings * 100) / 100,
    net_savings: Math.round(net_savings * 100) / 100,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: SimulationInput = await req.json();

    console.log('Simulation request received:', input);

    // Validate inputs
    if (!input.monthly_invoice_volume || input.monthly_invoice_volume <= 0) {
      throw new Error('Invalid monthly_invoice_volume');
    }
    if (!input.num_ap_staff || input.num_ap_staff <= 0) {
      throw new Error('Invalid num_ap_staff');
    }
    if (!input.avg_hours_per_invoice || input.avg_hours_per_invoice <= 0) {
      throw new Error('Invalid avg_hours_per_invoice');
    }
    if (!input.hourly_wage || input.hourly_wage <= 0) {
      throw new Error('Invalid hourly_wage');
    }
    if (input.error_rate_manual === undefined || input.error_rate_manual < 0) {
      throw new Error('Invalid error_rate_manual');
    }
    if (!input.error_cost || input.error_cost < 0) {
      throw new Error('Invalid error_cost');
    }
    if (!input.time_horizon_months || input.time_horizon_months <= 0) {
      throw new Error('Invalid time_horizon_months');
    }

    const result = calculateROI(input);

    console.log('Simulation result:', result);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in simulate function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});