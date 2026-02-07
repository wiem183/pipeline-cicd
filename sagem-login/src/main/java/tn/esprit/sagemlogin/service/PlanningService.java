package tn.esprit.sagemlogin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.sagemlogin.entity.Planning;
import tn.esprit.sagemlogin.repositories.projets.PlanningRepository;


import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanningService {

    private final PlanningRepository planningRepository;

    public List<Planning> getAll() {
        return planningRepository.findAll();
    }

    public Planning add(Planning planning) {
        return planningRepository.save(planning);
    }

    public void delete(String id) {
        planningRepository.deleteById(id);
    }

    public Planning update(String id, Planning newPlanning) {
        return planningRepository.findById(id).map(p -> {
            p.setFamille(newPlanning.getFamille());
            p.setFonctionATester(newPlanning.getFonctionATester());
            p.setDateDebut(newPlanning.getDateDebut());
            p.setDateFin(newPlanning.getDateFin());
            return planningRepository.save(p);
        }).orElse(null);
    }

    public Planning getById(String id) {
        return planningRepository.findById(id).orElse(null);
    }
}