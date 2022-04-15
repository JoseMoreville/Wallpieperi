import { reactive, readonly } from "vue";
interface StoreState {
    placeholder: string;
}
const state:StoreState = reactive({
    placeholder: '',
});

const mutations = {};

export default {
    state: readonly(state),
    mutations,
};