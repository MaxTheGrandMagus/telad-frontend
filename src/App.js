import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainPage from './components/main/mainPage';

import Search from './components/search/search';
import ClinicsSearch from './components/clinics-search/clinicsSearch';
import Specialties from './components/specialties/specialties';

import Doctor from './components/profile-doctor/doctor';
import Clinic from './components/profile-clinic/clinic';

import Map from './components/map/map';

import Registration from './components/registration/registration';
import Login from './components/login/login';
import PhoneAuth from './components/phone-auth/phoneAuth';
import ValidateOtp from './components/phone-auth/validateOtp';

import PCDoctor from './components/personal-cabinet/pc-doctor/pc-doctor';
import PCClinic from './components/personal-cabinet/pc-clinic/pc-clinic';


function App() {
  return (
    <div className="App">
      <Switch>
        
        <Route
          exact path = "/"
          component = {MainPage}
        />

        <Route path = "/search"
          component = {Search}
        />
        <Route path = "/clinics-search"
          component = {ClinicsSearch}
        />
        <Route path = "/specialties"
          component = {Specialties}
        />

        <Route path = "/clinic"
          component = {Clinic}
        />
        <Route path = "/doctor"
          component = {Doctor}
        />

        <Route path = "/map"
          component = {Map}
        />

        <Route path = "/registration"
          component = {Registration}
        />
        <Route path = "/login"
          component = {Login}
        />
        <Route path = "/phone-auth"
          component = {PhoneAuth}
        />
        <Route path = "/validate-otp"
          component = {ValidateOtp}
        />

        <Route path = "/pc-doctor"
          component = {PCDoctor}
        />
        {/* <Route path = "/pc-clinic"
          component = {PCClinic}
        /> */}
        
      </Switch>
    </div>
  );
}

export default App;