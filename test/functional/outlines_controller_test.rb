require 'test_helper'

class OutlinesControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:outlines)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_outline
    assert_difference('Outline.count') do
      post :create, :outline => { }
    end

    assert_redirected_to outline_path(assigns(:outline))
  end

  def test_should_show_outline
    get :show, :id => outlines(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => outlines(:one).id
    assert_response :success
  end

  def test_should_update_outline
    put :update, :id => outlines(:one).id, :outline => { }
    assert_redirected_to outline_path(assigns(:outline))
  end

  def test_should_destroy_outline
    assert_difference('Outline.count', -1) do
      delete :destroy, :id => outlines(:one).id
    end

    assert_redirected_to outlines_path
  end
end
