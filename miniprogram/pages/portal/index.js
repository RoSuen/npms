// pages/portal/index.js

import portal from '@onev/util/portal'

Page({

  data: {},

  onLoad() {
    portal.load()
  },

  onUnload() {
    portal.unload()
  },

  'onTap1': onTap1,
  'onTap2': onTap2,
});

function onTap1() {
  let _portal_ = { a:1, b:'2' };
  portal.set(_portal_);
}

function onTap2() {
  portal.navigateTo('/pages/index/index');
}
