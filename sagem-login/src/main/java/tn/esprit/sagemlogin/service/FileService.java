package tn.esprit.sagemlogin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${etl.script-dir}")
    private String scriptDir;

    public void saveFile(MultipartFile file) {
        try {
            Path dir = Paths.get(uploadDir);
            System.out.println("Upload directory: " + dir.toAbsolutePath());
            Files.createDirectories(dir);
            Path filePath = dir.resolve(file.getOriginalFilename());
            System.out.println("Saving file to: " + filePath.toAbsolutePath());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File saved successfully.");
        } catch (IOException e) {
            System.err.println("Erreur d'enregistrement de fichier : " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur d'enregistrement de fichier", e);
        }
    }


    public boolean runEtlScript(String fileName, String type) {
        String python = "python3";

        String filePath = Paths.get(uploadDir, fileName).toString();
        String scriptName;

        if ("Test".equalsIgnoreCase(type)) {
            scriptName = "Test.py";
        } else if ("Budget".equalsIgnoreCase(type)) {
            scriptName = "Budget.py";
        } else if ("Planning".equalsIgnoreCase(type)) {
            scriptName = "Planning.py"; // Ajout pour Planning
        } else {
            throw new IllegalArgumentException("Type de script ETL non reconnu : " + type);
        }

        String scriptPath = Paths.get(scriptDir, scriptName).toString();

        ProcessBuilder pb = new ProcessBuilder(python, scriptPath, filePath);
        pb.redirectErrorStream(true);

        try {
            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            reader.lines().forEach(System.out::println);
            int exitCode = process.waitFor();
            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return false;
        }
    }
}

