# Healthie Pairing Pre-Work

Two parts:

- **`data-model/`**: providers, clients, plans, and journal entries in ActiveRecord
- **`kanban/`**: a React + TypeScript Kanban board with Rick and Morty characters

---

## Part 1: Data model

### Running it

You need Ruby 3.2 or newer.

```bash
cd data-model
bundle install

ruby test/models_test.rb   # tests
ruby bin/demo              # runs the 4 queries, prints results and the SQL behind each
ruby bin/console           # interactive prompt with the models and seed data loaded
```

### Schema

```
providers         clients
  name              name
  email (unique)    email (unique)
      \             /
       subscriptions
         provider_id
         client_id
         plan ("basic" | "premium")
         unique on (provider_id, client_id)

journal_entries
  client_id
  body (text)
  created_at
  index on (client_id, created_at)
```

### The 4 queries

| Query | Code |
|---|---|
| All clients for a provider | `provider.clients` |
| All providers for a client | `client.providers` |
| A client's journal entries, by date | `client.journal_entries.newest_first` |
| Journal entries across all of a provider's clients, by date | `provider.journal_entries.newest_first` |

All four come straight from the associations in `app/models/`.  Run `bin/demo` to see the SQL each one generates. 

### Decisions

- **Plan is on the subscription table, not on the client or provider record.** A client can have multiple providers, with a different plan for each one.
- **Separate `providers` and `clients` tables.** They have the same fields for now, so they could be one table, but they're different roles and will likely need different fields later.
- **One subscription per provider/client pair.** Enforced with a unique index in the database, not just a model validation, to prevent duplicates.
- **Journal entries are indexed on `(client_id, created_at)`**, which is what the queries filter and sort on. Works for this exercise, but new queries may need new indexes.

### At scale

- The indexes match the queries. `(client_id, created_at)` serves both journal queries, and `(provider_id, client_id)` covers provider lookups.
- The provider feed joins through subscriptions and clients. For a provider with thousands of clients this may be fine, but I'd check the EXPLAIN plan before optimizing.

---

## Part 2: Kanban board

### Running it

You need Node 20 or newer.

```bash
cd kanban
npm install
npm run dev    # open the URL it prints
npm test       # reducer tests
```

### Layout

```
src/
  App.tsx                 board state, wires everything together
  types.ts                Character, Item, BoardState, column list
  api/
    rickAndMorty.ts       the GraphQL request, plain fetch
    useCharacters.ts      hook for characters, loading, and error state
  state/
    boardReducer.ts       every board change (add, move) goes through here
    boardReducer.test.ts
  components/
    NewItemForm.tsx       title plus character picker
    Board.tsx             drag-and-drop context, turns a drop into a move
    Column.tsx            one droppable column
    ItemCard.tsx          one draggable card
  celebrate.ts            confetti when a card lands in Done
```

### Decisions

- **Board state is items stored by id, plus an ordered list of ids for each column.** The column an item is in is its status, and its position in the list is its order, so moving between columns and reordering use the same logic
- **All board changes go through one reducer.** Makes the logic easy to test, gives one place to add persistence or undo later.
- **`@hello-pangea/dnd` for drag and drop.** Maintained fork of `react-beautiful-dnd`, built for list/column UIs and supports keyboard dragging. 
- **Each card stores a copy of its character, not just the id.** Card can render on its own and won't depend on  API
- **Only loads the first page of characters (20).** Proof of concept

### Not done yet

- Persistence. 
- Filtering, editing, and deleting cards. 
- Searching or paging through more characters.
