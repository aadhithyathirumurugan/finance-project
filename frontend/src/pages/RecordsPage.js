import React, { useEffect, useState } from "react";
import { financeAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    keyword: "",
  });
  const [formData, setFormData] = useState({
    amount: "",
    type: "INCOME",
    category: "",
    date: "",
    description: "",
  });
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await financeAPI.getAllRecords();
      setRecords(res.data);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      if (filters.keyword) {
        const res = await financeAPI.search(filters.keyword);
        setRecords(res.data);
      } else {
        const params = {};
        if (filters.type) params.type = filters.type;
        if (filters.category) params.category = filters.category;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        if (Object.keys(params).length > 0) {
          const res = await financeAPI.filter(params);
          setRecords(res.data);
        } else {
          await fetchRecords();
        }
      }
    } catch (error) {
      toast.error("Failed to filter records");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ type: "", category: "", startDate: "", endDate: "", keyword: "" });
    fetchRecords();
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({ amount: "", type: "INCOME", category: "", date: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editingRecord) {
        await financeAPI.update(editingRecord.id, payload);
        toast.success("Record updated!");
      } else {
        await financeAPI.create(payload);
        toast.success("Record created!");
      }
      setShowModal(false);
      fetchRecords();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await financeAPI.delete(id);
        toast.success("Record deleted!");
        fetchRecords();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Records</h1>
          <p className="page-subtitle">Manage all your transactions</p>
        </div>
        {hasRole("ADMIN") && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={15} /> Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            className="filter-input"
            style={{ paddingLeft: "32px", width: "100%" }}
            placeholder="Search..."
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>
        <select className="filter-input" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <input className="filter-input" type="text" placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input className="filter-input" type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input className="filter-input" type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        <button className="btn btn-primary btn-sm" onClick={handleFilter}>Filter</button>
        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : records.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">No records found</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                {hasRole("ADMIN") && <th style={{ textAlign: "center" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.date)}</td>
                  <td style={{ fontWeight: 500 }}>{record.description || "—"}</td>
                  <td><span className="badge badge-viewer">{record.category}</span></td>
                  <td>
                    <span className={`badge ${record.type === "INCOME" ? "badge-income" : "badge-expense"}`}>
                      {record.type}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: record.type === "INCOME" ? "#16a34a" : "#dc2626" }}>
                    {record.type === "INCOME" ? "+" : "-"}{formatCurrency(record.amount)}
                  </td>
                  {hasRole("ADMIN") && (
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(record)} title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(record.id)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingRecord ? "Edit Record" : "Add Record"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input className="form-input" type="number" step="0.01" min="0.01" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required autoFocus />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" type="text" placeholder="e.g. Salary" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <input className="form-input" type="text" placeholder="Short note" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingRecord ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;
