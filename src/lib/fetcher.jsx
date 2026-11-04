export const $fetch = async (url, options) => {
    try {
      const res = await fetch(url, options);
      return res.json();
    } catch (error) {
      console.log("🚀 $fetch error:", error);
      return {
        message: error?.message,
        data: [],
      };
    }
  };