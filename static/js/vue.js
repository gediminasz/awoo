const TAB_LONG_TERM = 'long_term';
const TAB_MEDIUM_TERM = 'medium_term';
const TAB_SHORT_TERM = 'short_term';
const TABS = {
    [TAB_LONG_TERM]: 'All time',
    [TAB_MEDIUM_TERM]: 'Last 6 months',
    [TAB_SHORT_TERM]: 'Last 4 weeks'
};

let app = new Vue({
    el: '#app',

    data: {
        tabs: TABS,
        currentTab: TAB_LONG_TERM,
        tracks: {},
        nowPlaying: { track: null, audio: null }
    },

    computed: {
        displayedTracks: function () { return this.tracks[this.currentTab] }
    },

    methods: {
        switchTab: function (tab) {
            this.currentTab = tab;
            this.fetchTracks(tab);
        },

        fetchTracks: function (tab) {
            if (this.tracks[tab]) return;
            fetch('/tracks?time_range=' + tab, { credentials: "same-origin" })
                .then((response) => response.json())
                .then((data) => Vue.set(this.tracks, tab, data));
        },

        playPreview: function (track) {
            this.stopPlayback();

            const audio = new Audio(track.preview_url);
            audio.play()
            audio.addEventListener('ended', () => this.stopPreview());

            this.nowPlaying = { track, audio };
        },

        stopPreview: function () {
            this.stopPlayback();
            this.nowPlaying = { track: null, audio: null };
        },

        stopPlayback: function () {
            if (this.nowPlaying.audio) {
                this.nowPlaying.audio.pause();
            }
        }
    },

    mounted: function () {
        this.fetchTracks(this.currentTab);
    }
});
