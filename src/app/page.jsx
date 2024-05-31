"use server";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

async function getDatas() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/photos?albumId=1"
  );
  if (!res.ok) {
    throw new Error("Cannot Fetch");
  }
  return res.json();
}

export default async function Home() {
  const datas = await getDatas();
  return (
    <main className="container mx-auto px-24 max-[1024px]:px-5">
      <h1 className="text-center text-3xl font-bold mt-5">Cards Shop</h1>
      <div className="grid grid-cols-5 gap-4 mt-6 max-[1024px]:grid-cols-4 max-[900px]:grid-cols-3 max-[480px]:grid-cols-1">
        {datas.map((item) => (
          <Card key={item.id} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={item.url}
              title="green iguana"
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ height: 100, overflow: "hidden" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  width: "auto",
                  Maxheight: 20,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Typography>
            </CardContent>
            <CardActions>
              <Button href={`/selectedImage/${item.id}`} size="small">
                Shop now
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </main>
  );
}
