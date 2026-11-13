class Provider < ActiveRecord::Base
  has_many :subscriptions, dependent: :destroy
  has_many :clients, through: :subscriptions

  # Follows the chain provider -> subscriptions -> clients -> journal_entries.
  # This is a single SQL query with joins, not a loop over clients.
  has_many :journal_entries, through: :clients

  # "Alice@Example.com " and "alice@example.com" are the same person
  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :name, presence: true
  validates :email, presence: true,
                    uniqueness: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP }
end
