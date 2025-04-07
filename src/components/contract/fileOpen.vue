<template>
    <div class="content-container">
        <div class="html-container">
            <div v-for="(content, index) in htmlContents" :key="index" class="text-black html-content" v-html="content">
            </div>
        </div>
        <button class="download-button mb-4" @click="downloadFile">Shartnomani yuklab olish</button>
        <div v-for="(page, index) in pdfPages" :key="index" class="mb-4">
            <img :src="page"
                class="w-full rounded-lg shadow-md object-cover "
                alt="PDF Page" />
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { URL } from '@/auth/url.js';
import translateText from '@/auth/Translate';
import * as pdfjsLib from "pdfjs-dist";
const route = useRoute();
const id = route.params.id;
const data = ref(); // Initialize with an empty check array
const htmlContents = ref([]); // Store multiple HTML contents as an array
const dat = inject('dat')

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
    if (data.value?.file) {
        try {
            const response = await axios.get(`${URL}${data.value.file}`, {
                responseType: 'blob', // Ensure the response is treated as a file
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', data.value.file.split('/').pop()); // Extract file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    } else {
        console.warn("No file available to download.");
    }
};

// Explicitly set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"; // Updated to match API version

const isLoading = ref(false);
const fileId = route.params.id;
const fileUrl = ref("");
const pdfPages = ref([]);

const BASE_URL = 'https://backend.arizasud.uz'; // Replace with your actual API base URL

const getData = async () => {
    isLoading.value = true;
    try {
        const requestUrl = `${BASE_URL}/client/${fileId}`;
        console.log("Request URL:", requestUrl); // Debugging: Log the request URL

        const res = await axios.get(requestUrl, {
            validateStatus: (status) => status < 500, // Accept only non-server-error responses
        });

        console.log("Full API Response:", res); // Debugging: Log full response

        // Check for HTTP status errors
        if (res.status !== 200) {
            console.error(`HTTP Error: ${res.status} - ${res.statusText}`);
            throw new Error(`Failed to fetch data. HTTP Status: ${res.status}`);
        }

        // Validate API response format
        if (!res.data || typeof res.data !== "object" || !res.data.file) {
            if (typeof res.data === "string" && res.data.includes("<!DOCTYPE html>")) {
                console.error("API returned an HTML document. Response:", res.data);
                throw new Error("API response returned an HTML document instead of JSON. Check the API endpoint.");
            }
            throw new Error("API response is missing filePath or invalid");
        }

        // Correct the property access from 'filePath' to 'file'
        fileUrl.value = res.data.file.startsWith("http")
            ? res.data.file
            : `${BASE_URL}${res.data.file}`;

        console.log("File URL:", fileUrl.value); // Debugging: Check File URL

        // PDF render qilish
        await renderPdf(fileUrl.value);
    } catch (error) {
        console.error("Ma'lumot yuklashda xatolik:", error);
        // Fallback: Display a user-friendly message
        pdfPages.value = [];
        alert("Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."); // Notify the user
    } finally {
        isLoading.value = false;
    }
};

// Render PDF pages as images
const renderPdf = async (url) => {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        pdfPages.value = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            // Create a canvas element
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render the page into the canvas
            await page.render({ canvasContext: context, viewport }).promise;

            // Convert canvas to image data URL
            const imageDataUrl = canvas.toDataURL("image/png");
            pdfPages.value.push(imageDataUrl);
        }
    } catch (error) {
        console.error("PDF yuklashda xatolik:", error);
    }
};

onMounted(() => {
    getData();
    GetClient();
});
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
    gap: 20px;
    /* Add spacing between HTML files */
    flex-wrap: wrap;
    /* Ensure responsiveness for smaller screens */
}

.html-content {
    flex: 1;
    /* Allow equal space for each HTML file */
    min-width: 300px;
    /* Set a minimum width for each content block */
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

.pdf-container {
    width: 99%;
    max-width: 800px;
    overflow-y: auto;
}

.pdf-page {
    width: 100%;
    margin-bottom: 5px;
    display: block;
}

#particles-js {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}

b {
    color: white;
    font-weight: bold;
}
</style>
