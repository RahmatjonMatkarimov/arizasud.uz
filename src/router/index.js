import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getRoleFromToken } from "@/auth/auth";

const routes = [
    { path: "/edit/:id/:id2?", name: "editFile", component: () => import("@/components/main/file/file.vue"), },
    { path: "/CommonerLogin", name: "CommonerLogin", component: () => import("@/components/filePage/fileLogin.vue") },
    { path: "/fileProfile/:id", name: "fileProfile", component: () => import("@/components/filePage/fileProfile.vue") },
    { path: "/", name: "home", component: () => import("@/views/Home.vue") },
    { path: "/view-file/:id", name: "PDF", component: () => import("@/views/pdfViwer.vue") },
    { path: "/FEq8Qt7oKTrvFEq8Qt7oKTrv8YFWGtPL3Yot50diIP9VH_FL6NQIcT08YFWGtPLFEq8Qt7oKTrv8YFWGtPL3Yot50diIP9VH_FL6NQIcT03Yot50diIPFEq8Qt7oKTrv8YFWGtPL3Yot50diIP9VH_FL6NQIcT09VH_FL6NQIcT0", name: "login", component: () => import("@/components/login.vue") },
    { path: "/path/:id", name: "pathId", component: () => import("@/components/main/path/path.vue") },
    { path: "/service/:id", name: "service", component: () => import("@/components/main/file/file.vue") },
    { path: "/offering", name: "offer", component: () => import("@/components/offering/OfferingAdmin.vue") },
    { path: "/appeals", name: "appeals", component: () => import("@/components/appeal/appeal.vue") },
    { path: "/aplications/:id", name: "aplications", component: () => import("@/components/main/aplications/aplications.vue") },
    { path: "/screen", name: "screen", component: () => import("@/components/filePage/dakument.vue") },
    { path: "/ticket", name: "ticket", component: () => import("@/components/ticket/ticket.vue") },
    { path: "/servise/:id", name: "screen", component: () => import("@/components/main/servise/servise.vue") },
    { path: "/:catchAll(.*)", component: () => import("@/components/error.vue"), props: { errorCode: 404 } },
    {
        path: "/admin", component: () => import("@/components/Templates/AdminTemplate.vue"),
        children: [
            { path: "", component: () => import("@/components/main/admin.vue") },
            { path: "/reminders", name: "reminders", component: () => import("@/components/reminders/reminders.vue") },
            { path: "/appealAdmin", component: () => import("@/components/appeal/appealAdmin.vue") },
            { path: "/partners", component: () => import("@/components/sponsor/CardAdmin.vue") },
            { path: "/admins", component: () => import("@/components/admins/AdminCreate.vue") },
            { path: "/yurists", component: () => import("@/components/admins/YuristCreate.vue") },
            { path: "/operators", component: () => import("@/components/admins/coll_centerCreate.vue") },
            { path: "/profile/:id", component: () => import("@/components/ProfilePage/Profile.vue") },
            { path: "/ServiceAdmin/:id", component: () => import("@/components/main/servise/ServiceAdmin.vue") },
            { path: "/aplicationsAdmin/:id", component: () => import("@/components/main/aplications/aplicationsAdmin.vue") },
            { path: "/AdminPath/:id", component: () => import("@/components/main/path/adminPath.vue") },
            { path: "/setting/:id", component: () => import("@/components/settings/setting.vue") },
            { path: "/AdminCon/:id", component: () => import("@/components/settings/AdminCon.vue") },
            { path: "/notifications/:id", component: () => import("@/components/main/notifications.vue") },
            { path: "/archive", component: () => import("@/components/archive/archiveMain.vue") },
            { path: "/archiveBody/:data", component: () => import("@/components/archive/archiveBody.vue") },
            { path: "/chat/:id", component: () => import("@/components/Message/Message.vue") },
            { path: "/videoChat", component: () => import("@/components/Message/videochat.vue") },
            { path: "/Requirefiles", component: () => import("@/components/RequireFile/Requirefiles.vue") },
            { path: "/Requirefile/:id", component: () => import("@/components/RequireFile/RequireFile.vue") },
            { path: "/requireUserInfoFiles", component: () => import("@/components/RequireFile/info/requireUserInfoFiles.vue") },
            { path: "/info/:id", component: () => import("@/components/RequireFile/info/info.vue") },
            { path: "/requireUserTasksFiles", component: () => import("@/components/RequireFile/tasks/requireUserTasksFiles.vue") },
            { path: "/tasks/:id", component: () => import("@/components/RequireFile/tasks/tasks.vue") },
            { path: "/ticketAdmin", component: () => import("@/components/ticket/ticketAdmin.vue") },
            { path: "/requireUserobligationsFiles", component: () => import("@/components/RequireFile/obligations/requireUserObligationsFiles.vue") },
            { path: "/payments", component: () => import("@/components/payments.vue") },
            { path: "/obligations/:id", component: () => import("@/components/RequireFile/obligations/obligations.vue") },
            { path: "/smile", component: () => import("@/components/Message/CreateSmile.vue") },
            { path: "/all", component: () => import("@/components/admins/alladmins.vue") },
            { path: "/companyFile", component: () => import("@/components/company/filePage.vue") },
            { path: "/commaners", component: () => import("@/components/main/file/all.vue") },
            { path: "/companyFile-view/:id", component: () => import("@/components/company/fileView.vue") },
            { path: "/remindersAdmin", component: () => import("@/components/reminders/remindersAdmin.vue") },
            { path: "/profileUser/:id", component: () => import("@/components/ProfilePage/ProfileUser.vue") },
            { path: "/scanersAdmin", component: () => import("@/components/main/scaners/scanersAdmin.vue") },
        ],
        meta: { requiresAuth: true, allowedRoles: ["admin", "manager", "yurist", "bigAdmin"] },
    },
];

const router = createRouter({
    history: createWebHistory("/"),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (!isAuthenticated()) {
            next({ name: "" });
        } else {
            const userRole = getRoleFromToken();
            if (to.meta.allowedRoles?.length && !to.meta.allowedRoles.includes(userRole)) {
                next({ name: "home" });
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

export default router;
