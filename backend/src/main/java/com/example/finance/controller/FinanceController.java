package com.example.finance.controller;

import com.example.finance.dto.FinancialRecordDTO;
import com.example.finance.security.JwtTokenProvider;
import com.example.finance.service.FinancialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@Tag(name = "Financial Records", description = "CRUD and filtering for financial records")
public class FinanceController {

    @Autowired
    private FinancialService financialService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a financial record (Admin only)")
    public ResponseEntity<FinancialRecordDTO> create(
            @Valid @RequestBody FinancialRecordDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        Long userId = tokenProvider.getUserIdFromToken(token);

        return ResponseEntity.status(HttpStatus.CREATED).body(financialService.create(dto, userId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    @Operation(summary = "Get all records with pagination")
    public ResponseEntity<Page<FinancialRecordDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(financialService.getAll(page, size));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    @Operation(summary = "Get all records without pagination")
    public ResponseEntity<List<FinancialRecordDTO>> getAllRecords() {
        return ResponseEntity.ok(financialService.getAllRecords());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    @Operation(summary = "Get a single record by ID")
    public ResponseEntity<FinancialRecordDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(financialService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a financial record (Admin only)")
    public ResponseEntity<FinancialRecordDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody FinancialRecordDTO dto) {
        return ResponseEntity.ok(financialService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft delete a financial record (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        financialService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    @Operation(summary = "Filter records by type, category, and/or date range")
    public ResponseEntity<List<FinancialRecordDTO>> filter(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(financialService.filter(type, category, startDate, endDate));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('VIEWER', 'ANALYST', 'ADMIN')")
    @Operation(summary = "Search records by keyword in description or category")
    public ResponseEntity<List<FinancialRecordDTO>> search(
            @RequestParam String keyword) {
        return ResponseEntity.ok(financialService.search(keyword));
    }
}