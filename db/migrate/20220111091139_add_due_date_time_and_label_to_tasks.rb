class AddDueDateTimeAndLabelToTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :label, :string
    add_column :tasks, :due_date_time, :datetime
  end
end
