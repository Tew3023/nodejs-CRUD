"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Slide from "@/app/components/Slide";
import Axios from "axios";

async function getData(id) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/photos?albumId=1&id=${id}`
  );
  if (!res.ok) {
    throw new Error("Cannot Fetch");
  }
  return res.json();
}
async function getOther() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/photos?albumId=1`
  );
  if (!res.ok) {
    throw new Error("Cannot Fetch");
  }
  return res.json();
}
async function getUser() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
  if (!res.ok) {
    throw new Error("Cannot Fetch");
  }
  return res.json();
}

export default function selectedImage({ params }) {
  const [cards, setCards] = useState([]);
  const [expample, setExample] = useState([]);
  const [user, setUser] = useState([]);
  const [data, setData] = useState([]);
  async function getnfo() {
    const data = await getData(params.slug);
    const data2 = await getOther();
    const users = await getUser();
    setCards(data);
    setExample(data2);
    setUser(users);
  }
  useEffect(() => {
    getnfo();
    Axios.get("http://localhost:3001/order/get").then((response) => {
      setData(response.data);
    });
  }, []);

  function addition(item) {
    const sameID = data.find((order) => order.productID === item.id);
    if (sameID) {
      console.log("Updating existing order:", sameID);
      return Axios.put(`http://localhost:3001/order/update/${sameID.id}`, {
        quantity: sameID.quantity + 1,
      })
        .then((response) => {
          console.log("Add successfully", response);
          setData((prevData) =>
            prevData.map((order) =>
              order.productID === item.id
                ? { ...order, quantity: order.quantity + 1 }
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
    } else {
      const randomNumber = Math.floor(Math.random() * 100000) + 1;
      const newitem = {
        id: randomNumber,
        url: item.url,
        title: item.title,
        owner: "tew",
        contract: "tew666@gamil.com",
        price: 9999,
        quantity: 1,
        productID: item.id,
      };
      Axios.post("http://localhost:3001/order/post", {
        id: newitem.id,
        image: newitem.url,
        title: newitem.title,
        owner: newitem.owner,
        contract: newitem.contract,
        price: newitem.price,
        quantity: newitem.quantity,
        productID: newitem.productID,
      }).then((response) => {
        if (response.status === 200) {
          alert("Successfully added to cart");
          setData((prevData) => [...prevData, newitem]);
        }
      });
    }
  }

  const exampleFilter = expample.filter((item) => item.id != params.slug);

  return (
    <div className="container mx-auto  px-24 max-[1024px]:px-5">
      <h1 className="text-center font-bold text-2xl sm:text-4xl mt-5">Selected Image</h1>
      <div className="mt-5 mb-5">
        {cards.map((item) => (
          <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-center">
              <Image
                className="rounded-xl"
                priority={true}
                src={item.url}
                width={1000}
                height={1000}
                alt={item.title}
              />
            </div>
            <div>
              <h1 className="font-bold text-2xl sm:text-4xl mb-2">{item.title}</h1>
              <p className="text-lg sm:text-xl mb-2">
                9999 THB{" "}
                <span className="bg-red-500 text-white py-1 px-3 rounded-xl">
                  Sale
                </span>
              </p>
              <p className="mb-2">
                <span className="underline cursor-pointer">Shipping</span>{" "}
                calculated at checkout.
              </p>
              <p className="mb-2">Owner : Tew</p>
              <p className="mb-2">Contract : tew666@gamil.com</p>
              <button
                onClick={() => {
                  addition(item);
                }}
                className="w-full py-2 border-black border-2 rounded-full mb-2"
              >
                Add to cart
              </button>
              <p className="mb-2 text-sm sm:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, <br />
                <br /> when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not
                only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised
                in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-2xl sm:text-3xl font-bold mb-5">You may also like</p>
      <Slide item={exampleFilter} />
    </div>
  );
}
