# -*- coding: mule-utf-8 -*-
class Planner < ActiveRecord::Base
  acts_as_nested_set

  #如果parent_id为空，则为树的根节点
  def self.root_nodes
    find(:all, :conditions => 'parent_id IS NULL')
  end

  def self.uiProvider
    'col'
  end

   def self.find_children(start_id = nil)

     if(start_id.to_i==0)
       root_nodes
     else
     find(start_id).direct_children
     end
     
   end


   def leaf
       unknown? || children_count == 0
   end

   def to_json_with_leaf(options = {})
       self.to_json_without_leaf(options.merge(:methods => :leaf))
   end

  alias_method_chain :to_json, :leaf
end
