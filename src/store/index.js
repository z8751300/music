

import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as  getters from './getters'
import * as  actions from './actions'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
