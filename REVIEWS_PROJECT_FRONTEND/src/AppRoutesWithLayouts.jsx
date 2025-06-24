import {AppRoutes} from './utils/Constant.js'
import {Routes, Route} from 'react-router-dom';

import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'


import AdminUserDashboard from './Pages/SystemAdministrator/AdminDashboard.jsx'
import AdminUserMangeUsers from './Pages/SystemAdministrator/ManageUsers.jsx'
import AdminUserMangeStores from './Pages/SystemAdministrator/ManageStores.jsx'

import NormalUserStores from './Pages/NormalUser/Stores.jsx'
import UpdataPassword from './Pages/NormalUser/UpdataPassword.jsx';
import ListStorePage from './Pages/NormalUser/StoreFullPage.jsx'

import OwnerUserDashboard from './Pages/StoreOwner/OwnerDashboard.jsx'
import UpdatePasswordStoreOwner from './Pages/StoreOwner/UpdatePasswordStoreOwner.jsx'


import AddStore from './Components/SystemAdministration/AddStore.jsx';
import AddUser from './Components/SystemAdministration/AddUser.jsx';


function AppRoutesWithLayouts(){
    return (
        <Routes>
            <Route path={AppRoutes.SignupPage} element={<SignupPage />} />
            <Route path={AppRoutes.LoginPage} element={<LoginPage />} />

            <Route path={AppRoutes.AdminUserDashboard} element={<AdminUserDashboard />} />
            <Route path={AppRoutes.AdminUserMangeUsers} element={<AdminUserMangeUsers />} />
            <Route path={AppRoutes.AdminUserMangeStores} element={<AdminUserMangeStores />} />

            <Route path={AppRoutes.NormalUserStores} element={<NormalUserStores />} />
            <Route path= '/ListStorePage/:id' element={<ListStorePage />} />
            <Route path={AppRoutes.UpdataPassword} element={<UpdataPassword />} />

            <Route path={AppRoutes.OwnerUserDashboard} element={<OwnerUserDashboard  />} />
            <Route path={AppRoutes.UpdatePasswordStoreOwner } element={<UpdatePasswordStoreOwner  />} />


            <Route path={AppRoutes.AddStore} element={<AddStore />} />
            <Route path={AppRoutes.AddUser} element={<AddUser />} />
        </Routes>
    )
}

export default AppRoutesWithLayouts;