import React from 'react'
import Link from 'next/link'

export default function Page() {
    return (<>
    <h1 className="text-3xl">Aggie Events Homepage!</h1>
    <Link href="/dashboard">Testing Dashboard</Link>
    </>)
}