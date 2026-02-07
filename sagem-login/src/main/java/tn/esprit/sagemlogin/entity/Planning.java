package tn.esprit.sagemlogin.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = "planning") // nom de la collection MongoDB
public class Planning {

    @Id
    private String id;

    @Field("Famille")
    private String famille;

    @Field("Fonction a testée")
    private String fonctionATester;

    @Field("Date Début")
    private String dateDebut;

    @Field("Date Fin")
    private String dateFin;

    @Field("projet")
    private String projet;
}
