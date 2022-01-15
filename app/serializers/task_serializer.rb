class TaskSerializer
  include JSONAPI::Serializer
  attributes :name, :description, :todolist_id, :due_date, :due_time, :label, :completed, :created_at, :updated_at
end
