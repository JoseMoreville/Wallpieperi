import { useHead } from "@vueuse/head";

const useNewTitle = (title: string)=>{
    useHead({
        title,
      });
};

export { useNewTitle };