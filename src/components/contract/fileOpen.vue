<template>
    <div class="content-container">
        <button class="download-button mb-4" @click="downloadFile">Shartnomani yuklab olish</button>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { URL } from '@/auth/url.js';

const route = useRoute();
const id = route.params.id;
const data = ref(); // Initialize with an empty check array
const htmlContents = ref([]); // Store multiple HTML contents as an array

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
                    const htmlContentsArray = await Promise.all(
                        htmlFilePaths.map(async (filePath) => {
                            const htmlResponse = await axios.get(`${URL}${filePath}`);
                            return htmlResponse.data; // Fetch and return the HTML content
                        })
                    );
                    htmlContents.value = htmlContentsArray; // Store all HTML contents in the array
                } catch (htmlError) {
                    console.error("Error fetching HTML files:", htmlError);
                    htmlContents.value = ['<p>Error loading HTML content.</p>']; // Fallback HTML content
                }
            } else {
                console.warn("No valid HTML file paths found in the check array.");
                htmlContents.value = ['<p>No valid HTML content available.</p>']; // Fallback HTML content
            }
        } else {
            console.warn("No valid 'check' array found in the response.");
            htmlContents.value = ['<p>No data available.</p>']; // Fallback HTML content
        }
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        htmlContents.value = ['<p>Error loading content.</p>']; // Fallback HTML content in case of error
    }
};

const downloadFile = async () => {
    if (htmlContents.value.length > 0) {
        try {
            const htmlContent = htmlContents.value[0]; // Get the first HTML content
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.html'); // Set a default file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading HTML file:", error);
        }
    } else {
        console.warn("No HTML content available to download.");
    }
};

GetClient();
</script>

<style scoped>
.content-container {
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    max-width: 900px;
    margin: 20px auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.html-container {
    display: flex;
    gap: 20px; /* Add spacing between HTML files */
    flex-wrap: wrap; /* Ensure responsiveness for smaller screens */
}

.html-content {
    flex: 1; /* Allow equal space for each HTML file */
    min-width: 300px; /* Set a minimum width for each content block */
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 1.5;
}

.download-button {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.download-button:hover {
    background-color: #0056b3;
}

.html-content ::v-deep * {
    color: black !important;
}
</style>
