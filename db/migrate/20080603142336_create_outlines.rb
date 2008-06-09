class CreateOutlines < ActiveRecord::Migration
  def self.up
    create_table :outlines do |t|
      t.text :name

      t.timestamps
    end
  end

  def self.down
    drop_table :outlines
  end
end
