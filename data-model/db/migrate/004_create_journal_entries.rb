class CreateJournalEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :journal_entries do |t|
      # index: false because the composite index below already covers client_id
      t.references :client, null: false, foreign_key: true, index: false
      t.text :body, null: false
      t.timestamps
    end

    # Matches the main query: "this client's entries, sorted by date".
    # The database can find and sort them straight from the index.
    add_index :journal_entries, [:client_id, :created_at]
  end
end
