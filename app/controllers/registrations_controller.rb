class RegistrationsController < Devise::RegistrationsController
  def sign_up_params
    params.require(:player).permit(:name, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.require(:player).permit(:name, :email, :password, :password_confirmation, :current_password)
  end

end
