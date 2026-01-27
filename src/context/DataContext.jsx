import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [fleet, setFleet] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [filteredFleet, setFilteredFleet] = useState(null); // Null means no search active
    const [searchParams, setSearchParams] = useState(null); // Store current search dates/type

    const fetchFleet = async () => {
        try {
            const res = await fetch('/api/cars');
            const data = await res.json();
            setFleet(data);
        } catch (error) {
            console.error('Error fetching fleet:', error);
        }
    };

    const fetchRentals = async () => {
        try {
            const res = await fetch('/api/rentals');
            const data = await res.json();
            setRentals(data);
        } catch (error) {
            console.error('Error fetching rentals:', error);
        }
    };

    const searchAvailableCars = async (startDate, endDate, type) => {
        try {
            const res = await fetch(`/api/available-cars?startDate=${startDate}&endDate=${endDate}&type=${type}`);
            const data = await res.json();
            setFilteredFleet(data);
            setSearchParams({ startDate, endDate, type });
        } catch (error) {
            console.error('Error searching cars:', error);
        }
    };

    useEffect(() => {
        fetchFleet();
        fetchRentals();
    }, []);

    const addCar = async (newCar) => {
        try {
            const res = await fetch('/api/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCar)
            });
            if (!res.ok) {
                const text = await res.text();
                console.error("Server Error (addCar):", res.status, text);
                let errorMessage = `Erro ${res.status}`;
                try {
                    const err = JSON.parse(text);
                    errorMessage = err.error || errorMessage;
                } catch {
                    // response was not JSON (likely HTML)
                    errorMessage = "Falha na comunicação com o servidor/API";
                }
                throw new Error(errorMessage);
            }
            fetchFleet();
            return true;
        } catch (error) {
            console.error('Error adding car:', error);
            alert(`Erro ao adicionar: ${error.message}`);
            return false;
        }
    };

    const addRental = async (rental) => {
        try {
            const res = await fetch('/api/rentals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rental)
            });
            if (!res.ok) throw new Error('Falha ao criar aluguel');
            fetchRentals();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCar = async (id) => {
        await fetch(`/api/cars/${id}`, { method: 'DELETE' });
        fetchFleet();
    };

    const updateCar = async (id, updatedCar) => {
        try {
            const res = await fetch(`/api/cars/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCar)
            });
            if (!res.ok) {
                const text = await res.text();
                alert(`Debug: Server returned ${res.status}. Check console for details.`);
                console.error("Server Error (updateCar):", res.status, text);

                let errorMessage = `Erro ${res.status}`;
                try {
                    const err = JSON.parse(text);
                    errorMessage = err.error || errorMessage;
                } catch {
                    // response was not JSON (likely HTML)
                    errorMessage = "Falha na comunicação com o servidor. O servidor pode estar offline ou o arquivo é muito grande.";
                }
                throw new Error(errorMessage);
            }
            fetchFleet();
            return true;
        } catch (error) {
            console.error('Error updating car:', error);
            alert(`Erro ao atualizar: ${error.message}`);
            return false;
        }
    };

    const toggleAvailability = async (id) => {
        await fetch(`/api/cars/${id}/toggle-availability`, { method: 'POST' });
        fetchFleet();
    };

    const updateRental = async (id, data) => {
        try {
            const res = await fetch(`/api/rentals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Falha ao atualizar aluguel');
            fetchRentals();
            return true;
        } catch (error) {
            console.error('Error updating rental:', error);
            alert(`Erro ao atualizar aluguel: ${error.message}`);
            return false;
        }
    };

    const deleteRental = async (id) => {
        if (!confirm('Tem certeza que deseja deletar este aluguel?')) return;
        try {
            const res = await fetch(`/api/rentals/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao deletar aluguel');
            fetchRentals();
        } catch (error) {
            console.error('Error deleting rental:', error);
            alert(`Erro: ${error.message}`);
        }
    };

    return (
        <DataContext.Provider value={{
            fleet, rentals, filteredFleet, searchParams,
            addCar, addRental, deleteCar, updateCar, toggleAvailability, searchAvailableCars, updateRental, deleteRental
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
