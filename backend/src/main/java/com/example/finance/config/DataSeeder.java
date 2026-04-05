package com.example.finance.config;

import com.example.finance.model.*;
import com.example.finance.repository.FinancialRecordRepository;
import com.example.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private FinancialRecordRepository recordRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0) {
                        return; // Already seeded
                }

                // --- Seed Users ---
                User admin = User.builder()
                                .name("Admin User")
                                .email("admin@finance.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(Role.ADMIN)
                                .active(true)
                                .build();

                User analyst = User.builder()
                                .name("Analyst User")
                                .email("analyst@finance.com")
                                .password(passwordEncoder.encode("analyst123"))
                                .role(Role.ANALYST)
                                .active(true)
                                .build();

                User viewer = User.builder()
                                .name("Viewer User")
                                .email("viewer@finance.com")
                                .password(passwordEncoder.encode("viewer123"))
                                .role(Role.VIEWER)
                                .active(true)
                                .build();

                userRepository.saveAll(List.of(admin, analyst, viewer));

                // --- Seed Financial Records ---
                List<FinancialRecord> records = List.of(
                                FinancialRecord.builder()
                                                .amount(75000.0).type(TransactionType.INCOME).category("Salary")
                                                .date(LocalDate.of(2026, 1, 5)).description("January salary")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(75000.0).type(TransactionType.INCOME).category("Salary")
                                                .date(LocalDate.of(2026, 2, 5)).description("February salary")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(75000.0).type(TransactionType.INCOME).category("Salary")
                                                .date(LocalDate.of(2026, 3, 5)).description("March salary")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(15000.0).type(TransactionType.INCOME).category("Freelance")
                                                .date(LocalDate.of(2026, 1, 15)).description("Web development project")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(8000.0).type(TransactionType.INCOME).category("Freelance")
                                                .date(LocalDate.of(2026, 2, 20)).description("UI design work")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(5000.0).type(TransactionType.INCOME).category("Investment")
                                                .date(LocalDate.of(2026, 3, 10)).description("Dividend income")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(12000.0).type(TransactionType.EXPENSE).category("Rent")
                                                .date(LocalDate.of(2026, 1, 1)).description("Monthly rent January")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(12000.0).type(TransactionType.EXPENSE).category("Rent")
                                                .date(LocalDate.of(2026, 2, 1)).description("Monthly rent February")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(12000.0).type(TransactionType.EXPENSE).category("Rent")
                                                .date(LocalDate.of(2026, 3, 1)).description("Monthly rent March")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(3500.0).type(TransactionType.EXPENSE).category("Groceries")
                                                .date(LocalDate.of(2026, 1, 8)).description("Monthly groceries")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(4200.0).type(TransactionType.EXPENSE).category("Groceries")
                                                .date(LocalDate.of(2026, 2, 10)).description("Monthly groceries")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(3800.0).type(TransactionType.EXPENSE).category("Groceries")
                                                .date(LocalDate.of(2026, 3, 12)).description("Monthly groceries")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(2500.0).type(TransactionType.EXPENSE).category("Utilities")
                                                .date(LocalDate.of(2026, 1, 15))
                                                .description("Electricity and water bill").userId(admin.getId())
                                                .deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(2800.0).type(TransactionType.EXPENSE).category("Utilities")
                                                .date(LocalDate.of(2026, 2, 15))
                                                .description("Electricity and water bill").userId(admin.getId())
                                                .deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(1500.0).type(TransactionType.EXPENSE).category("Entertainment")
                                                .date(LocalDate.of(2026, 1, 20)).description("Movie tickets and dinner")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(6000.0).type(TransactionType.EXPENSE).category("Healthcare")
                                                .date(LocalDate.of(2026, 2, 25))
                                                .description("Doctor visit and medicines").userId(admin.getId())
                                                .deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(10000.0).type(TransactionType.EXPENSE).category("Travel")
                                                .date(LocalDate.of(2026, 3, 15)).description("Weekend trip to Goa")
                                                .userId(admin.getId()).deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(2000.0).type(TransactionType.EXPENSE).category("Education")
                                                .date(LocalDate.of(2026, 3, 20))
                                                .description("Online course subscription").userId(admin.getId())
                                                .deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(20000.0).type(TransactionType.INCOME).category("Bonus")
                                                .date(LocalDate.of(2026, 3, 25))
                                                .description("Quarterly performance bonus").userId(admin.getId())
                                                .deleted(false).build(),
                                FinancialRecord.builder()
                                                .amount(4500.0).type(TransactionType.EXPENSE).category("Shopping")
                                                .date(LocalDate.of(2026, 3, 28))
                                                .description("New clothes and accessories").userId(admin.getId())
                                                .deleted(false).build());

                recordRepository.saveAll(records);

                System.out.println("=== Data Seeded Successfully ===");
                System.out.println("Admin:   admin@finance.com / admin123");
                System.out.println("Analyst: analyst@finance.com / analyst123");
                System.out.println("Viewer:  viewer@finance.com / viewer123");
                System.out.println("Financial Records: " + records.size() + " records created");
        }
}
