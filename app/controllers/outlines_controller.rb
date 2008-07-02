class OutlinesController < ApplicationController
  # layout "events"

  uses_tiny_mce(:options => {:theme => 'advanced',
                           :browsers => %w{msie gecko},
                           :auto_resize=>false,
                           :width=>"100%",
                           :height=>"500",
                           :force_p_newlines=>false,
                           :theme_advanced_toolbar_location => "top",
                           :theme_advanced_toolbar_align => "left",
                           :theme_advanced_resizing => true,
                           :theme_advanced_resize_horizontal => false,
                           :paste_auto_cleanup_on_paste => true,
                           :theme_advanced_buttons1 => %w{fontsizeselect bold italic underline strikethrough separator justifyleft justifycenter justifyright indent outdent separator numlist bullist separator undo redo  fullscreen},
                           :theme_advanced_buttons2 => [],
                  :theme_advanced_resizing=>true,

                           :fullscreen_new_window=>true,
                           :plugins => %w{contextmenu paste fullscreen}},

              :only => [:new, :edit, :show, :index])

  # GET /outlines
  # GET /outlines.xml
  def index
    @outlines = Outline.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @outlines }
    end
  end

  # GET /outlines/1
  # GET /outlines/1.xml
  def show
    @outline = Outline.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @outline }
    end
  end

  # GET /outlines/new
  # GET /outlines/new.xml
  def new
    @outline = Outline.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @outline }
    end
  end

  # GET /outlines/1/edit
  def edit
    @outline = Outline.find(params[:id])
  end

  # POST /outlines
  # POST /outlines.xml
  def create
    @outline = Outline.new(params[:outline])

    respond_to do |format|
      if @outline.save
        flash[:notice] = 'Outline was successfully created.'
        @planner=Planner.find_by_name(@outline.name)
        format.html { redirect_to(@planner) }
        format.xml  { render :xml => @outline, :status => :created, :location => @outline }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @outline.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /outlines/1
  # PUT /outlines/1.xml
  def update
    @outline = Outline.find(params[:id])

    respond_to do |format|
      if @outline.update_attributes(params[:outline])
        flash[:notice] = 'Outline was successfully updated.'
        format.html { redirect_to(@outline) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @outline.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /outlines/1
  # DELETE /outlines/1.xml
  def destroy
    @outline = Outline.find(params[:id])
    @outline.destroy

    respond_to do |format|
      format.html { redirect_to(outlines_url) }
      format.xml  { head :ok }
    end
  end
end
