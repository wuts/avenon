# -*- coding: mule-utf-8 -*-
class PlannersController < ApplicationController
  # GET /planners
  # GET /planners.xml

  layout "planners",:except=>[:new,:edit]

  protect_from_forgery :only => :index


  before_filter :login_required

  def index
    @planners = Planner.find(:all,:conditions=>["parent_id is NULL or parent_id=0"])

    respond_to do |format|
     format.html # index.html.erb
     format.xml  { render :xml => @planners }
    end
  end

  # GET /planners/1
  # GET /planners/1.xml
  def show
    @planner = Planner.find(params[:id])

    node_id=params[:node]

    if (node_id=='ynode-7')
      node_id=params[:id]
    end

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @planner }
      format.json { render :json=>Planner.find_children(node_id).map{ |pl| pl.attributes}}
     end
  end

  # GET /planners/1
  # GET /planners/1.xml
  def view
    @planner = Planner.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @planner }
     end
  end


  # GET /planners/new
  # GET /planners/new.xml
  def new
    @planner = Planner.new
    @parent_id=params[:parent_id]

    respond_to do |format|
      format.html { render :layout=>"planners-min"}# new.html.erb
      format.xml  { render :xml => @planner }
    end
  end

  # GET /planners/1/edit
  def edit
    @planner = Planner.find(params[:id])
    render :layout=>"planners-min"
  end

  # POST /planners
  # POST /planners.xml
  def create
    @planner = Planner.new(params[:planner])

    respond_to do |format|
      if @planner.save
        flash[:notice] = 'Planner was successfully created.'
        format.html { redirect_to(@planner) }
        format.xml  { render :xml => @planner, :status => :created, :location => @planner }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @planner.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /planners/1
  # PUT /planners/1.xml
  def update
    @planner = Planner.find(params[:id])

    respond_to do |format|
      if @planner.update_attributes(params[:planner])
        flash[:notice] = 'Planner was successfully updated.'
        format.html { redirect_to(@planner) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @planner.errors, :status => :unprocessable_entity }
      end
    end
  end

  #ajax update
  def ajax_update
    @planner = Planner.find(params[:id])
    dfield=params[:dfield]
    dvalue=params[:dvalue]
    case dfield
      when "name"
      @planner.name=dvalue
      when "score"
      @planner.score=dvalue
      when "award"
      @planner.award=dvalue
      else
    end
    @planner.save
    respond_to do |format|
      format.xml{ head :ok}
    end
  end


  # DELETE /planners/1
  # DELETE /planners/1.xml
  def destroy
    @planner = Planner.find(params[:id])
    @planner.destroy

    respond_to do |format|
      format.html { redirect_to(planners_url) }
      format.xml  { head :ok }
    end
  end



end
