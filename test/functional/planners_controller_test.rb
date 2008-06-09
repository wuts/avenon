require 'test_helper'

class PlannersControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:planners)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_planner
    assert_difference('Planner.count') do
      post :create, :planner => { }
    end

    assert_redirected_to planner_path(assigns(:planner))
  end

  def test_should_show_planner
    get :show, :id => planners(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => planners(:one).id
    assert_response :success
  end

  def test_should_update_planner
    put :update, :id => planners(:one).id, :planner => { }
    assert_redirected_to planner_path(assigns(:planner))
  end

  def test_should_destroy_planner
    assert_difference('Planner.count', -1) do
      delete :destroy, :id => planners(:one).id
    end

    assert_redirected_to planners_path
  end
end
