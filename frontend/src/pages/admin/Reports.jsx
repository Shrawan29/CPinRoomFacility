import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";
import api from "../../services/api";

export default function Reports() {
  const { token, loading: authLoading } = useAdminAuth();
  const [report, setReport] = useState(null);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyError, setMonthlyError] = useState(null);
  const [foodSearch, setFoodSearch] = useState("");
  const [housekeepingSearch, setHousekeepingSearch] = useState("");

  useEffect(() => {
    if (authLoading || !token) {
      setLoading(authLoading);
      return;
    }

    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/reports/insights");
        setReport(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token, authLoading]);

  useEffect(() => {
    if (authLoading || !token) {
      setMonthlyLoading(authLoading);
      return;
    }

    const fetchMonthlyReport = async () => {
      try {
        setMonthlyLoading(true);
        const res = await api.get("/admin/reports/monthly", {
          params: {
            year: selectedYear,
            month: selectedMonth,
          },
        });
        setMonthlyReport(res.data);
        setMonthlyError(null);
      } catch (err) {
        setMonthlyError(err.response?.data?.message || "Failed to load monthly item report");
        setMonthlyReport(null);
      } finally {
        setMonthlyLoading(false);
      }
    };

    fetchMonthlyReport();
  }, [token, authLoading, selectedMonth, selectedYear]);

  const generatedAt = report?.generatedAt ? new Date(report.generatedAt) : null;
  const occupancyRatePct =
    typeof report?.rooms?.occupancyRate === "number"
      ? `${(report.rooms.occupancyRate * 100).toFixed(1)}%`
      : "—";

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const yearOptions = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y -= 1) {
    yearOptions.push(y);
  }

  const handlePrint = () => {
    window.print();
  };

  const handlePrintSection = (sectionKey) => {
    const previous = document.body.getAttribute("data-print-report");
    document.body.setAttribute("data-print-report", sectionKey);
    window.print();

    if (previous) {
      document.body.setAttribute("data-print-report", previous);
    } else {
      document.body.removeAttribute("data-print-report");
    }
  };

  const allFoodRows = useMemo(
    () => normalizeMonthlyRows(monthlyReport?.dishes),
    [monthlyReport?.dishes]
  );

  const allHousekeepingRows = useMemo(
    () => normalizeMonthlyRows(monthlyReport?.housekeeping),
    [monthlyReport?.housekeeping]
  );

  const filteredFoodRows = useMemo(
    () => filterRowsByQuery(allFoodRows, foodSearch),
    [allFoodRows, foodSearch]
  );

  const filteredHousekeepingRows = useMemo(
    () => filterRowsByQuery(allHousekeepingRows, housekeepingSearch),
    [allHousekeepingRows, housekeepingSearch]
  );

  const foodSummary = useMemo(() => buildMonthlySummary(allFoodRows), [allFoodRows]);
  const housekeepingSummary = useMemo(() => buildMonthlySummary(allHousekeepingRows), [allHousekeepingRows]);

  const downloadCsv = (rows, typeLabel) => {
    const periodLabel = monthlyReport?.periodLabel || `${monthOptions[selectedMonth - 1]}-${selectedYear}`;
    const safeType = String(typeLabel || "report").toLowerCase().replace(/\s+/g, "-");
    const filename = `${safeType}-${periodLabel.replace(/\s+/g, "-").toLowerCase()}.csv`;

    const header = ["Item", "Requested Qty", "No. of Requests"];
    const dataRows = (Array.isArray(rows) ? rows : []).map((row) => [
      row.itemName,
      String(row.timesRequested ?? 0),
      String(row.requestsCount ?? 0),
    ]);

    const csv = [header, ...dataRows]
      .map((cols) => cols.map(csvEscape).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Reports</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Full app insights snapshot{generatedAt ? ` • Generated ${generatedAt.toLocaleString()}` : ""}
          </p>
        </div>

        <div className="report-controls no-print bg-[var(--bg-secondary)] border border-black/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm text-[var(--text-primary)] font-medium">
              Month
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
              >
                {monthOptions.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-[var(--text-primary)] font-medium">
              Year
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePrintSection("food")}
              className="rounded-lg bg-[var(--brand)] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Print Food Report
            </button>
            <button
              type="button"
              onClick={() => handlePrintSection("housekeeping")}
              className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Print Housekeeping Report
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg border border-black/25 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-black/5 transition"
            >
              Print Full Report
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6">Loading reports…</div>
      )}

      {!loading && error && (
        <div className="bg-[var(--bg-secondary)] border border-black/10 rounded-xl p-6">
          <p className="text-[var(--text-primary)] font-semibold">Failed to load</p>
          <p className="text-[var(--text-muted)] text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && report && (
        <div className="space-y-10 printable-report-root">
          <div className="report-block report-food">
            <Section title={`Food Orders Report (${monthlyReport?.periodLabel || `${monthOptions[selectedMonth - 1]} ${selectedYear}`})`}>
              {monthlyLoading && (
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10 col-span-full">
                  <p className="text-[var(--text-muted)] text-sm">Loading food report…</p>
                </div>
              )}

              {!monthlyLoading && monthlyError && (
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10 col-span-full">
                  <p className="text-[var(--text-primary)] font-semibold">Failed to load food report</p>
                  <p className="text-[var(--text-muted)] text-sm mt-1">{monthlyError}</p>
                </div>
              )}

              {!monthlyLoading && !monthlyError && monthlyReport && (
                <div className="col-span-full grid grid-cols-1 gap-6">
                  <MonthlySummaryCards
                    totalItems={foodSummary.totalItems}
                    totalQty={foodSummary.totalQty}
                    totalRequests={foodSummary.totalRequests}
                    labelPrefix="Food"
                  />
                  <div className="no-print bg-[var(--bg-secondary)] border border-black/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
                    <label className="text-sm text-[var(--text-primary)] font-medium w-full sm:max-w-sm">
                      Search Dish
                      <input
                        value={foodSearch}
                        onChange={(e) => setFoodSearch(e.target.value)}
                        placeholder="Type item name"
                        className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => downloadCsv(allFoodRows, "food-report")}
                      className="rounded-lg border border-black/25 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-black/5 transition"
                    >
                      Download Food CSV
                    </button>
                  </div>
                  <MonthlyItemTable
                    title="Dishes"
                    rows={filteredFoodRows}
                    emptyLabel="No dish requests in this month"
                    itemCountLabel={buildItemCountLabel(filteredFoodRows.length, allFoodRows.length)}
                  />
                </div>
              )}
            </Section>
          </div>

          <div className="report-block report-housekeeping">
            <Section title={`Housekeeping Report (${monthlyReport?.periodLabel || `${monthOptions[selectedMonth - 1]} ${selectedYear}`})`}>
              {monthlyLoading && (
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10 col-span-full">
                  <p className="text-[var(--text-muted)] text-sm">Loading housekeeping report…</p>
                </div>
              )}

              {!monthlyLoading && monthlyError && (
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10 col-span-full">
                  <p className="text-[var(--text-primary)] font-semibold">Failed to load housekeeping report</p>
                  <p className="text-[var(--text-muted)] text-sm mt-1">{monthlyError}</p>
                </div>
              )}

              {!monthlyLoading && !monthlyError && monthlyReport && (
                <div className="col-span-full grid grid-cols-1 gap-6">
                  <MonthlySummaryCards
                    totalItems={housekeepingSummary.totalItems}
                    totalQty={housekeepingSummary.totalQty}
                    totalRequests={housekeepingSummary.totalRequests}
                    labelPrefix="Housekeeping"
                  />
                  <div className="no-print bg-[var(--bg-secondary)] border border-black/10 rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
                    <label className="text-sm text-[var(--text-primary)] font-medium w-full sm:max-w-sm">
                      Search Housekeeping Item
                      <input
                        value={housekeepingSearch}
                        onChange={(e) => setHousekeepingSearch(e.target.value)}
                        placeholder="Type item name"
                        className="mt-1 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => downloadCsv(allHousekeepingRows, "housekeeping-report")}
                      className="rounded-lg border border-black/25 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-black/5 transition"
                    >
                      Download Housekeeping CSV
                    </button>
                  </div>
                  <MonthlyItemTable
                    title="Housekeeping Items"
                    rows={filteredHousekeepingRows}
                    emptyLabel="No housekeeping requests in this month"
                    itemCountLabel={buildItemCountLabel(filteredHousekeepingRows.length, allHousekeepingRows.length)}
                  />
                </div>
              )}
            </Section>
          </div>

          <Section title="Rooms">
            <Card label="Total Rooms" value={formatNumber(report.rooms?.total)} />
            <Card label="Available" value={formatNumber(report.rooms?.available)} />
            <Card label="Occupied" value={formatNumber(report.rooms?.occupied)} />
            <Card label="Occupancy Rate" value={occupancyRatePct} />
          </Section>

          <Section title="Guests & Access" columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card label="Active Sessions (Total)" value={formatNumber(report.guests?.activeSessionsNow?.total)} />
            <Card label="Active Sessions (App)" value={formatNumber(report.guests?.activeSessionsNow?.app)} />
            <Card label="Active Sessions (Hotel Sync)" value={formatNumber(report.guests?.activeSessionsNow?.hotelSync)} />
            <Card label="Active Guest Credentials" value={formatNumber(report.guests?.activeGuestCredentials?.total)} />
          </Section>

          <Section title="Guest Sessions Created">
            <Card label="Today" value={formatNumber(report.guests?.sessionsCreated?.today)} />
            <Card label="Last 7 Days" value={formatNumber(report.guests?.sessionsCreated?.last7Days)} />
            <Card label="Last 30 Days" value={formatNumber(report.guests?.sessionsCreated?.last30Days)} />
            <Card label="All Time" value={formatNumber(report.guests?.sessionsCreated?.allTime)} />
          </Section>

          <Section title="Orders (KPIs)">
            <Card label="Orders Today" value={formatNumber(report.orders?.today?.count)} />
            <Card label="Revenue Today" value={formatMoney(report.orders?.today?.revenue)} />
            <Card label="Avg Order Today" value={formatMoney(report.orders?.today?.avgOrderValue)} />
            <Card label="Open Orders" value={formatNumber(getOpenOrders(report.orders?.byStatus))} />
          </Section>

          <Section title="Orders (Last 7 / 30 Days)" columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card label="Orders (7d)" value={formatNumber(report.orders?.last7Days?.count)} />
            <Card label="Revenue (7d)" value={formatMoney(report.orders?.last7Days?.revenue)} />
            <Card label="Orders (30d)" value={formatNumber(report.orders?.last30Days?.count)} />
            <Card label="Revenue (30d)" value={formatMoney(report.orders?.last30Days?.revenue)} />
          </Section>

          <Section title="Order Status Breakdown" columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card label="Placed" value={formatNumber(report.orders?.byStatus?.PLACED)} />
            <Card label="Preparing" value={formatNumber(report.orders?.byStatus?.PREPARING)} />
            <Card label="Ready" value={formatNumber(report.orders?.byStatus?.READY)} />
            <Card label="Delivered" value={formatNumber(report.orders?.byStatus?.DELIVERED)} />
          </Section>

          <Section title="Top Items (Last 30 Days)" columnsClassName="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListCard
              title="By Quantity"
              items={(report.orders?.topItemsLast30Days || []).map((r) => ({
                primary: r.name,
                secondary: `Qty ${formatNumber(r.qty)} • Rev ${formatMoney(r.revenue)}`,
              }))}
              emptyLabel="No orders in the last 30 days"
            />
            <ListCard
              title="Top Rooms"
              items={(report.orders?.topRoomsLast30Days || []).map((r) => ({
                primary: `Room ${r.roomNumber}`,
                secondary: `${formatNumber(r.count)} orders • Rev ${formatMoney(r.revenue)}`,
              }))}
              emptyLabel="No orders in the last 30 days"
            />
          </Section>

          <Section title="Housekeeping">
            <Card label="Requests Today" value={formatNumber(report.housekeeping?.requestsToday)} />
            <Card label="Pending" value={formatNumber(report.housekeeping?.byStatus?.pending)} />
            <Card label="Accepted" value={formatNumber(report.housekeeping?.byStatus?.accepted)} />
            <Card label="Completed" value={formatNumber(report.housekeeping?.byStatus?.completed)} />
          </Section>

          <Section title="Top Housekeeping Items (Last 30 Days)" columnsClassName="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListCard
              title="Most Requested"
              items={(report.housekeeping?.topItemsLast30Days || []).map((r) => ({
                primary: r.name,
                secondary: `Qty ${formatNumber(r.quantity)}`,
              }))}
              emptyLabel="No housekeeping requests in the last 30 days"
            />
            <ListCard
              title="Service Requests Status"
              items={Object.entries(report.housekeeping?.byStatus || {}).map(([status, count]) => ({
                primary: status,
                secondary: formatNumber(count),
              }))}
              emptyLabel="No housekeeping data"
            />
          </Section>

          <Section title="Complaints / Feedback">
            <Card label="Today" value={formatNumber(report.complaints?.counts?.today)} />
            <Card label="Last 7 Days" value={formatNumber(report.complaints?.counts?.last7Days)} />
            <Card label="Last 30 Days" value={formatNumber(report.complaints?.counts?.last30Days)} />
            <Card label="All Time" value={formatNumber(report.complaints?.counts?.allTime)} />
          </Section>

          <Section title="Complaint Insights (Last 30 Days)" columnsClassName="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ListCard
              title="Top Categories"
              items={(report.complaints?.topCategoriesLast30Days || []).map((r) => ({
                primary: r.category,
                secondary: `${formatNumber(r.count)} reports`,
              }))}
              emptyLabel="No complaints in the last 30 days"
            />
            <ListCard
              title="Top Types"
              items={(report.complaints?.topTypesLast30Days || []).map((r) => ({
                primary: r.type,
                secondary: `${formatNumber(r.count)} reports`,
              }))}
              emptyLabel="No complaints in the last 30 days"
            />
            <ListCard
              title="Top Rooms"
              items={(report.complaints?.topRoomsLast30Days || []).map((r) => ({
                primary: `Room ${r.roomNumber}`,
                secondary: `${formatNumber(r.count)} reports`,
              }))}
              emptyLabel="No complaints in the last 30 days"
            />
          </Section>

          <Section title="Events">
            <Card label="Upcoming" value={formatNumber(report.events?.byStatus?.UPCOMING)} />
            <Card label="Active" value={formatNumber(report.events?.byStatus?.ACTIVE)} />
            <Card label="Completed" value={formatNumber(report.events?.byStatus?.COMPLETED)} />
            <Card
              label="Next Event"
              value={report.events?.next?.title ? truncate(report.events.next.title, 24) : "—"}
            />
          </Section>

          <Section title="Menu">
            <Card label="Total Items" value={formatNumber(report.menu?.total)} />
            <Card label="Available" value={formatNumber(report.menu?.available)} />
            <Card label="Unavailable" value={formatNumber(report.menu?.unavailable)} />
            <Card label="Categories" value={formatNumber(report.menu?.categories)} />
          </Section>

          <Section title="Menu (Composition)" columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card label="Veg" value={formatNumber(report.menu?.veg)} />
            <Card label="Non-Veg" value={formatNumber(report.menu?.nonVeg)} />
            <Card label="Avg Price" value={formatMoney(report.menu?.avgPrice)} />
            <Card label="All-Time Orders" value={formatNumber(report.orders?.allTime?.count)} />
          </Section>

          <Section title="QR Tokens">
            <Card label="Tokens Stored" value={formatNumber(report.qrTokens?.total)} />
            <Card label="Used" value={formatNumber(report.qrTokens?.used)} />
            <Card label="Valid & Unused" value={formatNumber(report.qrTokens?.validUnused)} />
            <Card label="Data Sync Running" value={report.dataSync?.isSyncing ? "Yes" : "No"} />
          </Section>

          <Section title="Admins & Configuration" columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card label="Admins (Total)" value={formatNumber(report.admins?.total)} />
            <Card label="Admins (Active)" value={formatNumber(report.admins?.active)} />
            <Card label="Hotel Info Configured" value={report.hotelInfo?.configured ? "Yes" : "No"} />
            <Card label="Hotel Name" value={report.hotelInfo?.name || "—"} />
          </Section>

          <Section title="Roles & Data Sync" columnsClassName="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListCard
              title="Active Admins by Role"
              items={Object.entries(report.admins?.byRole || {}).map(([role, count]) => ({
                primary: role,
                secondary: formatNumber(count),
              }))}
              emptyLabel="No admin data"
            />
            <ListCard
              title="Last Data Sync Run"
              items={buildSyncItems(report.dataSync)}
              emptyLabel="No sync run data"
            />
          </Section>
        </div>
      )}
    </AdminLayout>
  );
}

