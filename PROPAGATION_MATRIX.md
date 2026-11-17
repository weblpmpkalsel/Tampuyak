# Propagation Matrix

| Input Node | Downstream Node | Propagates? | Blocked By |
|---|---|---|---|
| Education Report | Priority Analysis (UI) | YES | N/A |
| Priority Analysis (UI) | Approval | YES | N/A |
| Approval | DOE | **NO** | DOE ignores approval status |
| Priority Analysis (UI) | DOE | **NO** | DOE recalculates from raw Rapor data |
| DOE | RKJM | YES | N/A |
| DOE | RKT | YES | N/A |
| DOE | RKAS | YES | N/A |
