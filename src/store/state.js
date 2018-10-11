import {mode} from '../common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '../common/js/catch'
const state =  {
  singer: {},
  playingState: false,
  fullScrean: false,
  playlist: [],
  sequenceList: [],
  currentIndex: -1,
  playMode: mode.random,
  disc: null,
  topList: null,
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteHistory: loadFavorite(),
}

export default state
