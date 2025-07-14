import * as React from 'react';
import {
  BookOpen,
  Car,
  HomeIcon,
  ParkingCircle,
  Pizza,
  Settings2,
  Shirt,
} from 'lucide-react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import UserImg from '@/assets/images/userImg.png';
// import { title } from 'process';

const data = {
  user: {
    name: 'Jonathon',
    email: 'jonathon@gmail.com',
    avatar: `${UserImg}`,
  },
  teams: {
    name: 'Vervoer',
    plan: 'Super Admin',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: HomeIcon,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/',
        },
        {
          title: 'Users',
          url: '/users',
        },
        {
          title: 'Merchants',
          url: '/merchants',
        },
        {
          title: 'Delivery Partners',
          url: '#',
        },
      ],
    },
    {
      title: 'Laundry',
      url: '#',
      icon: Shirt,
      isActive: false,
      items: [
        {
          title: 'Laundry Owners',
          url: '/laundry-owners',
        },
        {
          title: 'Dry Cleaner Owners',
          url: '/dry-cleaner-owners',
        },

        {
          title: 'Customer Reviews',
          url: '#',
        },
      ],
    },
    {
      title: 'Ride Share',
      url: '#',
      icon: Car,
      items: [
        {
          title: 'Vehicle Owners',
          url: '/vehicle-owners',
        },
        {
          title: 'Customer Reviews',
          url: '#',
        },
      ],
    },
    {
      title: 'Car Parking',
      url: '#',
      icon: ParkingCircle,
      items: [
        {
          title: 'Parking Lot',
          url: '/parking-lot',
        },
        {
          title: 'Garage List',
          url: '/garage-list',
        },
        {
          title: 'Residant Parking',
          url: '/residant-parking',
        },
      ],
    },
    {
      title: 'Food Delivery',
      url: '#',
      icon: Pizza,
      items: [
        {
          title: 'Restaurant Owners',
          url: '#',
        },
        {
          title: 'Customer Reviews',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-white" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
