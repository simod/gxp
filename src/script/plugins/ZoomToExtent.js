/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ZoomToExtent
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ZoomToExtent(config)
 *
 *    Provides an action for zooming to an extent.  If not configured with a 
 *    specific extent, the action will zoom to the map's visible extent.
 */
gxp.plugins.ZoomToExtent = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gx_zoomtoextent */
    ptype: "gx_zoomtoextent",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: "Zoom To Max Extent",

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: "Zoom To Max Extent",
    
    /** api: config[extent]
     *  ``String | OpenLayers.Bounds``
     *  The target extent.  If none is provided, the map's visible extent will 
     *  be used.
     */
    extent: null,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.ZoomToExtent.superclass.constructor.apply(this, arguments);
        if (this.extent instanceof Array) {
            this.extent = OpenLayers.Bounds.fromArray(this.extent);
        }
    },

    /** api: method[addActions]
     */
    addActions: function() {
        return gxp.plugins.ZoomToExtent.superclass.addActions.apply(this, [{
            menuText: this.menuText,
            iconCls: "gx-icon-zoomtoextent",
            tooltip: this.tooltip,
            handler: function() {
                var map = this.target.mapPanel.map;
                var extent = this.extent;
                if (!extent) {
                    // determine visible extent
                    var layer, extended;
                    for (var i=0, len=map.layers.length; i<len; ++i) {
                        layer = map.layers[i];
                        if (layer.getVisibility()) {
                            extended = layer.restrictedExtent || layer.maxExtent;
                            if (extent) {
                                extent.extend(extended);
                            } else if (extended) {
                                extent = extended.clone();
                            }
                        }
                    }
                }
                if (extent) {
                    // respect map properties
                    var restricted = map.restrictedExtent || map.maxExtent;
                    if (restricted) {
                        extent = new OpenLayers.Bounds(
                            Math.max(extent.left, restricted.left),
                            Math.max(extent.bottom, restricted.bottom),
                            Math.min(extent.right, restricted.right),
                            Math.min(extent.top, restricted.top)
                        );
                    }
                    map.zoomToExtent(extent, true);
                }
            },
            scope: this
        }]);
    }
        
});

Ext.preg(gxp.plugins.ZoomToExtent.prototype.ptype, gxp.plugins.ZoomToExtent);