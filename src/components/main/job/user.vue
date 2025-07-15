<template>
    <div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-for="item in data" :key="item.id" @click="PostJobAplications(item.id)"
            :class="{ selected: ids.includes(item.id) }">
            {{ item }}
        </div>
    </div>
</template>

<script setup>
import { URL } from "@/auth/url";
import axios from "axios";
import { onMounted, ref } from "vue";

const data = ref([]);
const ids = ref([]);
const error = ref(null);


const getJobs = async () => {
    try {
        const res = await axios.get(`${URL}/jobs`);
        data.value = res.data;
        error.value = null;
    } catch (err) {
        error.value = err.response?.data?.message || "Failed to fetch jobs";
        console.error(err);
    }
};

const PostJobAplications = async (id) => {
    try {
       const res = await axios.post(`${URL}/user-applications`, {
            fullName: 'string',
            email: 'string',
            cvUrl: 'string',
            jobId: parseInt(id),
            phone: 'string',
            description: 'string',
        });
        await getJobs();
        error.value = null;
    } catch (err) {
        error.value = err.response?.data?.message || "Failed to create job";
        console.error(err);
    }
};

onMounted(() => {
    getJobs();
});
</script>

<style lang="scss" scoped>
.error {
    color: red;
    margin-bottom: 10px;
}

.selected {
    background-color: #e0e0e0;
    padding: 5px;
    border-radius: 4px;
}

button {
    margin: 5px;
    padding: 5px 10px;
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

div {
    margin: 5px 0;
}
</style>