'use client'
import React from 'react'
import { testApi } from '@/api/test'

export default function Page() {

    return (<>
        <h1 className="text-3xl">Aggie Events Homepage!</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 rounded"
        onClick={testApi}>
            Test API
        </button>
    </>)
}