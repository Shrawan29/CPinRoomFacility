import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

const emptyAmenity = () => ({ name: "", available: true });
const emptyService = () => ({ name: "", description: "", available: true });

export default function HotelInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    basicInfo: {
      name: "",
      description: "",
      address: "",
      contactPhone: "",
      contactEmail: "",
    },
    amenities: [],
    services: [],
    policies: [],
    emergency: {
      frontDeskNumber: "",
      ambulanceNumber: "",
      fireSafetyInfo: "",
    },
  });

  const load = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.get("/hotel-info");
      const info = res.data || {};

      setForm({
        basicInfo: {
          name: info?.basicInfo?.name || "",
          description: info?.basicInfo?.description || "",
          address: info?.basicInfo?.address || "",
          contactPhone: info?.basicInfo?.contactPhone || "",
          contactEmail: info?.basicInfo?.contactEmail || "",
        },
        amenities: Array.isArray(info?.amenities) ? info.amenities : [],
        services: Array.isArray(info?.services) ? info.services : [],
        policies: Array.isArray(info?.policies) ? info.policies : [],
        emergency: {
          frontDeskNumber: info?.emergency?.frontDeskNumber || "",
          ambulanceNumber: info?.emergency?.ambulanceNumber || "",
          fireSafetyInfo: info?.emergency?.fireSafetyInfo || "",
        },
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load hotel info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBasic = (key, value) => {
    setForm((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [key]: value,
      },
    }));
  };

  const updateEmergency = (key, value) => {
    setForm((prev) => ({
      ...prev,
      emergency: {
        ...prev.emergency,
        [key]: value,
      },
    }));
  };

  const setAmenity = (index, patch) => {
    setForm((prev) => {
      const next = [...prev.amenities];
      next[index] = { ...(next[index] || emptyAmenity()), ...patch };
      return { ...prev, amenities: next };
    });
  };

  const addAmenity = () => {
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, emptyAmenity()] }));
  };

  const removeAmenity = (index) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const setService = (index, patch) => {
    setForm((prev) => {
      const next = [...prev.services];
      next[index] = { ...(next[index] || emptyService()), ...patch };
      return { ...prev, services: next };
    });
  };

  const addService = () => {
    setForm((prev) => ({ ...prev, services: [...prev.services, emptyService()] }));
  };

  const removeService = (index) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const setPolicy = (index, value) => {
    setForm((prev) => {
      const next = [...prev.policies];
      next[index] = value;
      return { ...prev, policies: next };
    });
  };

  const addPolicy = () => {
    setForm((prev) => ({ ...prev, policies: [...prev.policies, ""] }));
  };

  const removePolicy = (index) => {
    setForm((prev) => ({
      ...prev,
      policies: prev.policies.filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        basicInfo: {
          ...form.basicInfo,
          name: String(form.basicInfo.name || "").trim(),
        },
        amenities: (form.amenities || [])
          .map((a) => ({ name: String(a?.name || "").trim(), available: a?.available !== false }))
          .filter((a) => a.name),
        services: (form.services || [])
          .map((s) => ({
            name: String(s?.name || "").trim(),
            description: String(s?.description || "").trim(),
            available: s?.available !== false,
          }))
          .filter((s) => s.name),
        policies: (form.policies || []).map((p) => String(p || "").trim()).filter(Boolean),
        emergency: {
          frontDeskNumber: String(form.emergency.frontDeskNumber || "").trim(),
          ambulanceNumber: String(form.emergency.ambulanceNumber || "").trim(),
          fireSafetyInfo: String(form.emergency.fireSafetyInfo || "").trim(),
        },
      };

      if (!payload.basicInfo.name) {
        setError("Hotel name is required");
        return;
      }

      const res = await api.post("/hotel-info", payload);
      setMessage(res?.data?.message || "Hotel info updated");
      setTimeout(() => setMessage(""), 2500);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to save hotel info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-(--bg-secondary) p-6 rounded-xl">Loading hotel info…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-(--text-primary)">Hotel Info</h1>
        <p className="text-sm text-(--text-muted) mt-1">
          This content powers the Guest Hotel Info page and the Guest Assistant chatbot.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      {message && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-4">
          <p className="text-green-700 font-medium">{message}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-(--bg-secondary) rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Hotel Name" required>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.basicInfo.name}
                onChange={(e) => updateBasic("name", e.target.value)}
              />
            </Field>
            <Field label="Contact Phone">
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.basicInfo.contactPhone}
                onChange={(e) => updateBasic("contactPhone", e.target.value)}
              />
            </Field>
            <Field label="Contact Email">
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.basicInfo.contactEmail}
                onChange={(e) => updateBasic("contactEmail", e.target.value)}
              />
            </Field>
            <Field label="Address">
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.basicInfo.address}
                onChange={(e) => updateBasic("address", e.target.value)}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Description">
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={form.basicInfo.description}
                onChange={(e) => updateBasic("description", e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-(--bg-secondary) rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-(--text-primary)">Amenities</h2>
            <button
              type="button"
              onClick={addAmenity}
              className="px-3 py-2 rounded-lg bg-(--brand) text-white text-sm"
            >
              Add amenity
            </button>
          </div>

          {form.amenities.length === 0 ? (
            <p className="text-sm text-(--text-muted)">No amenities yet.</p>
          ) : (
            <div className="space-y-3">
              {form.amenities.map((a, idx) => (
                <div key={idx} className="bg-white/60 rounded-lg p-4 border border-black/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <Field label="Name">
                      <input
                        className="w-full border rounded-lg px-3 py-2"
                        value={a?.name || ""}
                        onChange={(e) => setAmenity(idx, { name: e.target.value })}
                      />
                    </Field>
                    <div className="flex items-center gap-3 pt-6 md:pt-0">
                      <label className="flex items-center gap-2 text-sm text-(--text-primary)">
                        <input
                          type="checkbox"
                          checked={a?.available !== false}
                          onChange={(e) => setAmenity(idx, { available: e.target.checked })}
                        />
                        Available
                      </label>
                    </div>
                    <div className="flex md:justify-end pt-2 md:pt-6">
                      <button
                        type="button"
                        onClick={() => removeAmenity(idx)}
                        className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Services */}
        <section className="bg-(--bg-secondary) rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-(--text-primary)">Services</h2>
            <button
              type="button"
              onClick={addService}
              className="px-3 py-2 rounded-lg bg-(--brand) text-white text-sm"
            >
              Add service
            </button>
          </div>

          {form.services.length === 0 ? (
            <p className="text-sm text-(--text-muted)">No services yet.</p>
          ) : (
            <div className="space-y-3">
              {form.services.map((s, idx) => (
                <div key={idx} className="bg-white/60 rounded-lg p-4 border border-black/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                    <Field label="Name">
                      <input
                        className="w-full border rounded-lg px-3 py-2"
                        value={s?.name || ""}
                        onChange={(e) => setService(idx, { name: e.target.value })}
                      />
                    </Field>
                    <Field label="Description">
                      <input
                        className="w-full border rounded-lg px-3 py-2"
                        value={s?.description || ""}
                        onChange={(e) => setService(idx, { description: e.target.value })}
                      />
                    </Field>
                    <div className="flex flex-col md:items-end gap-2 pt-0 md:pt-6">
                      <label className="flex items-center gap-2 text-sm text-(--text-primary)">
                        <input
                          type="checkbox"
                          checked={s?.available !== false}
                          onChange={(e) => setService(idx, { available: e.target.checked })}
                        />
                        Available
                      </label>
                      <button
                        type="button"
                        onClick={() => removeService(idx)}
                        className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Policies */}
        <section className="bg-(--bg-secondary) rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-(--text-primary)">Policies</h2>
            <button
              type="button"
              onClick={addPolicy}
              className="px-3 py-2 rounded-lg bg-(--brand) text-white text-sm"
            >
              Add policy
            </button>
          </div>

          {form.policies.length === 0 ? (
            <p className="text-sm text-(--text-muted)">No policies yet.</p>
          ) : (
            <div className="space-y-3">
              {form.policies.map((p, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <textarea
                    className="flex-1 border rounded-lg px-3 py-2"
                    rows={2}
                    value={p || ""}
                    onChange={(e) => setPolicy(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removePolicy(idx)}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Emergency */}
        <section className="bg-(--bg-secondary) rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-(--text-primary) mb-4">Emergency</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Front Desk Number">
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.emergency.frontDeskNumber}
                onChange={(e) => updateEmergency("frontDeskNumber", e.target.value)}
              />
            </Field>
            <Field label="Ambulance Number">
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.emergency.ambulanceNumber}
                onChange={(e) => updateEmergency("ambulanceNumber", e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Fire Safety Info">
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                value={form.emergency.fireSafetyInfo}
                onChange={(e) => updateEmergency("fireSafetyInfo", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-(--brand) text-white font-medium disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Hotel Info"}
          </button>
          <button
            type="button"
            onClick={load}
            disabled={saving}
            className="px-5 py-2 rounded-lg border border-black/10 text-(--text-primary) font-medium disabled:opacity-60"
          >
            Refresh
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-(--text-primary)">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
