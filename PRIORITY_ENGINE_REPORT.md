# PRIORITY ENGINE REPORT

## Priority Algorithm
The Priority Engine resolves the critical problem of resource allocation by determining which issues matter most.

## Mathematical Model
`Priority Score = Urgency * Impact * Gap`
- **Gap:** 100 - Current Value.
- **Urgency:** Multiplier based on the severity of the gap (>40 = 3x, >20 = 2x).
- **Impact:** Multiplier based on the strategic importance of the dimension (Mutu Hasil Belajar [A] and Mutu Pembelajaran [D] receive higher weight multipliers).

## Output
The engine exposes a `getTopPriorities(limit)` method, allowing downstream modules (like RKT and RKAS) to automatically filter and fund only the top 5, 10, or 20 most critical issues, completely removing human bias from budget prioritization.
