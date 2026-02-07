package tn.esprit.sagemlogin.repositories.projets;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.sagemlogin.entity.PlanningRecord;


import java.util.List;
@Repository
public interface PlanningRecordRepository extends MongoRepository<PlanningRecord, String> {
    List<PlanningRecord> findByProjet(String projet);
    void deleteByProjet(String projet);
}
