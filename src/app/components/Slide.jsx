import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import { useEffect, useState } from "react";
import Axios from "axios";
export default function Slide({item}) {
  const [user,setUser] = useState([])
  async function getUser() {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
    if (!res.ok) {
      throw new Error("Cannot Fetch");
    }
    return res.json();
  }

  async function getInfo(){
    const data = await getUser();
    setUser(data)
  }

  useEffect(()=>{
    getInfo()
  },[])
  const random = Math.floor(Math.random() * 10) + 1;
  const Newuser = user[random];


  function addition(item) {
    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const newitem = {
      id: randomNumber,
      url: item.url,
      title: item.title,
      owner: Newuser.name,
      contract: Newuser.email,
      price: randomNumber,
      quantity: 1,
    };
    Axios.post("http://localhost:3001/order/post", {
      id: newitem.id,
      image: newitem.url,
      title: newitem.title,
      owner: newitem.owner,
      contract: newitem.contract,
      price: newitem.price,
      quantity: newitem.quantity,
      
    }).then(function (response) {
      if (response.ok) {
        alert("succesfully");
      }
    });
  }
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={4}
      className="mySwiper"
      pagination={{
        dynamicBullets: true,
      }}
    >
      {item.map((item) => (
        <SwiperSlide key={item.id}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={item.url}
              title={item.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ height: 60, overflow: "hidden" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  width: "auto",
                  maxHeight: 20,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                9999 THB
              </Typography>
            </CardContent>
            <CardActions>
              <button onClick={()=>{addition(item)}} className="bg-black w-full text-white py-1 px-2 rounded-full">
                Add to cart
              </button>
            </CardActions>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
