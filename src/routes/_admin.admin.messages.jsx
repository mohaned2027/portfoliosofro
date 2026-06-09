
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/api/client";
import { SearchInput, Spinner, Empty } from "@/components/common/Primitives";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { confirmDelete } from "@/lib/confirm";



function MessagesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState     (null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-msgs", search], queryFn: () => api.messages.list({ search, pageSize: 50 }) });

  const toggle = useMutation({
    mutationFn: ({ id, read }                               ) => api.messages.markRead(id, read),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-msgs"] }),
  });
  const remove = useMutation({
    mutationFn: (id        ) => api.messages.remove(id),
    onSuccess: () => { toast.success("Deleted"); setSelected(null); qc.invalidateQueries({ queryKey: ["admin-msgs"] }); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Inbox of contact-form submissions.</p>
      </div>
      <SearchInput value={search} onChange={setSearch} placeholder="Search messages…" />
      {isLoading ?          <Spinner /> : !data?.data.length ? <Empty /> : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <ul className="rounded-xl border border-border bg-card divide-y divide-border max-h-[70vh] overflow-y-auto">
            {data.data.map((m     ) => (
              <li key={m.id}>
                <button onClick={() => {                 if (!m.read) toggle.mutate({ id: m.id, read: true }); }}
                  className={`w-full text-left p-4 hover:bg-muted/30 ${selected?.id === m.id ? "bg-muted/40" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${m.read ? "text-muted-foreground" : "font-semibold text-foreground"}`}>{m.name}</p>
                    <span className="text-[10px] font-mono text-muted-foreground">{m.date}</span>
                  </div>
                  <p className={`text-sm ${m.read ? "text-muted-foreground" : "text-foreground"}`}>{m.subject}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.body}</p>
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-border bg-card p-6">
            {selected   (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold">{selected.subject}</h2>
                    <p className="text-xs text-muted-foreground">From {selected.name} &lt;{selected.email}&gt; • {selected.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggle.mutate({ id: selected.id, read: !selected.read })} className="grid size-8 place-items-center rounded-md border border-border hover:border-electric/60" title={selected.read ? "Mark unread" : "Mark read"}>
                      {selected.read ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />}
                    </button>
                    <button onClick={async () => { if (await confirmDelete()) remove.mutate(selected.id); }} className="grid size-8 place-items-center rounded-md border border-border hover:border-destructive/60 hover:text-destructive"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{selected.body}</p>
              </>
            ) : <Empty message="Select a message to read." />}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesPage;
