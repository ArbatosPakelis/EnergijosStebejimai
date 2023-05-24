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
import DeviceForm from './pages/deviceForm'
import ScheduleForm from './pages/scheduleForm'
import TimeForm1 from './pages/timeForm1'
import WeeksList from './pages/weeksList'
import SensorsList from './pages/sensorsList'
import SensorForm1 from './pages/sensorForm'
import TimeView from './pages/timeView'
import EmailForm from './pages/emailForm'


function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<AccommondationList />} />
        <Route exact path="/data" element={<Data />} />
        <Route exact path="/days" element={<Days />} />
        <Route exact path="/weeks" element={<Weeks />} />
        <Route exact path="/graph" element={<GraphPage />} />
        <Route exact path="/sensorForm" element={<SensorForm />} />
        <Route path="accommodation">
          <Route index element={<AccommondationList />} />
          <Route path="new" element={<AccommondationForm />} />
          <Route path=":id">
            <Route index element={<Accommondation />} />
            <Route path="update" element={<AccommondationUpdateForm />} />
            <Route path="schedule" element={<AccommondationSchedule />} />
            <Route path="addDevice" element={<DeviceForm />} />
            <Route path="sensors">
              <Route index element={<SensorsList />} />
              <Route path="new" element={ <SensorForm1/> } />
            </Route>
            <Route path="weeks">
              <Route index element={<WeeksList />} />
              <Route path=":weekId">
                <Route index element={<ScheduleForm />} />
                <Route path="days">
                  <Route index element={<p>Page Not Found</p>} />
                  <Route path=":dayId">
                    <Route index element={<p>Page Not Found</p>} />
                    <Route path="times">
                      <Route index element={<p>Page Not Found</p>} />
                      <Route path="new" element={ <TimeForm1/> } />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="editDevice">
              <Route path=":deviceId" element={<DeviceForm />} />
            </Route>
          </Route>
        </Route>

        <Route path="times">
          <Route index element={<p>Page Not Found</p>} />
            <Route path=":id" element={<TimeView />} />
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
        <Route exact path="/changeMail" element={<EmailForm />} />        
        <Route path="*" element={<p>Page Not Found</p>}></Route>
      </Routes>
    </>
  )
}

export default App