package tn.esprit.sagemlogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.sagemlogin.entity.Planning;
import tn.esprit.sagemlogin.service.PlanningService;

import java.util.List;

@RestController
@RequestMapping("/api/planning")
@RequiredArgsConstructor
public class PlanningController {

    private final PlanningService planningService;

    @GetMapping
    public List<Planning> getAllPlannings() {
        return planningService.getAll();
    }

    @PostMapping
    public Planning addPlanning(@RequestBody Planning planning) {
        return planningService.add(planning);
    }
}
