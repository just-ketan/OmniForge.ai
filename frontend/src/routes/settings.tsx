import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — OmniForge" },
      { name: "description", content: "Model parameters, theme, and workspace preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [temp, setTemp] = useState([0.7]);
  const [topP, setTopP] = useState([0.9]);
  const [maxTokens, setMaxTokens] = useState([1024]);
  const [model, setModel] = useState("omniforge-pro");
  const [theme, setTheme] = useState("light");
  const [dense, setDense] = useState(false);

  const save = () => toast.success("Preferences saved");

  return (
    <Section>
      <PageHeader
        title="Settings"
        description="Tune model behavior and personalize your workspace."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-entrance">
        <Card title="AI Model" description="Choose the engine powering generation.">
          <Label>Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omniforge-pro">OmniForge Pro</SelectItem>
              <SelectItem value="omniforge-flash">OmniForge Flash</SelectItem>
              <SelectItem value="omniforge-balanced">OmniForge Balanced</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card title="Generation" description="Sampling parameters for the model.">
          <Stat label="Temperature" value={temp[0].toFixed(2)} />
          <Slider value={temp} onValueChange={setTemp} min={0} max={2} step={0.05} />
          <Stat label="Top-P" value={topP[0].toFixed(2)} className="mt-4" />
          <Slider value={topP} onValueChange={setTopP} min={0} max={1} step={0.05} />
          <Stat label="Max tokens" value={maxTokens[0].toLocaleString()} className="mt-4" />
          <Slider
            value={maxTokens}
            onValueChange={setMaxTokens}
            min={256}
            max={4096}
            step={128}
          />
        </Card>

        <Card title="Workspace" description="Preferences specific to this account.">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light (Editorial)</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">Sync with system</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between mt-4">
            <div>
              <Label className="text-sm">Compact density</Label>
              <p className="text-[11px] text-muted-foreground">Tighter spacing across cards.</p>
            </div>
            <Switch checked={dense} onCheckedChange={setDense} />
          </div>
          <Label className="mt-4 block">Display name</Label>
          <Input defaultValue="Julian Draxler" />
        </Card>
      </div>

      <div className="flex justify-end animate-entrance">
        <Button onClick={save}>Save changes</Button>
      </div>
    </Section>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl ring-1 ring-black/[0.03] space-y-3">
      <div className="mb-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline justify-between ${className}`}>
      <Label className="text-xs">{label}</Label>
      <span className="text-xs font-mono tabular text-muted-foreground">{value}</span>
    </div>
  );
}