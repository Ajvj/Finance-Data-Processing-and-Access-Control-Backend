const { readStore, writeStore, nextId } = require("../services/storeService");

function createRecord(req, res) {
  const { amount, type, category, date, notes } = req.body;
  const store = readStore();

  const record = {
    id: nextId(store.records),
    amount,
    type,
    category,
    date,
    notes: notes || "",
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false
  };

  store.records.push(record);
  writeStore(store);
  return res.status(201).json(record);
}

function listRecords(req, res) {
  const { type, category, startDate, endDate } = req.query;
  const store = readStore();
  let records = store.records.filter((r) => !r.deleted);

  if (type) records = records.filter((r) => r.type === type);
  if (category) records = records.filter((r) => r.category.toLowerCase() === String(category).toLowerCase());
  if (startDate) records = records.filter((r) => new Date(r.date) >= new Date(startDate));
  if (endDate) records = records.filter((r) => new Date(r.date) <= new Date(endDate));

  records.sort((a, b) => new Date(b.date) - new Date(a.date));
  return res.json(records);
}

function updateRecord(req, res) {
  const recordId = Number(req.params.id);
  const store = readStore();
  const record = store.records.find((r) => r.id === recordId && !r.deleted);
  if (!record) return res.status(404).json({ message: "Record not found." });

  const { amount, type, category, date, notes } = req.body;
  if (amount !== undefined) record.amount = amount;
  if (type !== undefined) record.type = type;
  if (category !== undefined) record.category = category;
  if (date !== undefined) record.date = date;
  if (notes !== undefined) record.notes = notes;
  record.updatedAt = new Date().toISOString();

  writeStore(store);
  return res.json(record);
}

function deleteRecord(req, res) {
  const recordId = Number(req.params.id);
  const store = readStore();
  const record = store.records.find((r) => r.id === recordId && !r.deleted);
  if (!record) return res.status(404).json({ message: "Record not found." });

  record.deleted = true;
  record.updatedAt = new Date().toISOString();
  writeStore(store);
  return res.json({ message: "Record soft deleted." });
}

module.exports = {
  createRecord,
  listRecords,
  updateRecord,
  deleteRecord
};
