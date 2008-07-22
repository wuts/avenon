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
        width:800,
        autoHeight:true,
        rootVisible:false,
        enableDD:true,
        autoScroll:false,
        useArrows:false,
        title: 'Example Plans',

        columns:[{
            header:'Plan',
            width:600,
            dataIndex:'name'
        },{
            header:'Score',
            width:100,
            dataIndex:'score'
        },{
            header:'Award',
            width:100,
            dataIndex:'award'
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
           text:'Planners',
           draggable:true
        })

    });
    var win;
    tree.on('dblclick',function(node){
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
                        title: 'Edit Plan',
                          autoLoad:'/planners/'+planner_id+'/edit'
                        },{
                        title: 'New Plan',
                           autoLoad:'/planners/new'
                        }]

                })
        });
    });

    var inPlaceEditor;
    var dq=Ext.DomQuery;
    var dh=Ext.DomHelper;
    var el;
    var nodeId;
    var fieldName;
    var msg=Ext.get('msg');
    var modifiedValue;
    tree.on("click",function(node,e){
            //var score=node.attributes.score;
            //var plan=node.attributes.name;
            //var award=node.attributes.award;


            var target=e.getTarget("",2,true);


            if(target){
              if(dq.is(target.dom,"span[id*=plan]") || dq.is(target.dom,"div[id*=plan]")){
                 if(dq.is(target.dom,"span[id*=plan-name]") || dq.is(target.dom,"div[id*=plan-name]")){
                   fieldName="name";
                 }
                 else if(dq.is(target.dom,"span[id*=plan-score]") || dq.is(target.dom,"div[id*=plan-score]")){
                   fieldName="score";
                 }
                 else if(dq.is(target.dom,"span[id*=plan-award]") || dq.is(target.dom,"div[id*=plan-award]")){
                   fieldName="award";
                 }
                 else{
                   fieldName="";
                 }
                 nodeId=node.id;

                 if(inPlaceEditor && inPlaceEditor.isVisible()){
                   modifiedValue=inPlaceEditor.getValue();
                   if(fieldName!="" && modifiedValue!=""){
                       updatePlanner(nodeId,fieldName,modifiedValue);
                   }
                   inPlaceEditor.destroy();
                 }

                 inPlaceEditor=new Ext.form.TextField({
                     name:"score"
                   // value:plan,
                    //renderTo:target.id
                });

                //alert(target.innerHTML);
                targetValue=target.dom.innerHTML.replace(/<.+?>/gim,'');
                //target.innerHTML="";
                // targetValue=target.getValue();
                target.update("");
                inPlaceEditor.setValue(targetValue);
                inPlaceEditor.render(target);
              }else if(dq.is(target.dom,"input")){
                  inPlaceEditor.syncSize();

              }else{
                  if(inPlaceEditor && inPlaceEditor.isVisible()){
                    modifiedValue=inPlaceEditor.getValue();
                    if(fieldName!="" && modifiedValue!=""){
                      updatePlanner(nodeId,fieldName,modifiedValue);
                    }
                    inPlaceEditor.hide();
                  }

              }
            }

    });

    function updatePlanner(id,field,value){
        Ext.Ajax.request({
             url:"/planners/"+id+".xml",
             method:"PUT",
             params:"planner["+field+"]="+value,
             success:updateNode(value),
             failure:undoUpdateNode(value)

        });
        // Ext.Ajax.on("beforerequest",this.showSpinner,this);
    }

    function updateNode(value){
        el=inPlaceEditor.getEl();
        el.update("");
        dh.insertAfter(el,value);
        inPlaceEditor.hide();
        msg.setWidth(100,true);
    }

    function undoUpdateNode(originValue){
        el=inPlaceEditor.getEl();
        el.update("");
        dh.insertAfter(el,originValue);
        inPlaceEditor.hide();
    }

    tree.on("check",function(node,checked){
            //alert(node.attributes.plan);
            node.cls="x-tree-headers";
            //node.disable();

          }); //注册"check"事件

    tree.render();
    tree.expandAll(true)

});

