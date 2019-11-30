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
    },
    computed: {
        displayedTracks: function () { return this.tracks[this.currentTab] }
    },
    methods: {
        fetchTracks: function (tab) {
            console.debug(`Fetching ${tab} tracks`);
            if (this.tracks[tab]) return;

            fetch('/tracks?time_range=' + tab, { credentials: "same-origin" })
                .then((response) => response.json())
                .then((data) => Vue.set(this.tracks, tab, data));
        }
    },
    mounted: function () {
        this.fetchTracks(this.currentTab);
    }
});
