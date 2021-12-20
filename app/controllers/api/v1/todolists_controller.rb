module Api
    module V1
        class TodolistsController < ActionController::Base

            protect_from_forgery with: :null_session

            def index
                todolists = Todolist.all

                render json: TodolistSerializer.new(todolists, options).serializable_hash.to_json
            end

            def show
                todolist = Todolist.find(params[:id])

                render json: TodolistSerializer.new(todolist, options).serializable_hash.to_json
            end

            def create
                todolist = Todolist.new(todolist_params)

                if todolist.save
                    render json: TodolistSerializer.new(todolist).serializable_hash.to_json
                else
                    render json: { error: todolist.errors.messages }, status: 422
                end
            end

            def update
                todolist = Todolist.find(params[:id])

                if todolist.update(todolist_params)
                    render json: TodolistSerializer.new(todolist, options).serializable_hash.to_json
                else
                    render json: { error: todolist.errors.messages }, status: 422
                end
            end

            def destroy
                todolist = Todolist.find(params[:id])

                if todolist.destroy
                    head :no_content
                else
                    render json: { error: todolist.errors.messages }, status: 422
                end
            end

            def todolist_params
                params.require(:todolist).permit(:name)
            end

            def options
                @options ||= { include: %i[tasks] }
            end
        end
    end
end