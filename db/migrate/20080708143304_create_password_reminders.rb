class CreatePasswordReminders < ActiveRecord::Migration
  def self.up
    create_table :password_reminders do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :password_reminders
  end
end
