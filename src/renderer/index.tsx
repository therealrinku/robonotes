import { createRoot } from 'react-dom/client';
import { Main } from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<Main />);
