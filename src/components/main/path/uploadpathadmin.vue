<template>
  <div>
    <form @submit.prevent="uploadCourt" ref="form">
      <div>
        <input
            v-model="courtName1"
            class="text-black w-full outline-none p-3 mt-9 rounded-[15px]"
            type="text"
            id="name"
            required
        />
      </div>
      <div>
        <input
            ref="fileInput1"
            @change="onFileChange1"
            type="file"
            id="file"
            accept="image/*"
            required
        />
      </div>
      <button
          class="w-full rounded-[30px] bg-lime-600 hover:bg-lime-900 text-[20px] py-2"
          type="submit"
      >
        {{ $t('yuklash') }}
      </button>
    </form>
    <p v-if="successMessage1" style="color: green">{{ successMessage1 }}</p>
    <p v-if="errorMessage1" style="color: red">{{ errorMessage1 }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { URL } from "../../../auth/url.js";

export default {
  setup() {
    const courtName1 = ref("");
    const file1 = ref(null);
    const successMessage1 = ref("");
    const errorMessage1 = ref("");
    const route = useRoute(); // Fixed typo: useRoute not router
    const form = ref(null);
    const fileInput1 = ref(null);

    const onFileChange1 = (event) => {
      file1.value = event.target.files[0];
    };

    const id1 = route.params.id;

    const uploadCourt = async () => {
      const formData = new FormData();
      formData.append("name", courtName1.value);
      formData.append("file", file1.value); // Matches backend FileInterceptor
      formData.append("courtsId", id4);

      try {
        await axios.post(`${URL}/services`, formData, { // Fixed endpoint name
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        successMessage1.value = "Service muvaffaqiyatli yuklandi!";
        errorMessage1.value = "";
        courtName1.value = "";
        file1.value = null;
        if (fileInput1.value) fileInput1.value = ""; // Reset file input
      } catch (error) {
        errorMessage1.value = "Yuklashda xato yuz berdi: " + (error.response?.data?.message || error.message);
        successMessage1.value = "";
      }
    };

    return {
      courtName1,
      file1,
      successMessage1,
      errorMessage1,
      onFileChange1,
      uploadCourt,
      form,
      fileInput1,
    };
  },
};
</script>

<style>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
}
</style>