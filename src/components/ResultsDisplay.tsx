import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

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

interface ResultsDisplayProps {
  results: SimulationResult | null;
  loading?: boolean;
}

export const ResultsDisplay = ({ results, loading }: ResultsDisplayProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calculating Results...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ROI Results</CardTitle>
          <CardDescription>Enter parameters to see your potential savings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Fill out the form to calculate your ROI
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            ${results.monthly_savings.toLocaleString()}
          </div>
          <p className="text-sm opacity-90 mt-2">
            Save this amount every month with automation
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-4 w-4" />
              Payback Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {results.payback_months} months
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Percent className="h-4 w-4" />
              Return on Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {results.roi_percentage.toLocaleString()}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Net Savings</span>
            <span className="font-semibold text-lg">
              ${results.net_savings.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Cumulative Savings</span>
            <span className="font-semibold text-lg">
              ${results.cumulative_savings.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Manual Labor Cost</span>
            <span className="font-semibold">
              ${results.labor_cost_manual.toLocaleString()}/mo
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Automation Cost</span>
            <span className="font-semibold">
              ${results.auto_cost.toLocaleString()}/mo
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Error Reduction Savings</span>
            <span className="font-semibold">
              ${results.error_savings.toLocaleString()}/mo
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};