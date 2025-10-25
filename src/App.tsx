import React from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Header } from './components/shared';
import { HomePage, ProducerRegisterPage } from './pages';
import { CulturesPage } from './pages/Cultures';
import FazendaForm from './pages/fazenda/FazendaForm';
import { ProducersPage } from './pages/Producers';
import PropriedadesPage from './pages/propriedades';
import { store } from './store';
import GlobalStyleWrapper from './styles/GlobalStyleWrapper';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyleWrapper>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/producers' element={<ProducersPage />} />
            <Route path='/culturas' element={<CulturesPage />} />
            <Route path='/producer-register' element={<ProducerRegisterPage />} />
            <Route path='/producer-edit/:id' element={<ProducerRegisterPage />} />
            <Route path='/propriedades/:produtorId' element={<PropriedadesPage />} />
            <Route path='/fazenda-register/:produtorId' element={<FazendaForm />} />
            <Route path='/fazenda-edit/:produtorId/:propriedadeId' element={<FazendaForm />} />
          </Routes>
        </Router>
      </GlobalStyleWrapper>
    </Provider>
  );
};

export default App;
