class JournalEntry < ActiveRecord::Base
  belongs_to :client

  validates :body, presence: true

  # Newest entries first. id breaks ties when two entries share a timestamp,
  # so the order is always the same (this matters once you paginate).
  scope :newest_first, -> { order(created_at: :desc, id: :desc) }
end
