"use server"
import { db } from './database'
import { Users } from 'kysely-codegen'
import { Selectable, Insertable, Updateable } from 'kysely'
import { app } from './express'

export type SelectableUsers = Selectable<Users>
export type InsertableUsers = Insertable<Users>
export type UpdateableUsers = Updateable<Users>

export async function createUser(username: string, email: string) {
    return db.insertInto('users').values({user_name: username, user_email: email}).execute()
}


export async function getAllUsernames() {
    return db.selectFrom('users').select('user_name').execute()
}