Rails.application.routes.draw do
  devise_for :players, :controllers => {:registrations => "registrations"}
  root to: "players#index"

  resources :players, except: [ :update, :edit, :destroy ] do
    resources :scores, only: [ :index, :create ]
  end

  
end
