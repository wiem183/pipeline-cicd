package tn.esprit.sagemlogin.repositories.projets;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.sagemlogin.entity.Projet;

@Repository
public interface ProjetRepository extends MongoRepository<Projet, String> {
}