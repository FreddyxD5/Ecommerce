import { Link } from 'react-router-dom'
import {
    PaperClipIcon,
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    MenuAlt2Icon,
    UsersIcon,
    XIcon,
    CreditCardIcon,
} from '@heroicons/react/outline'

import { SearchIcon } from '@heroicons/react/solid'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const DashboardLink = () => {    
    return (
        <>
            <Link to="/dashboard"

                className={classNames(
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                )}
            >
                <HomeIcon
                    className={classNames(
                        'text-gray-400 group-hover:text-gray-500',
                        'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                />
                Dashboard
            </Link>
            <Link to="/dashboard/payments"

                className={classNames(
                    'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                )}
            >
                <CreditCardIcon
                    className={classNames(
                        'text-gray-400 group-hover:text-gray-500',
                        'mr-4 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                />
                Payment History
            </Link>
        </>
    )
}

export default DashboardLink;