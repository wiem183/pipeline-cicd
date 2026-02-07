package tn.esprit.sagemlogin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.sagemlogin.entity.QuoiTester;
import tn.esprit.sagemlogin.service.QuoiTesterService;


import java.util.List;

@RestController
@RequestMapping("/api/quoi-tester")
public class QuoiTesterController {

    @Autowired
    private QuoiTesterService service;

    @GetMapping
    public List<QuoiTester> getAll() {
        return service.findAll();
    }
}
