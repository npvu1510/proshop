import fs from 'fs';

const dataStr = fs.readFileSync('./proshop.users.json', 'utf8');
const data = JSON.parse(dataStr);

const extractData = data.map((item) => item._id['$oid']);

console.log(extractData);
[
  '6667e815fab43abdaf4a1f58',
  '6667e815fab43abdaf4a1f59',
  '6667e815fab43abdaf4a1f5a',
  '6667e815fab43abdaf4a1f5b',
  '6667e815fab43abdaf4a1f5c',
  '6667e815fab43abdaf4a1f5d',
  '6667e815fab43abdaf4a1f5e',
  '6667e815fab43abdaf4a1f5f',
  '6667e815fab43abdaf4a1f60',
  '6667e815fab43abdaf4a1f61',
  '6667e815fab43abdaf4a1f62',
];
