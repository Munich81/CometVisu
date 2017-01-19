/* WgPluginInfo.js 
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
 * Adds an dynamic field to the visu that shows live information from a WireGate plugin.
 *
 * @author Christian Mayer
 * @since 2012
 */
qx.Class.define('cv.structure.pure.WgPluginInfo', {
  extend: cv.structure.AbstractWidget,
  include: cv.role.Update,


  /*
  ******************************************************
    PROPERTIES
  ******************************************************
  */
  properties: {
    variable   : { check: "String", nullable: true, apply: "_applyVariable" }
  },

  /*
  ******************************************************
    MEMBERS
  ******************************************************
  */
  members: {
    __request: null,

    // property apply
    _applyVariable: function(value) {
      if (value) {
        if (!this.__request) {
          // create the request
          this.__request = new qx.io.request.Xhr('/wg-plugindb.pl?name=' + value);
          this.__request.set({
            accept: "application/json",
            async: false
          });
          this.__request.addListener("success", this._onSuccess, this);
        } else {
          this.__request.setUrl('/wg-plugindb.pl?name=' + value);
        }
      }
    },

    /**
     * Handle successful requests from {@link qx.io.request.Xhr}
     * @param ev {Event}
     */
    _onSuccess: function(ev) {
      var req = ev.getTarget();
      var data = req.getResponse();
      this.defaultUpdate(undefined, data[this.getVariable()], this.getValueElement());
    },

    // overridden
    _getInnerDomString: function () {
      return '<div class="actor"><div class="value">-</div></div>';
    },

    /**
     * Triggers an {@link qx.io.request.Xhr} request to query the plugin value
     */
    handleUpdate: function() {
      if (this.__request) {
        this.__request.send();
      }
    }
  },

  /*
  ******************************************************
    DESTRUCTOR
  ******************************************************
  */
  destruct: function() {
    this._disposeObjects("__request");
  },

  defer: function(statics) {
    cv.structure.WidgetFactory.registerClass("wgplugininfo", statics);
  }
});