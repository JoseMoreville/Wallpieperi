import { reactive, readonly } from "vue";
interface StoreState {
    currentBackground: string;
}
const state:StoreState = reactive({
    currentBackground: '',
});

const mutations = {
    changeCurrentBackground(background:string){
        state.currentBackground = background;
    },
};

export default {
    state: readonly(state),
    mutations,
};