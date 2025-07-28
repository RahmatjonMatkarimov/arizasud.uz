const routes = [
  {
    path: "/edit/:id/:id2?",
    name: "editFile",
    component: () => import("@/components/main/file/file.vue"),
  },
  {
    path: "/CommonerLogin",
    name: "CommonerLogin",
    component: () => import("@/components/filePage/fileLogin.vue"),
  },
  {
    path: "/fileProfiles/:id",
    name: "fileProfiles",
    component: () => import("@/components/filePage/fileProfile.vue"),
  },
  { path: "/", name: "home", component: () => import("@/views/Home.vue") },
  {
    path: "/view-file/:id",
    name: "PDF",
    component: () => import("@/views/pdfViwer.vue"),
  },
  {
    path: "/enterprise-file/:id",
    name: "PDaF",
    component: () => import("@/views/pdfViwer copy.vue"),
  },
  {
    path: "/FEq8Qt7oKTrvFEq8Qt7oKTrv8YFWGtPL3Yot50diIP9VH_FL6NQIcT08YFWGtPLFEq8Qt7oKTrv8YFWGtPL3Yot50diIP9VH_FL6NQIcT03Yot50diIPFEq8Qt7oKTrv8YFWGtPL3Yot50diIP9VH_FL6NQIcT09VH_FL6NQIcT0",
    name: "login",
    component: () => import("@/components/login.vue"),
  },
  {
    path: "/path/:id",
    name: "pathId",
    component: () => import("@/components/main/path/path.vue"),
  },
  {
    path: "/payments",
    name: "payment",
    component: () => import("@/views/payments.vue"),
  },
  {
    path: "/video/:id",
    component: () => import("@/components/contract/vidoeOpen.vue"),
  },
  {
    path: "/clientOpenVideoRoom/:id",
    component: () => import("@/components/contract/vidoeOpen.vue"),
  },
  {
    path: "/service/:id",
    name: "service",
    component: () => import("@/components/main/file/file.vue"),
  },
  {
    path: "/offering",
    name: "offer",
    component: () => import("@/components/offering/OfferingAdmin.vue"),
  },
  {
    path: "/appeals",
    name: "appeals",
    component: () => import("@/components/appeal/appeal.vue"),
  },
  {
    path: "/clientOpenFile/:id",
    name: "clientOpenFile",
    component: () => import("@/components/contract/htmlView.vue"),
  },
  {
    path: "/clientOpenRoom/:id",
    name: "clientOpenRoom",
    component: () => import("@/components/contract/room.vue"),
  },
  {
    path: "/room-status/:id1/:id",
    name: "room-status",
    component: () => import("@/components/contract/room-status.vue"),
  },
  {
    path: "/room-file/:id",
    name: "clientOpenfile",
    component: () => import("@/components/contract/room-file.vue"),
  },
  {
    path: "/aplications/:id",
    name: "aplications",
    component: () => import("@/components/main/aplications/aplications.vue"),
  },
  {
    path: "/screen",
    name: "screen",
    component: () => import("@/components/filePage/dakument.vue"),
  },
  {
    path: "/warehouseRoom/:id",
    name: "warehouseRoom",
    component: () => import("@/components/qrcode/WerehouseOpenRoom.vue"),
  },
  {
    path: "/room-lists/:id1/:id",
    component: () => import("@/components/contract/room-lists.vue"),
  },
  {
    path: "/clientLogin",
    name: "clientLogin",
    component: () => import("@/components/contract/cilendLogin.vue"),
  },
  {
    path: "/ticket",
    name: "ticket",
    component: () => import("@/components/ticket/ticket.vue"),
  },
  {
    path: "/PdfOpen/:folder/:filePath",
    name: "PdfOdpen",
    component: () => import("@/views/PdfOpenPage.vue"),
  },
  {
    path: "/servise/:id",
    name: "PdfOpen",
    component: () => import("@/components/main/servise/servise.vue"),
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/components/error.vue"),
    props: { errorCode: 404 },
  },
  { path: "/finger", component: () => import("@/components/finger.vue") },
  {
    path: "/questions",
    component: () => import("@/components/main/questions/user.vue"),
  },
  {
    path: "/Vokansiya",
    component: () => import("@/components/main/job/user.vue"),
  },
  {
    path: "/coll-center",
    name: "coll-center",
    component: () => import("@/components/Customers/customer-layout.vue"),
    meta: { title: "coll-center" },
    children: [
      {
        path: "/main",
        component: () => import("@/components/Customers/customer-statis.vue"),
      },
      {
        path: "/home",
        component: () => import("@/components/Customers/customer-home.vue"),
      },
      {
        path: "/customers-reminders",
        component: () => import("@/components/reminders/reminders.vue"),
      },
      {
        path: "/customers-profiles",
        component: () => import("@/views/Profile.vue"),
      },
      {
        path: "/customers-chat/:id",
        component: () => import("@/components/Message/Message.vue"),
      },
      {
        path: "/customer-sections/:id",
        component: () => import("@/components/Customers/customer-sections.vue"),
      },
      {
        path: "/customer-files/:id",
        component: () => import("@/components/Customers/customer-Files.vue"),
      },
      {
        path: "/customer-sms",
        component: () => import("@/components/Customers/customer-sms.vue"),
      },
      {
        path: "/customer-open/:id",
        component: () => import("@/components/Customers/customer-open.vue"),
      },
    ],
  },
  {
    path: "/ashboard",
    name: "bugalter",
    component: () => import("@/components/Templates/template.vue"),
    meta: { title: "bugalter" },
    children: [
      { path: "/Dashboard", component: () => import("@/views/Dashboard.vue") },
      {
        path: "/clients",
        component: () => import("@/components/dashboard/clents.vue"),
      },
      {
        path: "/invoicesChild",
        component: () => import("@/views/InvoicesChildren.vue"),
      },
      {
        path: "/reportsChild",
        component: () => import("@/views/ReportsChildren.vue"),
      },
      {
        path: "/salaryCalculator",
        component: () => import("@/components/admins/salaryCalculator.vue"),
      },
      {
        path: "/salaryChange",
        component: () => import("@/components/Salery/Salerychange.vue"),
      },
      {
        path: "/salary",
        component: () => import("@/components/Salery/index.vue"),
      },
      { path: "/invoices", component: () => import("@/views/Invoices.vue") },
      {
        path: "/reminder",
        component: () => import("@/components/reminders/reminders.vue"),
      },
      { path: "/reports", component: () => import("@/views/Reports.vue") },
      {
        path: "/link",
        component: () => import("@/components/dashboard/links.vue"),
      },
      { path: "/profile", component: () => import("@/views/Profile.vue") },
      {
        path: "/chats/:id",
        component: () => import("@/components/Message/Message.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
      allowedRoles: ["accauntant", "chiefAccauntant", "bigAdmin"],
    },
  },
  {
    path: "/admin",
    component: () => import("@/components/Templates/AdminTemplate.vue"),
    children: [
      { path: "", component: () => import("@/components/main/admin.vue") },
      {
        path: "/reminders",
        name: "reminders",
        component: () => import("@/components/reminders/reminders.vue"),
      },
      {
        path: "/appealAdmin",
        component: () => import("@/components/appeal/appealAdmin.vue"),
      },
      {
        path: "/partners",
        component: () => import("@/components/sponsor/CardAdmin.vue"),
      },
      {
        path: "/admins",
        component: () => import("@/components/admins/AdminCreate.vue"),
      },
      {
        path: "/operator",
        component: () => import("@/components/admins/Operator.vue"),
      },
      {
        path: "/Customer-Admin",
        component: () => import("@/components/Customers/customer-Admin.vue"),
      },
      {
        path: "/FileAdmin/:id",
        component: () => import("@/components/main/file/fileaDMIN.vue"),
      },
      {
        path: "/yurists",
        component: () => import("@/components/admins/YuristCreate.vue"),
      },
      {
        path: "/operators",
        component: () => import("@/components/admins/coll_centerCreate.vue"),
      },
      {
        path: "/profile/:id",
        component: () => import("@/components/ProfilePage/Profile.vue"),
      },
      {
        path: "/ServiceAdmin/:id",
        component: () => import("@/components/main/servise/ServiceAdmin.vue"),
      },
      {
        path: "/aplicationsAdmin/:id",
        component: () =>
          import("@/components/main/aplications/aplicationsAdmin.vue"),
      },
      {
        path: "/AdminPath/:id",
        component: () => import("@/components/main/path/adminPath.vue"),
      },
      {
        path: "/setting/:id",
        component: () => import("@/components/settings/setting.vue"),
      },
      {
        path: "/AdminCon/:id",
        component: () => import("@/components/settings/AdminCon.vue"),
      },
      {
        path: "/notifications/:id",
        component: () => import("@/components/main/notifications.vue"),
      },
      { path: "/profiles", component: () => import("@/views/Profile.vue") },
      {
        path: "/archive",
        component: () => import("@/components/archive/archiveMain.vue"),
      },
      {
        path: "/archiveBody/:data",
        component: () => import("@/components/archive/archiveBody.vue"),
      },
      {
        path: "/chat/:id",
        component: () => import("@/components/Message/Message.vue"),
      },
      {
        path: "/videoChat",
        component: () => import("@/components/Message/videochat.vue"),
      },
      {
        path: "/Requirefiles",
        component: () => import("@/components/RequireFile/Requirefiles.vue"),
      },
      {
        path: "/Requirefile/:id",
        component: () => import("@/components/RequireFile/RequireFile.vue"),
      },
      {
        path: "/requireUserInfoFiles",
        component: () =>
          import("@/components/RequireFile/info/requireUserInfoFiles.vue"),
      },
      {
        path: "/info/:id",
        component: () => import("@/components/RequireFile/info/info.vue"),
      },
      {
        path: "/fileProfile/:id",
        name: "fileProfile",
        component: () => import("@/components/filePage/fileProfile.vue"),
      },
      {
        path: "/requireUserTasksFiles",
        component: () =>
          import("@/components/RequireFile/tasks/requireUserTasksFiles.vue"),
      },
      {
        path: "/tasks/:id",
        component: () => import("@/components/RequireFile/tasks/tasks.vue"),
      },
      {
        path: "/ticketAdmin",
        component: () => import("@/components/ticket/ticketAdmin.vue"),
      },
      {
        path: "/requireUserobligationsFiles",
        component: () =>
          import(
            "@/components/RequireFile/obligations/requireUserObligationsFiles.vue"
          ),
      },
      {
        path: "/payment",
        component: () => import("@/components/payments.vue"),
      },
      {
        path: "/obligations/:id",
        component: () =>
          import("@/components/RequireFile/obligations/obligations.vue"),
      },
      {
        path: "/smile",
        component: () => import("@/components/Message/CreateSmile.vue"),
      },
      {
        path: "/all",
        component: () => import("@/components/admins/alladmins.vue"),
      },
      {
        path: "/companyFile",
        component: () => import("@/components/company/filePage.vue"),
      },
      {
        path: "/commaners",
        component: () => import("@/components/main/file/all.vue"),
      },
      {
        path: "/companyFile-view/:id",
        component: () => import("@/components/company/fileView.vue"),
      },
      {
        path: "/remindersAdmin",
        component: () => import("@/components/reminders/remindersAdmin.vue"),
      },
      {
        path: "/profileUser/",
        component: () => import("@/components/ProfilePage/ProfileUser.vue"),
      },
      {
        path: "/scanersAdmin",
        component: () => import("@/components/main/scaners/scanersAdmin.vue"),
      },
      {
        path: "/ContractAdmin/:id?",
        component: () => import("@/components/contract/ClientAdmin.vue"),
      },
      {
        path: "/FileAdmin",
        component: () => import("@/components/contract/fileAdmiin.vue"),
      },
      {
        path: "/Sum",
        component: () => import("@/components/contract/SumAdmin.vue"),
      },
      {
        path: "/CliendList",
        component: () => import("@/components/contract/cliendList.vue"),
      },
      {
        path: "/Check/:id",
        component: () => import("@/components/contract/fileOpen.vue"),
      },
      {
        path: "/lists/:id1/:id",
        component: () => import("@/components/contract/lists.vue"),
      },
      {
        path: "/room-statusAdmin/:id1/:id",
        name: "room-status-Admin",
        component: () => import("@/components/contract/room-statusAdmin.vue"),
      },
      {
        path: "/lists-view/:id",
        component: () => import("@/components/contract/list-view.vue"),
      },
      {
        path: "/admin-list",
        component: () => import("@/components/admins/all.vue"),
      },
      {
        path: "/all-contract",
        component: () => import("@/components/contract/all.vue"),
      },
      {
        path: "/all-courts",
        component: () => import("@/components/main/all.vue"),
      },
      {
        path: "/Require-signing/:id",
        component: () => import("@/components/RequireFile/requireSigning.vue"),
      },
      {
        path: "/asinstant",
        component: () => import("@/components/admins/Yurist-asinstant.vue"),
      },
      {
        path: "/video-open/:id",
        component: () => import("@/components/contract/vidoeOpenAdmin.vue"),
      },
      {
        path: "/yurist-tasks",
        component: () => import("@/components/admins/Yurist-tasks.vue"),
      },
      {
        path: "/deliverer",
        component: () => import("@/components/admins/KuyerAdmin.vue"),
      },
      {
        path: "/admin-task",
        component: () => import("@/components/admins/admin-tasks.vue"),
      },
      {
        path: "/asisstant-task",
        component: () =>
          import("@/components/admins/yurist-assistant-tasks.vue"),
      },
      {
        path: "/deliverer-task",
        component: () => import("@/components/admins/delivier-tasks.vue"),
      },
      {
        path: "/bugalter",
        component: () => import("@/components/admins/bugalter.vue"),
      },
      {
        path: "/category",
        component: () => import("@/components/qrcode/CategoryView.vue"),
      },
      {
        path: "/warehouse",
        component: () => import("@/components/qrcode/WarehouseView.vue"),
      },
      {
        path: "/mudir",
        component: () => import("@/components/admins/create.vue"),
      },
      {
        path: "/warehouseHouse/:id",
        component: () => import("@/components/qrcode/WarehouseDetail.vue"),
      },
      {
        path: "/warehousesHouse",
        component: () => import("@/components/qrcode/warehouseHouse.vue"),
      },
      {
        path: "/fileconvert",
        component: () => import("@/views/fileconvert.vue"),
      },
      {
        path: "/chiefAccauntant",
        component: () => import("@/components/admins/chiefAccauntant.vue"),
      },
      {
        path: "/JobsAdmin",
        component: () => import("@/components/main/job/admin.vue"),
      },
      {
        path: "/questionsAdmin",
        component: () => import("@/components/main/questions/admin.vue"),
      },
      {
        path: "/required-items-section",
        name: "RequiredItemsSectionForm",
        component: () => import("@/components/requiredItemsSection/Form.vue"),
      },
      {
        path: "/required-items-section/:id",
        name: "RequiredItemsSectionItems",
        component: () =>
          import("@/components/requiredItemsSection/ItemsPage.vue"),
        props: true,
      },
    ],
    meta: { requiresAuth: true, allowedRoles: ['admin', 'manager','warehouseman', 'yuristAssistant', 'deliverer', 'yurist', 'bigAdmin'] },
  },
];
export default routes;
