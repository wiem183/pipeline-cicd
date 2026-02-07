package tn.esprit.sagemlogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.sagemlogin.service.PlanningStorageService;


@RestController
@RequestMapping("/sagem/api/files")
@RequiredArgsConstructor
public class PlanningUploadController {

    private final PlanningStorageService planningStorageService;

    @PostMapping("/upload-planning")
    public ResponseEntity<String> uploadPlanning(@RequestParam("file") MultipartFile file) {
        try {
            planningStorageService.savePlanningByRows(file);
            return ResponseEntity.ok("Planning enregistré avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
}
