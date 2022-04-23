import { ref, onMounted, onBeforeMount, type Ref } from "vue";
interface StoreState {
    mutations: {
        changeCurrentBackground: (background: string) => void;
    };
}

const useBackground = (isMainRoute:Ref<boolean>, store: StoreState) => {
    const shouldVideoBeMuted = ref(true);
    const extension = ref("");

    onBeforeMount(() => {
        if(isMainRoute.value){
        window.ipcRenderer.invoke('getAudioStatus',   'getAudioStatus')
          .then((audioStatus) => shouldVideoBeMuted.value = !audioStatus);
      }
      }),
      
      onMounted(() => {
        if (isMainRoute.value) {
          window.ipcRenderer
            .invoke("getBackground", "getBackground")
            .then((backgroundLocation) => {
              extension.value = backgroundLocation.split(".").pop();
              store.mutations.changeCurrentBackground(`file://${backgroundLocation}`);
            });
        }
      });
      return{
        shouldVideoBeMuted,
        extension,
      };
};

export default useBackground;