package tn.esprit.sagemlogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.sagemlogin.entity.BudgetINTEG;
import tn.esprit.sagemlogin.service.BudgetINTEGService;

import java.util.List;

@RestController
@RequestMapping("/api/budget-integ")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BudgetINTEGController {

    private final BudgetINTEGService service;

    @GetMapping
    public List<BudgetINTEG> getAll() {
        System.out.println("✅ [BACKEND] Appel GET /api/budget-integ");
        return service.getAll();
    }

    @PostMapping
    public BudgetINTEG add(@RequestBody BudgetINTEG budget) {
        System.out.println("✅ [BACKEND] Appel POST /api/budget-integ");
        return service.add(budget);
    }

    @PutMapping("/{id}")
    public BudgetINTEG update(@PathVariable String id, @RequestBody BudgetINTEG budget) {
        System.out.println("✅ [BACKEND] Appel PUT /api/budget-integ/" + id);
        return service.update(id, budget);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        System.out.println("✅ [BACKEND] Appel DELETE /api/budget-integ/" + id);
        service.delete(id);
    }

    @GetMapping("/{id}")
    public BudgetINTEG getById(@PathVariable String id) {
        System.out.println("✅ [BACKEND] Appel GET /api/budget-integ/" + id);
        return service.getById(id);
    }
}
