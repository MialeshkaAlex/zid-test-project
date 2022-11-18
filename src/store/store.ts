import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const name = ref("Alexander Meleshko");
  const gender = ref("Male");
  const avatar = ref(
    "https://images.pexels.com/photos/1280162/pexels-photo-1280162.jpeg?auto=compress&cs=tinysrgb&w=1600"
  );

  return {
    name,
    gender,
    avatar,
  };
});
