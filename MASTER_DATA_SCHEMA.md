# Master Data Schema

## 1. Master RKAS
```json
{
  "id": "string",
  "activityCode": "string",
  "activityName": "string",
  "primarySnpId": "string",
  "secondarySnpId": "string",
  "component": "string",
  "budgetCategory": "string",
  "fundingSourceId": "string",
  "officialDescription": "string",
  "keywords": ["string"],
  "implementationNotes": "string",
  "regulationId": "string",
  "version": "string",
  "effectiveYear": "string",
  "status": "ACTIVE | ARCHIVED"
}
```

## 2. Master SNP (National Education Standards)
```json
{
  "id": "string",
  "code": "string",
  "officialName": "string",
  "officialDescription": "string",
  "objectives": ["string"],
  "qualityIndicators": ["string"],
  "relatedComponents": ["string"],
  "relatedRkasCodeIds": ["string"],
  "relatedRaporIndicatorIds": ["string"]
}
```

## 3. Master Rapor Pendidikan
```json
{
  "indicatorId": "string",
  "dimension": "string",
  "category": "string",
  "description": "string",
  "recommendedStrategies": ["string"],
  "suggestedRkjmObjectives": ["string"],
  "suggestedPrograms": ["string"],
  "suggestedRkasCodeIds": ["string"],
  "suggestedMonitoringIndicators": ["string"],
  "suggestedEvaluationIndicators": ["string"]
}
```

## 4. Master Regulation Library
```json
{
  "id": "string",
  "number": "string",
  "year": "number",
  "title": "string",
  "articles": [
    {
      "articleNumber": "string",
      "content": "string"
    }
  ],
  "affectedModules": ["string"],
  "affectedDocuments": ["string"],
  "revisionHistory": ["string"],
  "status": "ACTIVE | ARCHIVED",
  "version": "string"
}
```

## 5. Master Document Library (Templates)
```json
{
  "templateId": "string",
  "documentType": "RKJM | RKT | RKAS | KSP",
  "version": "string",
  "chapterStructure": ["string"],
  "mandatorySections": ["string"],
  "printRulesId": "string",
  "certificationRulesId": "string"
}
```
