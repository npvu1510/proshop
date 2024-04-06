import toast, { Toaster } from 'react-hot-toast';

const successful = () => toast.success('Successfully created!');
const waiting = () => toast.loading('Waiting...');
const error = () => toast.error('Error created!');
function Test() {
  return (
    <div>
      <button onClick={successful}>Make me a successful</button>
      <button onClick={waiting}>Make me a loading</button>
      <button onClick={error}>Make me a error</button>
      <Toaster />
    </div>
  );
}

export default Test;
