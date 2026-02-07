package tn.esprit.sagemlogin.service;

import org.springframework.stereotype.Service;
import tn.esprit.sagemlogin.entity.Projet;
import tn.esprit.sagemlogin.repositories.projets.ProjetRepository;


import java.util.List;

@Service
public class ProjetService {
    private final ProjetRepository projetRepository;

    public ProjetService(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    public Projet addProjet(Projet projet) {
        return projetRepository.save(projet);
    }
}
