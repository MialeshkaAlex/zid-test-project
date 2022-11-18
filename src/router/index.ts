import { createRouter, createWebHistory } from "vue-router";
import type { RouterOptions } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PaymentView from "../views/PaymentView.vue";
import EditView from "../views/EditView.vue";
import StatusPaymentView from "../views/StatusPaymentView.vue";

const router = createRouter(<RouterOptions>{
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/payment",
      name: "payment",
      component: PaymentView,
    },
    {
      path: "/edit",
      name: "edit",
      component: EditView,
    },
    {
      path: "/status",
      name: "status",
      component: StatusPaymentView,
    },
  ],
});

export default router;
