"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Axios from "axios";
import Button from "@mui/material/Button";

export default function Cart() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/order/get").then((response) => {
      setOrders(response.data);
    });
  }, []);

  function DeleteOrder(id) {
    Axios.delete(`http://localhost:3001/order/delete/${id}`)
      .then((response) => {
        alert("Order deleted successfully");
        setOrders(orders.filter((order) => order.id !== id)); // Update the state to remove the deleted order
      })
      .catch((error) => {
        console.error("There was an error deleting the order!", error);
        alert("Failed to delete order");
      });
  }

  function AddQuantity(id, currentQuantity) {
    Axios.put(`http://localhost:3001/order/update/${id}`, {
      quantity: currentQuantity + 1,
    })
      .then((response) => {
        setOrders(
          orders.map((order) =>
            order.id === id
              ? { ...order, quantity: currentQuantity + 1 }
              : order
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the order quantity!", error);
        alert("Failed to update order quantity");
      });
  }

  function handleDelete(id) {
    const orderWithZeroQuantity = orders.find(
      (item) => item.id === id && item.quantity === 0
    );
    if (orderWithZeroQuantity) {
      Axios.delete(`http://localhost:3001/order/delete/${id}`)
        .then((response) => {
          alert("Order deleted successfully");
          setOrders(orders.filter((order) => order.id !== id));
        })
        .catch((error) => {
          console.error("There was an error deleting the order!", error);
          alert("Failed to delete order");
        });
    }
  }

  useEffect(() => {
    const orderWithZeroQuantity = orders.find((item) => item.quantity === 0);
    if (orderWithZeroQuantity) {
      handleDelete(orderWithZeroQuantity.id);
    }
  }, [orders]);

  function MinusQuantity(id, currentQuantity) {
    if (currentQuantity <= 1) {
      handleDelete(id);
    } else {
      Axios.put(`http://localhost:3001/order/update/${id}`, {
        quantity: currentQuantity - 1,
      })
        .then((response) => {
          setOrders(
            orders.map((order) =>
              order.id === id
                ? { ...order, quantity: currentQuantity - 1 }
                : order
            )
          );
        })
        .catch((error) => {
          console.error(
            "There was an error updating the order quantity!",
            error
          );
          alert("Failed to update order quantity");
        });
    }
  }
  const subtotal = orders.reduce((sum, item) => sum + (item.price || 0), 0);
  return (
    <div className="container mx-auto px-24 max-[1024px]:px-5">
      <h1 className="font-bold text-xl sm:text-3xl">Your cart</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Image</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Owner</th>
              <th className="text-left p-2">Contract</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Quantity</th>
              <th className="text-left p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr className="text-center border-b" key={order.id}>
                  <td className="p-2 flex justify-center">
                    <Image
                      priority={true}
                      src={order.image}
                      alt={order.title}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </td>
                  <td className="p-2">{order.title}</td>
                  <td className="p-2">{order.owner}</td>
                  <td className="p-2">{order.contract}</td>
                  <td className="p-2">$ {order.price}</td>
                  <td className="p-2">
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={() => MinusQuantity(order.id, order.quantity)}
                        sx={{ minWidth: '24px', padding: '4px', marginRight: '4px' }}
                        variant="contained"
                      >
                        -
                      </Button>
                      {order.quantity}
                      <Button
                        onClick={() => AddQuantity(order.id, order.quantity)}
                        sx={{ minWidth: '24px', padding: '4px', marginLeft: '4px' }}
                        variant="contained"
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button
                      onClick={() => DeleteOrder(order.id)}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-md text-gray-600 font-bold p-5"
                >
                  Your Cart Is Empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="border-t-2 border-gray-500 mt-5 text-end text-md mb-3">
        <span className="font-bold">Subtotal :</span>{" "}
        <span className="text-gray-600 w-28 inline-block">{subtotal} THB</span>
      </p>
      <div className="text-end">
        <p className="mb-3">Taxes and shipping calculated at checkout</p>
        <button className="text-md bg-black text-white w-full sm:w-60 h-10 rounded-full">
          Check out
        </button>
      </div>
    </div>
  );
}
