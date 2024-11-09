import { Icon } from "@iconify/react";
import React from "react";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";

export const SidebarData = [
  // Dashboard
  {
    sectionTitle: "",
    navItems: [
      {
        groupTitle: "Dashboard",
        path: "/",
        icon: <Icon icon="radix-icons:dashboard" className="h-6 w-6 " />,
      },
    ],
  },

  // PROJECTS MANAGEMENT
  {
    sectionTitle: "PROJECTS MANAGEMENT",
    navItems: [
      {
        groupTitle: "Projects",
        path: "/projects",
        icon: <Icon icon="solar:suitcase-tag-linear" className="h-6 w-6" />,
      },
      {
        groupTitle: "Tracking",
        path: "/builder-tracking",
        icon: <Icon icon="octicon:issue-tracked-by-24" className="h-6 w-6" />,
        subNav: [
          {
            title: "Contractor Tracking",
            icon: <BsDot size={20} />,
            path: "/builder-tracking",
            condition: true,
          },
          {
            title: "Map",
            icon: <BsDot size={20} />,
            path: "/builder-tracking/map",
            condition: true,
          },
        ],
      },
      {
        groupTitle: "Tasks",
        path: "/tasks",
        icon: <Icon icon="fluent:tasks-app-28-regular" className="h-6 w-6" />,
        subNav: [
          {
            title: <Link to="/tasks">All Tasks</Link>,
            icon: <BsDot size={20} />,
            path: "/tasks",
            condition: true,
          },
          {
            title: <Link to="/tasks/bids">Bids</Link>,
            icon: <BsDot size={20} />,
            path: "/tasks/bids",
            condition: true,
          },
          {
            title: <Link to="/tasks/tasks-for-bid">Tasks For Bid</Link>,
            icon: <BsDot size={20} />,
            path: "/tasks/tasks-for-bid",
            condition: false,
          },
        ],
      },
      {
        groupTitle: "Categories",
        path: "/categories",
        icon: <Icon icon="carbon:category" className="h-6 w-6 " />,
      },
    ],
  },

  // DESIGN
  {
    sectionTitle: "DESIGN",
    navItems: [
      {
        groupTitle: "AR Board",
        path: "/arboard",
        icon: <Icon icon="lucide:scale-3d" className="h-6 w-6" />,
        subNav: [
          {
            title: "Ar Projects",
            icon: <BsDot size={20} />,
            path: "/arboard",
            condition: true,
          },
          {
            title: "USDZLoader",
            icon: <BsDot size={20} />,
            path: "/arboard/usdz/projectId",
            condition: false,
          },
          // {
          //   title: "Floor Plan",
          //   icon: <BsDot size={20} />,
          //   path: "/arboard/floor-plan",
          //   condition: true,
          // },
          // {
          //   title: <Link to="/arboard/visualization">Concepts</Link>,
          //   icon: <BsDot size={20} />,
          //   path: "/arboard/visualization",
          //   condition: true,
          // },
          // {
          //   title: <Link to="/arboard/notes">Notes</Link>,
          //   icon: <BsDot size={20} />,
          //   path: "/arboard/notes",
          //   condition: true,
          // },
        ],
      },
    ],
  },

  // ENTITY MANAGEMENT
  {
    sectionTitle: "ENTITY MANAGEMENT",
    navItems: [
      {
        groupTitle: "Companies",
        icon: <Icon icon="ph:buildings-bold" className="h-6 w-6 " />,
        path: "/companies",
        subNav: [
          {
            title: <Link to="/companies">Companies</Link>,
            icon: <BsDot size={20} />,
            path: "/companies",
            condition: true,
          },
          {
            title: <Link to="/companies/update-app-code">Update App Code</Link>,
            icon: <BsDot size={20} />,
            path: "/companies/update-app-code",
            condition: true,
          },
          // {
          //   title: <Link to="/companies/add-company">Add Company</Link>,
          //   icon: <BsDot size={20} />,
          //   path: "/companies/add-company",
          //   condition: true,
          // },
        ],
      },
      {
        groupTitle: "Sub Contractors",
        icon: <Icon icon="fluent-mdl2:build-definition" className="h-6 w-6 " />,
        path: "/sub-contractors",
        subNav: [
          {
            title: "Sub Contractors",
            icon: <BsDot size={20} />,
            path: "/sub-contractors",
            condition: true,
          },
          {
            title: "Groups",
            icon: <BsDot size={20} />,
            path: "/sub-contractors/groups",
            condition: true,
          },
          // {
          //   title: "Add Sub Contractor",
          //   icon: <BsDot size={20} />,
          //   path: "/sub-contractors/add-sub-contractor",
          //   condition: true,
          // },
        ],
      },
      {
        groupTitle: "Clients",
        icon: <Icon icon="fluent-mdl2:people" className="h-6 w-6 " />,
        path: "/clients",
        // subNav: [
        //   {
        //     title: <Link to="/clients">All Clients</Link>,
        //     icon: <BsDot size={20} />,
        //     path: "/clients",
        //     condition: true,
        //   },
        //   {
        //     title: <Link to="/clients/add-client">Add Client</Link>,
        //     icon: <BsDot size={20} />,
        //     path: "/clients/add-client",
        //     condition: true,
        //   },
        // ],
      },
      {
        groupTitle: "Employees",
        icon: <Icon icon="fluent:people-28-regular" className="h-6 w-6 " />,
        path: "/employees",
        // subNav: [
        //   {
        //     title: <Link to="/employees">All Employees</Link>,
        //     icon: <BsDot size={20} />,
        //     path: "/employees",
        //     condition: true,
        //   },
        //   {
        //     title: <Link to="/employees/add-employee">Add Employee</Link>,
        //     icon: <BsDot size={20} />,
        //     path: "/employees/add-employee",
        //     condition: true,
        //   },
        //   {
        //     title: (
        //       <Link to="/employees/all-employee-roles">All Employee Roles</Link>
        //     ),
        //     icon: <BsDot size={20} />,
        //     path: "/employees/all-employee-roles",
        //     condition: true,
        //   },
        //   {
        //     title: (
        //       <Link to="/employees/add-employee-role">Add Employees Role</Link>
        //     ),
        //     icon: <BsDot size={20} />,
        //     path: "/employees/add-employee-role",
        //     condition: true,
        //   },
        // ],
      },
      {
        groupTitle: "Roles",
        icon: <Icon icon="ri:user-settings-line" className="h-6 w-6" />,
        path: "/roles",
      },
    ],
  },

  // FINANCE
  {
    sectionTitle: "FINANCE",
    navItems: [
      {
        groupTitle: "Cost & Payment",
        icon: <Icon icon="fluent:payment-32-regular" className="h-6 w-6" />,
        path: "/payment",
        subNav: [
          {
            title: <Link to="/payment">Make Payment</Link>,
            icon: <BsDot size={20} />,
            path: "/payment",
            condition: true,
          },
          {
            title: <Link to="/payment/estimate">Estimate</Link>,
            icon: <BsDot size={20} />,
            path: "/payment/estimate",
            condition: true,
          },
          {
            title: <Link to="/payment/add-estimate">Add Estimate</Link>,
            icon: <BsDot size={20} />,
            path: "/payment/add-estimate",
            condition: false,
          },
          {
            title: <Link to="/payment/invoice">Invoices</Link>,
            icon: <BsDot size={20} />,
            path: "/payment/invoice",
            condition: true,
          },
          {
            title: <Link to="/payment/add-invoice">Add Invoices</Link>,
            icon: <BsDot size={20} />,
            path: "/payment/add-invoice",
            condition: false,
          },

          {
            title: <Link to="/payment/transactions">Transactions</Link>,
            icon: <BsDot size={20} />,
            path: "/payment/transactions",
            condition: true,
          },
          // {
          //   title: (
          //     <Link to="/payment/received-payments">Received Payments</Link>
          //   ),
          //   icon: <BsDot size={20} />,
          //   path: "/payment/received-payments",
          //   condition: true,
          // },

          // {
          //   title: <Link to="/payment/out-payments">Out Payments</Link>,
          //   icon: <BsDot size={20} />,
          //   path: "/payment/out-payments",
          //   condition: true,
          // },
          {
            title: (
              <Link to="/payment/products-and-services">
                Products & Services
              </Link>
            ),
            icon: <BsDot size={20} />,
            path: "/payment/products-and-services",
            condition: true,
          },
          {
            title: (
              <Link to="/payment/add-products-and-services">
                Add Product or Service
              </Link>
            ),
            icon: <BsDot size={20} />,
            path: "/payment/add-products-and-services",
            condition: false,
          },
        ],
      },
    ],
  },

  // COMMUNICATION
  {
    sectionTitle: "COMMUNICATION",
    navItems: [
      {
        groupTitle: "Chat",
        path: "/chats",
        icon: <Icon icon="fluent:chat-16-regular" className="h-6 w-6 " />,
      },
      {
        groupTitle: "Notifications",
        path: "/notification",
        icon: <Icon icon="clarity:notification-line" className="h-6 w-6 " />,
      },
      // {
      //   groupTitle: "Submissions",
      //   path: "/submissions",
      //   icon: (
      //     <Icon icon="ic:outline-send-time-extension" className="h-6 w-6 " />
      //   ),
      // },
      {
        groupTitle: "Gallery",
        path: "/galleries",
        icon: <Icon icon="bi:images" className="h-6 w-6 " />,
      },
    ],
  },

  // BUSINESS MANAGEMENT
  {
    sectionTitle: "BUSINESS MANAGEMENT",
    navItems: [
      {
        groupTitle: "Pages & Social Media",
        path: "/website",
        icon: <Icon icon="clarity:world-outline-badged" className="h-6 w-6 " />,
      },
      // {
      //   subNav: [
      //     {
      //       title: "Website",
      //       icon: <BsDot size={20} />,
      //       path: "/website",
      //       condition: true,
      //     },
      //     // {
      //     //   title: "Social Media",
      //     //   icon: <BsDot size={20} />,
      //     //   path: "/website/social-media",
      //     //   condition: true,
      //     // },
      //   ],
      // },
      {
        groupTitle: "Business Settings",
        path: "/business-settings",
        icon: <Icon icon="mdi-light:settings" className="h-6 w-6 " />,
      },
      {
        groupTitle: "Third Party & Configurations",
        icon: (
          <Icon icon="fluent:database-person-20-regular" className="h-6 w-6" />
        ),
        path: "/third-party",
        subNav: [
          {
            title: <Link to="/third-party">3rd Party</Link>,
            icon: <BsDot size={20} />,
            path: "/third-party",
            condition: true,
          },
        ],
      },
    ],
  },
];