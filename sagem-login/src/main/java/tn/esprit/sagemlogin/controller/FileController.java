package tn.esprit.sagemlogin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.sagemlogin.service.FileService;


@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        fileService.saveFile(file);
        return ResponseEntity.ok("Fichier importé avec succès !");
    }


    @PostMapping("/run-etl")
    public ResponseEntity<String> runEtlScript(
            @RequestParam String fileName,
            @RequestParam String type) {
        boolean result = fileService.runEtlScript(fileName, type);
        if (result) {
            return ResponseEntity.ok("Script ETL exécuté avec succès !");
        } else {
            return ResponseEntity.status(500).body("Erreur lors de l’exécution du script ETL");
        }
    }
    @PostMapping(value = "/upload-and-run", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadAndRun(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        try {
            fileService.saveFile(file);
            boolean success = fileService.runEtlScript(file.getOriginalFilename(), type);
            if (success) {
                return ResponseEntity.ok("Fichier stocké et script ETL exécuté avec succès !");
            } else {
                return ResponseEntity.status(500).body("Erreur lors de l’exécution du script ETL");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }


}
