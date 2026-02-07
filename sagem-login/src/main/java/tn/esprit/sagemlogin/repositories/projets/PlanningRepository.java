package tn.esprit.sagemlogin.repositories.projets;
import org.springframework.data.mongodb.repository.MongoRepository;
import tn.esprit.sagemlogin.entity.Planning;


public interface PlanningRepository extends MongoRepository<Planning, String> {
}
