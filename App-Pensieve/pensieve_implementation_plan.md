# Pensieve — Implementation Plan

Companion to the PRD. Each phase lists concrete steps in build order — what to create and how — so you can work through it sequentially without re-deriving decisions mid-build.

---

## Phase 0 — Project setup (do this first, ~1 evening)

1. **Create project** — Android Studio → Empty Activity (Compose) → package `com.kush.pensieve`, min SDK 26.
2. **Add dependencies** (`build.gradle.kts`, app module): Compose BOM, Room + `room-ktx` + `room-testing`, Hilt + `hilt-navigation-compose`, WorkManager + `work-hiltjob` integration, ML Kit text-recognition, Retrofit (only needed in Phase 5), Firebase BOM + `firebase-firestore-ktx` (Phase 5), Compose Navigation.
3. **Enable KSP** (for Room/Hilt annotation processing) instead of kapt — faster builds.
4. **Application class** — `@HiltAndroidApp class PensieveApp`, register in manifest.
5. **Git init**, commit skeleton. Commit after every phase below — gives you a clean history to show in interviews.

---

## Phase 1 — Notes CRUD + search (Week 1)

**Step 1.1 — Room entity**
Create `Note.kt`:
```kotlin
@Entity(tableName = "notes")
data class Note(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val content: String,
    val tags: String = "",
    val folderId: Long? = null,
    val sourceImageUri: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
```

**Step 1.2 — FTS shadow table**
Add a second entity `NoteFts` with `@Fts4(contentEntity = Note::class)` mirroring `title`/`content`. Room auto-syncs it on insert/update.

**Step 1.3 — DAO**
`NoteDao` with `@Insert`, `@Update`, `@Delete`, `@Query("SELECT * FROM notes ORDER BY updatedAt DESC")` returning `Flow<List<Note>>`, and a search query joining against `NoteFts` using `MATCH`.

**Step 1.4 — Database class**
`@Database(entities = [Note::class, NoteFts::class], version = 1) abstract class PensieveDatabase`. Provide it via Hilt `@Module @InstallIn(SingletonComponent::class)` using `Room.databaseBuilder`.

**Step 1.5 — Repository**
`NoteRepository` wraps the DAO — this is the layer everything else (ViewModel, later sync) talks to, never the DAO directly.

**Step 1.6 — ViewModel**
`NoteListViewModel` exposes `notes: StateFlow<List<Note>>` from the repository's `Flow`. `NoteEditViewModel` holds a single note's editable state and a `save()` function.

**Step 1.7 — Compose screens**
`NoteListScreen` (LazyColumn + search bar wired to the FTS query) → `NoteEditScreen` (title/content text fields, save button). Wire with Compose Navigation, 2 destinations.

**Checkpoint:** you can create, edit, delete, and search notes fully offline. Commit.

---

## Phase 2 — OCR capture (Week 2)

**Step 2.1 — Image source**
Add a button on `NoteEditScreen` → launch either `ActivityResultContracts.TakePicture` (camera) or `.PickVisualMedia` (gallery). No need for full CameraX unless you want a custom camera UI — the system camera intent is enough for MVP.

**Step 2.2 — OCR processor**
Create `OcrProcessor.kt`:
```kotlin
suspend fun recognizeText(bitmap: Bitmap): String {
    val image = InputImage.fromBitmap(bitmap, 0)
    val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
    val result = recognizer.process(image).await() // kotlinx-coroutines-play-services
    return result.text
}
```

**Step 2.3 — Wire into edit flow**
On image capture → show a loading spinner → call `recognizeText` on a background dispatcher → populate the note's `content` field with the result, editable before save. Store the image URI in `sourceImageUri` for reference.

**Step 2.4 — Error handling**
Handle blank OCR result (blurry photo) with a toast — "no text detected, try again" — don't silently save an empty note.

**Checkpoint:** photograph a page, get editable text in a note. Commit.

---

## Phase 3 — SM-2 spaced repetition (Week 3)

**Step 3.1 — Flashcard entity + DAO**
```kotlin
@Entity(tableName = "flashcards")
data class Flashcard(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val noteId: Long,
    val front: String,
    val back: String,
    val easeFactor: Double = 2.5,
    val interval: Int = 0,
    val repetitions: Int = 0,
    val nextReviewDate: Long = System.currentTimeMillis(),
    val lastReviewedAt: Long? = null
)
```
DAO query: `SELECT * FROM flashcards WHERE nextReviewDate <= :now` for the due queue.

**Step 3.2 — SM-2 algorithm as a pure function**
This is the piece to unit-test hardest — keep it free of Android/DB dependencies so it's trivially testable:
```kotlin
fun sm2(card: Flashcard, quality: Int): Flashcard {
    require(quality in 0..5)
    var ef = card.easeFactor
    var reps = card.repetitions
    var interval = card.interval

    if (quality < 3) {
        reps = 0
        interval = 1
    } else {
        interval = when (reps) {
            0 -> 1
            1 -> 6
            else -> (interval * ef).toInt()
        }
        reps += 1
    }
    ef = (ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))).coerceAtLeast(1.3)

    val nextReview = System.currentTimeMillis() + interval * 86_400_000L
    return card.copy(easeFactor = ef, repetitions = reps, interval = interval,
        nextReviewDate = nextReview, lastReviewedAt = System.currentTimeMillis())
}
```

