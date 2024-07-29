import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

// Define columns for the DataGrid
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 130 },
  { field: 'description', headerName: 'Description', width: 130 },
  { field: 'price', headerName: 'Price', type: 'number', width: 90 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'sold', headerName: 'Sold', type: 'boolean', width: 130 },
];

function DataTable() {
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true); // Add loading state
  // const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    axios.get('/api/v1/products/allTransaction')
      .then(response => {
        console.log('Fetched data:', response.data); // Log raw response

        // Check if the response contains the array in a specific property
        const transactions = response.data.allTranstion; // Adjust based on your API response structure

        // Ensure transactions is an array
        if (Array.isArray(transactions)) {
          // Map the data to match the DataGrid columns
          const mappedData = transactions.map(item => ({
            id: item.id, 
            title: item.title, 
            description: item.description,
            price: item.price,
            category: item.category,
            sold: item.sold
          }));
          setData(mappedData);
        } else {
          console.error('Response data is not an array:', transactions);
        }
        // setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // setError(error);
        // setLoading(false);
      });
  }, []);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data} columns={columns} pageSize={10} />
    </div>
  );
}

export default DataTable;