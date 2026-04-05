package com.example.finance.service;

import com.example.finance.dto.DashboardSummaryDTO;
import com.example.finance.dto.FinancialRecordDTO;
import com.example.finance.model.FinancialRecord;
import com.example.finance.model.TransactionType;
import com.example.finance.repository.FinancialRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private FinancialRecordRepository repo;

    public DashboardSummaryDTO getSummary() {
        double totalIncome = repo.sumByType(TransactionType.INCOME);
        double totalExpense = repo.sumByType(TransactionType.EXPENSE);
        double netBalance = totalIncome - totalExpense;
        long totalRecords = repo.countByDeletedFalse();

        return DashboardSummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .totalRecords(totalRecords)
                .build();
    }

    public Map<String, Double> getCategorySummary() {
        List<Object[]> results = repo.sumGroupByCategory();
        Map<String, Double> categoryTotals = new LinkedHashMap<>();

        for (Object[] row : results) {
            categoryTotals.put((String) row[0], (Double) row[1]);
        }

        return categoryTotals;
    }

    public List<DashboardSummaryDTO.MonthlyTrendDTO> getMonthlyTrends() {
        List<Object[]> results = repo.sumGroupByMonthAndType();
        Map<String, DashboardSummaryDTO.MonthlyTrendDTO> trendMap = new LinkedHashMap<>();

        for (Object[] row : results) {
            String month = (String) row[0];
            TransactionType type = TransactionType.valueOf((String) row[1]);
            Double amount = (Double) row[2];

            DashboardSummaryDTO.MonthlyTrendDTO trend = trendMap.computeIfAbsent(month,
                    k -> DashboardSummaryDTO.MonthlyTrendDTO.builder()
                            .month(k)
                            .income(0)
                            .expense(0)
                            .build());

            if (type == TransactionType.INCOME) {
                trend.setIncome(amount);
            } else {
                trend.setExpense(amount);
            }
        }

        return new ArrayList<>(trendMap.values());
    }

    public List<FinancialRecordDTO> getRecentTransactions() {
        return repo.findTop10ByDeletedFalseOrderByDateDescCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private FinancialRecordDTO toDTO(FinancialRecord record) {
        return FinancialRecordDTO.builder()
                .id(record.getId())
                .amount(record.getAmount())
                .type(record.getType())
                .category(record.getCategory())
                .date(record.getDate())
                .description(record.getDescription())
                .userId(record.getUserId())
                .createdAt(record.getCreatedAt() != null ? record.getCreatedAt().toString() : null)
                .updatedAt(record.getUpdatedAt() != null ? record.getUpdatedAt().toString() : null)
                .build();
    }
}
