import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Ensure SweetAlert2 is imported correctly

export default function DeleteStock() {
    const { id } = useParams(); // Get stock ID from URL
    const navigate = useNavigate();

    function deleteStock() {
        console.log("Opening confirmation dialog");

        // Show SweetAlert2 confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            console.log("Confirmation result:", result);

            if (result.isConfirmed) {
                console.log("Confirmed deletion, sending delete request");

                // If confirmed, delete the stock item
                axios.delete(`http://localhost:8070/stocks/delete/${id}`)
                .then(() => {
                    Swal.fire(
                        'Deleted!',
                        'The stock item has been deleted.',
                        'success'
                    );
                    navigate('/'); // Redirect after deletion
                })
                .catch((err) => {
                    Swal.fire('Error', err.message, 'error');
                    console.error('Error deleting stock:', err);
                });
            } else {
                console.log("Deletion canceled");
            }
        });
    }

    return (
        <div className='container'>
            <h1>Are you sure you want to delete this stock item?</h1>
            <button onClick={deleteStock} className="btn btn-danger">Delete</button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
    );
}
