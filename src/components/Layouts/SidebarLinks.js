import { AccountIcon2, CatalogIcon, ChatIcon, CompanyIcon, DashboardIcon, IntegratedIcon, NotificationIcon, ProjectIcon } from "@/icon";


export const menuItems = [
  {
    href: '/admin',
    title: 'Dashboard',
    icon: <DashboardIcon/>
  },
  // {
  //   href: '/admin/Customers',
  //   title: 'Customers',
  //   icon: <AccountIcon2/>
  // },
  {
    title: 'Catalog',
    icon: <CatalogIcon />,
    subItems: [
      {
        href: '/admin/catalog/Addproduct',
        title: 'Add Product',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Productlist',
        title: 'Product List',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Category',
        title: 'Category',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Categorylist',
        title: 'Category List',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Color',
        title: 'Color',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Colorlist',
        title: 'Color List',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Procedures',
        title: 'Procedures',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/catalog/Procedurelist',
        title: 'Procedure List',
        icon: <AccountIcon2/>
      },
    ],
  },
  {
    title: 'Create Orders',
    icon: <ChatIcon />,
    subItems: [
      {
        href: '/admin/create/Createorder',
        title: 'Create Order',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/create/CreateIC',
        title: 'Create IC',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/create/CreateCustomer',
        title: 'Create Customers',
        icon: <AccountIcon2/>
      },
    ],
  },
  {
    href: '/admin/Orders',
    title: 'Orders',
    icon: <AccountIcon2/>
  },
  {
    href: '/admin/Projects',
    title: 'Projects',
    icon:<ProjectIcon />,
 
  },  
  {
    title: 'Chat',
    icon: <ChatIcon />,
    subItems: [
      {
        href: '/admin/staff/dashboard',
        title: 'Dashboard',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/staff/list',
        title: 'Staff List',
        icon: <AccountIcon2/>
      },
      {
        href: '/admin/chat/Chat',
        title: 'IC Chat',
        icon: <AccountIcon2/>
      },
    ],
  },
  // {
  //   href: '/admin/Suppliers',
  //   title: 'Suppliers',
  //   icon: <CompanyIcon/>,
  // },
  {
    href: '/admin/IntegratedC',
    title: 'ICS',
    icon: <IntegratedIcon/>,
  },
  {
    href: '/admin/Reviews',
    title: 'Reviews',
    icon: <IntegratedIcon/>,
  },
];