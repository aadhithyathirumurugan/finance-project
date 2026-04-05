package com.example.finance.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDTO {
    private double totalIncome;
    private double totalExpense;
    private double netBalance;
    private long totalRecords;
    private Map<String, Double> categoryTotals;
    private List<MonthlyTrendDTO> monthlyTrends;
    private List<FinancialRecordDTO> recentTransactions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTrendDTO {
        private String month;
        private double income;
        private double expense;
    }
}
