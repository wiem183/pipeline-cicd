package tn.esprit.sagemlogin.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.sagemlogin.dto.ProjetDTO;
import tn.esprit.sagemlogin.entity.EtlRecord;
import tn.esprit.sagemlogin.repositories.projets.EtlRecordRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtlRecordService {

    private final EtlRecordRepository etlRecordRepository;
    private final MongoTemplate projetsMongoTemplate; // En gris car non utilisé (pour l'instant)

    public EtlRecordService(
            EtlRecordRepository etlRecordRepository,
            @Qualifier("projetsMongoTemplate") MongoTemplate projetsMongoTemplate
    ) {
        this.etlRecordRepository = etlRecordRepository;
        this.projetsMongoTemplate = projetsMongoTemplate;
    }

    public List<ProjetDTO> getAllProjects() {
        return etlRecordRepository.findAll().stream()
                .map(record -> new ProjetDTO(record.getProjet()))
                .collect(Collectors.toList());
    }
}