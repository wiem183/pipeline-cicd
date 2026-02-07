package tn.esprit.sagemlogin.repositories.projets;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.sagemlogin.entity.BudgetINTEG;

@Repository
public interface BudgetINTEGRepository extends MongoRepository<BudgetINTEG, String> {
}
