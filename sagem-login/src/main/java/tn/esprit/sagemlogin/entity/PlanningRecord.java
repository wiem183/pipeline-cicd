package tn.esprit.sagemlogin.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "planning")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanningRecord {
    @Id
    private String id;
    private Map<String, Object> data;  // Toutes les colonnes du fichier
    private String projet;             // Nom du projet
}
