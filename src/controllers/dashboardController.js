const { readStore } = require("../services/storeService");

function getSummary(req, res) {
  const store = readStore();
  const records = store.records.filter((r) => !r.deleted);

  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((acc, r) => acc + r.amount, 0);
  const totalExpenses = records
    .filter((r) => r.type === "expense")
    .reduce((acc, r) => acc + r.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const categoryTotals = records.reduce((acc, r) => {
    const key = `${r.type}:${r.category}`;
    acc[key] = (acc[key] || 0) + r.amount;
    return acc;
  }, {});

  const recentActivity = [...records]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return res.json({
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    recentActivity
  });
}

function getTrends(req, res) {
  const period = req.query.period === "weekly" ? "weekly" : "monthly";
  const store = readStore();
  const records = store.records.filter((r) => !r.deleted);

  const buckets = {};
  for (const record of records) {
    const dt = new Date(record.date);
    const key =
      period === "weekly"
        ? `${dt.getUTCFullYear()}-W${String(getWeekNumber(dt)).padStart(2, "0")}`
        : `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`;

    if (!buckets[key]) buckets[key] = { income: 0, expense: 0 };
    buckets[key][record.type] += record.amount;
  }

  const trends = Object.entries(buckets)
    .map(([bucket, totals]) => ({ bucket, ...totals, net: totals.income - totals.expense }))
    .sort((a, b) => a.bucket.localeCompare(b.bucket));

  return res.json({ period, trends });
}

function getWeekNumber(date) {
  const firstDay = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const pastDays = (date - firstDay) / 86400000;
  return Math.ceil((pastDays + firstDay.getUTCDay() + 1) / 7);
}

module.exports = { getSummary, getTrends };
