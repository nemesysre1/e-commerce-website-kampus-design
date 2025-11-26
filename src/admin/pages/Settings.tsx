// src/admin/pages/Settings.tsx
import React, { useEffect, useState } from "react";
import { getAuthHeader, apiFetch } from "../../lib/api";

export default function Settings() {
  const [form, setForm] = useState<any>({ danaNumber: "", ovoNumber: "", type: "manual", qrImageUrl: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/settings", { headers: getAuthHeader() });
        setForm(res.payment || form);
      } catch (err) {
        console.error("Load settings", err);
      }
    })();
  }, []);

  const submit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("danaNumber", form.danaNumber || "");
      fd.append("ovoNumber", form.ovoNumber || "");
      fd.append("type", form.type || "manual");
      if (file) fd.append("qrImage", file);

      const res = await fetch("http://localhost:4000/api/settings/payment", {
        method: "PUT",
        body: fd,
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setForm(data.payment || form);
      alert("Tersimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Pengaturan Pembayaran</h1>

      <div className="grid gap-3">
        <label className="text-sm">Tipe Pembayaran</label>
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input">
          <option value="manual">Manual (nomor)</option>
          <option value="qr">QR</option>
          <option value="link">Link</option>
        </select>

        <input placeholder="Nomor DANA" value={form.danaNumber} onChange={e=>setForm({...form,danaNumber:e.target.value})} className="input" />
        <input placeholder="Nomor OVO" value={form.ovoNumber} onChange={e=>setForm({...form,ovoNumber:e.target.value})} className="input" />

        <div>
          <label className="text-sm">QR Image (upload)</label>
          <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        </div>

        {form.qrImageUrl && <img src={form.qrImageUrl} alt="qr" className="w-48 h-48 object-contain" />}

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded" onClick={submit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
