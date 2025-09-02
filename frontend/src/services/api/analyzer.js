import axios from './axios'

export async function analyzeCode(payload){
    return await axios.post('/analyze-code', { code: payload }, 
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percent}%`);
          }
        },
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Download Progress: ${percent}%`);
          }
        },
      }
    );
}
  

export async function analyzeFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "/analyze-file",
    formData,
    {
      headers: {
        "Accept": "application/json",
      },
    }
  );

  return response.data;
}