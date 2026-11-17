# JSON Schema for TIE Output

TIE outputs decisions in a strict JSON format. LLMs (if enabled) consume this JSON, never raw logic.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "analysisId": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "indicatorId": { "type": "string" },
          "score": { "type": "number" },
          "gap": { "type": "boolean" },
          "rootCauses": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "causeId": { "type": "string" },
                "description": { "type": "string" },
                "confidence": { "type": "number" }
              }
            }
          },
          "recommendations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "alternativeId": { "type": "string" },
                "priority": { "type": "string" },
                "rkjmObjective": { "type": "string" },
                "rktProgram": { "type": "string" },
                "rkasCode": { "type": "string" },
                "snpId": { "type": "string" },
                "regulationId": { "type": "string" },
                "explainability": {
                  "type": "object",
                  "properties": {
                    "why": { "type": "string" },
                    "evidence": { "type": "string" },
                    "expectedImpact": { "type": "string" }
                  }
                },
                "metrics": {
                  "type": "object",
                  "properties": {
                    "impactScore": { "type": "number" },
                    "urgencyScore": { "type": "number" },
                    "costEstimate": { "type": "string" },
                    "difficulty": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
