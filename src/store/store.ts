import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const name = ref("Alexander Meleshko");
  const gender = ref("Male");
  const avatar = ref(
    "https://images.pexels.com/photos/1280162/pexels-photo-1280162.jpeg?auto=compress&cs=tinysrgb&w=1600"
  );
  const dateOfBirth = ref<Date>(new Date("2000-12-06"));

  const loading = ref(false);
  const loadingType = ref("Default");

  return {
    name,
    gender,
    avatar,
    dateOfBirth,
    loading,
    loadingType,
  };
});
