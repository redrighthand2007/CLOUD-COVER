# Pensieve — Product Requirements Document

**Type:** Personal portfolio project (Android)
**Author:** Kush Aghera
**Status:** Finalized scope, pre-development
**Cost:** $0 (Room, ML Kit on-device, Firebase Spark free tier)

---

## 1. Overview

Pensieve is an offline-first Android study companion that combines note-taking, OCR-based capture, spaced-repetition flashcards, and reminders. It exists to solve a real personal problem — turning scattered notes/photos of notes into a system that actively schedules review — while doubling as an internship portfolio piece with three defensible technical talking points: offline-first sync with conflict resolution, on-device ML, and a self-implemented scheduling algorithm.

## 2. Goals

- Ship a fully working, solo-testable app in ~4 weeks of evening/weekend work
- Demonstrate three "hard" engineering skills an interviewer can dig into
- Stay buildable without derailing DSA prep — cuttable scope if time runs short

### Non-goals (out of scope for v1)
- Multi-user collaboration or sharing
- Rich text / markdown WYSIWYG editor (plain text + tags only)
- End-to-end encryption
- iOS or cross-platform support
- Handwriting recognition (stretch only, not required for MVP)

## 3. Target user

Primarily Kush himself (dogfooding for exam prep), generalized to any student who takes photos of notes/textbook pages and wants them turned into searchable, reviewable material without manual retyping.

## 4. Core features & how they work

### 4.1 Notes (CRUD) — Phase 1
- Create, edit, delete, tag notes; organize by folder/tag
- Full-text search powered by Room FTS (search title + body instantly, offline)
- Every write goes straight to Room — app is 100% usable with no network at any point
- **Flow:** User taps "New note" → types or pastes text → optionally tags it → saves → appears instantly in list, searchable immediately

### 4.2 OCR capture — Phase 2
- User photographs a page or picks an existing gallery image
- ML Kit Text Recognition runs **on-device** (no network call, no cost) and returns recognized text
- Recognized text is dropped into an editable note draft — user can fix OCR errors before saving
- **Flow:** Camera/gallery → ML Kit extracts text → editable draft screen → user edits/confirms → saved as a normal note

### 4.3 Spaced repetition (SM-2) — Phase 3
- Any note (or a highlighted snippet within it) can be converted into a flashcard (front/back)
- Self-implemented SM-2 algorithm tracks per-card: ease factor, interval (days), repetition count, and next review date
- After each review, user rates recall 0–5; SM-2 recomputes the next interval and ease factor from that rating
- **Flow:** User enters "Review" mode → sees due cards one at a time → flips card → rates recall → SM-2 updates the card's schedule → next due card shown

### 4.4 Reminders — Phase 4
- AlarmManager fires a notification when flashcards become due for review
- Optional custom per-note reminders (e.g. "revisit before exam") independent of the SM-2 schedule
- **Flow:** SM-2 sets `nextReviewDate` on a card → app schedules an exact AlarmManager alarm for that date → notification opens directly into the review queue

### 4.5 Sync — Phase 5 (cuttable)
- WorkManager runs a periodic background job that pushes/pulls notes and flashcards to Firebase Firestore (free tier)
- Conflict resolution: each record carries an `updatedAt` timestamp; sync compares local vs. remote and applies last-write-wins, logging any overwritten conflicts for transparency
- **Flow:** Note edited offline → WorkManager job runs on next connectivity/interval → compares timestamps with Firestore copy → newer version wins, older is overwritten (with a conflict log entry)
- Each note shows a small sync-status icon — synced / pending / conflict — so the conflict-resolution work is visible in a demo, not just background logic
- If cut for time: app remains fully functional single-device; this phase is the only one not required for the other two talking points to stand

## 5. Data model (Room entities)

| Entity | Key fields |
|---|---|
| `Note` | id, title, content, tags, folderId, sourceImageUri (nullable), createdAt, updatedAt, syncStatus (SYNCED/PENDING/CONFLICT) |
| `Flashcard` | id, noteId (FK), front, back, easeFactor, interval, repetitions, nextReviewDate, lastReviewedAt |
| `ReviewLog` | id, flashcardId, reviewedAt, qualityRating (0–5) |
| `Reminder` | id, noteId (FK, nullable), triggerTime, message, isRepeating |
| `SyncMeta` (Phase 5) | entityId, entityType, remoteId, lastSyncedAt, updatedAt |

## 6. Architecture

Standard MVVM + Repository, single module (Clean Architecture's multi-module split deliberately skipped as over-engineering for solo scope):

- **Presentation:** Jetpack Compose screens + ViewModels (UI state, MVVM)
- **Domain:** Repository as single source of truth, mediates between local DB and remote sync
- **Data:** Room (local DB + FTS), ML Kit (on-device OCR), WorkManager + AlarmManager (background sync, reminders), Retrofit/Firebase (optional sync backend)

## 7. Non-functional requirements

- **Offline-first:** every core feature (notes, OCR, review, reminders) must work with airplane mode on
- **Min SDK 26** — covers ~95%+ of active devices
- **Performance:** OCR result returned within ~2s on-device for a typical page photo
- **Testability:** SM-2 logic implemented as pure functions, covered by JUnit + MockK unit tests

## 8. Build plan (4–5 weeks, evenings/weekends)

| Week | Phase | Deliverable |
|---|---|---|
| 1 | Notes CRUD | Offline note creation, editing, tagging, FTS search |
| 2 | OCR | Camera/gallery capture → ML Kit → editable note |
| 3 | SM-2 | Flashcard creation, review session, scheduling algorithm + tests |
| 4 | Reminders | AlarmManager notifications tied to due cards + custom reminders |
| 5 (stretch) | Sync | Firebase Firestore sync via WorkManager + conflict resolution |

If time is short: stop after Phase 4. Notes + OCR + SM-2 + Reminders is a complete, demoable app with 2 of 3 strong talking points intact (OCR and SM-2); sync is the only piece safe to drop.

## 9. Interview talking points this project produces

1. **On-device ML integration** — OCR pipeline with ML Kit, no backend dependency
2. **Self-implemented scheduling algorithm** — SM-2 spaced repetition from scratch, unit-tested
3. **Offline-first sync with conflict resolution** — timestamp-based last-write-wins over Firestore (if Phase 5 is built)

## 10. Risks

| Risk | Mitigation |
|---|---|
| Sync scope creep | Firebase free tier, simple last-write-wins — no custom backend |
| OCR accuracy on messy handwriting | Scope to printed/clear text for MVP; note handwriting recognition as future work |
| Time conflict with DSA prep | Strict weekly phase boundaries; Phase 5 is explicitly cuttable |
