#!/bin/bash
# Extract the import lines
grep "^@import" src/index.css > imports.css
# Extract the rest
grep -v "^@import" src/index.css > rest.css
# Combine them with imports first
cat imports.css rest.css > src/index.css
rm imports.css rest.css
