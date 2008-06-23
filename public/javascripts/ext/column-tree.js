/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

Ext.onReady(function(){

    var tree = new Ext.tree.ColumnTree({
        el:'tree-ct',
        width:752,
        autoHeight:true,
        rootVisible:false,
        enableDD:false,
        autoScroll:false,
        useArrows:false,
        title: 'Example Plans',

        columns:[{
            header:'planner Id',
            width:100,
            dataIndex:'id'
        },{
            header:'Plan',
            width:350,
            dataIndex:'name'
        },{
            header:'Score',
            width:100,
            dataIndex:'score'
        },{
            header:'Award',
            width:100,
            dataIndex:'award'
        },{
            header:'Check',
            width:100,
            dataIndex:''
        }],

        loader: new Ext.tree.TreeLoader({
                dataUrl:window.location.href,
            requestMethod: 'GET',
            baseParams:{format:'json'},
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }

        }),

        root: new Ext.tree.AsyncTreeNode({
           text:'Planns',
           draggable:true
        })

    });
    var win;
    tree.on('click',function(node){
      if(!win){
          var planner_id=node.attributes.id;
          win = new Ext.Window({
                el:'hello-win',
                layout:'fit',
                width:800,
                height:600,
                closeAction:'hide',
                plain: true,
                animateTarget:'tree-ct',


                items: new Ext.TabPanel({
                    el: 'hello-tabs',
                    autoTabs:true,
                    activeTab:0,
                    deferredRender:false,
                    border:false,
                        items: [{
                        title: 'view Plan',
                          autoLoad:'/planners/view/'+planner_id
                        },{
                        title: 'Edit Plan',
                          autoLoad:'/planners/'+planner_id+'/edit'
                        },{
                        title: 'New Plan',
                           autoLoad:'/planners/new'
                        }]

                }),

                buttons: [{
                    text: 'Close',
                    handler: function(){
                        win.hide();
                    }
                }]
            });
        }
        win.show(this);
        win.on("show",function(){

               new Ext.TabPanel({
                    el: 'hello-tabs',
                    autoTabs:true,
                    activeTab:0,
                    deferredRender:false,

                    border:false,
                        items: [{
                        title: 'view Plan',
                           autoLoad:'/planners/view/'+planner_id
                        },{
                        title: 'Edit Plan',
                          autoLoad:'/planners/'+planner_id+'/edit'
                        },{
                        title: 'New Plan',
                           autoLoad:'/planners/new'
                        }]

                })
        });
    });

    tree.on("check",function(node,checked){
            //alert(node.attributes.plan);
            node.cls="x-tree-headers";
            node.disable();

          }); //注册"check"事件

    tree.render();
    tree.expandAll(true)

});

