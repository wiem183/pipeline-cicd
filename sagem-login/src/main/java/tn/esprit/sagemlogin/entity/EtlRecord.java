package tn.esprit.sagemlogin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "budget_cms") // ici c’est bien le nom de ta collection (même s’il contient un espace)
public class EtlRecord {
    @Id
    private String id;

    @Field("projet")
    private String projet;

    // Si tu veux récupérer d'autres champs, tu les ajoutes ici avec @Field
    // Ex. :
    // @Field("Process / Phase / Operations ")
    // private String processPhaseOperations;

    // Getters et setters
    public String getId() {
        return id;
    }

    public String getProjet() {
        return projet;
    }

    public void setProjet(String projet) {
        this.projet = projet;
    }
}

