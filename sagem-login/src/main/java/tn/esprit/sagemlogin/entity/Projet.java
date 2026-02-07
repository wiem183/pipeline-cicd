package tn.esprit.sagemlogin.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projet {
    @Id
    private String id;
    private String nom;
    private String description;
    private String nomFichier;
    private String fichierIdMongo;
}

