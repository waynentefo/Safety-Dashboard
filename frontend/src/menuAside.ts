import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/audits/audits-list',
    label: 'Audits',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiClipboardCheck' in icon ? icon['mdiClipboardCheck' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_AUDITS'
  },
  {
    href: '/documents/documents-list',
    label: 'Documents',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiFileDocument' in icon ? icon['mdiFileDocument' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_DOCUMENTS'
  },
  {
    href: '/inspections/inspections-list',
    label: 'Inspections',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiMagnify' in icon ? icon['mdiMagnify' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_INSPECTIONS'
  },
  {
    href: '/risk_managements/risk_managements-list',
    label: 'Risk managements',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAlertCircle' in icon ? icon['mdiAlertCircle' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_RISK_MANAGEMENTS'
  },
  {
    href: '/safety_tickets/safety_tickets-list',
    label: 'Safety tickets',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiTicket' in icon ? icon['mdiTicket' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SAFETY_TICKETS'
  },
  {
    href: '/she_meetings/she_meetings-list',
    label: 'She meetings',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCalendar' in icon ? icon['mdiCalendar' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SHE_MEETINGS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
