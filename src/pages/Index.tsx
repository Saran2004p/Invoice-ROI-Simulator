import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalculatorForm, type CalculatorFormData } from "@/components/CalculatorForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ReportModal } from "@/components/ReportModal";
import { ScenariosList } from "@/components/ScenariosList";
import type { Database } from "@/integrations/supabase/types";

type Scenario = Database['public']['Tables']['scenarios']['Row'];

const Index = () => {
  const [formData, setFormData] = useState<CalculatorFormData>({
    scenario_name: "",
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000,
  });
  const [results, setResults] = useState<any>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScenarios();
  }, []);

  useEffect(() => {
    calculateROI(formData);
  }, [formData]);

  const loadScenarios = async () => {
    const { data, error } = await supabase
      .from("scenarios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading scenarios:", error);
      toast.error("Failed to load scenarios");
      return;
    }

    setScenarios(data || []);
  };

  const calculateROI = async (data: CalculatorFormData) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("simulate", {
        body: {
          monthly_invoice_volume: data.monthly_invoice_volume,
          num_ap_staff: data.num_ap_staff,
          avg_hours_per_invoice: data.avg_hours_per_invoice,
          hourly_wage: data.hourly_wage,
          error_rate_manual: data.error_rate_manual,
          error_cost: data.error_cost,
          time_horizon_months: data.time_horizon_months,
          one_time_implementation_cost: data.one_time_implementation_cost,
        },
      });

      if (error) throw error;
      setResults(result);
    } catch (error) {
      console.error("Error calculating ROI:", error);
      toast.error("Failed to calculate ROI");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async (data: CalculatorFormData) => {
    const { error } = await supabase.from("scenarios").insert([{
      scenario_name: data.scenario_name,
      monthly_invoice_volume: data.monthly_invoice_volume,
      num_ap_staff: data.num_ap_staff,
      avg_hours_per_invoice: data.avg_hours_per_invoice,
      hourly_wage: data.hourly_wage,
      error_rate_manual: data.error_rate_manual,
      error_cost: data.error_cost,
      time_horizon_months: data.time_horizon_months,
      one_time_implementation_cost: data.one_time_implementation_cost,
    }]);

    if (error) {
      console.error("Error saving scenario:", error);
      toast.error("Failed to save scenario");
      return;
    }

    toast.success("Scenario saved successfully!");
    loadScenarios();
  };

  const handleLoadScenario = (scenario: Scenario) => {
    setFormData({
      scenario_name: scenario.scenario_name,
      monthly_invoice_volume: scenario.monthly_invoice_volume,
      num_ap_staff: scenario.num_ap_staff,
      avg_hours_per_invoice: scenario.avg_hours_per_invoice,
      hourly_wage: scenario.hourly_wage,
      error_rate_manual: scenario.error_rate_manual,
      error_cost: scenario.error_cost,
      time_horizon_months: scenario.time_horizon_months,
      one_time_implementation_cost: scenario.one_time_implementation_cost,
    });
    toast.success("Scenario loaded!");
  };

  const handleDeleteScenario = async (id: string) => {
    const { error } = await supabase.from("scenarios").delete().eq("id", id);

    if (error) {
      console.error("Error deleting scenario:", error);
      toast.error("Failed to delete scenario");
      return;
    }

    toast.success("Scenario deleted!");
    loadScenarios();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Invoicing ROI Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how much you can save by automating your invoicing process. 
            Calculate real ROI, payback period, and monthly savings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <CalculatorForm
              onSubmit={handleSaveScenario}
              onInputChange={setFormData}
              defaultValues={formData}
            />
          </div>

          <div className="space-y-4">
            <ResultsDisplay results={results} loading={loading} />
            {results && (
              <ReportModal formData={formData} results={results} />
            )}
          </div>
        </div>

        <ScenariosList
          scenarios={scenarios}
          onLoad={handleLoadScenario}
          onDelete={handleDeleteScenario}
        />
      </div>
    </div>
  );
};

export default Index;