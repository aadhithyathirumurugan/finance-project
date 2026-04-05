package com.example.finance.repository;

import com.example.finance.model.FinancialRecord;
import com.example.finance.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialRecordRepository extends JpaRepository<FinancialRecord, Long> {

    

    List<FinancialRecord> findByDeletedFalse();

    Page<FinancialRecord> findByDeletedFalse(Pageable pageable);

    Optional<FinancialRecord> findByIdAndDeletedFalse(Long id);

    

    List<FinancialRecord> findByTypeAndDeletedFalse(TransactionType type);

    List<FinancialRecord> findByCategoryAndDeletedFalse(String category);

    List<FinancialRecord> findByDateBetweenAndDeletedFalse(LocalDate start, LocalDate end);

    List<FinancialRecord> findByTypeAndCategoryAndDeletedFalse(TransactionType type, String category);

    List<FinancialRecord> findByTypeAndDateBetweenAndDeletedFalse(TransactionType type, LocalDate start, LocalDate end);

    List<FinancialRecord> findByCategoryAndDateBetweenAndDeletedFalse(String category, LocalDate start, LocalDate end);

    List<FinancialRecord> findByTypeAndCategoryAndDateBetweenAndDeletedFalse(
            TransactionType type, String category, LocalDate start, LocalDate end);

    

    @Query("SELECT r FROM FinancialRecord r WHERE r.deleted = false AND " +
            "(LOWER(r.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<FinancialRecord> searchByKeyword(@Param("keyword") String keyword);



    List<FinancialRecord> findTop10ByDeletedFalseOrderByDateDescCreatedAtDesc();

    

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM FinancialRecord r WHERE r.type = :type AND r.deleted = false")
    Double sumByType(@Param("type") TransactionType type);

    @Query("SELECT r.category, SUM(r.amount) FROM FinancialRecord r WHERE r.deleted = false GROUP BY r.category ORDER BY SUM(r.amount) DESC")
    List<Object[]> sumGroupByCategory();

    @Query("SELECT FUNCTION('DATE_FORMAT', r.date, '%Y-%m'), r.type, SUM(r.amount) " +
            "FROM FinancialRecord r WHERE r.deleted = false " +
            "GROUP BY FUNCTION('DATE_FORMAT', r.date, '%Y-%m'), r.type " +
            "ORDER BY FUNCTION('DATE_FORMAT', r.date, '%Y-%m')")
    List<Object[]> sumGroupByMonthAndType();

    long countByDeletedFalse();
}