import React, { useState } from "react";
import { addRecord } from "../services/api";

function AddRecord({ token }) {
  const [data, setData] = useState({
    amount: "",
    type: "INCOME",
    category: "",
    date: "",
    description: "",
  });

  const handleSubmit = () => {
    addRecord(data, token);
    alert("Record Added");
  };

  return (
    <div>
      <h3>Add Transaction</h3>
      <input
        placeholder="Amount"
        onChange={(e) => setData({ ...data, amount: e.target.value })}
      />
      <select
        onChange={(e) => setData({ ...data, type: e.target.value })}
      >
        <option>INCOME</option>
        <option>EXPENSE</option>
      </select>
      <input
        placeholder="Category"
        onChange={(e) => setData({ ...data, category: e.target.value })}
      />
      <input
        type="date"
        onChange={(e) => setData({ ...data, date: e.target.value })}
      />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default AddRecord;