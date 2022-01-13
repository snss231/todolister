class DueDateTimeToDueDateAndDueTime < ActiveRecord::Migration[6.1]
  def change
    remove_column  :tasks, :due_date_time, :datetime
    add_column :tasks, :due_date, :date
    add_column :tasks, :due_time, :time
  end
end
