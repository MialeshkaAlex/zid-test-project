<template>
  <v-container>
    <v-card>
      <v-card-text>
        {{ paymentStatus }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/store";

const paymentStatus = ref("");
const stripe = ref<Stripe | null>(null);
const router = useRoute();
const store = useUserStore();

onMounted(async () => {
  store.loading = true;
  try {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    paymentStatus.value = await getStatusMessage();
  } catch (err) {
    store.loading = false;
    console.error("Fail to load stripe", err);
  }
});

const getStatusMessage = async function (): Promise<string> {
  const clientSecret = router.query["payment_intent_client_secret"];

  if (!clientSecret || typeof clientSecret !== "string" || !stripe.value) {
    store.loading = false;
    return "Something went wrong.";
  }

  const { paymentIntent } = await stripe.value.retrievePaymentIntent(
    clientSecret
  );

  switch (paymentIntent?.status) {
    case "succeeded":
      store.loading = false;
      return "Payment succeeded!";
    case "processing":
      store.loading = false;
      return "Your payment is processing.";
    case "requires_payment_method":
      store.loading = false;
      return "Your payment was not successful, please try again.";
    default:
      store.loading = false;
      return "Something went wrong.";
  }
};
</script>

<style scoped></style>
