import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  scenario_name: z.string().min(1, "Scenario name is required"),
  monthly_invoice_volume: z.coerce.number().min(1, "Must be at least 1"),
  num_ap_staff: z.coerce.number().min(1, "Must be at least 1"),
  avg_hours_per_invoice: z.coerce.number().min(0.01, "Must be greater than 0"),
  hourly_wage: z.coerce.number().min(1, "Must be at least 1"),
  error_rate_manual: z.coerce.number().min(0, "Must be 0 or greater").max(100, "Must be 100 or less"),
  error_cost: z.coerce.number().min(0, "Must be 0 or greater"),
  time_horizon_months: z.coerce.number().min(1, "Must be at least 1"),
  one_time_implementation_cost: z.coerce.number().min(0, "Must be 0 or greater"),
});

export type CalculatorFormData = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  onSubmit: (data: CalculatorFormData) => void;
  onInputChange: (data: CalculatorFormData) => void;
  defaultValues?: Partial<CalculatorFormData>;
}

export const CalculatorForm = ({ onSubmit, onInputChange, defaultValues }: CalculatorFormProps) => {
  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      scenario_name: "",
      monthly_invoice_volume: 2000,
      num_ap_staff: 3,
      avg_hours_per_invoice: 0.17,
      hourly_wage: 30,
      error_rate_manual: 0.5,
      error_cost: 100,
      time_horizon_months: 36,
      one_time_implementation_cost: 50000,
    },
  });

  const handleChange = () => {
    const values = form.getValues();
    const result = formSchema.safeParse(values);
    if (result.success) {
      onInputChange(result.data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Parameters</CardTitle>
        <CardDescription>Enter your invoicing details to calculate ROI</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scenario_name">Scenario Name</Label>
            <Input
              id="scenario_name"
              {...form.register("scenario_name")}
              onChange={(e) => {
                form.register("scenario_name").onChange(e);
                handleChange();
              }}
            />
            {form.formState.errors.scenario_name && (
              <p className="text-sm text-destructive">{form.formState.errors.scenario_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_invoice_volume">Monthly Invoice Volume</Label>
              <Input
                id="monthly_invoice_volume"
                type="number"
                {...form.register("monthly_invoice_volume")}
                onChange={(e) => {
                  form.register("monthly_invoice_volume").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.monthly_invoice_volume && (
                <p className="text-sm text-destructive">{form.formState.errors.monthly_invoice_volume.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_ap_staff">Number of AP Staff</Label>
              <Input
                id="num_ap_staff"
                type="number"
                {...form.register("num_ap_staff")}
                onChange={(e) => {
                  form.register("num_ap_staff").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.num_ap_staff && (
                <p className="text-sm text-destructive">{form.formState.errors.num_ap_staff.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avg_hours_per_invoice">Avg Hours per Invoice</Label>
              <Input
                id="avg_hours_per_invoice"
                type="number"
                step="0.01"
                {...form.register("avg_hours_per_invoice")}
                onChange={(e) => {
                  form.register("avg_hours_per_invoice").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.avg_hours_per_invoice && (
                <p className="text-sm text-destructive">{form.formState.errors.avg_hours_per_invoice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_wage">Hourly Wage ($)</Label>
              <Input
                id="hourly_wage"
                type="number"
                {...form.register("hourly_wage")}
                onChange={(e) => {
                  form.register("hourly_wage").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.hourly_wage && (
                <p className="text-sm text-destructive">{form.formState.errors.hourly_wage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="error_rate_manual">Manual Error Rate (%)</Label>
              <Input
                id="error_rate_manual"
                type="number"
                step="0.1"
                {...form.register("error_rate_manual")}
                onChange={(e) => {
                  form.register("error_rate_manual").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.error_rate_manual && (
                <p className="text-sm text-destructive">{form.formState.errors.error_rate_manual.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="error_cost">Error Cost ($)</Label>
              <Input
                id="error_cost"
                type="number"
                {...form.register("error_cost")}
                onChange={(e) => {
                  form.register("error_cost").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.error_cost && (
                <p className="text-sm text-destructive">{form.formState.errors.error_cost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_horizon_months">Time Horizon (months)</Label>
              <Input
                id="time_horizon_months"
                type="number"
                {...form.register("time_horizon_months")}
                onChange={(e) => {
                  form.register("time_horizon_months").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.time_horizon_months && (
                <p className="text-sm text-destructive">{form.formState.errors.time_horizon_months.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="one_time_implementation_cost">Implementation Cost ($)</Label>
              <Input
                id="one_time_implementation_cost"
                type="number"
                {...form.register("one_time_implementation_cost")}
                onChange={(e) => {
                  form.register("one_time_implementation_cost").onChange(e);
                  handleChange();
                }}
              />
              {form.formState.errors.one_time_implementation_cost && (
                <p className="text-sm text-destructive">{form.formState.errors.one_time_implementation_cost.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">Save Scenario</Button>
        </form>
      </CardContent>
    </Card>
  );
};