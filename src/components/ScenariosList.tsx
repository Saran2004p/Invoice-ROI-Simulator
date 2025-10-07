import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Scenario = Database['public']['Tables']['scenarios']['Row'];

interface ScenariosListProps {
  scenarios: Scenario[];
  onLoad: (scenario: Scenario) => void;
  onDelete: (id: string) => void;
}

export const ScenariosList = ({ scenarios, onLoad, onDelete }: ScenariosListProps) => {
  if (scenarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Scenarios</CardTitle>
          <CardDescription>No saved scenarios yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Save your first scenario to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Scenarios</CardTitle>
        <CardDescription>Load or delete your saved calculations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold">{scenario.scenario_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {scenario.monthly_invoice_volume.toLocaleString()} invoices/mo • 
                  {scenario.num_ap_staff} staff • 
                  ${scenario.one_time_implementation_cost.toLocaleString()} cost
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created: {new Date(scenario.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLoad(scenario)}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Load
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(scenario.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};