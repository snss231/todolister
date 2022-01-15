module Api
    module V1
        class TasksController < ActionController::Base

            protect_from_forgery with: :null_session
            
            def create
                task = todolist.tasks.new(task_params)

                if task.save
                    render json: TaskSerializer.new(task).to_json
                else
                    render json: { error: task.errors.messages }, status: 422
                end
            end

            def update
                task = Task.find(params[:id])

                if task.update(task_params)
                    render json: TaskSerializer.new(task).to_json
                else
                    render json: { error: task.errors.messages }, status: 422
                end
            end

            def destroy
                task = Task.find(params[:id])

                if task.destroy
                    head :no_content
                else
                    render json: { error: task.errors.messages }, status: 422
                end
            end

            private

            def todolist
                @todolist ||= Todolist.find(params[:todolist_id])
            end

            def task_params
                params.require(:task).permit(:name, :description, :todolist_id, :due_date, :completed, :due_time)
            end
        end
    end
end