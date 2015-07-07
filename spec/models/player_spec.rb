require 'rails_helper'

RSpec.describe Player, type: :model do
  let(:valid_player) { create(:player)}
  let(:invalid_player) { create(:player, email: "Jeffrey", password: true)}

	describe "fields" do
		it { should have_db_column(:name).of_type(:string) }
		it { should have_db_column(:email).of_type(:string) }
		it { should have_db_column(:encrypted_password).of_type(:string) }
	end

	describe "validations" do
		it { should validate_presence_of(:name)}
		it { should validate_presence_of(:email)}
		it { should validate_presence_of(:encrypted_password)}
	end




end
