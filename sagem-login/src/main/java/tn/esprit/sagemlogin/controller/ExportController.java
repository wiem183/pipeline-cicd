package tn.esprit.sagemlogin.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.xslf.usermodel.*;
import org.apache.poi.sl.usermodel.PictureData;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ExportController {

    /**
     * Reçoit une image base64 dans le JSON { "imageBase64": "data:image/png;base64,iVBORw0..." }
     * Crée un PowerPoint avec cette image en slide, puis le renvoie en réponse HTTP.
     */
    @PostMapping("/export-ppt")
    public void exportPowerPoint(@RequestBody Map<String, String> requestBody,
                                 HttpServletResponse response) throws IOException {
        String imageBase64 = requestBody.get("imageBase64");

        if (imageBase64 == null || !imageBase64.startsWith("data:image")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Image base64 invalide ou manquante.");
            return;
        }

        // Nettoyer le préfixe "data:image/png;base64,"
        String base64Data = imageBase64.substring(imageBase64.indexOf(",") + 1);
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        // Préparer la réponse HTTP
        response.setContentType("application/vnd.openxmlformats-officedocument.presentationml.presentation");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=rapport.pptx");

        // Créer la présentation PowerPoint
        XMLSlideShow ppt = new XMLSlideShow();

        // Créer une slide
        XSLFSlide slide = ppt.createSlide();

        // Ajouter l'image à la présentation
        XSLFPictureData pictureData = ppt.addPicture(imageBytes, PictureData.PictureType.PNG);
        XSLFPictureShape pictureShape = slide.createPicture(pictureData);

        // Positionner l'image pour couvrir toute la slide (ajuster si besoin)
        Dimension pgsize = ppt.getPageSize();
        pictureShape.setAnchor(new Rectangle(0, 0, pgsize.width, pgsize.height));

        // Envoyer le fichier PPT en réponse HTTP
        ppt.write(response.getOutputStream());
        ppt.close();
    }
}
