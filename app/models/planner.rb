# -*- coding: mule-utf-8 -*-
class Planner < ActiveRecord::Base
   acts_as_nested_set

   def leaf
       unknown? || children_count == 0
   end

   def to_json_with_leaf(options = {})
       self.to_json_without_leaf(options.merge(:methods => :leaf))
   end

  alias_method_chain :to_json, :leaf
end
