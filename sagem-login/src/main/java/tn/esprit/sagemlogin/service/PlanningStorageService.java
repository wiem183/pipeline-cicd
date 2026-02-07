package tn.esprit.sagemlogin.service;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.sagemlogin.entity.PlanningRecord;
import tn.esprit.sagemlogin.repositories.projets.PlanningRecordRepository;


import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PlanningStorageService {

    private final PlanningRecordRepository planningRecordRepository;

    public void savePlanningByRows(MultipartFile file) throws Exception {
        String projectName = extractProjectName(file.getOriginalFilename());

        // Supprimer anciens
        planningRecordRepository.deleteByProjet(projectName);

        List<PlanningRecord> records = parseExcelFile(file.getInputStream(), projectName);

        planningRecordRepository.saveAll(records);
    }

    private List<PlanningRecord> parseExcelFile(InputStream inputStream, String projectName) throws Exception {
        List<PlanningRecord> records = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        Iterator<Row> rowIterator = sheet.iterator();
        List<String> headers = new ArrayList<>();

        if (rowIterator.hasNext()) {
            Row headerRow = rowIterator.next();
            headerRow.forEach(cell -> headers.add(cell.getStringCellValue().trim()));
        }

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Map<String, Object> rowData = new HashMap<>();

            for (int i = 0; i < headers.size(); i++) {
                Cell cell = row.getCell(i);
                Object value = getCellValue(cell);
                rowData.put(headers.get(i), value);
            }

            records.add(new PlanningRecord(null, rowData, projectName));
        }

        workbook.close();
        return records;
    }

    private Object getCellValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return cell.getNumericCellValue();
            case BOOLEAN: return cell.getBooleanCellValue();
            default: return null;
        }
    }

    private String extractProjectName(String filename) {
        if (filename != null && filename.contains("_")) {
            return filename.split("_")[0].trim().toLowerCase();
        }
        return "projet_sans_nom";
    }
}
