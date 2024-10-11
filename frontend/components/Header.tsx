import React from 'react'
import Image from 'next/image'

const links: { href: string, label: string }[] = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Search' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'About' },
]

export default function Header() {
    return (
        <header className="bg-slate-400">
            <nav className="flex items-center justify-between w-[92%] mx-auto">
                {/* Logo section */}
                <div>
                    <a href='/'>
                        <Image src="/logo.png" alt="logo" width={75} height={75} priority={true} />
                    </a>
                </div>

                {/* Navigation section */}
                <div className="">
                    <ul className="flex gap-x-[4vw]">
                        {links.map(({ href, label }, index) => (
                            <li key={index}>
                                <a href={href} className="text-lg">{label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* User section */}
                <div>
                    <button className="bg-slate-700 text-white px-4 py-2 rounded-lg">
                        <a href='/login'>Login</a>
                    </button>
                </div>
            </nav>
        </header >
    )
}
