package tn.esprit.sagemlogin.repositories.projets;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;
import tn.esprit.sagemlogin.entity.Budget_CMS;;

import java.util.List;
@Repository
public interface BudgetCMSRepository extends MongoRepository<Budget_CMS, String> {
    List<Budget_CMS> findByProjet(String projet);
}
