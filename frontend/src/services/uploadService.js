import api from './api';

const deleteUpload = async (uploadId) => {
  try {
    const response = await api.delete(`/upload/${uploadId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete upload:', error);
    throw error;
  }
};

export default {
  deleteUpload,
};
