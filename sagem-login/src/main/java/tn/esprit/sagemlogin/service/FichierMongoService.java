package tn.esprit.sagemlogin.service;


import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.MongoClient;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class FichierMongoService {

    private final MongoClient mongoClient;

    private GridFSBucket getGridFSBucket() {
        return GridFSBuckets.create(mongoClient.getDatabase("projets")); // Nom de ta base MongoDB
    }

    public String saveFile(MultipartFile file) throws IOException {
        GridFSUploadOptions options = new GridFSUploadOptions();
        ObjectId fileId = getGridFSBucket().uploadFromStream(
                file.getOriginalFilename(), file.getInputStream(), options
        );
        return fileId.toHexString();
    }

    public InputStream getFileById(String id) {
        return getGridFSBucket().openDownloadStream(new ObjectId(id));
    }
}
