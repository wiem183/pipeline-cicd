package tn.esprit.sagemlogin.repositories.projets;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.sagemlogin.entity.QuoiTester;


@Repository
public interface QuoiTesterRepository extends MongoRepository<QuoiTester, String> {
}
