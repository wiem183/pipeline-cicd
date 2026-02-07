package tn.esprit.sagemlogin.repositories.projets;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.sagemlogin.entity.EtlRecord;

import java.util.List;

@Repository
public interface EtlRecordRepository extends MongoRepository<EtlRecord, String> {
    List<EtlRecord> findAll();
}

