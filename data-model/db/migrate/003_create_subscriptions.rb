# A subscription is one client signed up with one provider.
# It's the join table for the many-to-many, and it's also where the plan lives,
# because the plan belongs to the relationship (a client can be "premium" with
# one provider and "basic" with another).
class CreateSubscriptions < ActiveRecord::Migration[8.0]
  def change
    create_table :subscriptions do |t|
      # t.references adds provider_id plus an index and a foreign key
      t.references :provider, null: false, foreign_key: true
      t.references :client, null: false, foreign_key: true

      # Stored as a readable string ("basic" / "premium") rather than an integer
      t.string :plan, null: false

      t.timestamps
    end

    # A client can only sign up with the same provider once
    add_index :subscriptions, [:provider_id, :client_id], unique: true
  end
end
