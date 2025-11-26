# Course Consolidation Summary

## Action Taken
Consolidating all courses from `lib/data/curricula/*` into `lib/data/normalized/courses.json`

## Department Mapping
- department_id: 1 → Petroleum Engineering
- department_id: 2 → Chemical Engineering  
- department_id: 3 → Civil Engineering
- department_id: 4 → Electrical & Electronics Engineering
- department_id: 5 → Mechanical Engineering
- department_id: 6 → Computer Science
- department_id: 7 → Information Technology
- department_id: 8 → Software Engineering
- department_id: 9 → Accounting
- department_id: 10 → Business Administration
- department_id: 11 → Mass Communication
- department_id: 12 → English Language
- department_id: 13 → Mathematics
- department_id: 14 → Chemistry
- department_id: 15 → Biology
- department_id: 16 → Physics

## Files to Remove After Consolidation
- ❌ app/lib/data/curricula/engineering.json
- ❌ app/lib/data/curricula/sciences.json
- ❌ app/lib/data/curricula/arts-sciences.json
- ❌ app/lib/data/curricula/arts-sciences-2.json
- ❌ app/lib/data/curricula/business.json
- ❌ app/lib/data/curricula/it-computing.json

## Files to Update
- ✅ app/lib/data/normalized/courses.json - Add all courses
- ✅ app/lib/courseData.ts - Remove curricula imports
- ✅ app/lib/normalizedDatabase.ts - Already configured correctly

## Next Steps
Run this to remove old folder after verification:
```bash
# After confirming everything works, delete the folder:
rm -rf app/lib/data/curricula
```
