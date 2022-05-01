import { ref, onMounted, type Ref } from "vue";
interface StoreState {
  mutations: {
    changeCurrentBackground: (background: string) => void;
  };
}

const useBackground = (isMainRoute: Ref<boolean>, store: StoreState) => {
  const shouldVideoBeMuted = ref(true);
  const extension = ref("");
  const isBackgroundActive:Ref<boolean> = ref(true);

  onMounted(() => {
    if (isMainRoute.value) {
      window.ipcRenderer
        .invoke("getAudioStatus", "getAudioStatus")
        .then((audioStatus) => {
          shouldVideoBeMuted.value = !audioStatus;
          
          // Might add a condition to check if video has audio tracks to avoid the interval to be triggered
          // i'll work on it later on next build, not a priority

          if(shouldVideoBeMuted.value === false){
            setInterval(()=>{
              window.ipcRenderer.invoke('active', 'active').then((active) => {
                if(active !== undefined || active?.title !== undefined){
                isBackgroundActive.value = false;
                }else{
                  isBackgroundActive.value = true;
                }
        
                if(isBackgroundActive.value){
                  shouldVideoBeMuted.value = false;
                  document.getElementsByTagName('video')[0].volume = 0.33;
                }else{
                  shouldVideoBeMuted.value = true;
                }
              });
            }, 1000);
          }
        });  
    }

    if (isMainRoute.value) {
      window.ipcRenderer
        .invoke("getBackground", "getBackground")
        .then((backgroundLocation) => {
          extension.value = backgroundLocation.split(".").pop();
          store.mutations.changeCurrentBackground(`file://${backgroundLocation}`);
        });
    }
  });

  return {
    shouldVideoBeMuted,
    extension,
  };
};

export default useBackground;
