package tn.esprit.sagemlogin.controller;

import org.springframework.web.bind.annotation.*;
import tn.esprit.sagemlogin.entity.Projet;
import tn.esprit.sagemlogin.service.ProjetService;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@CrossOrigin(origins = "http://localhost:4200") // autoriser Angular localhost
public class ProjetController {

    private final ProjetService projetService;

    public ProjetController(ProjetService projetService) {
        this.projetService = projetService;
    }

    @GetMapping
    public List<Projet> getAllProjets() {
        return projetService.getAllProjets();
    }

    @PostMapping
    public Projet createProjet(@RequestBody Projet projet) {
        return projetService.addProjet(projet);
    }
}
