/**
 * ⚠️ ROUTING RULES:
 * - Router is in main.tsx. Do NOT add another <BrowserRouter> here or anywhere.
 * - Use <Routes> + <Route> components ONLY. Do NOT use useRoutes().
 * - STATIC IMPORTS ONLY — no React.lazy() or dynamic import().
 * - Import from 'react-router' — NOT 'react-router-dom' (does not exist).
 */
import { Routes, Route } from 'react-router';
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import Gallery from '@/pages/Gallery';
import Admin from '@/pages/Admin';
import Glossary from '@/pages/Glossary';
import WingPostures from '@/pages/WingPostures';
import SizeIdentification from '@/pages/SizeIdentification';
import Help from '@/pages/Help';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function App() {
	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/quiz" element={<Index />} />
				<Route path="/gallery" element={<Gallery />} />
				<Route path="/glossary" element={<Glossary />} />
				<Route path="/wing-postures" element={<WingPostures />} />
				<Route path="/size" element={<SizeIdentification />} />
				<Route path="/help" element={<Help />} />
				<Route path="/admin" element={<Admin />} />
			</Routes>
		</>
	);
}