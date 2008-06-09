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
        width:552,
        autoHeight:true,
        rootVisible:false,
        autoScroll:true,
        title: 'Example Plans',

        columns:[{
            header:'Plan',
            width:350,
            dataIndex:'plan'
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
            dataUrl:'planners/1',
            requestMethod: 'GET',
            baseParams:{format:'json'},
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),

        root: new Ext.tree.AsyncTreeNode({
            text:'Tasks'
        })
    });
    tree.render();
});