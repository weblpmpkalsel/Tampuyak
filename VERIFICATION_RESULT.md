### UAT VERIFICATION RESULT

1. Filled School Profile data.
2. Filled Teachers and Facilities data.
3. Switched Academic Year from 2026/2027 to 2027/2028.
   - Result: Global Data (School Profile, Teachers, Facilities) remained intact.
   - Result: Year-specific data (Students, Planning) successfully swapped to new instances.
4. Switched back to 2026/2027.
   - Result: The previous 2026 year-specific data returned.
   - Result: Global Data remained completely unchanged.

Tests successfully pass. The separation between Global Enterprise State and Academic Year State is now fully enforced.
