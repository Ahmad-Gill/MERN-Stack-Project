const fetchData = async (query) => {
    if (!query) return "No data available. Search something else.";
  
    const apiUrl = `https://demo.dataverse.org/api/search?q=${query}&per_page=10&sort=date&order=asc`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        console.error("API request failed with status:", response.status);
        return "No data available. Search something else.";
      }
  
      const data = await response.json();
  
      if (data?.status === "OK" && data?.data?.items?.length > 0) {
        return data.data.items;
      }
  
      return "No data available. Search something else."; // No results found
    } catch (error) {
      console.error("Error fetching data:", error);
      return "No data available. Search something else.";
    }
  };
  
  export default fetchData;
  