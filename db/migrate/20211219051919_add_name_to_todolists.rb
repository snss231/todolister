class AddNameToTodolists < ActiveRecord::Migration[6.1]
  def change
    add_column :todolists, :name, :string
  end
end
