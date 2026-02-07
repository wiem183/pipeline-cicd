package tn.esprit.sagemlogin.config;



import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        // Remplace par l’URI de connexion réelle si nécessaire
        return MongoClients.create("mongodb://sagem-mongo:27017/projets");
    }
}

