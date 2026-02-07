package tn.esprit.sagemlogin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.sagemlogin.entity.BudgetINTEG;
import tn.esprit.sagemlogin.repositories.projets.BudgetINTEGRepository;


import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetINTEGService {

    private final BudgetINTEGRepository repository;

    public List<BudgetINTEG> getAll() {
        return repository.findAll();
    }

    public BudgetINTEG add(BudgetINTEG budgetINTEG) {
        return repository.save(budgetINTEG);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public BudgetINTEG update(String id, BudgetINTEG updated) {
        BudgetINTEG existing = repository.findById(id).orElseThrow(() -> new RuntimeException("BudgetINTEG not found"));
        updated.setId(id);
        return repository.save(updated);
    }

    public BudgetINTEG getById(String id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("BudgetINTEG not found"));
    }
}
