import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateMaps from "./stateMaps";

const mutations = {
    ...generateSimpleMutations(stateMaps),

    /**
     * Set both center and zoom in one go, and immediately move the map.
     * @param {MapState} state
     * @param {{ center: number[], zoom: number }} payload
     */
    setView (state, { center, zoom }) {
        state.center = center;
        state.zoom   = zoom;

        const mapView = mapCollection.getMapView('2D');
        mapView.setCenter(center);
        mapView.setZoom(zoom);
    },


    /**
     * Adds the given feature to highlightedFeatures.
     * @param {Object} state the state.
     * @param {module:ol/Feature} feature - The given feature.
     * @returns {void}
     */
    addHighlightedFeature (state, feature) {
        state.highlightedFeatures.push(feature);
    },

    /**
     * Adds the given style to highlightedFeatureStyles.
     * @param {Object} state the state.
     * @param {Object} style - The given style.
     * @returns {void}
     */
    addHighlightedFeatureStyle (state, style) {
        state.highlightedFeatureStyles.push(style);
    },
};

export default mutations;
