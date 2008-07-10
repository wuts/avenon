class HomeController < ApplicationController
  skip_before_filter :require_activation

  def index
       respond_to do |format|
      format.html
    end
  end
end
