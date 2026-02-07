package tn.esprit.sagemlogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.sagemlogin.entity.Budget_CMS;
import tn.esprit.sagemlogin.service.BudgetCMSService;

import java.util.List;

@RestController
@RequestMapping("/api/budget-cms")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BudgetCMSController {

    private final BudgetCMSService budgetCMSService;

    @GetMapping
    public List<Budget_CMS> getAll() {
        System.out.println("✅ [BACKEND] Appel GET /api/budget-cms");
        return budgetCMSService.getAll();
    }

    @GetMapping("/{projet}")
    public List<Budget_CMS> getByProjet(@PathVariable String projet) {
        System.out.println("✅ [BACKEND] Appel GET /api/budget-cms/" + projet);
        return budgetCMSService.getByProjet(projet);
    }

    @PostMapping
    public Budget_CMS save(@RequestBody Budget_CMS budgetCMS) {
        System.out.println("✅ [BACKEND] Appel POST /api/budget-cms");
        return budgetCMSService.save(budgetCMS);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        System.out.println("✅ [BACKEND] Appel DELETE /api/budget-cms/" + id);
        budgetCMSService.deleteById(id);
    }
}