function Section({ title, children, columnsClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">{title}</h2>
      <div className={columnsClassName}>{children}</div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <h2 className="text-2xl font-bold mt-2 text-[var(--text-primary)] break-words">
        {value ?? "—"}
      </h2>
    </div>
  );
}

function ListCard({ title, items, emptyLabel }) {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10">
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
      {safeItems.length === 0 ? (
        <p className="text-sm mt-3 text-[var(--text-muted)]">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {safeItems.map((it, idx) => (
            <li key={`${it.primary}-${idx}`} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[var(--text-primary)] font-medium truncate">{it.primary}</p>
                {it.secondary ? (
                  <p className="text-xs text-[var(--text-muted)] mt-1">{it.secondary}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MonthlySummaryCards({ totalItems, totalQty, totalRequests, labelPrefix }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card label={`${labelPrefix} Items`} value={formatNumber(totalItems)} />
      <Card label={`${labelPrefix} Qty Requested`} value={formatNumber(totalQty)} />
      <Card label={`${labelPrefix} Requests`} value={formatNumber(totalRequests)} />
    </div>
  );
}

function MonthlyItemTable({ title, rows, emptyLabel, itemCountLabel = "" }) {
  const safeRows = Array.isArray(rows) ? rows.filter(Boolean) : [];

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-black/10 overflow-x-auto">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm text-[var(--text-muted)]">{title}</p>
        {itemCountLabel ? <p className="text-xs text-[var(--text-muted)]">{itemCountLabel}</p> : null}
      </div>
      {safeRows.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">{emptyLabel}</p>
      ) : (
        <table className="w-full border-collapse min-w-[420px] monthly-item-table">
          <thead>
            <tr className="border-b border-black/15">
              <th className="text-left text-xs text-[var(--text-muted)] font-semibold py-2">Item</th>
              <th className="text-right text-xs text-[var(--text-muted)] font-semibold py-2">Requested Qty</th>
              <th className="text-right text-xs text-[var(--text-muted)] font-semibold py-2">No. of Requests</th>
            </tr>
          </thead>
          <tbody>
            {safeRows.map((row) => (
              <tr key={`${title}-${row.itemName}`} className="border-b border-black/10 last:border-b-0">
                <td className="py-2 text-sm text-[var(--text-primary)]">{row.itemName}</td>
                <td className="py-2 text-sm text-[var(--text-primary)] text-right">{formatNumber(row.timesRequested)}</td>
                <td className="py-2 text-sm text-[var(--text-primary)] text-right">{formatNumber(row.requestsCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function formatNumber(value) {
  if (value == null) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString();
}

function formatMoney(value) {
  if (value == null) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function truncate(value, maxLen) {
  const s = String(value || "");
  const n = Number(maxLen);
  if (!n || s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

function getOpenOrders(byStatus) {
  const s = byStatus || {};
  const placed = Number(s.PLACED) || 0;
  const preparing = Number(s.PREPARING) || 0;
  const ready = Number(s.READY) || 0;
  return placed + preparing + ready;
}

function buildSyncItems(dataSync) {
  const lastRun = dataSync?.lastRun;
  if (!lastRun) return [];

  const startedAt = lastRun?.startedAt ? new Date(lastRun.startedAt) : null;
  const finishedAt = lastRun?.finishedAt ? new Date(lastRun.finishedAt) : null;

  const items = [
    { primary: "Status", secondary: lastRun.ok ? "OK" : "Failed" },
    startedAt ? { primary: "Started", secondary: startedAt.toLocaleString() } : null,
    finishedAt ? { primary: "Finished", secondary: finishedAt.toLocaleString() } : null,
    lastRun?.sourceDbName && lastRun?.sourceCollectionName
      ? { primary: "Source", secondary: `${lastRun.sourceDbName}.${lastRun.sourceCollectionName}` }
      : null,
    typeof lastRun?.hotelRoomsFetched === "number"
      ? { primary: "Hotel Rooms Fetched", secondary: formatNumber(lastRun.hotelRoomsFetched) }
      : null,
    typeof lastRun?.roomsCount === "number"
      ? { primary: "Rooms Mirrored", secondary: formatNumber(lastRun.roomsCount) }
      : null,
    typeof lastRun?.guestsCount === "number"
      ? { primary: "Guests Mirrored", secondary: formatNumber(lastRun.guestsCount) }
      : null,
    lastRun?.note ? { primary: "Note", secondary: String(lastRun.note) } : null,
    !lastRun?.ok && lastRun?.error ? { primary: "Error", secondary: String(lastRun.error) } : null,
  ].filter(Boolean);

  return items;
}

function normalizeMonthlyRows(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    itemName: String(row?.itemName || "(unknown)"),
    timesRequested: Number(row?.timesRequested) || 0,
    requestsCount: Number(row?.requestsCount) || 0,
  }));
}

function filterRowsByQuery(rows, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return rows;
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    String(row?.itemName || "").toLowerCase().includes(q)
  );
}

function buildMonthlySummary(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  return {
    totalItems: safeRows.length,
    totalQty: safeRows.reduce((sum, row) => sum + (Number(row?.timesRequested) || 0), 0),
    totalRequests: safeRows.reduce((sum, row) => sum + (Number(row?.requestsCount) || 0), 0),
  };
}

function buildItemCountLabel(shownCount, totalCount) {
  if (!totalCount) return "0 items";
  if (shownCount === totalCount) return `${formatNumber(totalCount)} items`;
  return `${formatNumber(shownCount)} of ${formatNumber(totalCount)} items`;
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
    return `"${s.replace(/\"/g, '""')}"`;
  }
  return s;
}