**Step 3.3 — Unit tests**
Write JUnit tests before wiring UI: quality=5 repeatedly should grow intervals; quality<3 should reset `repetitions` to 0 and `interval` to 1. This is your strongest "show me the tests" interview moment — do it properly.

**Step 3.4 — Review session UI**
`ReviewViewModel` loads the due queue, exposes current card, `submitRating(quality: Int)` calls `sm2()`, persists via repository, advances to next card. `ReviewScreen`: card front → tap to flip → back + 6 rating buttons (0–5).

**Step 3.5 — Turn a note into a flashcard**
Add a "Make flashcard" action on `NoteEditScreen` — simplest version: front = title, back = content. Creates a `Flashcard` row linked by `noteId`.

**Checkpoint:** create a flashcard from a note, review it, watch the schedule move. Commit.

---

## Phase 4 — Reminders (Week 4)

**Step 4.1 — Notification channel**
Create once in `PensieveApp.onCreate()`: a `NotificationChannel` for "Review due" notifications.

**Step 4.2 — AlarmManager wrapper**
```kotlin
fun scheduleReviewAlarm(context: Context, flashcardId: Long, triggerAt: Long) {
    val intent = Intent(context, ReviewAlarmReceiver::class.java)
        .putExtra("flashcardId", flashcardId)
    val pi = PendingIntent.getBroadcast(context, flashcardId.toInt(), intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    val am = context.getSystemService(AlarmManager::class.java)
    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi)
}
```

**Step 4.3 — BroadcastReceiver**
`ReviewAlarmReceiver` reads `flashcardId` from the intent, builds and posts a notification that deep-links into `ReviewScreen`.

**Step 4.4 — Wire scheduling to SM-2**
After every `sm2()` call in Step 3.2's flow, call `scheduleReviewAlarm()` with the new `nextReviewDate` — the reminder system and the algorithm stay decoupled; the alarm is just "wake up and check what's due."

**Step 4.5 — Reboot handling**
Register a `BootCompletedReceiver` that re-reads all flashcards with future `nextReviewDate` and re-schedules alarms — Android clears exact alarms on reboot.

**Step 4.6 — Custom reminders**
Simple version: add a `Reminder` entity + a "remind me" button on `NoteEditScreen` that opens a date/time picker and schedules an alarm the same way.

**Checkpoint:** a due card triggers a real notification that opens the review screen. Commit.

---

## Phase 5 — Sync (Week 5, cut this first if short on time)

**Step 5.1 — Firebase setup**
Create a Firebase project (free Spark plan), add the Android app, drop `google-services.json` into the app module, add the Firestore SDK dependency.

**Step 5.2 — Firestore schema**
Mirror the Room tables: `users/{uid}/notes/{noteId}` and `users/{uid}/flashcards/{cardId}` documents. Use Firebase Anonymous Auth so you don't need a login screen for the demo.

**Step 5.3 — SyncWorker**
```kotlin
class SyncWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        val localNotes = noteRepository.getAllOnce()
        val remoteNotes = firestore.collection("notes").get().await()
        // for each note: compare updatedAt, last-write-wins, log conflicts
        return Result.success()
    }
}
```
Schedule it with `PeriodicWorkRequestBuilder` (15 min minimum interval) plus a `Constraints` requiring network.

**Step 5.4 — Conflict resolution**
For each note that exists both locally and remotely: compare `updatedAt`. Newer timestamp wins and overwrites the other side. Log every overwrite (even to `Log.d` for the demo) — this log is what you show in an interview to prove you actually handled conflicts, not just happy-path synced.

**Step 5.5 — Manual trigger**
Add pull-to-refresh on `NoteListScreen` that enqueues a one-time `OneTimeWorkRequest` for immediate sync, on top of the periodic background job.

**Step 5.6 — Sync status indicator**
Add a `syncStatus` field to `Note` (or derive it from `SyncMeta`): `SYNCED`, `PENDING`, or `CONFLICT`. Show a small icon per note in `NoteListScreen` — a checkmark, clock, or warning triangle. Set to `PENDING` on local edit, `SYNCED` once `SyncWorker` confirms the push, `CONFLICT` briefly when Step 5.4's resolution overwrites a side (auto-clears after a few seconds or on next view). This is a small addition but makes the conflict-resolution work visible in a demo instead of invisible background logic.

**Checkpoint:** edit a note on two "devices" (or emulator + physical device), see last-write-wins resolve it correctly, and watch the status icon reflect pending → synced. Commit.

---

## Testing checklist (run before calling it done)

- [ ] SM-2 unit tests pass for quality 0, 3, 5 across multiple repetitions
- [ ] App fully usable in airplane mode (notes, OCR, review, reminders)
- [ ] Alarm survives a device reboot
- [ ] OCR handles a blurry/empty-result photo gracefully
- [ ] Sync conflict test: edit same note on two devices while offline, reconnect both, verify last-write-wins

## Suggested commit cadence

One commit per numbered step above (not per phase) — gives you ~25 commits with clear messages, which reads well on GitHub and gives you natural checkpoints to talk through in an interview.
