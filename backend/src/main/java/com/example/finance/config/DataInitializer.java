package com.example.finance.config;

import com.example.finance.model.*;
import com.example.finance.repository.FinancialRecordRepository;
import com.example.finance.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
@Profile("prod")
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepo,
                               FinancialRecordRepository financeRepo,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.count() == 0) {
                // Create demo admin user
                User admin = User.builder()
                        .name("Demo Admin")
                        .email("admin@demo.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .active(true)
                        .build();
                admin = userRepo.save(admin);

                // Create demo analyst user
                User analyst = User.builder()
                        .name("Demo Analyst")
                        .email("analyst@demo.com")
                        .password(passwordEncoder.encode("analyst123"))
                        .role(Role.ANALYST)
                        .active(true)
                        .build();
                userRepo.save(analyst);

                // Create sample financial records
                Long uid = admin.getId();

                financeRepo.save(FinancialRecord.builder()
                        .amount(5000.00).type(TransactionType.INCOME)
                        .category("Salary").date(LocalDate.now().minusDays(30))
                        .description("Monthly salary").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(1200.00).type(TransactionType.EXPENSE)
                        .category("Rent").date(LocalDate.now().minusDays(28))
                        .description("Monthly rent payment").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(250.00).type(TransactionType.EXPENSE)
                        .category("Groceries").date(LocalDate.now().minusDays(25))
                        .description("Weekly groceries").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(2000.00).type(TransactionType.INCOME)
                        .category("Freelance").date(LocalDate.now().minusDays(20))
                        .description("Freelance project payment").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(150.00).type(TransactionType.EXPENSE)
                        .category("Utilities").date(LocalDate.now().minusDays(15))
                        .description("Electric and water bills").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(500.00).type(TransactionType.EXPENSE)
                        .category("Entertainment").date(LocalDate.now().minusDays(10))
                        .description("Concert tickets").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(3000.00).type(TransactionType.INCOME)
                        .category("Investment").date(LocalDate.now().minusDays(5))
                        .description("Stock dividend").userId(uid).deleted(false).build());

                financeRepo.save(FinancialRecord.builder()
                        .amount(80.00).type(TransactionType.EXPENSE)
                        .category("Transport").date(LocalDate.now().minusDays(2))
                        .description("Fuel and parking").userId(uid).deleted(false).build());

                System.out.println(">>> Demo data initialized successfully!");
                System.out.println(">>> Login: admin@demo.com / admin123");
            }
        };
    }
}
