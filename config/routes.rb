Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      resources :todolists
      resources :tasks
    end
  end
  
end
