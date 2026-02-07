package tn.esprit.sagemlogin.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "test_quoi_tester")  // nom de la collection MongoDB
public class QuoiTester {

    @Id
    private String id;

    @Field("Famille Technique")
    private String familleTechnique;

    @Field("Fonctions a tester")
    private String fonctionsATester;

    @Field("Demande ICP")
    private String demandeICP;

    @Field("Commentaire")
    private String commentaire;

    @Field("Soft de Test")
    private String softDeTest;

    private String projet;
}
