// input-group/index.js

import inputComboBehavior from '../input-combo/input-combo-behavior'

Component({
  behaviors: [inputComboBehavior],
  externalClasses: ['com-class'],

  // Component properties
  properties: { more: Boolean },

  // Component methods
  methods: { onTapMore },
});

function onTapMore(e) { wx.vibrateShort();
  this.setData({ more: !this.properties.more });
  e.detail.more = this.properties.more;
  e.detail.name = this.properties.name;
  this.triggerEvent('tapmore', e.detail)
}
