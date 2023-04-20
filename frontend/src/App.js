import React, { useEffect, useState } from 'react'
import Home from './pages/home'
import Data from './pages/data'
import Days from './pages/daysData'
import Weeks from './pages/weeksData'
import GraphPage from './pages/graphPage'
import SensorForm from './pages/NewSensorEntry'
import DayForm from './pages/dayForm'
import TimeForm from './pages/timeForm'
import { Routes, Route } from "react-router-dom";
import Accommondation from './pages/accommodation';
import AccommondationList from './pages/accommondationList';
import AccommondationForm from './pages/accommondationForm';
import AccommondationUpdateForm from './pages/accommondationUpdateForm';
import AccommondationSchedule from './pages/accommondationSchedule';
import WeekForm from './pages/weekForm';
import DayUpdateForm from './pages/dayUpdateForm'
import WeekUpdateForm from './pages/weekUpdateForm';

function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/data" element={<Data />} />
        <Route exact path="/days" element={<Days />} />
        <Route exact path="/weeks" element={<Weeks />} />
        <Route exact path="/graph" element={<GraphPage />} />
        <Route exact path="/sensorForm" element={<SensorForm />} />
        <Route path="accommodation">
          <Route index element={<AccommondationList />} />
          <Route path=":id" element={<Accommondation />} />
          <Route path="new" element={<AccommondationForm />} />
          <Route path="update">
            <Route path=":id" element={<AccommondationUpdateForm />} />
          </Route>
          <Route path="schedule">
            <Route path=":id" element={<AccommondationSchedule />} />
          </Route>
        </Route>
        <Route path="week">
          <Route index element={<Home />} />
          <Route path="new" element={<WeekForm />} />
          
          <Route path=":id">
            <Route index element={<Home />} />
            <Route path="update" element={<WeekUpdateForm />} />
          </Route>
        </Route>
        <Route exact path="/dayForm" element={<DayForm />} />
        <Route path="updateDay">
          <Route path=":id" element={<DayUpdateForm />} />
        </Route>
        <Route exact path="/timeForm" element={<TimeForm />} />
        <Route path="*" element={<p>Page Not Found</p>}></Route>
      </Routes>
    </>
  )
}

export default App