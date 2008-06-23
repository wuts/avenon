class Outline < ActiveRecord::Base

  validates_presence_of :name,:outline

  def after_create
    require 'rexml/document'
    xml=REXML::Document.new self.outline
    root=REXML::XPath.first(xml,"//ol")
    if (root.nil?)
      false
    end
    parent_plan=Planner.create(:name=>self.name,:parent_id=>0,:checked=>false)
    if (parent_plan.nil?)
      false
    end
    parser_plan_tree(root,parent_plan)

  end

  private
  def parser_plan_tree(node,parent_plan)
    if(node.has_elements?)
      parent_node=node.previous_element
      if (!parent_node.nil? && parent_node.has_text?)
         parent_plan=Planner.find_by_name(parent_node.text)
      end
      node.elements.each do |el|
        parser_plan_tree(el,parent_plan)
      end
    else
      if(node.has_text?)
         parent_plan.add_child(Planner.create(:name=>node.text,:checked=>false))
      end
    end
  end

end

