import uuid4 from "uuid4";

let users = [
  {
    username: "soojin",
    password: "$2b$12$cfUBZyjFGGhuCwBpInoF4uxjLTCjHo263SZ48y/pD6uXI2rYXuRi6",
    name: "Jin",
    email: "jin@naver.com",
    image:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3V0ZXxlbnwwfHwwfHx8MA%3D%3D",
    id: "abc",
  },
];
export async function getUser(username) {
  return users.find((x) => x.username === username);
}

export async function addUser(user) {
  const newUser = { ...user, id: uuid4() };
  users.push(newUser);
  return newUser.id;
}

export async function findById(id) {
  return users.find((x) => x.id === id);
}
