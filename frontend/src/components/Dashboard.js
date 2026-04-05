import React, { useEffect, useState } from "react";
import { getSummary, getAll } from "../services/api";

function Dashboard({ token }) {
  const [summary, setSummary] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getSummary(token).then((res) => setSummary(res.data));
    getAll(token).then((res) => setRecords(res.data));
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="cards">
        <div className="card">Income: ₹{summary.income}</div>
        <div className="card">Expense: ₹{summary.expense}</div>
        <div className="card">Balance: ₹{summary.balance}</div>
      </div>

      <h3>Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.amount}</td>
              <td>{r.type}</td>
              <td>{r.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;