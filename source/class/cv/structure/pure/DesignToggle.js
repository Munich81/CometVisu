/* DesignToggle.js 
 * 
 * copyright (c) 2010-2016, Christian Mayer and the CometVisu contributers.
 * 
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
 */


/**
 * Adds a button to toggle through the available designs
 * @widgetexample
 * <designtoggle>
 *   <layout colspan="6"/>
 *   <label>Change Design</label>
 * </designtoggle>
 *
 *
 *
 * @author Christian Mayer
 * @since 0.5.3 (2010)
 */
qx.Class.define('cv.structure.pure.DesignToggle', {
  extend: cv.structure.AbstractWidget,
  include: [cv.role.Operate, cv.role.HasAnimatedButton],

  /*
   ******************************************************
   CONSTRUCTOR
   ******************************************************
   */
  construct: function(props) {
    this.base(arguments, props);
    var store = new qx.data.store.Json("./designs/get_designs.php");
    store.addListener("loaded", function (ev) {
      this.setAvailableDesigns(ev.getData());
    }, this);
  },

  /*
   ******************************************************
   PROPERTIES
   ******************************************************
   */
  properties: {
    availableDesigns: { check: "Array", init: [] }
  },

  /*
   ******************************************************
   MEMBERS
   ******************************************************
   */
  members: {
    // overridden
    _getInnerDomString: function () {
      return '<div class="actor switchUnpressed"><div class="value">' + cv.Config.clientDesign + '</div></div>';
    },
    /**
     * Action performed when the widget got clicked
     *
     *
     * @param path {String} - Internal path of the widget
     * @param actor {Element} - DOMElement
     * @param isCanceled {Boolean} - If true the action does nothing
     */
    _action: function( path, actor, isCanceled ) {
      if( isCanceled ) return;

      var designs = this.getAvailableDesigns();

      var oldDesign = qx.bom.Selector.query('.value',this.getDomElement())[0].textContent;
      var newDesign = designs[ (designs.indexOf(oldDesign) + 1) % designs.length ];

      var URL = cv.util.Location.getHref();
      var regexp = new RegExp("design="+oldDesign);
      if (URL.search(regexp) != -1) { // has URL-parameter design
        cv.util.Location.setHref(URL.replace(regexp, "design="+newDesign));
      }
      else {
        if (URL.indexOf("?") != -1) { // has other parameters, append design
          cv.util.Location.setHref(URL+"&design="+newDesign);
        }
        else { // has now parameters
          cv.util.Location.setHref(URL+"?design="+newDesign);
        }
      }
    }
  },

  defer: function(statics) {
    cv.structure.WidgetFactory.registerClass("designtoggle", statics);
  }
});
