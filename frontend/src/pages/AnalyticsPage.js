import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#0ea5e9", "#8b5cf6", "#ec4899", "#14b8a6"];

const AnalyticsPage = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [catRes, monthRes] = await Promise.all([
        dashboardAPI.getCategorySummary(),
        dashboardAPI.getMonthlyTrends(),
      ]);

      const catArray = Object.entries(catRes.data).map(([name, value]) => ({
        name,
        value,
      }));
      setCategoryData(catArray);
      setMonthlyData(monthRes.data);
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (val) => {
    const parts = val.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[parseInt(parts[1]) - 1] || val;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const total = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <div className="slide-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Financial insights and trends</p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-card-title">Monthly Income vs Expense</h3>
          {monthlyData.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" fontSize={11} tickFormatter={formatMonth} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-card-title">Category Breakdown</h3>
          {categoryData.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Table */}
      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "16px", color: "#1e293b" }}>
          Category Details
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ textAlign: "right" }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat, i) => {
                const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={cat.name}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                        <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(cat.value)}</td>
                    <td style={{ textAlign: "right", color: "#64748b" }}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
