import { createRouter, createWebHistory } from "vue-router";
import UsersView from "../components/Users.vue";
import LoginView from "../components/Login.vue";
import RegisterView from "../components/Register.vue";
//import DashboardView from "../components/Dashboard.vue";
import NotfoundView from "../components/Notfound.vue";
import Redirect from "../components/Redirect.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: '/login',
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: '/dashboard/:uid',
      name: 'dashboard',
      //component: DashboardView,
      component: () => import('../components/Dashboard.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'notfound',
      component: NotfoundView,
    },
    {
      path: "/users",
      name: "users",
      component: UsersView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: '/:slink',
      name: 'slink',
      component: Redirect
    }

  ],
});

export default router;
