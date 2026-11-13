# DATA_DESIGN.md

## Overview
The game separates **data** from the UI/logic so that future extensions (new events, statistics, images, etc.) can be added without touching the core code.

## Files & Structures
| File | Purpose |
|------|----------|
| `script.js` | Contains all **static data** (`occupations`, `situations`, `events`) and the engine that consumes it.
| `events` (array) | Each entry is a plain JavaScript object with the following schema:
```js
{
  id: Number,               // unique identifier
  name: String,              // display name of the event
  category: String,          // one of the 15 high‑level death categories
  tags: Array<String>,       // e.g. ["現実系"], ["ネタ系"], ["生存系"]
  occupations: Array<String>,// occupations this event applies to (empty = all)
  situations: Array<String>, // situations this event applies to (empty = all)
  baseWeight: Number,        // baseline weight for the lottery
  result: "death"|"survive",
  description: String        // template using {{name}}, {{situation}}, {{event}}, {{cause}}
}
```
- **Extensibility**: Adding a new event only requires appending another object that follows the schema. No changes to the selection or weighting logic are needed.
- **Future data source**: The array can be replaced by an external JSON file (`events.json`) loaded with `fetch()`; the rest of the code works unchanged because it only accesses the `events` variable.

## Weight Calculation
Implemented in `computeWeight(event, input)`:
```js
weight = event.baseWeight
       * ageModifier
       * healthModifier
       * personalityModifier
       * randomFactor (0.75‑1.25)
```
All modifiers are simple lookup tables; to add new factors (e.g. *occupationModifier*) just extend the function.

## History Persistence
- Key: `deathGameHistory` in `localStorage`
- Stored as JSON array of objects `{timestamp, name, event, outcome, tags}`
- Only the newest 20 entries are kept.

## Separation Benefits
- UI code (`showScreen`, DOM manipulation) never touches the raw data.
- Data can be generated programmatically or imported from CSV/JSON without rewriting UI.
- Unit‑tests can import the data module and verify weight calculations in isolation.

---

**Note**: All numbers used for `baseWeight` and modifiers are *fictional* for gameplay balance only. They are clearly marked as such in the documentation.
