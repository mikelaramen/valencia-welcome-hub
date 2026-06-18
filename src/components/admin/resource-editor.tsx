import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "json" | "tags";
  placeholder?: string;
};

type Props<T extends Record<string, unknown>> = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  fields: FieldDef[];
  initial: T;
  onSubmit: (values: T) => Promise<void> | void;
};

export function ResourceEditor<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  fields,
  initial,
  onSubmit,
}: Props<T>) {
  const { t } = useTranslation();
  const [values, setValues] = useState<T>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setValues(initial);
  }, [open, initial]);

  function update(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }) as T);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const out: Record<string, unknown> = { ...values };
      for (const f of fields) {
        if (f.type === "json") {
          const raw = out[f.name];
          if (typeof raw === "string") {
            try {
              out[f.name] = raw.trim() ? JSON.parse(raw) : [];
            } catch {
              out[f.name] = [];
            }
          }
        }
        if (f.type === "tags") {
          const raw = out[f.name];
          if (typeof raw === "string") {
            out[f.name] = raw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }
        if (f.type === "number" && typeof out[f.name] === "string") {
          out[f.name] = out[f.name] === "" ? null : Number(out[f.name]);
        }
      }
      await onSubmit(out as T);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => {
            const raw = values[f.name];
            const value =
              f.type === "json"
                ? typeof raw === "string"
                  ? raw
                  : JSON.stringify(raw ?? [], null, 2)
                : f.type === "tags"
                  ? Array.isArray(raw)
                    ? raw.join(", ")
                    : (raw as string) ?? ""
                  : raw == null
                    ? ""
                    : String(raw);
            return (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === "textarea" || f.type === "json" ? (
                  <Textarea
                    id={f.name}
                    rows={f.type === "json" ? 6 : 4}
                    value={value}
                    placeholder={f.placeholder}
                    onChange={(e) => update(f.name, e.target.value)}
                    className={f.type === "json" ? "font-mono text-xs" : undefined}
                  />
                ) : f.type === "boolean" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      id={f.name}
                      checked={Boolean(raw)}
                      onCheckedChange={(c) => update(f.name, c)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {raw ? t("admin.on") : t("admin.off")}
                    </span>
                  </div>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : "text"}
                    value={value}
                    placeholder={f.placeholder}
                    onChange={(e) => update(f.name, e.target.value)}
                    step={f.type === "number" ? "0.01" : undefined}
                  />
                )}
              </div>
            );
          })}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("admin.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("admin.saving") : t("admin.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
