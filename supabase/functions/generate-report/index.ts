import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportData {
  email: string;
  scenario_name: string;
  inputs: {
    monthly_invoice_volume: number;
    num_ap_staff: number;
    avg_hours_per_invoice: number;
    hourly_wage: number;
    error_rate_manual: number;
    error_cost: number;
    time_horizon_months: number;
    one_time_implementation_cost: number;
  };
  results: {
    monthly_savings: number;
    payback_months: number;
    roi_percentage: number;
    labor_cost_manual: number;
    auto_cost: number;
    error_savings: number;
    cumulative_savings: number;
    net_savings: number;
  };
}

function generateHTMLReport(data: ReportData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ROI Simulation Report - ${data.scenario_name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          background: #f8fafc;
          padding: 40px 20px;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        .header h1 { font-size: 32px; margin-bottom: 8px; }
        .header p { opacity: 0.9; }
        .content { padding: 40px; }
        .section { margin-bottom: 32px; }
        .section h2 { 
          font-size: 20px; 
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .metric {
          background: #f1f5f9;
          padding: 20px;
          border-radius: 8px;
        }
        .metric-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }
        .highlight {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        .highlight .metric-label { color: rgba(255,255,255,0.8); }
        .highlight .metric-value { color: white; }
        .data-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .data-label { color: #64748b; }
        .data-value { font-weight: 500; }
        .footer {
          background: #f8fafc;
          padding: 24px 40px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ROI Simulation Report</h1>
          <p>${data.scenario_name}</p>
          <p style="font-size: 14px; margin-top: 8px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Key Results</h2>
            <div class="metric-grid">
              <div class="metric highlight">
                <div class="metric-label">Monthly Savings</div>
                <div class="metric-value">$${data.results.monthly_savings.toLocaleString()}</div>
              </div>
              <div class="metric highlight">
                <div class="metric-label">Payback Period</div>
                <div class="metric-value">${data.results.payback_months} months</div>
              </div>
              <div class="metric highlight">
                <div class="metric-label">ROI</div>
                <div class="metric-value">${data.results.roi_percentage.toLocaleString()}%</div>
              </div>
            </div>
            
            <div class="metric-grid">
              <div class="metric">
                <div class="metric-label">Net Savings (${data.inputs.time_horizon_months}mo)</div>
                <div class="metric-value">$${data.results.net_savings.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Cumulative Savings</div>
                <div class="metric-value">$${data.results.cumulative_savings.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Cost Breakdown</h2>
            <div class="data-row">
              <span class="data-label">Manual Labor Cost (Monthly)</span>
              <span class="data-value">$${data.results.labor_cost_manual.toLocaleString()}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Automation Cost (Monthly)</span>
              <span class="data-value">$${data.results.auto_cost.toLocaleString()}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Error Savings (Monthly)</span>
              <span class="data-value">$${data.results.error_savings.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Input Parameters</h2>
            <div class="data-row">
              <span class="data-label">Monthly Invoice Volume</span>
              <span class="data-value">${data.inputs.monthly_invoice_volume.toLocaleString()}</span>
            </div>
            <div class="data-row">
              <span class="data-label">AP Staff Count</span>
              <span class="data-value">${data.inputs.num_ap_staff}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Avg Hours per Invoice</span>
              <span class="data-value">${data.inputs.avg_hours_per_invoice}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Hourly Wage</span>
              <span class="data-value">$${data.inputs.hourly_wage}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Manual Error Rate</span>
              <span class="data-value">${data.inputs.error_rate_manual}%</span>
            </div>
            <div class="data-row">
              <span class="data-label">Error Cost</span>
              <span class="data-value">$${data.inputs.error_cost}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Time Horizon</span>
              <span class="data-value">${data.inputs.time_horizon_months} months</span>
            </div>
            <div class="data-row">
              <span class="data-label">Implementation Cost</span>
              <span class="data-value">$${data.inputs.one_time_implementation_cost.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Report prepared for: ${data.email}</p>
          <p style="margin-top: 8px;">© ${new Date().getFullYear()} Invoicing ROI Simulator</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReportData = await req.json();

    console.log('Report generation request for:', data.email);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      throw new Error('Invalid email address');
    }

    // Generate HTML report
    const htmlReport = generateHTMLReport(data);

    console.log('Report generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        html: htmlReport,
        message: 'Report generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in generate-report function:', error);
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