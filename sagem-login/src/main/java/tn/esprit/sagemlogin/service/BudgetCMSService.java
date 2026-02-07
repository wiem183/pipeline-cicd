package tn.esprit.sagemlogin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.sagemlogin.entity.Budget_CMS;
import tn.esprit.sagemlogin.repositories.projets.BudgetCMSRepository;


import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetCMSService {

    private final BudgetCMSRepository budgetCMSRepository;

    public List<Budget_CMS> getAll() {
        return budgetCMSRepository.findAll();
    }

    public List<Budget_CMS> getByProjet(String projet) {
        return budgetCMSRepository.findByProjet(projet);
    }

    public Budget_CMS save(Budget_CMS budgetCMS) {
        return budgetCMSRepository.save(budgetCMS);
    }

    public void deleteById(String id) {
        budgetCMSRepository.deleteById(id);
    }
}
