import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Jane Smith',
    email: 'jane@email.com',
    password: bcrypt.hashSync('password123', 10),
    isAdmin: true,
  },
  {
    name: 'Alice Johnson',
    email: 'alice@email.com',
    password: bcrypt.hashSync('pass123', 10),
    isAdmin: false,
  },
  {
    name: 'Bob Brown',
    email: 'bob@email.com',
    password: bcrypt.hashSync('bobpass', 10),
    isAdmin: false,
  },
  {
    name: 'Emma Davis',
    email: 'emma@email.com',
    password: bcrypt.hashSync('password1234', 10),
    isAdmin: false,
  },
  {
    name: 'Michael Wilson',
    email: 'michael@email.com',
    password: bcrypt.hashSync('mikepass', 10),
    isAdmin: false,
  },
  {
    name: 'Sophia Martinez',
    email: 'sophia@email.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: false,
  },
  {
    name: 'Daniel Taylor',
    email: 'daniel@email.com',
    password: bcrypt.hashSync('password321', 10),
    isAdmin: false,
  },
  {
    name: 'Olivia Garcia',
    email: 'olivia@email.com',
    password: bcrypt.hashSync('password12345', 10),
    isAdmin: false,
  },
];

export default users;
