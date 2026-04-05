package com.example.finance.service;

import com.example.finance.dto.FinancialRecordDTO;
import com.example.finance.exception.ResourceNotFoundException;
import com.example.finance.model.FinancialRecord;
import com.example.finance.model.TransactionType;
import com.example.finance.repository.FinancialRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinancialService {

    @Autowired
    private FinancialRecordRepository repo;

    
    public FinancialRecordDTO create(FinancialRecordDTO dto, Long userId) {
        FinancialRecord record = FinancialRecord.builder()
                .amount(dto.getAmount())
                .type(dto.getType())
                .category(dto.getCategory())
                .date(dto.getDate())
                .description(dto.getDescription())
                .userId(userId)
                .deleted(false)
                .build();

        return toDTO(repo.save(record));
    }

    
    public Page<FinancialRecordDTO> getAll(int page, int size) {
        return repo.findByDeletedFalse(PageRequest.of(page, size, Sort.by("date").descending()))
                .map(this::toDTO);
    }

    
    public List<FinancialRecordDTO> getAllRecords() {
        return repo.findByDeletedFalse().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public FinancialRecordDTO getById(Long id) {
        FinancialRecord record = repo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial record not found with id: " + id));
        return toDTO(record);
    }

    
    public FinancialRecordDTO update(Long id, FinancialRecordDTO dto) {
        FinancialRecord record = repo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial record not found with id: " + id));

        if (dto.getAmount() != null) record.setAmount(dto.getAmount());
        if (dto.getType() != null) record.setType(dto.getType());
        if (dto.getCategory() != null) record.setCategory(dto.getCategory());
        if (dto.getDate() != null) record.setDate(dto.getDate());
        if (dto.getDescription() != null) record.setDescription(dto.getDescription());

        return toDTO(repo.save(record));
    }

    
    public void delete(Long id) {
        FinancialRecord record = repo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Financial record not found with id: " + id));

        record.setDeleted(true);
        repo.save(record);
    }

    
    public List<FinancialRecordDTO> filter(String type, String category, String startDate, String endDate) {
        TransactionType txType = type != null ? TransactionType.valueOf(type.toUpperCase()) : null;
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;

        List<FinancialRecord> results;

        if (txType != null && category != null && start != null && end != null) {
            results = repo.findByTypeAndCategoryAndDateBetweenAndDeletedFalse(txType, category, start, end);
        } else if (txType != null && category != null) {
            results = repo.findByTypeAndCategoryAndDeletedFalse(txType, category);
        } else if (txType != null && start != null && end != null) {
            results = repo.findByTypeAndDateBetweenAndDeletedFalse(txType, start, end);
        } else if (category != null && start != null && end != null) {
            results = repo.findByCategoryAndDateBetweenAndDeletedFalse(category, start, end);
        } else if (txType != null) {
            results = repo.findByTypeAndDeletedFalse(txType);
        } else if (category != null) {
            results = repo.findByCategoryAndDeletedFalse(category);
        } else if (start != null && end != null) {
            results = repo.findByDateBetweenAndDeletedFalse(start, end);
        } else {
            results = repo.findByDeletedFalse();
        }

        return results.stream().map(this::toDTO).collect(Collectors.toList());
    }

    
    public List<FinancialRecordDTO> search(String keyword) {
        return repo.searchByKeyword(keyword).stream()
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