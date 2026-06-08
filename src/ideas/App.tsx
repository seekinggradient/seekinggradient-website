import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { IdeaPage } from './pages/IdeaPage';
import { Mockups } from './pages/Mockups';
import { NotFound } from './pages/NotFound';
import { ShortTermRentalTechnicalPlan } from './pages/ShortTermRentalTechnicalPlan';

export default function IdeasApp() {
  return (
    <div className="ideas-app">
      <BrowserRouter basename="/ideas">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/mockups" element={<Mockups />} />
            <Route path="/short-term-rental-demand-radar/technical-plan" element={<ShortTermRentalTechnicalPlan />} />
            <Route path="/:slug" element={<IdeaPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
