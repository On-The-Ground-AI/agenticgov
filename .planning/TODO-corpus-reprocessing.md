# TODO: MDB Corpus Reprocessing (Pre-Paper)

**Status:** Deferred — to be done before academic paper submission
**Created:** March 8, 2026
**Priority:** High (blocks accurate paper statistics)

## Context

The current MDB corpus of 352 PDFs was collected ad-hoc and contains 85 non-project documents mixed with 266 actual evaluations. The metadata (financing amounts, project numbers, source URLs) is incomplete — only 20% of reports have financing data extracted. Before the academic paper is finalized, the entire corpus needs to be re-curated from scratch.

## What Was Done (March 8, 2026)

- Classified all 351 scored reports into project evaluations (266) vs excluded (85)
- Updated Benchmark Explorer, API functions, and all RPCs to filter to project-only
- Created `project_evaluations_inventory.csv` and `excluded_documents_inventory.csv`
- Built `09_extract_metadata.py` for financing/URL extraction (20% coverage)
- Migration 011 ready for deployment

## What Needs to Be Done Later

### Step 1: Systematic Download
- [ ] Download all ADB PPERs, PVRs, and Impact Evaluation Studies systematically from ADB IED website
- [ ] Download all World Bank PPARs and ICRs from IEG/WB documents site
- [ ] Maintain a download manifest with: source URL, download date, project number, document ID
- [ ] Ensure no duplicates (current corpus has several duplicate scans)
- [ ] Remove non-project documents from `raw_pdfs/` (or move to `raw_pdfs/reference/`)

### Step 2: Text Extraction
- [ ] Re-run `01_extract_text.py` on all new/updated PDFs
- [ ] Ensure high-quality OCR for scanned documents
- [ ] Target: 100% of project reports should have extracted markdown text (currently 94/266 = 35%)

### Step 3: Metadata Extraction
- [ ] Re-run `09_extract_metadata.py` with all text available
- [ ] For remaining gaps, run an AI extraction pass (Claude Sonnet batch) to extract:
  - Financing amount (loan + grant + total)
  - Project number
  - Approval date / completion date
  - Sector and sub-sector
  - Country
  - Implementing agency
- [ ] Manually verify a sample of extracted metadata for accuracy
- [ ] Update `project_evaluations_inventory.csv` with complete metadata

### Step 4: Quality Scoring
- [ ] Re-run `02_score.py` on all reports with extracted text
- [ ] Re-run `08_deep_extract.py` for structured extraction (EIRR, effect sizes, lessons)
- [ ] Update `report_benchmarks` table with new scores and metadata

### Step 5: Upload & Verify
- [ ] Run `06_upload_benchmarks.py` to update Supabase
- [ ] Run migration 011 to ensure RPCs filter correctly
- [ ] Verify Benchmark Explorer shows correct count and data
- [ ] Verify all AI API functions return project-only context

### Step 6: Paper Statistics
- [ ] Generate final statistics from clean corpus for the academic paper
- [ ] Re-run `generate_pdf.py` to update CODEBASE_REPORT with final numbers
- [ ] Cross-reference every report title with its source URL

## Pipeline Scripts (in order)

```
01_extract_text.py      → PDF text extraction
02_score.py             → Quality scoring (6 dimensions, 0-18)
03_ingest_supabase.py   → RAG chunk upload
06_upload_benchmarks.py → Benchmark records upload
08_deep_extract.py      → Structured extraction (EIRR, effect sizes, lessons)
09_extract_metadata.py  → Financing, project numbers, source URLs
```

## Key Files

| File | Purpose |
|------|---------|
| `mdb_reports/processed/project_evaluations_inventory.csv` | Canonical 266-entry project inventory |
| `mdb_reports/processed/excluded_documents_inventory.csv` | 85 excluded docs with reasons |
| `mdb_reports/processed/report_inventory.csv` | Legacy full 351-entry inventory |
| `supabase/migrations/011_filter_project_evaluations.sql` | RPC doc_type filters |
