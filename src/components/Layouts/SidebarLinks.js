import { AccountIcon2, CatalogIcon, ChatIcon, CompanyIcon, DashboardIcon, IntegratedIcon, NotificationIcon, ProjectIcon } from "@/icon";


export const menuItems = [
  {
    href: '/admin',
    title: 'Dashboard',
    icon: <DashboardIcon/>
  },
  {
    href: '/admin/Customers',
    title: 'Customers',
    icon: <AccountIcon2/>
  },
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
    href: '/admin/Chat',
    title: 'Chat',
    icon: <ChatIcon/>
  },
  {
    href: '/admin/Suppliers',
    title: 'Suppliers',
    icon: <CompanyIcon/>,
  },
  {
    href: '/admin/IntegratedC',
    title: 'ICS',
    icon: <IntegratedIcon/>,
  },
];