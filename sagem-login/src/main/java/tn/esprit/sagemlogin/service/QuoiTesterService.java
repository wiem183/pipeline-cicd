package tn.esprit.sagemlogin.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.sagemlogin.entity.QuoiTester;
import tn.esprit.sagemlogin.repositories.projets.QuoiTesterRepository;

import java.util.List;

@Service
public class QuoiTesterService {

    @Autowired
    private QuoiTesterRepository repository;

    public List<QuoiTester> findAll() {
        return repository.findAll();
    }
}
