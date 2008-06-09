module PlannersHelper
  def yui_build_tree(tree_id, tree_data)

  return "//<![CDATA[ \n" +
       "function addChildrenNodes(currLevel, nodeIndex, parent) { \n" +
           "var lastNode;\n"+
           "var level = currLevel;\n"+
           "while (nodeIndex < #{tree_data}.length) {\n"+
               "var level = #{tree_data}[nodeIndex];\n"+
               "if (level == currLevel) {\n"+
                   "nodeIndex++;\n"+
                   "lastNode = new YAHOO.widget.TextNode(#{tree_data}[nodeIndex++], parent, false);\n"+
               "} else if (level < currLevel) {\n"+
                   "return nodeIndex;\n"+
               "} else {\n"+
                   "nodeIndex = addChildrenNodes(level, nodeIndex, lastNode);\n"+
               "}\n"+
           "}\n"+
           "return nodeIndex;\n"+
        "}\n"+
        "function #{tree_id}_Init() {\n"+
                "var tree = new YAHOO.widget.TreeView(\"#{tree_id}\");\n"+
                "addChildrenNodes(0, 0, tree.getRoot());\n"+
                "tree.draw();\n"+
        "}\n"+
    "YAHOO.util.Event.addListener(window, \"load\", #{tree_id}_Init);\n"+
"//]]>";

  end
end
