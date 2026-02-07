package tn.esprit.sagemlogin.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "budget_integ")
public class BudgetINTEG {

    @Id
    private String id;

    @Field("Process / Phase / Operations ")
    private String processPhaseOperations;

    @Field("Moynes ")
    private String moynes;

    @Field("Nbre  ")
    private int nbre;

    @Field("Cout Unitaire (euro)")
    private double coutUnitaire;

    @Field("Cout Moyns Prod (euro)")
    private double coutMoynsProd;

    @Field("Couts Interface de test (euro)")
    private double coutsInterfaceTest;

    @Field("Couts Banc de test(euro) ")
    private double coutsBancTest;
    @Field("Budget consommé")
    private double budgetConsomm;



    @Field("Cout Instrument de test(euro) ")
    private double coutInstrumentTest;

    private String projet;

}
