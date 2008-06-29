class Outline < ActiveRecord::Base

  validates_presence_of :name,:outline

  def after_create
    require 'rexml/document'
    #add header to self.outline
    xml_header="<?xml version='1.0' encoding='UTF-8' ?>"
    xml_root="<plan>"
    xml_root_end="</plan>"
    plan_tree=xml_header+xml_root+self.outline+xml_root_end
    xml=REXML::Document.new plan_tree
    root=REXML::XPath.first(xml,"//plan")
    parent_plan_description=''
    #first_child=REXML::Element.new
    first_childs=Array.new
    root.each_element do |child|
      if child.has_elements?
        first_childs<<child
      else
        parent_plan_description+=child.to_a.to_s
      end
    end

    first_childs.each do |first_child|
       parent_plan=Planner.create(:name=>self.name,:description=>parent_plan_description,:parent_id=>0,:checked=>false)
      if (parent_plan.nil?)
        false
      end
      parser_plan_tree(first_child,parent_plan,0)
    end
  end

  private
  def parser_plan_tree(node,parent_plan,level)

    if(node.has_elements?)
      if level>0
        parent_node=node.previous_element
         if (!parent_node.nil? && parent_node.has_text?)
          parent_plan=Planner.find(:first,:conditions=>"name='#{parent_node.text}' and parent_id=#{parent_plan.id}")
        end
      end
      level+=1
      node.elements.each do |el|
        parser_plan_tree(el,parent_plan,level)
      end
    else
      if(node.has_text?)
         child_plan=Planner.create(:name=>node.text,:checked=>false)
         parent_plan.add_child(child_plan)

      end
    end
  end

end

