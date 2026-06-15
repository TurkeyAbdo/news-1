"use client";

import { useState } from "react";
import type { CollectionDef } from "@/lib/admin-config";
import { CATEGORY_OPTIONS } from "@/lib/admin-config";

type Row = Record<string, unknown>;

function UploadField({
  name,
  label,
  initial,
  accept,
}: {
  name: string;
  label: string;
  initial: string;
  accept: string;
}) {
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setUrl(data.url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink">{label}</label>
      <input type="hidden" name={name} value={url} />
      {url && accept.startsWith("image") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-28 rounded-lg object-cover border" />
      )}
      {url && accept.startsWith("video") && (
        <p className="text-xs text-muted break-all">{url}</p>
      )}
      <input type="file" accept={accept} onChange={onPick} className="text-sm" />
      {busy && <p className="text-xs text-brand">جارٍ الرفع…</p>}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="أو ألصق رابطًا مباشرًا"
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}

export default function EntityForm({
  collection,
  row,
  action,
}: {
  collection: CollectionDef;
  row: Row | null;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-5" dir="rtl">
      {row?.id ? (
        <input type="hidden" name="id" value={String(row.id)} />
      ) : null}

      {collection.fields.map((f) => {
        const val = row?.[f.name];
        const strVal = val == null ? "" : String(val);

        if (f.type === "image" || f.type === "video") {
          return (
            <UploadField
              key={f.name}
              name={f.name}
              label={f.label}
              initial={strVal}
              accept={f.type === "video" ? "video/*" : "image/*"}
            />
          );
        }
        if (f.type === "boolean") {
          return (
            <label key={f.name} className="flex items-center gap-2 text-ink">
              <input
                type="checkbox"
                name={f.name}
                defaultChecked={Boolean(val)}
              />
              {f.label}
            </label>
          );
        }
        if (f.type === "category") {
          return (
            <div key={f.name} className="space-y-1">
              <label className="block text-sm font-semibold text-ink">
                {f.label}
              </label>
              <select
                name={f.name}
                defaultValue={strVal || "politics"}
                className="w-full border rounded-lg px-3 py-2"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        const isArea = f.type === "textarea" || f.type === "html";
        return (
          <div key={f.name} className="space-y-1">
            <label className="block text-sm font-semibold text-ink">
              {f.label}
              {f.type === "html" && (
                <span className="text-xs text-muted"> (يدعم HTML)</span>
              )}
            </label>
            {isArea ? (
              <textarea
                name={f.name}
                defaultValue={strVal}
                required={f.required}
                rows={f.type === "html" ? 12 : 3}
                className="w-full border rounded-lg px-3 py-2 leading-7"
              />
            ) : (
              <input
                type="text"
                name={f.name}
                defaultValue={strVal}
                required={f.required}
                className="w-full border rounded-lg px-3 py-2"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="bg-brand text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-brand-dark"
      >
        حفظ
      </button>
    </form>
  );
}
