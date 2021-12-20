class AddTodolistToTask < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :tasks, :todolist
  end
end
