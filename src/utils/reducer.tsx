import { reducerCases } from "./Constants";

interface State {
  user: any;
  playlists: any[];
  playing: boolean;
  item: any;
  token?: any;
  selectedPlaylistId?: string;
  selectedPlaylist?: any;
  playerState?: boolean;
  recommendedTracks?: any;
  selectedComponent?: string;
  shuffleState?: boolean;
  repeatMode?: string;
}

interface Action {
  type: string;
  user?: any;
  playlists?: any[];
  item?: any;
  token: string | null;
  selectedPlaylistId?: string;
  selectedPlaylist?: any;
  currentTrack?: any;
  recommendedTracks?: any;
  playerState?: boolean;
  positionMs?: Number;
  selectedComponent?: string;
  shuffleState?: boolean;
  repeatMode?: string;
  recentlyPlayedTracks?: any;
  searchedAlbums?: any;
  searchedTracks?: any;
  searchedPlaylists?: any;
  searchedArtists?: any;
  selectedAlbumId?: string;
  selectedAlbum?: any;
  selectedArtistId?: string;
  selectedArtist?: any;
  artistTopSongs?: any;
  likedSongs?: any;
  queueSongs?: any;
  popPlaylists?: any;
  hipHopPlaylists?: any;
  partyPlaylists?: any;
  rockPlaylists?: any;
  technoPlaylists?: any;
  workoutPlaylists?: any;
  indiePlaylists?: any;
  discoverPlaylist?: any;
  moodPlaylists?: any;
  studyPlaylists?: any;
  topTracks?: any;
}

export const initialState: State = {
  user: null,
  playlists: [],
  playing: false,
  item: null,
  selectedPlaylistId: "37i9dQZF1E8PazUE3WuG8i",
  selectedPlaylist: null,
  playerState: false,
  recommendedTracks: [],
  selectedComponent: "HomePage",
  shuffleState: false,
  repeatMode: "off",
  //Remove token string after development and set it to null as default
  token: null,
  // "BQApaigt7nF1NvVov6nEMBgiciXpCrJGdnAqetgrUD8y8ql9wuBf45tK6dtAU1jyc6wNbpQ-6R_yoZfvnk6ZccLRPBlDZOnXfbhFplfIg4Njrucdi29yYaSkKw4Grj9fOSbM02qEUZiZHnCXZVwHtj9zTgV14K41JkuPX6aj6zHuKA5KJYIuMVSC61ympaVYJNVY_qZIU5qvDrtwAiVufXIhM3_KC2O6vll3sn6S8RhsvixX6HsfG1OfFbhsi2HmfTabE2r_rkquLQ0_6qE",
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case reducerCases.SET_USER:
      return { ...state, user: action.user };
    case reducerCases.SET_TOKEN:
      return { ...state, token: action.token };
    case reducerCases.SET_PLAYLISTS:
      return { ...state, playlists: action.playlists };
    case reducerCases.SET_PLAYLIST:
      return { ...state, selectedPlaylist: action.selectedPlaylist };
    case reducerCases.SET_SELECTED_PLAYLIST_ID:
      return { ...state, selectedPlaylistId: action.selectedPlaylistId };
    case reducerCases.SET_CURRENT_TRACK:
      return { ...state, currentTrack: action.currentTrack };
    case reducerCases.SET_PLAYER_STATE:
      return { ...state, playerState: action.playerState };
    case reducerCases.SET_RECOMMENDED_TRACKS:
      return { ...state, recommendedTracks: action.recommendedTracks };
    case reducerCases.SET_TOP_TRACKS:
      return { ...state, topTracks: action.topTracks };
    case reducerCases.SEEK_TO_POSITION:
      return { ...state, positionMs: action.positionMs };
    case reducerCases.SET_SELECTED_COMPONENT:
      return { ...state, selectedComponent: action.selectedComponent };
    case reducerCases.SET_SHUFFLE:
      return { ...state, shuffleState: action.shuffleState };
    case reducerCases.SET_REPEAT_MODE:
      return { ...state, repeatMode: action.repeatMode };
    case reducerCases.SET_RECENTLY_PLAYED_TRACKS:
      return { ...state, recentlyPlayedTracks: action.recentlyPlayedTracks };
    case reducerCases.SET_SEARCHED_ALBUMS:
      return { ...state, searchedAlbums: action.searchedAlbums };
    case reducerCases.SET_SEARCHED_TRACKS:
      return { ...state, searchedTracks: action.searchedTracks };
    case reducerCases.SET_SEARCHED_ARTISTS:
      return { ...state, searchedArtists: action.searchedArtists };
    case reducerCases.SET_SEARCHED_PLAYLISTS:
      return { ...state, searchedPlaylists: action.searchedPlaylists };
    case reducerCases.SET_SELECTED_ALBUM_ID:
      return { ...state, selectedAlbumId: action.selectedAlbumId };
    case reducerCases.SET_ALBUM:
      return { ...state, selectedAlbum: action.selectedAlbum };
    case reducerCases.SET_SELECTED_ARTIST_ID:
      return { ...state, selectedArtistId: action.selectedArtistId };
    case reducerCases.SET_ARTIST:
      return { ...state, selectedArtist: action.selectedArtist };
    case reducerCases.SET_ARTIST_TOP_SONGS:
      return { ...state, artistTopSongs: action.artistTopSongs };
    case reducerCases.SET_LIKED_SONGS:
      return { ...state, likedSongs: action.likedSongs };
    case reducerCases.SET_QUEUE:
      return { ...state, queueSongs: action.queueSongs };
    case reducerCases.SET_POP_PLAYLISTS:
      return { ...state, popPlaylists: action.popPlaylists };
    case reducerCases.SET_HIPHOP_PLAYLISTS:
      return { ...state, hipHopPlaylists: action.hipHopPlaylists };
    case reducerCases.SET_PARTY_PLAYLISTS:
      return { ...state, partyPlaylists: action.partyPlaylists };
    case reducerCases.SET_ROCK_PLAYLISTS:
      return { ...state, rockPlaylists: action.rockPlaylists };
    case reducerCases.SET_TECHNO_PLAYLISTS:
      return { ...state, technoPlaylists: action.technoPlaylists };
    case reducerCases.SET_WORKOUT_PLAYLISTS:
      return { ...state, workoutPlaylists: action.workoutPlaylists };
    case reducerCases.SET_INDIE_PLAYLISTS:
      return { ...state, indiePlaylists: action.indiePlaylists };
    case reducerCases.SET_DISCOVER_PLAYLIST:
      return { ...state, discoverPlaylist: action.discoverPlaylist };
    case reducerCases.SET_MOOD_PLAYLISTS:
      return { ...state, moodPlaylists: action.moodPlaylists };
    case reducerCases.SET_STUDY_PLAYLISTS:
      return { ...state, studyPlaylists: action.studyPlaylists };
    default:
      return state;
  }
};
