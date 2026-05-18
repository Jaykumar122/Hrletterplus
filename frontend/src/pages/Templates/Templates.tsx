
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconPlus,
  IconSearch,
  IconDotsVertical,
  IconEdit,
  IconCopy,
  IconTrash,
  IconEye,
  IconFileText,
} from "@tabler/icons-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Template {
  id: number;
  name: string;
  body_html: string;
  placeholders_json: string[];
  version: number;
  created_by: string;
  created_at: string;
  is_active: boolean;
}

// ─── Placeholder quick-insert chips ──────────────────────────────────────────
const COMMON_PLACEHOLDERS = [
  "{{name}}",
  "{{salary}}",
  "{{doj}}",
  "{{designation}}",
  "{{department}}",
  "{{company}}",
  "{{location}}",
  "{{probation_period}}",
  "{{manager_name}}",
];

// ─── Template Builder / Edit Dialog ──────────────────────────────────────────
function TemplateDialog({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Template | null;
  onSaved: () => void;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setBodyHtml(initial?.body_html ?? "");
      setError(null);
    }
  }, [initial, open]);

  // Auto-detect {{placeholders}} typed in the body
  const detectedPlaceholders = Array.from(
    new Set(
      [...bodyHtml.matchAll(/\{\{(\w+)\}\}/g)].map((m) => `{{${m[1]}}}`)
    )
  );

  const insertPlaceholder = (ph: string) => {
    setBodyHtml((prev) => prev + ph);
  };

  const handleSubmit = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    setError(null);
    if (!name.trim()) return setError("Template name is required.");
    if (!bodyHtml.trim()) return setError("Template body cannot be empty.");

    setLoading(true);
    try {
      const url = isEdit ? `${apiUrl}/api/templates/${initial!.id}` : `${apiUrl}/api/templates`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          body_html: bodyHtml,
          placeholders_json: detectedPlaceholders,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(`Server error: Invalid response (${res.status})`);
      }

      if (!res.ok) throw new Error(data.message || "Failed to save template");

      toast.success(isEdit ? "Template updated!" : "Template created!");
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            Use{" "}
            <code className="bg-muted px-1 rounded text-xs font-mono">
              {"{{placeholder}}"}
            </code>{" "}
            syntax for dynamic fields. They will be substituted with real
            candidate data when generating an offer.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="tpl-name">
              Template Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tpl-name"
              placeholder="e.g. Software Engineer Offer Letter"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Quick insert */}
          <div className="grid gap-1.5">
            <Label>Quick Insert Placeholders</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_PLACEHOLDERS.map((ph) => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => insertPlaceholder(ph)}
                  className="text-xs px-2 py-1 rounded-full border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors font-mono"
                >
                  {ph}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-1.5">
            <Label htmlFor="tpl-body">
              Template Body (HTML / Plain Text){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="tpl-body"
              rows={14}
              placeholder={`Dear {{name}},\n\nWe are pleased to offer you the position of {{designation}} in the {{department}} department.\n\nSalary: {{salary}}\nDate of Joining: {{doj}}\n\nBest Regards,\n{{company}}`}
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              className="font-mono text-sm resize-y"
            />
            <p className="text-xs text-muted-foreground">
              You can use plain text or HTML tags. Placeholders are auto-detected
              as you type.
            </p>
          </div>

          {/* Detected placeholders */}
          {detectedPlaceholders.length > 0 && (
            <div className="grid gap-1.5">
              <Label>Detected Placeholders</Label>
              <div className="flex flex-wrap gap-2">
                {detectedPlaceholders.map((ph) => (
                  <Badge key={ph} variant="secondary" className="font-mono text-xs">
                    {ph}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Saving…"
              : isEdit
              ? "Update Template"
              : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Preview Dialog ───────────────────────────────────────────────────────────
function PreviewDialog({
  open,
  onClose,
  template,
}: {
  open: boolean;
  onClose: () => void;
  template: Template | null;
}) {
  if (!template) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>
            Version {template.version} · Read-only preview
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-1 mb-2">
          {(template.placeholders_json ?? []).map((ph) => (
            <Badge key={ph} variant="outline" className="font-mono text-xs">
              {ph}
            </Badge>
          ))}
        </div>
        <div
          className="border rounded-md p-4 bg-muted/30 font-mono text-sm whitespace-pre-wrap min-h-40"
          dangerouslySetInnerHTML={{ __html: template.body_html }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Templates Page ──────────────────────────────────────────────────────
export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Template | null>(null);
  const [previewTarget, setPreviewTarget] = useState<Template | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // ── Fetch all templates ──
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/templates`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch templates");
      
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error("Server returned invalid JSON response");
      }
      
      // Handle both { templates: [...] } and plain array responses
      setTemplates(Array.isArray(data) ? data : (data.templates ?? []));
    } catch (err: any) {
      toast.error(err.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ── Clone ──
  const handleClone = async (tpl: Template) => {
    try {
      const res = await fetch(`${apiUrl}/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: `${tpl.name} (Copy)`,
          body_html: tpl.body_html,
          placeholders_json: tpl.placeholders_json,
        }),
      });
      
      if (!res.ok) {
        let errorMsg = "Clone failed";
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      
      toast.success("Template cloned!");
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to clone template");
    }
  };

  // ── Soft-delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/templates/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (!res.ok) {
        let errorMsg = "Delete failed";
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      
      toast.success("Template deleted");
      setDeleteTarget(null);
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete template");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Filtered list ──
  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = templates.filter((t) => t.is_active).length;
  const inactiveCount = templates.length - activeCount;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* ── Page header ── */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage reusable offer letter templates with dynamic placeholders.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditTarget(null);
                setBuilderOpen(true);
              }}
              className="gap-2 shrink-0"
            >
              <IconPlus className="size-4" />
              New Template
            </Button>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2 pt-4 px-5">
                <CardDescription>Total Templates</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {templates.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-xs text-muted-foreground">All saved templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 pt-4 px-5">
                <CardDescription>Active</CardDescription>
                <CardTitle className="text-3xl tabular-nums text-green-600">
                  {activeCount}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-xs text-muted-foreground">Ready to use</p>
              </CardContent>
            </Card>
            <Card className="hidden sm:block">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardDescription>Inactive</CardDescription>
                <CardTitle className="text-3xl tabular-nums text-muted-foreground">
                  {inactiveCount}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-xs text-muted-foreground">Soft-deleted</p>
              </CardContent>
            </Card>
          </div>

          {/* ── Table card ── */}
          <Card>
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates…"
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-auto hidden sm:block">
                  {filtered.length} template{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                  Loading templates…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                  <IconFileText className="size-10 opacity-25" />
                  <p className="text-sm">
                    {search
                      ? "No templates match your search."
                      : "No templates yet. Create your first one!"}
                  </p>
                  {!search && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditTarget(null);
                        setBuilderOpen(true);
                      }}
                    >
                      <IconPlus className="size-4 mr-1" /> New Template
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Placeholders
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Version
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Created
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((tpl) => (
                      <TableRow key={tpl.id}>
                        <TableCell className="font-medium">
                          {tpl.name}
                        </TableCell>

                        {/* Placeholders */}
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(tpl.placeholders_json ?? [])
                              .slice(0, 4)
                              .map((ph) => (
                                <Badge
                                  key={ph}
                                  variant="outline"
                                  className="font-mono text-xs px-1.5 py-0"
                                >
                                  {ph}
                                </Badge>
                              ))}
                            {(tpl.placeholders_json ?? []).length > 4 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0"
                              >
                                +{(tpl.placeholders_json ?? []).length - 4}
                              </Badge>
                            )}
                            {(tpl.placeholders_json ?? []).length === 0 && (
                              <span className="text-muted-foreground text-xs">
                                None
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Version */}
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary">v{tpl.version}</Badge>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {new Date(tpl.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {tpl.is_active ? (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <IconDotsVertical className="size-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setPreviewTarget(tpl)}
                                className="gap-2"
                              >
                                <IconEye className="size-4" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditTarget(tpl);
                                  setBuilderOpen(true);
                                }}
                                className="gap-2"
                              >
                                <IconEdit className="size-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleClone(tpl)}
                                className="gap-2"
                              >
                                <IconCopy className="size-4" /> Clone
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeleteTarget(tpl)}
                                className="gap-2 text-destructive focus:text-destructive"
                              >
                                <IconTrash className="size-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Dialogs ── */}
        <TemplateDialog
          open={builderOpen}
          onClose={() => {
            setBuilderOpen(false);
            setEditTarget(null);
          }}
          initial={editTarget}
          onSaved={fetchTemplates}
        />

        <PreviewDialog
          open={!!previewTarget}
          onClose={() => setPreviewTarget(null)}
          template={previewTarget}
        />

        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{deleteTarget?.name}</strong> will be soft-deleted and
                removed from the active list. Existing offers using this template
                will not be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}