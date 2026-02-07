package tn.esprit.sagemlogin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.sagemlogin.dto.ProjetDTO;
import tn.esprit.sagemlogin.service.EtlRecordService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EtlRecordController {

    private final EtlRecordService etlRecordService;

    public EtlRecordController(EtlRecordService etlRecordService) {
        this.etlRecordService = etlRecordService;
    }

    @GetMapping("/projects")
    public List<ProjetDTO> getAllProjects() {
        return etlRecordService.getAllProjects();
    }
}
