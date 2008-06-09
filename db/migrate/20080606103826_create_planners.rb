class CreatePlanners < ActiveRecord::Migration
  def self.up
    create_table :planners do |t|
      t.string :name
      t.text :description
      t.datetime :start
      t.datetime :end
      t.integer :parent_id
      t.integer :lft
      t.integer :rgt
      t.decimal :score
      t.decimal :award

      t.timestamps
    end
  end

  def self.down
    drop_table :planners
  end
end
