# -*- coding: mule-utf-8 -*-
class PlannersController < ApplicationController
  # GET /planners
  # GET /planners.xml
  def index
    @planners = Planner.find(:all)

    respond_to do |format|
     format.html # index.html.erb
     format.xml  { render :xml => @planners }
    end
  end

  # GET /planners/1
  # GET /planners/1.xml
  def show
    @planner = Planner.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @planner }
      format.json { render :json=>Planner.find_children(params[:node]) }
    end
  end

  # GET /planners/new
  # GET /planners/new.xml
  def new
    @planner = Planner.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @planner }
    end
  end

  # GET /planners/1/edit
  def edit
    @planner = Planner.find(params[:id])
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

  def self.find_children(start_id = nil)
    start_id.to_i == 0 ? root_nodes : find(start_id).direct_children
  end

  #如果parent_id为空，则为树的根节点
  def self.root_nodes
  end

end
