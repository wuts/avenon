class Outline < ActiveRecord::Base


  def after_create
    header="<?xml version='1.0' encoding='UTF-8'?>"
    self.name+=header
    parser_outline_to_planner(self.name)
  end

  private
  def parser_tree(element)
    if(element.has_elements?)
      element.elements.each do |subelement|
        parser_tree(subelement)
    end
    else
       Planner.create(:name=>element.text) if element.has_text?
    end
  end


  def parser_outline_to_planner(str)
    require 'rexml/document'
    xml=REXML::Document.new str

    root=REXML::XPath.first(xml,"//ol")

    root.elements.each do |element|
      parser_tree(element)
    end
  end
end

