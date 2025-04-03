<template>
    <div class="text-black html-content" v-html="htmlContent"></div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { URL } from '@/auth/url.js';

const route = useRoute();
const id = route.params.id;
const data = ref(); // Initialize with an empty check array
const htmlContent = ref(''); // Store the HTML content as a string

const GetClient = async () => {
    try {
        const response = await axios.get(`${URL}/client/${id}`);
        console.log("Full API response:", response.data); // Debugging log to inspect the full response
        data.value = response.data;
        if (data.value?.check) {
            console.log("Check array:", data.value.check); // Debugging log to inspect the check array
            const htmlFilePaths = data.value.check.filter(item => typeof item === 'string' && item.endsWith('.html'));
            if (htmlFilePaths.length > 0) {
                try {
                    const htmlContents = await Promise.all(
                        htmlFilePaths.map(async (filePath) => {
                            const htmlResponse = await axios.get(`${URL}${filePath}`);
                            return htmlResponse.data; // Fetch and return the HTML content
                        })
                    );
                    htmlContent.value = htmlContents.join('\n'); // Concatenate all HTML content
                } catch (htmlError) {
                    console.error("Error fetching HTML files:", htmlError);
                    htmlContent.value = '<p>Error loading HTML content.</p>'; // Fallback HTML content
                }
            } else {
                console.warn("No valid HTML file paths found in the check array.");
                htmlContent.value = '<p>No valid HTML content available.</p>'; // Fallback HTML content
            }
        } else {
            console.warn("No valid 'check' array found in the response.");
            htmlContent.value = '<p>No data available.</p>'; // Fallback HTML content
        }
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        htmlContent.value = '<p>Error loading content.</p>'; // Fallback HTML content in case of error
    }
};

GetClient();
</script>

<style scoped>
.html-content ::v-deep * {
    color: black !important;
}
</style>
