import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
} from "lucide-react";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, recentRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getRecent(),
      ]);
      setSummary(summaryRes.data);
      setRecent(recentRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name}! Here's your financial overview.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="summary-card-header">
            <span className="summary-card-label">Total Income</span>
          </div>
          <div className="summary-card-value" style={{ color: "#16a34a" }}>
            {formatCurrency(summary?.totalIncome)}
          </div>
          <div className="summary-card-sub">All time earnings</div>
        </div>

        <div className="summary-card expense">
          <div className="summary-card-header">
            <span className="summary-card-label">Total Expenses</span>
          </div>
          <div className="summary-card-value" style={{ color: "#dc2626" }}>
            {formatCurrency(summary?.totalExpense)}
          </div>
          <div className="summary-card-sub">All time spending</div>
        </div>

        <div className="summary-card balance">
          <div className="summary-card-header">
            <span className="summary-card-label">Net Balance</span>
          </div>
          <div className="summary-card-value" style={{ color: "#2563eb" }}>
            {formatCurrency(summary?.netBalance)}
          </div>
          <div className="summary-card-sub">Current balance</div>
        </div>

        <div className="summary-card records">
          <div className="summary-card-header">
            <span className="summary-card-label">Total Records</span>
          </div>
          <div className="summary-card-value" style={{ color: "#0ea5e9" }}>
            {summary?.totalRecords || 0}
          </div>
          <div className="summary-card-sub">Financial entries</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "16px", color: "#1e293b" }}>
          Recent Transactions
        </h3>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p className="empty-state-text">No transactions yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td style={{ fontWeight: 500 }}>
                      {record.description || "—"}
                    </td>
                    <td>
                      <span className="badge badge-viewer">
                        {record.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          record.type === "INCOME"
                            ? "badge-income"
                            : "badge-expense"
                        }`}
                      >
                        {record.type}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                        color: record.type === "INCOME" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {record.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(record.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
