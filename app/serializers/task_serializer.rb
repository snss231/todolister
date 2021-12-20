class TaskSerializer
  include JSONAPI::Serializer
  attributes :name, :description, :todolist_id, :id
end
